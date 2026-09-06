"use client";

import dynamic from "next/dynamic";

// Lazy load below-fold sections — only load when scrolled into view
const Projects = dynamic(() => import("@/components/sections/Projects").then(m => ({ default: m.Projects })), { ssr: false });
const Reviews = dynamic(() => import("@/components/sections/Reviews").then(m => ({ default: m.Reviews })), { ssr: false });
const Contact = dynamic(() => import("@/components/sections/Contact").then(m => ({ default: m.Contact })), { ssr: false });
const ChatBot = dynamic(() => import("@/components/ui/ChatBot").then(m => ({ default: m.ChatBot })), { ssr: false });

export function LazySections() {
  return (
    <>
      <Projects />
      <Reviews />
      <Contact />
      <ChatBot />
    </>
  );
}
