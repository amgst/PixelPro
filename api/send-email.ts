import nodemailer from 'nodemailer';

export default async function handler(req: any, res: any) {
    console.log('--- Email API Triggered ---');
    console.log('Time:', new Date().toISOString());
    console.log('Method:', req.method);
    
    if (req.method !== 'POST') {
        console.warn('Invalid method:', req.method);
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Log Environment Configuration (Sanitized)
    console.log('SMTP Config Check:', {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        user: process.env.EMAIL_USER,
        secure: process.env.EMAIL_SECURE,
        hasPass: !!process.env.EMAIL_PASS,
        fromName: process.env.EMAIL_FROM_NAME,
        adminEmail: process.env.ADMIN_EMAIL
    });

    // Validate Environment Variables
    const requiredEnv = ['EMAIL_HOST', 'EMAIL_USER', 'EMAIL_PASS', 'ADMIN_EMAIL'];
    const missingEnv = requiredEnv.filter(key => !process.env[key]);
    if (missingEnv.length > 0) {
        console.error('Missing environment variables:', missingEnv);
        return res.status(500).json({ 
            message: 'Server configuration error: Missing email environment variables',
            missing: missingEnv 
        });
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
        console.warn('Invalid or missing JSON body');
        return res.status(400).json({ message: 'Invalid JSON body' });
    }

    const { type, data, recaptchaToken } = body;
    if (!type || !data || typeof data !== 'object') {
        console.warn('Missing required payload fields', { type, hasData: !!data });
        return res.status(400).json({ message: 'Missing required payload: type and data are required' });
    }

    // Verify reCAPTCHA
    if (!recaptchaToken) {
        console.warn('Missing reCAPTCHA token');
        return res.status(400).json({ message: 'reCAPTCHA token is required' });
    }

    try {
        console.log('Verifying reCAPTCHA token...');
        const verifyResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
        });

        const verifyData = await verifyResponse.json() as any;
        console.log('reCAPTCHA verification result:', verifyData.success);

        if (!verifyData.success) {
            console.warn('reCAPTCHA verification failed:', verifyData['error-codes']);
            return res.status(403).json({ 
                message: 'reCAPTCHA verification failed', 
                errors: verifyData['error-codes'] 
            });
        }
    } catch (verifyError) {
        console.error('Error verifying reCAPTCHA:', verifyError);
        // In case of verification API error, we might still want to proceed or fail.
        // Usually, failing is safer.
        return res.status(500).json({ message: 'Error verifying reCAPTCHA' });
    }

    console.log('Submission Type:', type);
    console.log('Payload Data:', JSON.stringify(data, null, 2));

    let subject = '';
    let text = '';

    if (type === 'contact') {
        subject = `New Contact Message from ${data.firstName} ${data.lastName}`;
        text = `
New Contact Message Received!

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Service: ${data.service}

Message:
${data.message}

View details: https://vancegraphix.com.au/admin/dashboard
        `;
    } else if (type === 'inquiry') {
        subject = `New Project Inquiry: ${data.serviceType} from ${data.name}`;
        text = `
New Project Inquiry Received!

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Service: ${data.serviceType}
Timeline: ${data.timeline}

Additional Info:
${data.additionalInfo}

View details: https://vancegraphix.com.au/admin/inquiries
        `;
    } else if (type === 'application') {
        subject = `New Job Application: ${data.role} from ${data.fullName}`;
        text = `
New Job Application Received!

Name: ${data.fullName}
Email: ${data.email}
Role: ${data.role}
Experience: ${data.experienceYears || 'N/A'}
Skills: ${data.skills || 'N/A'}
Portfolio: ${data.portfolioUrl || 'N/A'}
LinkedIn: ${data.linkedinUrl || 'N/A'}

Cover Letter:
${data.coverLetter}

View details: https://vancegraphix.com.au/admin/dashboard
        `;
    } else if (type === 'order') {
        subject = `New Product Order/Inquiry: ${data.productName} from ${data.customerName}`;
        text = `
New Product Order/Inquiry Received!

Product: ${data.productName}
SKU: ${data.productSku}
Quantity: ${data.quantity}

Customer Name: ${data.customerName}
Email: ${data.email}
Phone: ${data.phone || 'N/A'}

Notes/Specs:
${data.notes || 'No notes provided'}

View details: https://vancegraphix.com.au/admin/dashboard
        `;
    } else {
        console.warn('Invalid submission type received:', type);
        return res.status(400).json({ message: 'Invalid submission type' });
    }

    try {
        console.log('Creating nodemailer transporter...');
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            // Add connection timeout
            connectionTimeout: 10000, 
            greetingTimeout: 10000,
            socketTimeout: 10000,
        });

        // Add a timeout for the email sending process
        console.log('Attempting to send mail to:', process.env.ADMIN_EMAIL);
        const emailPromise = transporter.sendMail({
            from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: subject,
            text: text,
            replyTo: data.email,
        });

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Email sending timed out after 8 seconds')), 8000)
        );

        const info = await Promise.race([emailPromise, timeoutPromise]) as any;
        console.log('Email sent successfully. MessageId:', info.messageId);

        return res.status(200).json({ 
            message: 'Email sent successfully', 
            messageId: info.messageId 
        });
    } catch (error: any) {
        console.error('Final Error in Email Handler:', {
            message: error.message,
            stack: error.stack,
            details: error
        });
        return res.status(500).json({ 
            message: 'Error sending email', 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}
