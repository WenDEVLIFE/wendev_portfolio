"use server";

import nodemailer from "nodemailer";

export async function sendEmail(prevState: unknown, formData: FormData) {
    try {
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const message = formData.get("message") as string;
        const recaptchaToken = formData.get("g-recaptcha-response") as string;

        if (!name || !email || !message) {
            return { error: "Name, email, and message are required." };
        }

        if (!recaptchaToken) {
            return { error: "Please complete the reCAPTCHA verification." };
        }

        // 1. Verify reCAPTCHA token using env key or Google's official test key
        const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY || "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe";

        const recaptchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `secret=${recaptchaSecret}&response=${recaptchaToken}`
        });
        const recaptchaData = await recaptchaResponse.json();

        if (!recaptchaData.success) {
            return { error: "reCAPTCHA verification failed. Please try again." };
        }

        // 2. Setup Nodemailer transporter
        // NOTE: Accounting for the typo in the .env.local file "GMAIL_APP_PASSWOTD"
        const password = process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_APP_PASSWOTD;
        const userEmail = process.env.GMAIL_ACCOUNT;

        if (!userEmail || !password) {
            return { error: "Server email credentials are not configured properly." };
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
            from: `"${name}" <${userEmail}>`, // Send *from* our auth email so Google doesn't block it
            replyTo: email,                   // When you click 'Reply', it replies to the client
            to: userEmail,                    // Send *to* yourself
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

        return { success: "Message sent successfully! I'll get back to you soon." };
    } catch (e: unknown) {
        console.error("Error sending email:", e);
        const errorMessage = e instanceof Error ? e.message : "Failed to send the message. Please try again later.";
        return { error: errorMessage };
    }
}
