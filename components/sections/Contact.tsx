"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast, Toaster } from "react-hot-toast";
import { useTheme } from "next-themes";

export function Contact() {
    const customEasing: [number, number, number, number] = [0.22, 1, 0.36, 1];
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [isPending, setIsPending] = useState(false);
    const [content, setContent] = useState<{
        heading: string; description: string; email: string;
        formLabels: { name: string; email: string; message: string };
        formPlaceholders: { name: string; email: string; message: string };
        sendText: string; sendingText: string; emailDirectText: string;
    } | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });

    useEffect(() => {
        fetch("/api/content").then(r => r.json()).then(d => setContent(d.content?.contact || null)).catch(() => {});
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = recaptchaRef.current?.getValue();
        if (!token) {
            toast.error("Please complete the reCAPTCHA verification.");
            return;
        }

        setIsPending(true);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    recaptchaToken: token
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            toast.success(data.success);

            // Reset form
            setFormData({ name: "", email: "", message: "" });
            recaptchaRef.current?.reset();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Something went wrong";
            toast.error(errorMessage);
        } finally {
            setIsPending(false);
        }
    };

    if (!content) {
        return (
            <section id="contact" className="py-24 px-6 md:py-32 md:px-12 lg:px-32 relative">
                <div className="border border-border bg-card backdrop-blur-3xl rounded-[2rem] md:rounded-[3rem] py-20 px-4 md:py-32 md:px-6 text-center">
                    <div className="h-12 w-48 bg-muted rounded-xl animate-pulse mx-auto" />
                    <div className="h-6 w-80 bg-muted rounded-lg animate-pulse mx-auto mt-4" />
                </div>
            </section>
        );
    }

    return (
        <section id="contact" className="py-24 px-6 md:py-32 md:px-12 lg:px-32 relative">
            <Toaster position="bottom-right" />
            <div className="border border-border bg-card backdrop-blur-3xl flex flex-col items-center overflow-hidden rounded-[2rem] md:rounded-[3rem] py-20 px-4 md:py-32 md:px-6 text-center shadow-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: customEasing }}
                    viewport={{ once: true }}
                    className="w-full flex flex-col justify-center items-center"
                >
                    <h2 className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-6 text-4xl font-black tracking-tighter sm:text-5xl md:text-8xl">
                        {content.heading}
                    </h2>
                    <p className="mx-auto mb-12 max-w-xl text-base md:text-xl text-muted-foreground font-light">
                        {content.description}
                    </p>

                    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto mb-16 flex flex-col gap-4 text-left font-sans">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="name" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70 ml-1">{content.formLabels.name}</label>
                            <input
                                type="text"
                                id="name"
                                placeholder={content.formPlaceholders.name}
                                className="w-full bg-muted border border-border rounded-2xl px-5 py-4 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-ring transition-colors"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="email" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70 ml-1">{content.formLabels.email}</label>
                            <input
                                type="email"
                                id="email"
                                placeholder={content.formPlaceholders.email}
                                className="w-full bg-muted border border-border rounded-2xl px-5 py-4 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-ring transition-colors"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="message" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70 ml-1">{content.formLabels.message}</label>
                            <textarea
                                id="message"
                                placeholder={content.formPlaceholders.message}
                                rows={4}
                                className="w-full bg-muted border border-border rounded-2xl px-5 py-4 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-ring transition-colors resize-none"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                            ></textarea>
                        </div>

                        <div className="flex justify-center mt-2 w-full overflow-hidden">
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                                theme={mounted ? (resolvedTheme === 'dark' ? 'dark' : 'light') : 'dark'}
                                className="scale-90 sm:scale-100 origin-center"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="mt-4 w-full bg-accent text-accent-foreground h-14 flex items-center justify-center rounded-full text-sm font-bold uppercase tracking-wider transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                        >
                            {isPending ? content.sendingText : content.sendText}
                        </button>
                    </form>

                    <div className="flex flex-col items-center w-full overflow-hidden">
                        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 mb-6">{content.emailDirectText}</span>
                        <a
                            href={`mailto:${content.email}`}
                            className="group relative inline-block text-lg font-bold tracking-tight sm:text-2xl md:text-4xl text-foreground break-all md:break-normal px-2"
                        >
                            {content.email}
                            <span className="absolute -bottom-1 md:-bottom-4 left-0 h-1 w-0 bg-foreground transition-all duration-500 ease-out group-hover:w-full" />
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
