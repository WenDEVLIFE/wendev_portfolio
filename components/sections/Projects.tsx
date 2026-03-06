"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const ICON_MAP: Record<string, string> = {
    "React": "/assets/icons/reactjs.svg",
    "Node.js": "/assets/icons/nigganodes.svg",
    "JavaScript": "/assets/icons/javascript.svg",
    "Flutter": "/assets/icons/flutter.svg",
    "Dart": "/assets/icons/dart.svg",
    "Firebase": "/assets/icons/firebase.svg",
    "Kotlin": "/assets/icons/kotlin.svg"
};

const PROJECTS = [
    {
        name: "SudoTech+",
        description: "Startup website of my company",
        tags: ["React", "Node.js", "JavaScript"],
        url: "https://www.sudotech.plus/",
        domain: "sudotech.plus",
    },
    {
        name: "Aid Anchor",
        description: "A mobile app for first aid tips and helping communities from disasters",
        tags: ["Flutter", "Dart", "Firebase"],
        url: "https://github.com/WenDEVLIFE/aid_anchor",
        domain: "github.com",
    },
    {
        name: "ClassAce",
        description: "A mobile app for students to manage their classes, assignments, and schedules",
        tags: ["Kotlin", "Firebase"],
        url: "https://github.com/WenDEVLIFE/ClassAce",
        domain: "github.com",
    },
    {
        name: "DPR CAR RENTAL",
        description: "A mobile app that will manage rental system using AI and management",
        tags: ["Flutter", "Dart", "Firebase"],
        url: "https://github.com/WenDEVLIFE/dpr_car_rentals",
        domain: "github.com",
    }
];

export function Projects() {
    const customEasing: [number, number, number, number] = [0.22, 1, 0.36, 1];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                ease: customEasing
            }
        }
    } as const;

    const itemVariants = {
        hidden: { y: 24, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.8, ease: customEasing }
        }
    } as const;

    return (
        <section id="projects" className="py-24 px-6 md:py-32 md:px-12 lg:px-32">
            <div className="mb-20">
                <h2 className="mb-4 text-4xl font-bold tracking-tighter md:text-5xl">Selected Work</h2>
                <p className="text-neutral-400 text-lg">Digital products built with absolute precision.</p>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid gap-8 md:gap-16"
            >
                {PROJECTS.map((project, i) => (
                    <motion.div
                        key={project.name}
                        variants={itemVariants}
                        className="group grid grid-cols-1 gap-8 md:grid-cols-12 items-center"
                    >
                        <div className="md:col-span-7 relative aspect-[16/10] overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 transition-all duration-700 hover:border-white/20">
                            <div className="absolute inset-0 bg-gradient-to-tr from-black/80 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-700" />
                            <div className="flex h-full items-center justify-center p-8 z-0 relative">
                                <span className="text-neutral-600 font-mono text-xs uppercase tracking-widest">{project.name}</span>
                            </div>
                        </div>
                        <div className="md:col-span-5 flex flex-col justify-center md:pl-8">
                            <div className="mb-6 flex gap-3">
                                <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest">0{i + 1}</span>
                                <div className="h-px w-8 bg-neutral-700 my-auto" />
                                <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest">{project.domain}</span>
                            </div>
                            <h3 className="mb-4 md:mb-6 text-3xl md:text-4xl font-bold tracking-tighter lg:text-5xl">{project.name}</h3>
                            <p className="mb-6 text-base md:text-lg text-neutral-400 leading-relaxed font-light">
                                {project.description}
                            </p>
                            <div className="flex flex-wrap gap-2.5 mb-8 md:mb-10">
                                {project.tags.map(tag => (
                                    <div key={tag} className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 hover:bg-white/10 transition-colors">
                                        {ICON_MAP[tag] && (
                                            <Image src={ICON_MAP[tag]} alt={tag} width={14} height={14} className="w-3.5 h-3.5" />
                                        )}
                                        <span className="text-[10px] font-semibold tracking-wide text-neutral-300">
                                            {tag}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-6">
                                <a href={project.url} target="_blank" rel="noopener noreferrer" className="group/btn flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-colors hover:text-neutral-300">
                                    View Project
                                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
