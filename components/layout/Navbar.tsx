"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-white/[0.02] backdrop-blur-[24px] border border-white/[0.06] sticky top-6 z-50 mx-4 flex items-center justify-between rounded-full px-6 py-3 md:mx-auto md:max-w-5xl md:px-8 shadow-2xl shadow-black/50">
            <div className="flex items-center">
                <Image
                    src="/assets/logo/WHITE-LOGO-PNG.png"
                    alt="Frouen Logo"
                    width={100}
                    height={32}
                    className="h-6 md:h-8 w-auto object-contain"
                />
            </div>

            {/* Desktop Menu */}
            <div className="hidden gap-8 text-sm font-medium md:flex text-neutral-400">
                <a href="#about" className="hover:text-white transition-colors duration-300">About</a>
                <a href="#projects" className="hover:text-white transition-colors duration-300">Work</a>
                <a href="#contact" className="hover:text-white transition-colors duration-300">Contact</a>
            </div>
            <div className="hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-neutral-300 tracking-wider">
                <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500"></span>
                </span>
                Mon - Fri, 8AM - 5PM PH Time
            </div>

            {/* Mobile Toggle */}
            <button
                className="md:hidden p-2 text-neutral-400 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Mobile Dropdown */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-[calc(100%+12px)] w-full rounded-[2rem] border border-white/10 bg-black/95 p-6 backdrop-blur-2xl shadow-2xl md:hidden"
                    >
                        <div className="flex flex-col gap-6 text-center text-lg font-medium text-neutral-300">
                            <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white transition-colors">About</a>
                            <a href="#projects" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white transition-colors">Work</a>
                            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white transition-colors">Contact</a>
                            <div className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-neutral-300 w-full mt-2 tracking-wider">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                                </span>
                                Mon - Fri, 8AM - 5PM PH Time
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
