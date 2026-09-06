"use client";

import { useState, useEffect } from "react";
import { Code2 } from "lucide-react";

export function Footer() {
    const [content, setContent] = useState<{ copyright: string; links: { label: string; href: string }[] } | null>(null);

    useEffect(() => {
        fetch("/api/content").then(r => r.json()).then(d => setContent(d.content?.footer || null)).catch(() => {});
    }, []);

    if (!content) {
        return (
            <footer className="mx-auto max-w-7xl mb-8 flex items-center justify-center gap-6 px-6 py-8">
                <div className="h-4 w-48 bg-muted rounded animate-pulse" />
            </footer>
        );
    }

    return (
        <footer className="mx-auto max-w-7xl mb-8 flex flex-col items-center justify-between gap-6 px-6 py-8 text-xs font-medium uppercase tracking-widest text-muted-foreground/70 md:flex-row text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-3">
                <Code2 className="h-4 w-4 hidden md:block" />
                <span>{content.copyright}</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                {content.links.map(link => (
                    <a key={link.href} href={link.href} className="hover:text-foreground transition-colors">{link.label}</a>
                ))}
            </div>
        </footer>
    );
}
