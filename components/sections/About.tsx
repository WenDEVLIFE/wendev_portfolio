"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Cpu, Globe, ChevronRight, CheckCircle2, Handshake, DollarSign, MessageCircle } from "lucide-react";

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

const VALUES = [
    {
        icon: CheckCircle2,
        title: "Follow Your Requirements",
        description: "I listen first, build second. Every feature starts with understanding exactly what you need.",
    },
    {
        icon: Handshake,
        title: "Collaborate on Ideas",
        description: "Your vision matters. I work alongside you — refining, suggesting, and shaping ideas together.",
    },
    {
        icon: DollarSign,
        title: "Respect Your Budget",
        description: "No surprise costs. I negotiate fairly and deliver maximum value within what you can afford.",
    },
    {
        icon: MessageCircle,
        title: "Always Approachable",
        description: "No question is too small. I keep communication open, clear, and free of technical jargon.",
    },
];

export function About() {
    return (
        <section id="about" className="py-24 px-4 sm:px-6 md:py-32 md:px-12 lg:px-20 xl:px-24">
            <div className="mb-12 md:mb-16">
                <h2 className="text-3xl font-bold tracking-tighter md:text-5xl">Design meets Engineering</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:grid-rows-2">
                {/* Why Choose Me — Values Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="rounded-3xl border border-border bg-card backdrop-blur-[24px] p-8 transition-all duration-500 hover:border-border/80 hover:bg-card relative col-span-1 flex flex-col overflow-hidden md:col-span-2 md:row-span-2 group"
                >
                    <div>
                        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-muted border border-border text-foreground transition-colors group-hover:bg-muted/80">
                            <Handshake className="h-5 w-5" />
                        </div>
                        <h3 className="mb-2 text-3xl font-bold tracking-tight">Why Choose Me</h3>
                        <p className="text-muted-foreground text-sm mb-8">More than code — a partner for your project.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                        {VALUES.map((value) => (
                            <div key={value.title} className="flex flex-col gap-3 rounded-2xl bg-muted/50 border border-border/50 p-5 transition-all duration-300 hover:bg-muted hover:border-border">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-background border border-border">
                                    <value.icon className="h-4 w-4 text-foreground" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground text-sm mb-1">{value.title}</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">{value.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Tech Stack Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.1 }}
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
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.2 }}
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
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.3 }}
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
