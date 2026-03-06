import { Code2 } from "lucide-react";

export function Footer() {
    return (
        <footer className="mx-auto max-w-7xl mb-8 flex flex-col items-center justify-between gap-6 px-6 py-8 text-xs font-medium uppercase tracking-widest text-neutral-500 md:flex-row text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-3">
                <Code2 className="h-4 w-4 hidden md:block" />
                <span>© 2026 Frouen Medina.</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                <a href="https://github.com/wendevlife" className="hover:text-white transition-colors">GitHub</a>
                <a href="https://linkedin.com/in/wendevlife" className="hover:text-white transition-colors">LinkedIn</a>
            </div>
        </footer>
    );
}
