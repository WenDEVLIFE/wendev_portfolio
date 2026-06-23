"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

interface NavContent {
    links: { label: string; href: string }[];
    businessHours: string;
    logo: string;
    logoAlt: string;
}

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [content, setContent] = useState<NavContent | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        fetch("/api/content").then(r => r.json()).then(d => setContent(d.content?.nav || null)).catch(() => {});
    }, []);

    if (!content) return null;

    return (
        <motion.nav
            animate={{
                paddingLeft: isScrolled ? "1.0rem" : "1.5rem",
                paddingRight: isScrolled ? "1.0rem" : "1.5rem",
                maxWidth: isScrolled ? "64rem" : "88rem",
            }}
            transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
            }}
            className="bg-white/[0.02] backdrop-blur-[24px] border border-white/[0.06] sticky top-6 z-50 mx-4 flex items-center justify-between rounded-full py-3 shadow-2xl shadow-black/50 md:mx-auto"
        >
            <div className="flex items-center">
                <Image
                    src={content.logo}
                    alt={content.logoAlt}
                    width={100}
                    height={32}
                    className="h-6 md:h-8 w-auto object-contain"
                />
            </div>

            {/* Desktop Menu */}
            <div className="hidden gap-8 text-sm font-medium md:flex text-neutral-400">
                {content.links.map(link => (
                    <a key={link.href} href={link.href} className="hover:text-white transition-colors duration-300">{link.label}</a>
                ))}
            </div>
            <div className="hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-neutral-300 tracking-wider">
                <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500"></span>
                </span>
                {content.businessHours}
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
                            {content.links.map(link => (
                                <a key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white transition-colors">{link.label}</a>
                            ))}
                            <div className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-neutral-300 w-full mt-2 tracking-wider">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                                </span>
                                {content.businessHours}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
