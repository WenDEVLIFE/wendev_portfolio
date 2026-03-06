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
                    <p className="mx-auto mb-10 md:mb-16 max-w-xl text-base md:text-xl text-neutral-400 font-light">
                        Ready to elevate your digital presence? I am currently accepting strategic design and development projects.
                    </p>
                    <div className="flex flex-col items-center gap-8 w-full overflow-hidden">
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
