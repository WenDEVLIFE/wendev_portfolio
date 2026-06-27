import { getAdminDb } from "@/lib/firebase-admin";
import { findMostRelevant } from "@/lib/embeddings";
import { DEFAULT_CONTENT } from "@/lib/default-content";

interface ContextItem {
    text: string;
    metadata?: any;
}

async function loadKnowledgeBase(): Promise<ContextItem[]> {
    const items: ContextItem[] = [];
    try {
        const projSnap = await getAdminDb().collection("projects").get();
        projSnap.docs.forEach(doc => {
            const p = doc.data();
            items.push({
                text: `Project: ${p.name}\nDescription: ${p.description}\nTags: ${(p.tags || []).join(", ")}\nURL: ${p.url || "N/A"}\nDomain: ${p.domain || "N/A"}`,
                metadata: { type: "project", name: p.name },
            });
        });
    } catch {}
    try {
        const contentDoc = await getAdminDb().doc("config/site").get();
        if (contentDoc.exists) {
            const data = contentDoc.data() || {};
            items.push({
                text: `About: ${data.about?.title || ""} — ${data.about?.description || ""}. Stats: ${data.about?.statNumber || ""} ${data.about?.statLabel || ""}`,
                metadata: { type: "about" },
            });
            if (data.techStack?.length) {
                items.push({
                    text: `Tech Stack: ${data.techStack.map((t: any) => t.name).join(", ")}`,
                    metadata: { type: "techstack" },
                });
            }
            if (data.hero) {
                items.push({
                    text: `Hero: ${data.hero.name} — ${data.hero.tagline}. Badge: ${data.hero.badge}`,
                    metadata: { type: "hero" },
                });
            }
        }
    } catch {}
    if (items.length === 0) {
        items.push({
            text: `About: ${DEFAULT_CONTENT.about.title} — ${DEFAULT_CONTENT.about.description}. Stats: ${DEFAULT_CONTENT.about.statNumber} ${DEFAULT_CONTENT.about.statLabel}`,
            metadata: { type: "about" },
        });
        items.push({
            text: `Tech Stack: ${DEFAULT_CONTENT.techStack.map(t => t.name).join(", ")}`,
            metadata: { type: "techstack" },
        });
    }
    return items;
}

export async function getRagContext(query: string): Promise<string> {
    try {
        const knowledge = await loadKnowledgeBase();
        const relevant = await findMostRelevant(query, knowledge, 3);
        if (relevant.length === 0) return "";
        return relevant
            .map((r, i) => `[Context ${i + 1}]:\n${r.text}`)
            .join("\n\n");
    } catch {
        return "";
    }
}
