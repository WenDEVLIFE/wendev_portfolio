"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Background } from "@/components/ui/Background";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Contact } from "@/components/sections/Contact";
import { ChatBot } from "@/components/ui/ChatBot";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Artificial delay to show the loading screen
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500); // 3.5s matches slightly more than the intervals in LoadingScreen

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && <LoadingScreen />}
      <div className={`relative min-h-screen font-sans selection:bg-white/20 selection:text-white transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <Background />
        <Navbar />
        <main className="mx-auto max-w-[1920px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
          <Hero />
          <About />
          <Projects />
          <Contact />
        </main>
        <ChatBot />
        <Footer />
      </div>
    </>
  );
}
