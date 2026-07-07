"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function Hero() {
    const customEasing: [number, number, number, number] = [0.22, 1, 0.36, 1];
    const [content, setContent] = useState<{
        name: string; tagline: string; badge: string;
        ctaPrimary: { label: string; href: string };
        ctaSecondary: { label: string; href: string };
        profileImage: string;
    } | null>(null);

    useEffect(() => {
        fetch("/api/content").then(r => r.json()).then(d => setContent(d.content?.hero || null)).catch(() => {});
    }, []);

    if (!content) return null;

    return (
        <section id="about" className="py-24 px-4 sm:px-6 md:py-32 md:px-12 lg:px-20 relative flex min-h-[90vh] flex-col items-center justify-center text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.2, ease: customEasing }}
                className="relative mb-8 h-32 w-32 md:h-40 md:w-40 rounded-full"
            >
                <div className="absolute inset-0 rounded-full bg-muted-foreground/20 blur-2xl animate-pulse" />
                <Image
                    src={content.profileImage}
                    alt="Frouen Medina Jr."
                    fill
                    className="rounded-full object-cover border border-border relative z-10"
                    priority
                />
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.2, delay: 0.2, ease: customEasing }}
                className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-6 text-5xl font-black tracking-tighter sm:text-7xl md:text-8xl lg:text-[10rem] leading-[1]"
                dangerouslySetInnerHTML={{ __html: content.name }}
            />

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: customEasing }}
                className="max-w-2xl px-4 text-base text-muted-foreground sm:text-lg md:text-2xl font-light tracking-tight"
            >
                {content.tagline}
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: customEasing }}
                className="mt-12 flex flex-col sm:flex-row flex-wrap justify-center gap-4 px-4 w-full sm:w-auto"
            >
                <a href={content.ctaPrimary.href} className="bg-accent text-accent-foreground h-14 flex items-center justify-center gap-2 rounded-full px-8 text-sm font-bold uppercase tracking-wider transition-transform hover:scale-[1.02] w-full sm:w-auto">
                    {content.ctaPrimary.label}
                </a>
                <a href={content.ctaSecondary.href} target="_blank" rel="noopener noreferrer" className="bg-transparent text-foreground border border-border h-14 flex items-center justify-center gap-2 rounded-full px-8 text-sm font-bold uppercase tracking-wider transition-all hover:bg-muted w-full sm:w-auto">
                    {content.ctaSecondary.label}
                </a>
            </motion.div>
        </section>
    );
}
