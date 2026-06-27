import { getAdminDb } from "@/lib/firebase-admin";
import { semanticSearch } from "@/lib/embeddings";
import { DEFAULT_CONTENT } from "@/lib/default-content";

interface Chunk {
    text: string;
    metadata?: any;
}

function chunkProject(p: any): Chunk[] {
    const chunks: Chunk[] = [];
    const name = p.name || "Untitled";
    chunks.push({
        text: `Project: ${name} — ${p.description || ""}`,
        metadata: { type: "project", field: "overview", name },
    });
    if (p.tags?.length) {
        chunks.push({
            text: `Technologies used in ${name}: ${p.tags.join(", ")}`,
            metadata: { type: "project", field: "tags", name },
        });
    }
    if (p.url && p.url !== "#") {
        chunks.push({
            text: `${name} live URL: ${p.url}`,
            metadata: { type: "project", field: "url", name },
        });
    }
    if (p.domain) {
        chunks.push({
            text: `${name} domain/context: ${p.domain}`,
            metadata: { type: "project", field: "domain", name },
        });
    }
    return chunks;
}

async function loadChunks(): Promise<Chunk[]> {
    const chunks: Chunk[] = [];
    try {
        const projSnap = await getAdminDb().collection("projects").get();
        projSnap.docs.forEach(doc => chunks.push(...chunkProject(doc.data())));
    } catch {}
    try {
        const contentDoc = await getAdminDb().doc("config/site").get();
        if (contentDoc.exists) {
            const d = contentDoc.data() || {};
            if (d.about) {
                chunks.push({ text: `About: ${d.about.title} — ${d.about.description}. ${d.about.statNumber} ${d.about.statLabel}`, metadata: { type: "about", field: "bio" } });
            }
            if (d.techStack?.length) {
                const names = d.techStack.map((t: any) => t.name).join(", ");
                chunks.push({ text: `Tech Stack: ${names}`, metadata: { type: "techstack", field: "all" } });
                d.techStack.forEach((t: any) => {
                    chunks.push({ text: `${t.name} — ${t.name} developer skilled in ${t.name}`, metadata: { type: "techstack", field: "individual", name: t.name } });
                });
            }
            if (d.hero) {
                chunks.push({ text: `Hero: ${d.hero.name} — ${d.hero.tagline}. Status: ${d.hero.badge}`, metadata: { type: "hero", field: "intro" } });
            }
            if (d.nav?.businessHours) {
                chunks.push({ text: `Availability: ${d.nav.businessHours}`, metadata: { type: "availability" } });
            }
        }
    } catch {}
    if (chunks.length === 0) {
        chunks.push({ text: `About: ${DEFAULT_CONTENT.about.title} — ${DEFAULT_CONTENT.about.description}. ${DEFAULT_CONTENT.about.statNumber} ${DEFAULT_CONTENT.about.statLabel}`, metadata: { type: "about" } });
        chunks.push({ text: `Tech Stack: ${DEFAULT_CONTENT.techStack.map(t => t.name).join(", ")}`, metadata: { type: "techstack" } });
        chunks.push({ text: `Availability: ${DEFAULT_CONTENT.nav.businessHours}`, metadata: { type: "availability" } });
    }
    return chunks;
}

export async function getRagContext(query: string): Promise<string> {
    try {
        const chunks = await loadChunks();
        const relevant = await semanticSearch(query, chunks, 3);
        if (relevant.length === 0) return "";
        return relevant
            .map((r, i) => `[Context ${i + 1}]:\n${r.text}`)
            .join("\n\n");
    } catch {
        return "";
    }
}
