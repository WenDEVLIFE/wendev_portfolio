"use client";

import { motion } from "framer-motion";
import { Palette, Cpu, Globe, ChevronRight } from "lucide-react";

export function About() {
    return (
        <section id="about" className="py-24 px-6 md:py-32 md:px-12 lg:px-32">
            <div className="mb-12 md:mb-16">
                <h2 className="text-3xl font-bold tracking-tighter md:text-5xl">Design meets Engineering</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:grid-rows-2">
                {/* About Card */}
                <motion.div
                    className="rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-[24px] p-8 transition-all duration-500 hover:border-white/10 hover:bg-white/[0.02] relative col-span-1 flex flex-col justify-between overflow-hidden md:col-span-2 md:row-span-2 group"
                >
                    <div>
                        <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white transition-colors group-hover:bg-white/10">
                            <Palette className="h-5 w-5" />
                        </div>
                        <h3 className="mb-4 text-3xl font-bold tracking-tight">Full Stack Developer</h3>
                        <p className="text-neutral-400 leading-relaxed text-lg">
                            Developing mobile and web applications using Flutter, React, and Node.js. Specializing in cross-platform solutions and cloud integration.
                        </p>
                    </div>
                    <div className="mt-12 flex items-center gap-4 border-t border-white/10 pt-8 text-sm text-neutral-500 font-medium tracking-wide uppercase">
                        <span>President, GDG Davao | CEO SudoTech+</span>
                    </div>
                </motion.div>

                {/* Tech Stack Card */}
                <motion.div
                    className="rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-[24px] p-8 transition-all duration-500 hover:border-white/10 hover:bg-white/[0.02] col-span-1 md:col-span-2 group"
                >
                    <div className="flex justify-between items-start mb-8">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white transition-colors group-hover:bg-white/10">
                            <Cpu className="h-5 w-5" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight mb-6">Core Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                        {["Flutter", "React", "Node.js", "Python", "TypeScript", "AWS", "Firebase", "Docker"].map(s => (
                            <span key={s} className="rounded-full bg-white/5 px-4 py-2 text-xs font-semibold tracking-wide text-neutral-300 border border-white/5">
                                {s}
                            </span>
                        ))}
                    </div>
                </motion.div>

                {/* Achievement Card */}
                <motion.div
                    className="rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-[24px] p-8 transition-all duration-500 hover:border-white/10 hover:bg-white/[0.02] col-span-1 flex flex-col justify-between group"
                >
                    <Globe className="h-6 w-6 text-neutral-500 transition-colors group-hover:text-white" />
                    <div>
                        <div className="text-5xl font-black tracking-tighter mb-2">10+</div>
                        <div className="text-xs text-neutral-500 uppercase tracking-widest font-bold">Production Apps</div>
                    </div>
                </motion.div>

                {/* Links Card */}
                <motion.div
                    className="rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-[24px] p-8 transition-all duration-500 hover:border-white/10 hover:bg-white/[0.02] col-span-1 flex flex-col justify-center"
                >
                    <div className="space-y-6">
                        <a href="https://github.com/wendevlife" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group text-neutral-400 hover:text-white transition-colors">
                            <span className="font-semibold tracking-wide">GitHub</span>
                            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </a>
                        <div className="w-full h-px bg-white/5" />
                        <a href="https://linkedin.com/in/wendevlife" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group text-neutral-400 hover:text-white transition-colors">
                            <span className="font-semibold tracking-wide">LinkedIn</span>
                            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
