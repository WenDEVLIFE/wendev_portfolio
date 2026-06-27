const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;
const EMBEDDING_URL = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2";
const RELEVANCE_THRESHOLD = 0.3;
const DIVERSITY_PENALTY = 0.15;

export async function getEmbedding(text: string): Promise<number[]> {
    if (!HF_TOKEN) {
        throw new Error("HUGGINGFACE_TOKEN not configured.");
    }
    const res = await fetch(EMBEDDING_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: text }),
    });
    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Embedding API error (${res.status}): ${err}`);
    }
    const data = await res.json();
    return data[0] || data;
}

export function cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0, magA = 0, magB = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        magA += a[i] * a[i];
        magB += b[i] * b[i];
    }
    const denom = Math.sqrt(magA) * Math.sqrt(magB);
    return denom === 0 ? 0 : dot / denom;
}

function keywordScore(query: string, text: string): number {
    const qWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const tLower = text.toLowerCase();
    let matches = 0;
    for (const w of qWords) {
        if (tLower.includes(w)) matches++;
    }
    return qWords.length > 0 ? matches / qWords.length : 0;
}

export function expandQuery(query: string): string[] {
    const expansions: string[] = [query];
    const lower = query.toLowerCase();
    if (/\b(tech|technology|stack|skills?|tools?|language)\b/.test(lower)) {
        expansions.push("technologies skills programming languages tools frameworks expertise");
    }
    if (/\b(project|app|application|build|develop|create)\b/.test(lower)) {
        expansions.push("project application portfolio work experience development");
    }
    if (/\b(contact|hire|work|collaborate|freelance|job)\b/.test(lower)) {
        expansions.push("contact hire collaborate freelance services availability");
    }
    if (/\b(about|who|background|experience|profile)\b/.test(lower)) {
        expansions.push("about background experience bio introduction");
    }
    return [...new Set(expansions)];
}

export async function semanticSearch(
    query: string,
    candidates: { text: string; metadata?: any; embedding?: number[] }[],
    topK = 3
): Promise<{ text: string; metadata?: any; score: number }[]> {
    const queries = expandQuery(query);
    const queryEmbs = await Promise.all(queries.map(q => getEmbedding(q)));

    const results = await Promise.all(
        candidates.map(async (c) => {
            let emb = (c as any).embedding;
            if (!emb) {
                emb = await getEmbedding(c.text);
            }
            const semanticScores = queryEmbs.map(qe => cosineSimilarity(qe, emb));
            const semanticScore = Math.max(...semanticScores);
            const kwScore = keywordScore(query, c.text);
            const combined = semanticScore * 0.7 + kwScore * 0.3;
            return { text: c.text, metadata: c.metadata, score: combined, semantic: semanticScore };
        })
    );

    const filtered = results.filter(r => r.semantic >= RELEVANCE_THRESHOLD);
    const sorted = filtered.sort((a, b) => b.score - a.score);

    const diversified: typeof results = [];
    for (const r of sorted) {
        let tooSimilar = false;
        for (const d of diversified) {
            const sim = cosineSimilarity(
                await getEmbedding(r.text),
                await getEmbedding(d.text)
            );
            if (sim > 0.85) {
                tooSimilar = true;
                break;
            }
        }
        if (!tooSimilar) diversified.push(r);
        if (diversified.length >= topK) break;
    }

    return diversified.length > 0 ? diversified : sorted.slice(0, 1);
}
