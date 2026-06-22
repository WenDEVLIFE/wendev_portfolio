"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, ChevronDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
    role: "user" | "bot";
    content: string;
}

const MODELS = [
    { id: "llama-3.3-70b-versatile", label: "Llama 3.3 70B" },
    { id: "qwen/qwen3-32b", label: "Qwen 3 32B" },
    { id: "openai/gpt-oss-120b", label: "Openai 120B" },
];

function LoadingDots() {
    const [dots, setDots] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 5 ? "" : prev + ".");
        }, 400);
        return () => clearInterval(interval);
    }, []);

    return (
        <span className="font-mono text-neutral-500 tracking-wider">{dots}</span>
    );
}

function TypewriterContent({ content }: { content: string }) {
    const [displayed, setDisplayed] = useState("");
    const [done, setDone] = useState(false);

    useEffect(() => {
        setDisplayed("");
        setDone(false);
        let i = 0;
        const speed = 8;
        const interval = setInterval(() => {
            i++;
            setDisplayed(content.slice(0, i));
            if (i >= content.length) {
                clearInterval(interval);
                setDone(true);
            }
        }, speed);
        return () => clearInterval(interval);
    }, [content]);

    return (
        <>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-1.5">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-1.5">{children}</ol>,
                    li: ({ children }) => <li className="text-neutral-300">{children}</li>,
                    table: ({ children }) => (
                        <div className="overflow-x-auto my-2">
                            <table className="w-full text-left text-xs border-collapse">{children}</table>
                        </div>
                    ),
                    th: ({ children }) => <th className="border border-white/10 px-2.5 py-1.5 font-semibold text-white/80">{children}</th>,
                    td: ({ children }) => <td className="border border-white/10 px-2.5 py-1.5 text-neutral-400">{children}</td>,
                    strong: ({ children }) => <strong className="font-semibold text-white/90">{children}</strong>,
                    p: ({ children }) => <p className="my-1 text-neutral-300">{children}</p>,
                    code: ({ children }) => <code className="bg-white/5 px-1 rounded text-[11px] font-mono text-neutral-300">{children}</code>,
                }}
            >
                {displayed}
            </ReactMarkdown>
            {!done && (
                <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
                    className="inline-block w-[2px] h-[14px] bg-neutral-400 ml-0.5 align-middle"
                />
            )}
        </>
    );
}

function BotMessage({ content }: { content: string }) {
    return (
        <div className="bg-white/5 border border-white/10 text-neutral-300 max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed">
            <TypewriterContent content={content} />
        </div>
    );
}

export function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "bot", content: "Hi! I'm Frouen's AI assistant. Ask me anything about his projects, skills, or experience!" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [model, setModel] = useState(MODELS[0]);
    const [showModelPicker, setShowModelPicker] = useState(false);
    const [botKey, setBotKey] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const modelPickerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modelPickerRef.current && !modelPickerRef.current.contains(e.target as Node)) {
                setShowModelPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const charLimit = 1000;

    const handleSend = useCallback(async () => {
        if (!input.trim() || isLoading || input.length > charLimit) return;

        const userMsg = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMsg }]);
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMsg,
                    model: model.id,
                    history: messages.map(m => ({
                        role: m.role === "bot" ? "assistant" : "user",
                        content: m.content
                    }))
                })
            });

            const data = await response.json();
            if (data.reply) {
                setMessages(prev => [...prev, { role: "bot", content: data.reply }]);
                setBotKey(k => k + 1);
            } else {
                setMessages(prev => [...prev, { role: "bot", content: "Sorry, I encountered an error. Please try again." }]);
            }
        } catch (_error) {
            setMessages(prev => [...prev, { role: "bot", content: "Failed to connect to AI. Please check your connection." }]);
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading, charLimit, model.id, messages]);

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 z-[90] md:bg-transparent md:pointer-events-none"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.aside
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 28, stiffness: 300 }}
                        className="fixed top-0 right-0 z-[100] h-full w-full sm:w-[420px] bg-black/95 backdrop-blur-2xl border-l border-white/10 flex flex-col shadow-2xl"
                    >
                        <div className="p-5 pb-3 border-b border-white/10 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-white/80 tracking-[0.2em]">CHATBOT</span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4 text-neutral-500" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">
                            {messages.map((msg, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: msg.role === "user" ? 10 : -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={i}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    {msg.role === "user" ? (
                                        <div className="bg-white text-black font-medium max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed">
                                            {msg.content}
                                        </div>
                                    ) : i === messages.length - 1 && !isLoading ? (
                                        <BotMessage content={msg.content} key={botKey} />
                                    ) : (
                                        <div className="bg-white/5 border border-white/10 text-neutral-300 max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-1.5">{children}</ul>,
                                                    ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-1.5">{children}</ol>,
                                                    li: ({ children }) => <li className="text-neutral-300">{children}</li>,
                                                    table: ({ children }) => (
                                                        <div className="overflow-x-auto my-2">
                                                            <table className="w-full text-left text-xs border-collapse">{children}</table>
                                                        </div>
                                                    ),
                                                    th: ({ children }) => <th className="border border-white/10 px-2.5 py-1.5 font-semibold text-white/80">{children}</th>,
                                                    td: ({ children }) => <td className="border border-white/10 px-2.5 py-1.5 text-neutral-400">{children}</td>,
                                                    strong: ({ children }) => <strong className="font-semibold text-white/90">{children}</strong>,
                                                    p: ({ children }) => <p className="my-1 text-neutral-300">{children}</p>,
                                                    code: ({ children }) => <code className="bg-white/5 px-1 rounded text-[11px] font-mono text-neutral-300">{children}</code>,
                                                }}
                                            >
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl">
                                        <span className="font-mono text-sm text-neutral-400">generating</span>
                                        <LoadingDots />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-5 pt-3 border-t border-white/10 shrink-0">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex items-center gap-2"
                            >
                                <div ref={modelPickerRef} className="relative shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => setShowModelPicker(!showModelPicker)}
                                        className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-medium text-neutral-500 hover:text-white hover:border-white/20 transition-colors"
                                    >
                                        <span className="text-neutral-600 mr-0.5">-=-</span>
                                        {model.label}
                                        <span className="text-neutral-600 ml-0.5">-=-</span>
                                        <ChevronDown className={`w-3 h-3 transition-transform ${showModelPicker ? "rotate-180" : ""}`} />
                                    </button>
                                    <AnimatePresence>
                                        {showModelPicker && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -4, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -4, scale: 0.95 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute left-0 bottom-full mb-2 w-40 bg-black/95 border border-white/10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-2xl z-50"
                                            >
                                                {MODELS.map((m) => (
                                                    <button
                                                        key={m.id}
                                                        type="button"
                                                        onClick={() => { setModel(m); setShowModelPicker(false); }}
                                                        className={`w-full text-left px-3.5 py-2.5 text-xs font-medium transition-colors ${model.id === m.id
                                                            ? "bg-white/10 text-white"
                                                            : "text-neutral-400 hover:text-white hover:bg-white/5"
                                                            }`}
                                                    >
                                                        {m.label}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div className="relative flex-1 min-w-0">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => {
                                            if (e.target.value.length <= charLimit) {
                                                setInput(e.target.value);
                                            }
                                        }}
                                        placeholder="Ask about projects..."
                                        maxLength={charLimit}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 pr-14 text-sm text-white placeholder:text-neutral-700 focus:outline-none focus:border-white/30 transition-colors"
                                    />
                                    <span className="absolute right-3 bottom-2.5 text-[10px] font-mono text-neutral-600 pointer-events-none">
                                        {input.length}/{charLimit}
                                    </span>
                                </div>
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading || input.length > charLimit}
                                    className="p-2.5 bg-white text-black rounded-xl disabled:opacity-50 transition-all hover:scale-105 active:scale-95 shrink-0"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 90 }}
                className="bg-white text-black p-4 rounded-full shadow-2xl flex items-center justify-center relative"
            >
                <MessageSquare className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
            </motion.button>
        </>
    );
}