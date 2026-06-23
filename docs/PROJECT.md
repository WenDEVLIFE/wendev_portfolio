# Project Documentation: Wendev Portfolio

Welcome to the official developer documentation for the **Wendev Portfolio**, a professional, highly-animated, and modern portfolio website for **Frouen Medina Jr.** (Full Stack Developer & Designer).

This document details the project structure, design patterns, technology stack, environment configuration, and core API endpoints.

---

## 🚀 Technology Stack

| Layer | Technology | Version / Spec | Purpose |
| :--- | :--- | :--- | :--- |
| **Core Framework** | Next.js (App Router) | `16.1.6` | Server-Side Rendering (SSR), API routes, and static generation. |
| **View Library** | React | `19.2.3` | Component-based interactive UI. |
| **Styling** | Tailwind CSS | `^4.0.0` (with `@tailwindcss/postcss`) | Utility-first responsive design, sleek styling. |
| **Animations** | Framer Motion | `^12.35.0` | Ultra-smooth micro-animations, spring-based transitions. |
| **Icons** | Lucide React | `^0.577.0` | High-quality vector icon set. |
| **Form Security** | Google reCAPTCHA v2 | `^3.1.0` | Spam and bot protection for the contact form. |
| **Email Service** | Nodemailer | `^8.0.1` | SMTP transport to send user inquiries to Gmail. |
| **AI Integration** | Groq API | *REST API* | Powers the chatbot helper using high-performance open-source models. |

---

## 📂 Project Structure

Below is the directory tree of the portfolio workspace with descriptions of the key folders and files:

```text
wendev_portfolio/
├── app/                        # Next.js App Router root
│   ├── api/                    # Serverless API routes
│   │   ├── chat/               # AI Chatbot endpoint
│   │   │   └── route.ts        # Chat POST handler (Groq/API integrations)
│   │   └── contact/            # Contact form submission endpoint
│   │       └── route.ts        # reCAPTCHA verification & Nodemailer mail sender
│   ├── favicon.ico             # App icon
│   ├── globals.css             # Tailwind v4 globals & custom utilities
│   ├── layout.tsx              # Root HTML structure, fonts, metadata
│   └── page.tsx                # Main entry point (Landing Page component)
├── components/                 # Reusable React components
│   ├── layout/                 # Layout structure components
│   │   ├── Footer.tsx          # Copyright notice & brand details
│   │   └── Navbar.tsx          # Navigation header with scroll-to anchors
│   ├── sections/               # Page section blocks (rendered in page.tsx)
│   │   ├── About.tsx           # Skills, core technologies, and external profile links
│   │   ├── Contact.tsx         # Contact Form with reCAPTCHA v2 and state status
│   │   ├── Hero.tsx            # Full viewport greeting & links to CV/Certificates
│   │   └── Projects.tsx        # Project catalog cards with tags and lightbox modal
│   └── ui/                     # Isolated interactive UI controls
│       ├── Background.tsx      # Sleek dynamic gradient backdrop
│       ├── ChatBot.tsx         # Drawer-style floating AI Chatbot component
│       └── LoadingScreen.tsx   # Premium splash animation shown during startup
├── docs/                       # Project documentation directory
│   ├── DEEPSEEK.md             # Integration guide for DeepSeek models
│   ├── GEMINI.md               # Integration guide for Google Gemini models
│   └── PROJECT.md              # Main project structure & backend API docs (This file)
├── public/                     # Static assets (images, logos, SVG icons)
├── .env.local                  # Environment variables file (secrets excluded from Git)
├── package.json                # Project dependencies and script runner configurations
├── tsconfig.json               # TypeScript compiler rules
└── next.config.ts              # Next.js bundler settings
```

---

## 🔑 Environment Configuration

The application uses local environment variables defined in `.env.local`. Create this file in your root folder and define the following variables:

```ini
# --- AI Chatbot Configuration ---
GROQ_API_KEY=your_groq_api_key             # Groq key for powering default models (Llama/Qwen)
GEMINI_API_KEY=your_gemini_api_key         # Google Gemini API key (for Gemini upgrade)
DEEPSEEK_API_KEY=your_deepseek_api_key     # DeepSeek API key (for DeepSeek upgrade)

# --- Mail Dispatch Configuration ---
GMAIL_ACCOUNT=frouenmedinajr@gmail.com     # Sender Gmail address
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx     # 16-digit Google App Password (not standard pass)

# --- Contact Form Security ---
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_key   # Public key (used in frontend component)
RECAPTCHA_SECRET_KEY=your_secret_key      # Secret key (used in backend for verification)

# --- Other Third-Party Services ---
WEB3_FORMS_API=your_web3forms_api_key     # Backup contact form service API (optional)
HUGGINGFACE_TOKEN=your_hf_token           # Hugging Face token (optional, for ML resources)
```

---

## 🛠️ Getting Started & Installation

To run this project locally, ensure you have **Node.js (v18+)** installed.

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the live dashboard in your browser.

3. **Build the production bundle**:
   ```bash
   npm run build
   ```

4. **Start the production server**:
   ```bash
   npm run start
   ```

---

## 📡 API Reference

### 1. AI Chatbot API
* **Endpoint**: `/api/chat`
* **Method**: `POST`
* **Description**: Receives user input, screens for harmful inputs or prompt leaking, builds the context payload, and streams a response from the selected LLM.
* **Request Payload**:
  ```json
  {
    "message": "What is Frouen's expertise?",
    "model": "llama-3.3-70b-versatile",
    "history": [
      { "role": "user", "content": "Hi" },
      { "role": "assistant", "content": "Hello! How can I help you?" }
    ]
  }
  ```
* **Success Response (`200 OK`)**:
  ```json
  {
    "reply": "Frouen Medina Jr. is a Full Stack Developer & Designer specializing in **Flutter**, **React**, **Node.js**, and cloud configurations..."
  }
  ```
* **Guardrails Active**:
  * Blocked categories (Hacking instructions, self-harm, malware generation, etc.).
  * Prompt injections blocking (disregard, ignore system instructions, override).
  * System prompt reinforcement ensures the bot refers to Frouen in the third person and stays on topic.

### 2. Contact Form Mail API
* **Endpoint**: `/api/contact`
* **Method**: `POST`
* **Description**: Verifies the reCAPTCHA v2 token, validates form fields, and dispatches a rich HTML email to Frouen's inbox.
* **Request Payload**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "message": "Hello, I would like to build a mobile app using Flutter.",
    "recaptchaToken": "03AFcWeA7..."
  }
  ```
* **Success Response (`200 OK`)**:
  ```json
  {
    "success": "Message sent successfully! I'll get back to you soon."
  }
  ```
* **Error Response (`400 Bad Request` / `500 Internal Server Error`)**:
  ```json
  {
    "error": "Your reCAPTCHA Secret Key is invalid. Please ensure you created a 'reCAPTCHA v2 (Checkbox)' key."
  }
  ```

---

## 🎨 UI/UX Features & Design Choices

1. **Loading Splash Screen**: An animated loading loader sequence checks for asset pre-loading to maintain seamless animation performance across slower connections.
2. **Dynamic Backdrops**: Uses pure CSS grids and canvas-like blur circles for high-performance visual depth.
3. **Smooth Slide Chatbot**: Side drawer chat widget with Markdown parsing for bulleted lists, tables, bold text, and code snippets, formatted with a typewriter-like fade-in animation.
4. **Lightbox Feature**: High-definition zoom and preview for selected work images, complete with lock-body scrolling controls.
