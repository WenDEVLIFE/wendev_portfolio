import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, message, recaptchaToken } = body;

        if (!name || !email || !message) {
            return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
        }

        if (!recaptchaToken) {
            return NextResponse.json({ error: "Please complete the reCAPTCHA verification." }, { status: 400 });
        }

        // 1. Verify reCAPTCHA token using secret key from environment
        const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;

        const recaptchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `secret=${recaptchaSecret}&response=${recaptchaToken}`
        });
        const recaptchaData = await recaptchaResponse.json();

        if (!recaptchaData.success) {
            return NextResponse.json({ error: "reCAPTCHA verification failed. Please try again." }, { status: 400 });
        }

        // 2. Setup Nodemailer transporter
        // NOTE: Standardized environment variable name in .env.local
        const password = process.env.GMAIL_APP_PASSWORD;
        const userEmail = process.env.GMAIL_ACCOUNT;

        if (!userEmail || !password) {
            return NextResponse.json({ error: "Server email credentials are not configured properly." }, { status: 500 });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: userEmail,
                pass: password,
            },
        });

        // 3. Send Email
        const mailOptions = {
            from: `"${name}" <${userEmail}>`,
            replyTo: email,
            to: userEmail,
            subject: `Portfolio Contact Form: New Message from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            html: `
                <h3>New Message from Portfolio Website</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <div style="margin-top: 1rem; padding: 1rem; border-left: 4px solid #333; background: #f9f9f9;">
                    <p style="white-space: pre-wrap;">${message}</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: "Message sent successfully! I'll get back to you soon." });
    } catch (e: unknown) {
        console.error("Error in contact API:", e);
        const errorMessage = e instanceof Error ? e.message : "Failed to send the message.";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
