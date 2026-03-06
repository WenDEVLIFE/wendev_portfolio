"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function Hero() {
    const customEasing: [number, number, number, number] = [0.22, 1, 0.36, 1];

    return (
        <section id="about" className="py-24 px-4 sm:px-6 md:py-32 md:px-12 lg:px-20 relative flex min-h-[90vh] flex-col items-center justify-center text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.2, ease: customEasing }}
                className="relative mb-8 h-32 w-32 md:h-40 md:w-40 rounded-full"
            >
                <div className="absolute inset-0 rounded-full bg-neutral-500/30 blur-2xl animate-pulse" />
                <Image
                    src="/assets/profile/ceo.png"
                    alt="Frouen Medina Jr."
                    fill
                    className="rounded-full object-cover border border-white/10 relative z-10"
                    priority
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: customEasing }}
                className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-neutral-300 uppercase tracking-widest"
            >
                <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500"></span>
                </span>
                Accepting New Clients
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.2, delay: 0.2, ease: customEasing }}
                className="bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent mb-6 text-5xl font-black tracking-tighter sm:text-7xl md:text-8xl lg:text-[10rem] leading-[1]"
            >
                Frouen<br />Medina Jr.
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: customEasing }}
                className="max-w-2xl px-4 text-base text-neutral-400 sm:text-lg md:text-2xl font-light tracking-tight"
            >
                Passionate full stack developer with expertise in Flutter, React, Node.js, and cloud technologies.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: customEasing }}
                className="mt-12 flex flex-col sm:flex-row flex-wrap justify-center gap-4 px-4 w-full sm:w-auto"
            >
                <a href="#projects" className="bg-white text-black h-14 flex items-center justify-center gap-2 rounded-full px-8 text-sm font-bold uppercase tracking-wider transition-transform hover:scale-[1.02] w-full sm:w-auto">
                    View Selected Work
                </a>
                <a href="https://drive.google.com/drive/u/2/folders/1E0Syh-hwKiPOon_cfONmJ9wIWMHWqGH8" target="_blank" rel="noopener noreferrer" className="bg-transparent text-white border border-white/20 h-14 flex items-center justify-center gap-2 rounded-full px-8 text-sm font-bold uppercase tracking-wider transition-all hover:bg-white/5 w-full sm:w-auto">
                    View CV & Certificates
                </a>
            </motion.div>
        </section>
    );
}
