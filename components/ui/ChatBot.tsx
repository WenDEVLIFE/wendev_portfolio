"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, ChevronDown } from "lucide-react";

interface Message {
    role: "user" | "bot";
    content: string;
}

const MODELS = [
    { id: "llama3-8b-8192", label: "Llama 3 8B" },
    { id: "llama-3.3-70b-versatile", label: "Llama 3.3 70B" },
    { id: "mixtral-8x7b-32768", label: "Mixtral 8x7B" },
    { id: "gemma2-9b-it", label: "Gemma 2 9B" },
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

export function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "bot", content: "Hi! I'm Frouen's AI assistant. Ask me anything about his projects, skills, or experience!" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [model, setModel] = useState(MODELS[0]);
    const [showModelPicker, setShowModelPicker] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const modelPickerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modelPickerRef.current && !modelPickerRef.current.contains(e.target as Node)) {
                setShowModelPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

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
            } else {
                setMessages(prev => [...prev, { role: "bot", content: "Sorry, I encountered an error. Please try again." }]);
            }
        } catch (_error) {
            setMessages(prev => [...prev, { role: "bot", content: "Failed to connect to AI. Please check your connection." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="mb-4 w-[90vw] sm:w-[400px] h-[500px] bg-black/90 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 pb-3 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-neutral-600 font-mono text-xs select-none">=-=-=--=-</span>
                                <span className="text-xs font-bold text-white/80 tracking-[0.2em]">CHATBOT</span>
                                <span className="text-neutral-600 font-mono text-xs select-none">-=-=-=-=-</span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4 text-neutral-500" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                            {messages.map((msg, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: msg.role === "user" ? 10 : -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={i}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                                        ? "bg-white text-black font-medium"
                                        : "bg-white/5 border border-white/10 text-neutral-300"
                                        }`}>
                                        {msg.content}
                                    </div>
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

                        {/* Input */}
                        <div className="p-4 pt-3 border-t border-white/10">
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
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about projects..."
                                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-neutral-700 focus:outline-none focus:border-white/30 transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="p-2.5 bg-white text-black rounded-xl disabled:opacity-50 transition-all hover:scale-105 active:scale-95 shrink-0"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="bg-white text-black p-4 rounded-full shadow-2xl flex items-center justify-center relative group"
            >
                <MessageSquare className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
            </motion.button>
        </div>
    );
}