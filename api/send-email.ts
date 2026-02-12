import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { type, data } = req.body;

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

View details: https://www.wbify.com/admin/dashboard
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

View details: https://www.wbify.com/admin/inquiries
        `;
    } else {
        return res.status(400).json({ message: 'Invalid submission type' });
    }

    try {
        await transporter.sendMail({
            from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: subject,
            text: text,
        });

        return res.status(200).json({ message: 'Email sent successfully' });
    } catch (error: any) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Error sending email', error: error.message });
    }
}
