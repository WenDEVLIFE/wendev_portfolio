# Google Gemini API Integration Guide

This guide details how to integrate and configure **Google Gemini** models (such as `gemini-2.5-flash` or `gemini-2.5-pro`) to power the portfolio's conversational AI assistant.

Google Gemini is a highly performant and cost-effective alternative to Groq, providing native support for multimodal tasks, advanced reasoning, safety filtering, and system instruction context.

---

## 🛠️ Prerequisites

To connect to Gemini, you need:
1. **Google Gemini API Key**:
   - Go to [Google AI Studio](https://aistudio.google.com/).
   - Sign in with your Google Account and click **Create API Key**.
   - Copy the generated key.

2. **Environment Configuration**:
   - Open your local `.env.local` file in the project root.
   - Paste the API key into the `GEMINI_API_KEY` variable:
     ```ini
     GEMINI_API_KEY=AIzaSyCigoqzKCHJKOhgMUQl3y2bJsTnGc3MUvI
     ```

---

## 📦 SDK Installation

Google recommends the new official unified SDK `@google/genai` (released for Gemini 2.0/2.5) or the legacy `@google/generative-ai` package.

To install the official unified Google Gen AI SDK:
```bash
npm install @google/genai
```

---

## 💻 API Route Implementation

You can modify the Next.js API route (`app/api/chat/route.ts`) to use Gemini. Here is a complete, production-ready implementation that resolves the API key and handles Gemini generation:

```typescript
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

// Initialize the Gemini AI Client
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// System instruction to guide the persona & rules
const SYSTEM_PROMPT = `
You are "Frouen's AI Assistant", a professional and friendly AI representative for Frouen Medina Jr., a Full Stack Developer.
Your goal is to answer questions about Frouen's skills, projects, and professional background.

About Frouen Medina Jr.:
- Role: Full Stack Developer & Designer.
- Expertise: Flutter, React, Node.js, Cloud Technologies (Firebase, Docker, Supabase), and AI (TensorFlow).
- Production Apps: Over 10+ production-ready applications.
- Tech Stack: Flutter, Kotlin, React, Next.js, Node.js, Python, PostgreSQL, MongoDB, Docker, Firebase, Supabase, TensorFlow.

RESPONSE RULES:
- Always complete the full response. Do not truncate or cut off mid-sentence.
- If listing projects or features, cover ALL items without skipping.
- Keep paragraphs short and scannable. Format with bold terms and clean bullet points.
- STAY ON TOPIC: Only answer questions about Frouen's portfolio, skills, projects, and professional work. If asked about anything else, politely steer back.
`;

export async function POST(req: Request) {
    try {
        const { message, history, model } = await req.json();
        const selectedModel = model || "gemini-2.5-flash";

        if (!GEMINI_API_KEY) {
            return NextResponse.json({ reply: null, error: "Gemini API key is not configured in .env.local." }, { status: 500 });
        }

        // Format history to match Gemini's Contents API structure
        // Gemini expects roles: 'user' and 'model' (not 'assistant')
        const geminiHistory = (history || []).map((msg: { role: string; content: string }) => ({
            role: msg.role === "assistant" || msg.role === "bot" ? "model" : "user",
            parts: [{ text: msg.content }]
        }));

        // Call the Gemini API
        const response = await ai.models.generateContent({
            model: selectedModel,
            contents: [
                ...geminiHistory,
                { role: "user", parts: [{ text: message }] }
            ],
            config: {
                systemInstruction: SYSTEM_PROMPT,
                temperature: 0.7,
                maxOutputTokens: 1500,
                // Optional: Adjust safety settings
                safetySettings: [
                    {
                        category: "HARM_CATEGORY_HATE_SPEECH",
                        threshold: "BLOCK_LOW_AND_ABOVE",
                    },
                    {
                        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE",
                    }
                ]
            }
        });

        const reply = response.text || "I was unable to formulate a response. Please try again.";
        return NextResponse.json({ reply });

    } catch (error: any) {
        console.error("Gemini API Error:", error);
        return NextResponse.json({ error: error.message || "Failed to connect to Gemini AI." }, { status: 500 });
    }
}
```

---

## 🎨 Frontend Client Integration

To enable model selection in the chatbot drawer frontend, update `components/ui/ChatBot.tsx` to include Gemini models in the `MODELS` constant and dropdown picker:

### Step 1: Update Model Definitions
Change the list of available models to include Gemini options:

```typescript
const MODELS = [
    { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
    { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
    { id: "llama-3.3-70b-versatile", label: "Llama 3.3 70B (Groq)" },
];
```

### Step 2: Handle Payload Selection
Ensure that the client passes the chosen model `id` to the API route:

```typescript
const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        message: userMsg,
        model: model.id, // e.g. "gemini-2.5-flash"
        history: messages.map(m => ({
            role: m.role === "bot" ? "assistant" : "user",
            content: m.content
        }))
    })
});
```

---

## 🛡️ Model Configuration Options

Here are the recommended models depending on your requirements:

* **`gemini-2.5-flash`** *(Recommended)*: High-speed, highly-accurate, and low-latency. Best for quick chat interactions.
* **`gemini-2.5-pro`**: Advanced reasoning, complex query parsing, and highly-detailed responses. Excellent choice if users ask technical or detailed structural questions.
* **`gemini-1.5-flash` / `gemini-1.5-pro`**: Legacy 1.5 versions, useful if backwards compatibility with older API scopes is needed.
