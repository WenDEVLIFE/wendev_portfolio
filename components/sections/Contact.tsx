"use client";

import { motion } from "framer-motion";
import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast, Toaster } from "react-hot-toast";

export function Contact() {
    const customEasing: [number, number, number, number] = [0.22, 1, 0.36, 1];

    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [isPending, setIsPending] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = recaptchaRef.current?.getValue();
        if (!token) {
            toast.error("Please complete the reCAPTCHA verification.", {
                style: { borderRadius: '100px', background: '#333', color: '#fff' }
            });
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

            toast.success(data.success, {
                style: { borderRadius: '100px', background: '#333', color: '#fff' }
            });

            // Reset form
            setFormData({ name: "", email: "", message: "" });
            recaptchaRef.current?.reset();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Something went wrong";
            toast.error(errorMessage, {
                style: { borderRadius: '100px', background: '#333', color: '#fff' }
            });
        } finally {
            setIsPending(false);
        }
    };

    return (
        <section id="contact" className="py-24 px-6 md:py-32 md:px-12 lg:px-32 relative">
            <Toaster position="bottom-right" />
            <div className="border border-white/10 bg-white/[0.02] backdrop-blur-3xl flex flex-col items-center overflow-hidden rounded-[2rem] md:rounded-[3rem] py-20 px-4 md:py-32 md:px-6 text-center shadow-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: customEasing }}
                    viewport={{ once: true }}
                    className="w-full flex flex-col justify-center items-center"
                >
                    <h2 className="bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent mb-6 text-4xl font-black tracking-tighter sm:text-5xl md:text-8xl">
                        Let&apos;s Build.
                    </h2>
                    <p className="mx-auto mb-12 max-w-xl text-base md:text-xl text-neutral-400 font-light">
                        Ready to elevate your digital presence? I am currently accepting strategic design and development projects.
                    </p>

                    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto mb-16 flex flex-col gap-4 text-left font-sans">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="name" className="text-xs font-semibold uppercase tracking-widest text-neutral-500 ml-1">Name</label>
                            <input
                                type="text"
                                id="name"
                                placeholder="John Doe"
                                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition-colors"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="email" className="text-xs font-semibold uppercase tracking-widest text-neutral-500 ml-1">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="john@example.com"
                                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition-colors"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="message" className="text-xs font-semibold uppercase tracking-widest text-neutral-500 ml-1">Message</label>
                            <textarea
                                id="message"
                                placeholder="How can I help you?"
                                rows={4}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition-colors resize-none"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                            ></textarea>
                        </div>

                        <div className="flex justify-center mt-2 w-full overflow-hidden">
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                                theme="dark"
                                className="scale-90 sm:scale-100 origin-center"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="mt-4 w-full bg-white text-black h-14 flex items-center justify-center rounded-full text-sm font-bold uppercase tracking-wider transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                        >
                            {isPending ? "Sending..." : "Send Message"}
                        </button>
                    </form>

                    <div className="flex flex-col items-center w-full overflow-hidden">
                        <span className="text-xs font-semibold uppercase tracking-widest text-neutral-600 mb-6">Or email directly</span>
                        <a
                            href="mailto:medinajrfrouen@gmail.com"
                            className="group relative inline-block text-lg font-bold tracking-tight sm:text-2xl md:text-4xl text-white break-all md:break-normal px-2"
                        >
                            medinajrfrouen@gmail.com
                            <span className="absolute -bottom-1 md:-bottom-4 left-0 h-1 w-0 bg-white transition-all duration-500 ease-out group-hover:w-full" />
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
