"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Palette, Cpu, Globe, ChevronRight } from "lucide-react";

const TECH_STACK = [
    { name: "Flutter", icon: "/assets/icons/flutter.svg" },
    { name: "React", icon: "/assets/icons/reactjs.svg" },
    { name: "Node.js", icon: "/assets/icons/nigganodes.svg" },
    { name: "Python", icon: "/assets/icons/python.svg" },
    { name: "Firebase", icon: "/assets/icons/firebase.svg" },
    { name: "Docker", icon: "/assets/icons/docker.svg" },
    { name: "PostgreSQL", icon: "/assets/icons/pgsql.svg" },
    { name: "MongoDB", icon: "/assets/icons/mongodb.svg" },
    { name: "TensorFlow", icon: "/assets/icons/tensorflow.svg" },
    { name: "Jupyter Notebooks", icon: "/assets/icons/jupyter.svg" },
    { name: "Supabase", icon: "/assets/icons/supabase.svg" },
    { name: "Jetpack Compose", icon: "/assets/icons/jetpackcompose.svg" },
    { name: "Swift", icon: "/assets/icons/swift.svg" },
    { name: "Kotlin", icon: "/assets/icons/kotlin.svg" },
    { name: "Java", icon: "/assets/icons/java.svg" },
];

export function About() {
    return (
        <section id="about" className="py-24 px-4 sm:px-6 md:py-32 md:px-12 lg:px-20 xl:px-24">
            <div className="mb-12 md:mb-16">
                <h2 className="text-3xl font-bold tracking-tighter md:text-5xl">Design meets Engineering</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:grid-rows-2">
                {/* About Card */}
                <motion.div
                    className="rounded-3xl border border-border bg-card backdrop-blur-[24px] p-8 transition-all duration-500 hover:border-border/80 hover:bg-card relative col-span-1 flex flex-col justify-between overflow-hidden md:col-span-2 md:row-span-2 group"
                >
                    <div>
                        <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-muted border border-border text-foreground transition-colors group-hover:bg-muted/80">
                            <Palette className="h-5 w-5" />
                        </div>
                        <h3 className="mb-4 text-3xl font-bold tracking-tight">Software Developer</h3>
                        <p className="text-muted-foreground leading-relaxed text-lg">
                            Develop Web and mobile applications to meet the needs of modern businesses to upscale their operations.
                        </p>
                    </div>
                    <div className="mt-12 flex items-center gap-4 border-t border-border pt-8 text-sm text-muted-foreground/70 font-medium tracking-wide uppercase">
                        <span></span>
                    </div>
                </motion.div>

                {/* Tech Stack Card */}
                <motion.div
                    className="rounded-3xl border border-border bg-card backdrop-blur-[24px] p-8 transition-all duration-500 hover:border-border/80 hover:bg-card col-span-1 md:col-span-2 group"
                >
                    <div className="flex justify-between items-start mb-8">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted border border-border text-foreground transition-colors group-hover:bg-muted/80">
                            <Cpu className="h-5 w-5" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight mb-6">Core Technologies</h3>
                    <div className="flex flex-wrap gap-3">
                        {TECH_STACK.map((tech) => (
                            <div key={tech.name} className="flex items-center gap-2 rounded-full bg-muted border border-border px-4 py-2 hover:bg-muted/80 transition-colors">
                                <Image src={tech.icon} alt={tech.name} width={16} height={16} className="w-4 h-4" />
                                <span className="text-xs font-semibold tracking-wide text-muted-foreground">
                                    {tech.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Achievement Card */}
                <motion.div
                    className="rounded-3xl border border-border bg-card backdrop-blur-[24px] p-8 transition-all duration-500 hover:border-border/80 hover:bg-card col-span-1 flex flex-col justify-between group"
                >
                    <Globe className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-foreground" />
                    <div>
                        <div className="text-5xl font-black tracking-tighter mb-2">10+</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Production Apps</div>
                    </div>
                </motion.div>

                {/* Links Card */}
                <motion.div
                    className="rounded-3xl border border-border bg-card backdrop-blur-[24px] p-8 transition-all duration-500 hover:border-border/80 hover:bg-card col-span-1 flex flex-col justify-center"
                >
                    <div className="space-y-6">
                        <a href="https://github.com/wendevlife" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group text-muted-foreground hover:text-foreground transition-colors">
                            <span className="font-semibold tracking-wide">GitHub</span>
                            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </a>
                        <div className="w-full h-px bg-border" />
                        <a href="https://linkedin.com/in/wendevlife" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group text-muted-foreground hover:text-foreground transition-colors">
                            <span className="font-semibold tracking-wide">LinkedIn</span>
                            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
