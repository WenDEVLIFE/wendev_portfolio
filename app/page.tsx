import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Background } from "@/components/ui/Background";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { LazySections } from "@/components/ui/LazySections";

export default function Home() {
  return (
    <>
      <Background />
      <Navbar />
      <main className="mx-auto max-w-[1920px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
        <Hero />
        <About />
        <LazySections />
      </main>
      <Footer />
    </>
  );
}
