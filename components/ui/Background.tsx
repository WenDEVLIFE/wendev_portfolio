"use client";

import { motion } from "framer-motion";

export function Background() {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#050505]">
            {/* Subtle Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40" />

            {/* Animated Glowing Orbs */}
            <motion.div
                animate={{
                    x: [0, 100, -50, 0],
                    y: [0, -50, 100, 0],
                    scale: [1, 1.2, 0.9, 1],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/10 blur-[120px] mix-blend-screen"
            />

            <motion.div
                animate={{
                    x: [0, -100, 50, 0],
                    y: [0, 100, -50, 0],
                    scale: [0.9, 1.3, 1, 0.9],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-indigo-500/10 blur-[120px] mix-blend-screen"
            />

            <motion.div
                animate={{
                    x: [0, 50, -100, 0],
                    y: [0, -100, 50, 0],
                    scale: [1.1, 0.8, 1.2, 1.1],
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-[20%] left-[20%] w-[70vw] h-[70vw] rounded-full bg-purple-500/10 blur-[120px] mix-blend-screen"
            />

            {/* Deep intense central glow */}
            <div className="absolute top-[10vh] left-[50vw] w-[100vw] h-[80vh] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />

            {/* Maintained the subtle noise overlay if applicable */}
            <div className="noise opacity-20" />
        </div>
    );
}
