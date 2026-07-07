"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X, ChevronDown } from "lucide-react";

interface Project {
    id: string;
    name: string;
    description: string;
    tags: string[];
    url: string;
    domain: string;
    image: string;
}

const ICON_MAP: Record<string, string> = {
    "React": "/assets/icons/reactjs.svg",
    "Node.js": "/assets/icons/nigganodes.svg",
    "JavaScript": "/assets/icons/javascript.svg",
    "Flutter": "/assets/icons/flutter.svg",
    "Dart": "/assets/icons/dart.svg",
    "Firebase": "/assets/icons/firebase.svg",
    "Kotlin": "/assets/icons/kotlin.svg",
    "Swift": "/assets/icons/swift.svg",
    "Python": "/assets/icons/python.svg",
    "Docker": "/assets/icons/docker.svg",
    "PostgreSQL": "/assets/icons/pgsql.svg",
    "MongoDB": "/assets/icons/mongodb.svg",
    "MySQL": "/assets/icons/mysql.svg",
    "Java": "/assets/icons/java.svg",
    "Jetpack Compose": "/assets/icons/jetpackcompose.svg",
    "TensorFlow": "/assets/icons/tensorflow.svg",
    "Supabase": "/assets/icons/supabase.svg",
    "Jupyter Notebooks": "/assets/icons/jupyter.svg",
};

export function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [showAll, setShowAll] = useState(false);
    const INITIAL_COUNT = 5;
    const customEasing: [number, number, number, number] = [0.22, 1, 0.36, 1];

    useEffect(() => {
        fetch("/api/projects")
            .then(res => res.json())
            .then(data => setProjects(data.projects || []))
            .catch(() => {});
    }, []);

    const displayed = showAll ? projects : projects.slice(0, INITIAL_COUNT);

    return (
        <section id="projects" className="py-24 px-6 md:py-32 md:px-12 lg:px-32">
            <div className="mb-20">
                <h2 className="mb-4 text-4xl font-bold tracking-tighter md:text-5xl">Solutions That Drive Impact</h2>
                <p className="text-muted-foreground text-lg">Web and mobile applications designed to solve real business problems.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 md:gap-8">
                {displayed.map((project, i) => (
                    <motion.div
                        key={project.name}
                        initial={{ y: 24, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: i * 0.05, ease: customEasing }}
                        className="group rounded-[2rem] border border-border bg-card overflow-hidden hover:border-border/80 transition-all duration-500"
                    >
                        <div
                            className="relative aspect-[16/10] overflow-hidden cursor-zoom-in"
                            onClick={() => project.image && setSelectedImage(project.image)}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent dark:from-black/80 dark:via-black/20 dark:to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none" />
                            {project.image ? (
                                <Image
                                    src={project.image}
                                    alt={project.name}
                                    fill
                                    className="object-cover z-0 transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center p-8 z-0 relative">
                                    <span className="text-muted-foreground/60 font-mono text-xs uppercase tracking-widest">{project.name}</span>
                                </div>
                            )}
                            <div className="absolute top-4 left-4 z-20 flex gap-2">
                                <span className="font-mono text-[10px] text-muted-foreground bg-black/50 dark:bg-black/70 px-2 py-1 rounded-full">0{i + 1}</span>
                                <span className="font-mono text-[10px] text-muted-foreground bg-black/50 dark:bg-black/70 px-2 py-1 rounded-full">{project.domain}</span>
                            </div>
                        </div>
                        <div className="p-5 md:p-6">
                            <h3 className="mb-3 text-xl md:text-2xl font-bold tracking-tight">{project.name}</h3>
                            <p className="mb-4 text-sm text-muted-foreground leading-relaxed font-light line-clamp-2">
                                {project.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-5">
                                {project.tags.map(tag => (
                                    <div key={tag} className="flex items-center gap-1 rounded-full bg-muted border border-border px-2.5 py-1">
                                        {ICON_MAP[tag] && (
                                            <Image src={ICON_MAP[tag]} alt={tag} width={12} height={12} className="w-3 h-3" />
                                        )}
                                        <span className="text-[10px] font-semibold tracking-wide text-muted-foreground">{tag}</span>
                                    </div>
                                ))}
                            </div>
                            <a href={project.url} target="_blank" rel="noopener noreferrer" className="group/btn inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors hover:text-muted-foreground">
                                View Project
                                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                            </a>
                        </div>
                    </motion.div>
                ))}
            </div>

            {projects.length > INITIAL_COUNT && (
                <div className="flex justify-center mt-12">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-muted border border-border text-sm font-medium hover:bg-muted/80 transition-all"
                    >
                        {showAll ? "Show Less" : `View More (${projects.length - INITIAL_COUNT} more)`}
                        <ChevronDown className={`w-4 h-4 transition-transform ${showAll ? "rotate-180" : ""}`} />
                    </button>
                </div>
            )}

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 dark:bg-black/90 p-4 md:p-8 backdrop-blur-sm cursor-zoom-out"
                    >
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-6 right-6 z-[110] p-2 bg-muted hover:bg-muted/80 rounded-full text-foreground transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-6xl aspect-[16/10] sm:aspect-video rounded-2xl md:rounded-[2rem] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={selectedImage}
                                alt="Project Full View"
                                fill
                                className="object-contain bg-background/50"
                                quality={100}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
