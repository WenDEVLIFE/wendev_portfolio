"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-white/[0.02] backdrop-blur-[24px] border border-white/[0.06] sticky top-6 z-50 mx-4 flex items-center justify-between rounded-full px-6 py-3 md:mx-auto md:max-w-5xl md:px-8 shadow-2xl shadow-black/50">
            <div className="text-xl font-bold tracking-tighter">Frouen.</div>

            {/* Desktop Menu */}
            <div className="hidden gap-8 text-sm font-medium md:flex text-neutral-400">
                <a href="#about" className="hover:text-white transition-colors duration-300">About</a>
                <a href="#projects" className="hover:text-white transition-colors duration-300">Work</a>
                <a href="#contact" className="hover:text-white transition-colors duration-300">Contact</a>
            </div>
            <button className="hidden md:block bg-white text-black scale-100 hover:scale-[1.02] active:scale-[0.98] rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300">
                Available
            </button>

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
                            <button className="bg-white text-black rounded-full px-5 py-3 text-base font-semibold w-full mt-2">
                                Available
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
