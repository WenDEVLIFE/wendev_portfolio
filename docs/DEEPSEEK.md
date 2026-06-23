# DeepSeek API Integration Guide

This guide details how to integrate and configure **DeepSeek** models (such as `deepseek-chat` for general conversation or `deepseek-reasoner` for R1 deep thinking) to power the portfolio's conversational AI assistant.

DeepSeek provides high-quality open-source and commercial language models that are fully compatible with the OpenAI API format, making integration straightforward.

---

## 🛠️ Prerequisites

To connect to DeepSeek, you need:
1. **DeepSeek API Key**:
   - Register or sign in to the [DeepSeek Platform](https://platform.deepseek.com/).
   - Navigate to the **API Keys** section and click **Create API Key**.
   - Copy the generated key.

2. **Environment Configuration**:
   - Open your local `.env.local` file in the project root.
   - Paste the API key into the `DEEPSEEK_API_KEY` variable:
     ```ini
     DEEPSEEK_API_KEY=your_deepseek_api_key
     ```

---

## 📦 API Client Installation

Since DeepSeek's API is OpenAI-compatible, you can use the official `openai` SDK or make direct `fetch` calls.

To install the official OpenAI SDK:
```bash
npm install openai
```

---

## 💻 API Route Implementation

You can modify the Next.js API route (`app/api/chat/route.ts`) to route requests to DeepSeek. Here is a complete, production-ready implementation supporting both `deepseek-chat` (DeepSeek-V3) and `deepseek-reasoner` (DeepSeek-R1):

```typescript
import { NextResponse } from "next/server";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "";
const DEEPSEEK_BASE_URL = "https://api.deepseek.com/v1"; // OpenAI compatible base URL

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
        const selectedModel = model || "deepseek-chat"; // Fallback to DeepSeek V3

        if (!DEEPSEEK_API_KEY) {
            return NextResponse.json({ reply: null, error: "DeepSeek API key is not configured in .env.local." }, { status: 500 });
        }

        const systemMsg = { role: "system", content: SYSTEM_PROMPT };
        const userMsg = { role: "user", content: message };

        // Format history according to standard chat models format
        const formattedHistory = (history || []).map((msg: { role: string; content: string }) => ({
            role: msg.role === "bot" || msg.role === "assistant" ? "assistant" : "user",
            content: msg.content
        }));

        // Call the DeepSeek API using OpenAI compatible endpoint
        const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
            },
            body: JSON.stringify({
                model: selectedModel,
                messages: [systemMsg, ...formattedHistory, userMsg],
                temperature: selectedModel === "deepseek-reasoner" ? 1.0 : 0.7, // R1 reasoning recommends temperature = 1.0
                max_tokens: 2000,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("DeepSeek API Error Response:", response.status, errorText);
            return NextResponse.json({ reply: null, error: "DeepSeek AI service returned an error." }, { status: 503 });
        }

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || null;

        // Note: For deepseek-reasoner (R1), you can also extract the thinking process via:
        // const reasoningContent = data.choices?.[0]?.message?.reasoning_content;
        // This is highly useful to display 'thought process' blocks in the UI.

        return NextResponse.json({ reply });
    } catch (error: any) {
        console.error("DeepSeek API Error:", error);
        return NextResponse.json({ error: error.message || "Failed to connect to DeepSeek AI." }, { status: 500 });
    }
}
```

---

## 🎨 Frontend Client Integration

To enable model selection in the chatbot drawer frontend, update `components/ui/ChatBot.tsx` to include DeepSeek models in the `MODELS` constant and dropdown picker:

### Step 1: Update Model Definitions
Change the list of available models to include DeepSeek options:

```typescript
const MODELS = [
    { id: "deepseek-chat", label: "DeepSeek Chat (V3)" },
    { id: "deepseek-reasoner", label: "DeepSeek R1 (Reasoner)" },
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
        model: model.id, // e.g. "deepseek-chat"
        history: messages.map(m => ({
            role: m.role === "bot" ? "assistant" : "user",
            content: m.content
        }))
    })
});
```

---

## ⚖️ Model Selection Guide

DeepSeek offers two primary endpoints:

| Model ID | Commercial Name | Best Used For | Temperature Recommendation |
| :--- | :--- | :--- | :--- |
| **`deepseek-chat`** | DeepSeek-V3 | Standard fast conversational tasks, answering general queries about Frouen's projects and skills with low latency. | `0.7` |
| **`deepseek-reasoner`** | DeepSeek-R1 | Complex reasoning, mathematics, logic, coding explanations. Features a separate `reasoning_content` stream depicting steps. | `1.0` (Do not use system prompt or temperature overrides if using strict R1 defaults) |
