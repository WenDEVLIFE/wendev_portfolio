"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export const LoadingScreen = () => {
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setIsVisible(false), 500);
                    return 100;
                }
                return prev + 2;
            });
        }, 30);

        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0a]"
                >
                    <div className="relative flex flex-col items-center gap-8">
                        {/* Logo with pulse animation */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{
                                scale: [0.8, 1.1, 1],
                                opacity: 1
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                repeatType: "reverse",
                                ease: "easeInOut"
                            }}
                            className="relative w-32 h-32 md:w-48 md:h-48"
                        >
                            <Image
                                src="/assets/logo/WHITE-LOGO-PNG.png"
                                alt="Wendev Logo"
                                fill
                                priority
                                className="object-contain"
                            />
                        </motion.div>

                        {/* Loading Bar Container */}
                        <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden relative">
                            {/* Progress Fill */}
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                            />
                        </div>

                        {/* Percentage Text */}
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-white/40 text-xs font-mono tracking-widest uppercase"
                        >
                            Loading {Math.round(progress)}%
                        </motion.span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
