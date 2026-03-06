import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `
You are "Frouen's AI Assistant", a professional and friendly AI representative for Frouen Medina Jr., a Full Stack Developer.
Your goal is to answer questions about Frouen's skills, projects, and professional background.

About Frouen Medina Jr.:
- Role: Full Stack Developer & Designer.
- Expertise: Flutter, React, Node.js, Cloud Technologies (Firebase, Docker, Supabase), and AI (TensorFlow).
- Production Apps: Over 10+ production-ready applications.
- Key Projects:
  1. SudoTech+: Startup website for his company (sudotech.plus).
  2. Aid Anchor: Mobile app for first aid and disaster response (Flutter/Dart).
  3. ClassAce: Student management app (Kotlin/Firebase).
  4. DPR CAR RENTAL: AI-managed car rental system.
  5. NaveyGate: Gate pass and digital navigation platform.
  6. Mandaya App: Cultural/Educational mobile app.
- Tech Stack: 
  - Mobile: Flutter, Kotlin, Jetpack Compose, Swift, Java.
  - Web/Backend: React, Next.js, Node.js, Python, PostgreSQL, MongoDB.
  - Tools/Ops: Docker, Firebase, Supabase, TensorFlow.
- Professional Ethos: Passionate about crafting premium digital experiences with absolute precision.
- Availability: Monday to Friday, 8 AM - 5 PM (PH Time / UTC+8).

Tone & Guidelines:
- Be concise, professional, and slightly enthusiastic.
- Use bullet points for lists.
- If a user asks something personal or unrelated to Frouen's professional work, politely steer the conversation back to his portfolio.
- Never make up information. If you don't know something, suggest they contact Frouen directly via the contact form.
- Refer to Frouen in the third person unless you are specifically asked to "roleplay" him (in which case, be very humble).
`;

export async function POST(req: Request) {
    try {
        const { message, history } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "Gemini API key is not configured." }, { status: 500 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
                { role: "model", parts: [{ text: "Understood. I am Frouen's AI Assistant, ready to showcase his work and skills." }] },
                ...history.map((msg: { role: string; content: string }) => ({
                    role: msg.role === "user" ? "user" : "model",
                    parts: [{ text: msg.content }]
                }))
            ],
            generationConfig: {
                maxOutputTokens: 500,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ reply: text });
    } catch (e: unknown) {
        console.error("Gemini Error:", e);
        return NextResponse.json({ error: "Failed to connect to the AI." }, { status: 500 });
    }
}
