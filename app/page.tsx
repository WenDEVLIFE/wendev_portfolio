"use client";

import { motion } from "framer-motion";
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  ArrowUpRight,
  Code2,
  Palette,
  Cpu,
  Globe,
  ChevronRight
} from "lucide-react";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  } as const;

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 260, damping: 20 }
    }
  } as const;

  return (
    <div className="relative min-h-screen">
      {/* Background Elements */}
      <div className="noise" />
      <div className="aurora">
        <div className="aurora-blob aurora-1" />
        <div className="aurora-blob aurora-2" />
        <div className="aurora-blob aurora-3" />
      </div>

      {/* Navigation */}
      <nav className="glass sticky top-4 z-50 mx-4 flex items-center justify-between rounded-full px-6 py-3 md:mx-12 md:px-8">
        <div className="text-xl font-bold tracking-tighter">WENDEV</div>
        <div className="hidden gap-8 text-sm font-medium md:flex">
          <a href="#about" className="hover:text-accent transition-colors">About</a>
          <a href="#projects" className="hover:text-accent transition-colors">Projects</a>
          <a href="#contact" className="hover:text-accent transition-colors">Contact</a>
        </div>
        <button className="bg-foreground text-background scale-100 hover:scale-105 active:scale-95 rounded-full px-5 py-2 text-sm font-semibold transition-all">
          Hire Me
        </button>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="section-padding relative flex min-h-[80vh] flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
            </span>
            Available for new opportunities
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gradient mb-8 text-6xl font-bold tracking-tight md:text-8xl lg:text-9xl"
          >
            Crafting the <br />
            future web.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl text-lg text-muted-foreground md:text-xl lg:text-2xl"
          >
            Full-stack developer focused on creating fast, interactive, and visually stunning digital experiences.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 flex flex-wrap justify-center gap-4"
          >
            <a href="#projects" className="bg-foreground text-background group h-14 flex items-center gap-2 rounded-full px-8 text-base font-semibold transition-all hover:gap-3">
              Explore Projects <ArrowUpRight className="h-5 w-5" />
            </a>
            <a href="#contact" className="glass h-14 flex items-center gap-2 rounded-full px-8 text-base font-semibold hover:bg-muted transition-colors">
              Let&apos;s Talk <Mail className="h-5 w-5" />
            </a>
          </motion.div>
        </section>

        {/* Bento Grid (About & Skills) */}
        <section id="about" className="section-padding">
          <div className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">Design meets Engineering</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:grid-rows-2">
            {/* About Card */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bento-card relative col-span-1 flex flex-col justify-between overflow-hidden md:col-span-2 md:row-span-2"
            >
              <div>
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/20 text-accent">
                  <Palette className="h-6 w-6" />
                </div>
                <h3 className="mb-4 text-2xl font-bold">Hybrid designer-developer workflow</h3>
                <p className="text-muted-foreground">
                  I specialize in bridging the gap between design systems and complex engineering.
                  My code is as clean as the interfaces I design.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-4 border-t border-border pt-8 text-sm text-muted-foreground">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-muted" />
                  ))}
                </div>
                <span>Worked with 10+ startups</span>
              </div>
            </motion.div>

            {/* Tech Stack Card */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bento-card col-span-1 md:col-span-2"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 text-accent">
                  <Cpu className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold">Modern Stack</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Next.js", "React", "TypeScript", "Tailwind", "Node.js", "Prisma", "PostgreSQL", "Framer Motion"].map(s => (
                  <span key={s} className="rounded-lg bg-muted/50 px-3 py-1.5 text-xs font-medium border border-border">
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Achievement Card */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bento-card col-span-1"
            >
              <Globe className="mb-4 h-8 w-8 text-accent" />
              <div className="text-3xl font-bold mb-1">5★</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider font-bold">Client Rating</div>
            </motion.div>

            {/* Links Card */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bento-card col-span-1 flex flex-col justify-center"
            >
              <div className="space-y-4">
                <a href="#" className="flex items-center justify-between group">
                  <span className="font-semibold">GitHub</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
                <a href="#" className="flex items-center justify-between group">
                  <span className="font-semibold">LinkedIn</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Improved Projects Section */}
        <section id="projects" className="section-padding">
          <div className="mb-16">
            <h2 className="mb-4 text-4xl font-bold tracking-tight">Recent Experiments</h2>
            <p className="text-muted-foreground">Digital products built with performance in mind.</p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-12"
          >
            {[1, 2].map((i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="group grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-16"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-3xl glass">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent group-hover:opacity-60 transition-opacity" />
                  <div className="flex h-full items-center justify-center p-8">
                    <div className="text-muted-foreground font-mono text-sm opacity-50">[Project {i} Placeholder]</div>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="mb-4 flex gap-2">
                    <span className="rounded-full bg-accent/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent">Internal Project</span>
                  </div>
                  <h3 className="mb-6 text-3xl font-bold lg:text-5xl">Digital Platform {i}</h3>
                  <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
                    A high-performance web dashboard built for real-time data visualization.
                    Implemented a custom state management solution to handle large datasets seamlessly.
                  </p>
                  <div className="flex gap-4">
                    <a href="#" className="flex h-12 w-48 items-center justify-center gap-2 rounded-full bg-foreground text-background font-semibold transition-transform hover:scale-105">
                      Case Study <ArrowUpRight className="h-4 w-4" />
                    </a>
                    <a href="#" className="flex h-12 w-12 items-center justify-center rounded-full glass hover:bg-muted transition-colors">
                      <Github className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Modern Contact Section */}
        <section id="contact" className="section-padding">
          <div className="glass flex flex-col items-center overflow-hidden rounded-[2.5rem] py-24 px-6 text-center md:py-32">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-gradient mb-8 text-5xl font-bold tracking-tight md:text-7xl">
                Ready to build <br /> something great?
              </h2>
              <p className="mx-auto mb-12 max-w-lg text-lg text-muted-foreground">
                I&apos;m currently accepting new projects and remote opportunities.
                Drop me a line and let&apos;s start a conversation.
              </p>
              <div className="flex flex-col items-center gap-8">
                <a
                  href="mailto:hello@wendev.com"
                  className="group relative flex items-center gap-4 text-3xl font-bold md:text-5xl"
                >
                  hello@wendev.com
                  <span className="absolute -bottom-2 h-1.5 w-0 bg-accent transition-all duration-300 group-hover:w-full" />
                </a>
                <div className="flex gap-6">
                  <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full glass hover:text-accent transition-colors"><Twitter className="h-5 w-5" /></a>
                  <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full glass hover:text-accent transition-colors"><Github className="h-5 w-5" /></a>
                  <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full glass hover:text-accent transition-colors"><Linkedin className="h-5 w-5" /></a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="mx-4 mb-8 flex flex-col items-center justify-between gap-6 px-6 py-8 text-sm text-muted-foreground md:mx-12 md:flex-row">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4" />
          <span>© 2026 Wendev. Built with Next.js & Tailwind.</span>
        </div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors underline underline-offset-4 decoration-accent/50">Curriculum Vitae</a>
        </div>
      </footer>
    </div>
  );
}


