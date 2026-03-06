import { NextResponse } from "next/server";

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

        const params = new URLSearchParams();
        params.append('secret', recaptchaSecret || '');
        params.append('response', recaptchaToken);

        const recaptchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params.toString()
        });
        let recaptchaData;
        const recaptchaClone = recaptchaResponse.clone();
        try {
            recaptchaData = await recaptchaResponse.json();
        } catch (jsonError) {
            const errorText = await recaptchaClone.text();
            console.error("Failed to parse reCAPTCHA JSON. Response text:", errorText);
            throw new Error(`reCAPTCHA service returned HTML/Invalid response. check if your Secret Key is correct. Full response: ${errorText.substring(0, 100)}`);
        }

        if (!recaptchaData.success) {
            const errorCodes = recaptchaData["error-codes"] || [];
            console.error("reCAPTCHA Error Codes:", errorCodes);

            let descriptiveError = "reCAPTCHA verification failed.";
            if (errorCodes.includes("invalid-input-secret") || errorCodes.includes("invalid-keys")) {
                descriptiveError = "Your reCAPTCHA Secret Key is invalid. Please ensure you created a 'reCAPTCHA v2 (Checkbox)' key and not a v3 key.";
            } else if (errorCodes.includes("invalid-input-response")) {
                descriptiveError = "The reCAPTCHA token is invalid or expired. Please refresh and try again.";
            }

            return NextResponse.json({ error: descriptiveError }, { status: 400 });
        }

        // 2. Send Email using Nodemailer
        const nodemailer = await import("nodemailer");
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_ACCOUNT,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.GMAIL_ACCOUNT,
            to: "medinajrfrouen@gmail.com",
            subject: `Portfolio Contact: ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #333;">New Contact Form Submission</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Message:</strong></p>
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 10px;">
                        ${message.replace(/\n/g, "<br>")}
                    </div>
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
