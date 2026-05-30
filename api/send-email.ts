import nodemailer from 'nodemailer';

// ---------------------------------------------------------------------------
// Simple in-memory per-IP rate limiter (sliding window).
//
// NOTE: This is best-effort only. On serverless platforms (e.g. Vercel) each
// instance has its own memory and instances are recycled, so this does NOT
// provide strong, global rate limiting. For robust limits across instances,
// back this with a shared store such as Vercel KV / Upstash Redis. It still
// blunts trivial bursts from a single client hitting a warm instance.
// ---------------------------------------------------------------------------
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // max requests per IP per window
const ipHits = new Map<string, number[]>();

function getClientIp(req: any): string {
    const forwarded = req.headers?.['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded.length > 0) {
        return forwarded.split(',')[0].trim();
    }
    if (Array.isArray(forwarded) && forwarded.length > 0) {
        return forwarded[0];
    }
    return req.socket?.remoteAddress || 'unknown';
}

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW_MS;
    const hits = (ipHits.get(ip) || []).filter(ts => ts > windowStart);
    hits.push(now);
    ipHits.set(ip, hits);

    // Opportunistic cleanup to bound memory growth.
    if (ipHits.size > 5000) {
        for (const [key, timestamps] of ipHits) {
            const recent = timestamps.filter(ts => ts > windowStart);
            if (recent.length === 0) {
                ipHits.delete(key);
            } else {
                ipHits.set(key, recent);
            }
        }
    }

    return hits.length > RATE_LIMIT_MAX;
}

// Strip CR/LF (and trim) to prevent header injection via interpolated fields.
function sanitizeHeaderValue(value: unknown): string {
    if (value === undefined || value === null) return '';
    return String(value).replace(/[\r\n]+/g, ' ').trim();
}

function isValidEmail(email: unknown): email is string {
    if (typeof email !== 'string') return false;
    const trimmed = email.trim();
    // Basic format check; also rejects values containing newlines.
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const clientIp = getClientIp(req);
    if (isRateLimited(clientIp)) {
        console.warn('Rate limit exceeded for client.');
        return res.status(429).json({ message: 'Too many requests. Please try again later.' });
    }

    // Validate Environment Variables (without logging their values).
    const requiredEnv = ['EMAIL_HOST', 'EMAIL_USER', 'EMAIL_PASS', 'ADMIN_EMAIL'];
    const missingEnv = requiredEnv.filter(key => !process.env[key]);
    if (missingEnv.length > 0) {
        console.error('Server email configuration incomplete. Missing env keys count:', missingEnv.length);
        return res.status(500).json({ message: 'Server configuration error' });
    }

    const body =
        typeof req.body === 'string'
            ? (() => {
                try {
                    return JSON.parse(req.body);
                } catch {
                    return null;
                }
            })()
            : req.body;

    if (!body || typeof body !== 'object') {
        return res.status(400).json({ message: 'Invalid JSON body' });
    }

    const { type, data, recaptchaToken } = body;
    if (!type || !data || typeof data !== 'object') {
        return res.status(400).json({ message: 'Missing required payload: type and data are required' });
    }

    // Verify reCAPTCHA
    if (!recaptchaToken) {
        return res.status(400).json({ message: 'reCAPTCHA token is required' });
    }

    try {
        const verifyResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
        });

        const verifyData = await verifyResponse.json() as any;

        if (!verifyData.success) {
            return res.status(403).json({ message: 'reCAPTCHA verification failed' });
        }
    } catch (verifyError) {
        console.error('Error verifying reCAPTCHA.');
        return res.status(500).json({ message: 'Error verifying reCAPTCHA' });
    }

    // Validate the reply-to email format (also guards against header injection).
    if (!isValidEmail(data.email)) {
        return res.status(400).json({ message: 'A valid email address is required' });
    }
    const replyToEmail = data.email.trim();

    let subject = '';
    let text = '';

    if (type === 'contact') {
        subject = `New Contact Message from ${sanitizeHeaderValue(data.firstName)} ${sanitizeHeaderValue(data.lastName)}`;
        text = `
New Contact Message Received!

Name: ${data.firstName} ${data.lastName}
Email: ${replyToEmail}
Service: ${data.service}

Message:
${data.message}

View details: https://www.wbify.com/admin/dashboard
        `;
    } else if (type === 'inquiry') {
        subject = `New Project Inquiry: ${sanitizeHeaderValue(data.serviceType)} from ${sanitizeHeaderValue(data.name)}`;
        text = `
New Project Inquiry Received!

Name: ${data.name}
Email: ${replyToEmail}
Phone: ${data.phone}
Service: ${data.serviceType}
Timeline: ${data.timeline}

Additional Info:
${data.additionalInfo}

View details: https://www.wbify.com/admin/inquiries
        `;
    } else if (type === 'application') {
        subject = `New Job Application: ${sanitizeHeaderValue(data.role)} from ${sanitizeHeaderValue(data.fullName)}`;
        text = `
New Job Application Received!

Name: ${data.fullName}
Email: ${replyToEmail}
Role: ${data.role}
Experience: ${data.experienceYears || 'N/A'}
Skills: ${data.skills || 'N/A'}
Portfolio: ${data.portfolioUrl || 'N/A'}
LinkedIn: ${data.linkedinUrl || 'N/A'}

Cover Letter:
${data.coverLetter}

View details: https://www.wbify.com/admin/dashboard
        `;
    } else if (type === 'order') {
        subject = `New Product Order/Inquiry: ${sanitizeHeaderValue(data.productName)} from ${sanitizeHeaderValue(data.customerName)}`;
        text = `
New Product Order/Inquiry Received!

Product: ${data.productName}
SKU: ${data.productSku}
Quantity: ${data.quantity}

Customer Name: ${data.customerName}
Email: ${replyToEmail}
Phone: ${data.phone || 'N/A'}

Notes/Specs:
${data.notes || 'No notes provided'}

View details: https://www.wbify.com/admin/dashboard
        `;
    } else {
        return res.status(400).json({ message: 'Invalid submission type' });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 10000,
        });

        const emailPromise = transporter.sendMail({
            from: `"${sanitizeHeaderValue(process.env.EMAIL_FROM_NAME)}" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: subject,
            text: text,
            replyTo: replyToEmail,
        });

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Email sending timed out')), 8000)
        );

        const info = await Promise.race([emailPromise, timeoutPromise]) as any;

        return res.status(200).json({
            message: 'Email sent successfully',
            messageId: info.messageId
        });
    } catch (error) {
        // Log details server-side only; never return error internals to clients.
        console.error('Error sending email:', error instanceof Error ? error.message : 'unknown error');
        return res.status(500).json({ message: 'Error sending email' });
    }
}
