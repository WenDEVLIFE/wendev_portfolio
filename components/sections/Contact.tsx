"use client";

import { motion } from "framer-motion";

export function Contact() {
    const customEasing: [number, number, number, number] = [0.22, 1, 0.36, 1];

    return (
        <section id="contact" className="py-24 px-6 md:py-32 md:px-12 lg:px-32">
            <div className="border border-white/10 bg-white/[0.02] backdrop-blur-3xl flex flex-col items-center overflow-hidden rounded-[2rem] md:rounded-[3rem] py-20 px-4 md:py-32 md:px-6 text-center shadow-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: customEasing }}
                    viewport={{ once: true }}
                    className="w-full flex flex-col justify-center items-center"
                >
                    <h2 className="bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent mb-6 text-4xl font-black tracking-tighter sm:text-5xl md:text-8xl">
                        Let&apos;s Build.
                    </h2>
                    <p className="mx-auto mb-12 max-w-xl text-base md:text-xl text-neutral-400 font-light">
                        Ready to elevate your digital presence? I am currently accepting strategic design and development projects.
                    </p>

                    <form className="w-full max-w-md mx-auto mb-16 flex flex-col gap-4 text-left font-sans">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="name" className="text-xs font-semibold uppercase tracking-widest text-neutral-500 ml-1">Name</label>
                            <input type="text" id="name" placeholder="John Doe" className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition-colors" required />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="email" className="text-xs font-semibold uppercase tracking-widest text-neutral-500 ml-1">Email</label>
                            <input type="email" id="email" placeholder="john@example.com" className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition-colors" required />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="message" className="text-xs font-semibold uppercase tracking-widest text-neutral-500 ml-1">Message</label>
                            <textarea id="message" placeholder="How can I help you?" rows={4} className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition-colors resize-none" required></textarea>
                        </div>
                        <button type="submit" className="mt-4 w-full bg-white text-black h-14 flex items-center justify-center rounded-full text-sm font-bold uppercase tracking-wider transition-transform hover:scale-[1.02]">
                            Send Message
                        </button>
                    </form>

                    <div className="flex flex-col items-center w-full overflow-hidden">
                        <span className="text-xs font-semibold uppercase tracking-widest text-neutral-600 mb-6">Or email directly</span>
                        <a
                            href="mailto:medinajrfrouen@gmail.com"
                            className="group relative inline-block text-lg font-bold tracking-tight sm:text-2xl md:text-4xl text-white break-all md:break-normal px-2"
                        >
                            medinajrfrouen@gmail.com
                            <span className="absolute -bottom-1 md:-bottom-4 left-0 h-1 w-0 bg-white transition-all duration-500 ease-out group-hover:w-full" />
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
