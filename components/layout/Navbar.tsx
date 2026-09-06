"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

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
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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

    if (!content) {
        return (
            <div className="sticky top-6 z-50 mx-4 md:mx-auto bg-card backdrop-blur-[24px] border border-border rounded-full py-3 px-6 shadow-2xl shadow-black/20 dark:shadow-black/50">
                <div className="flex items-center justify-between">
                    <div className="h-6 w-24 bg-muted rounded animate-pulse" />
                    <div className="hidden md:flex gap-4">
                        <div className="h-4 w-12 bg-muted rounded animate-pulse" />
                        <div className="h-4 w-12 bg-muted rounded animate-pulse" />
                        <div className="h-4 w-12 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="md:hidden h-6 w-6 bg-muted rounded animate-pulse" />
                </div>
            </div>
        );
    }

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
            className="bg-card backdrop-blur-[24px] border border-border sticky top-6 z-50 mx-4 flex items-center justify-between rounded-full py-3 shadow-2xl shadow-black/20 dark:shadow-black/50 md:mx-auto"
        >
            <div className="flex items-center">
                <Image
                    src="/assets/logo/NAVY-BLUE-LOGO-PNG.png"
                    alt={content.logoAlt}
                    width={100}
                    height={32}
                    className="h-6 md:h-8 w-auto object-contain block dark:hidden"
                />
                <Image
                    src={content.logo}
                    alt={content.logoAlt}
                    width={100}
                    height={32}
                    className="h-6 md:h-8 w-auto object-contain hidden dark:block"
                />
            </div>

            {/* Desktop Menu */}
            <div className="hidden gap-8 text-sm font-medium md:flex text-muted-foreground">
                {content.links.map(link => (
                    <a key={link.href} href={link.href} className="hover:text-foreground transition-colors duration-300">{link.label}</a>
                ))}
            </div>
            <div className="hidden md:flex items-center gap-2">
                {mounted && (
                    <button
                        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                        className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        aria-label="Toggle theme"
                    >
                        {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>
                )}
            </div>

            {/* Mobile Toggle */}
            <button
                className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
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
                        className="absolute left-0 top-[calc(100%+12px)] w-full rounded-[2rem] border border-border bg-white/95 dark:bg-black/95 p-6 backdrop-blur-2xl shadow-2xl md:hidden"
                    >
                        <div className="flex flex-col gap-6 text-center text-lg font-medium text-muted-foreground">
                            {content.links.map(link => (
                                <a key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="hover:text-foreground transition-colors">{link.label}</a>
                            ))}
                            {mounted && (
                                <button
                                    onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                                    className="flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                    {resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
