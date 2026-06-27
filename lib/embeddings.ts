const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;
const EMBEDDING_URL = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2";

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
    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

export async function findMostRelevant(query: string, candidates: { text: string; metadata?: any }[], topK = 3): Promise<{ text: string; metadata?: any; score: number }[]> {
    const queryEmb = await getEmbedding(query);
    const scored = await Promise.all(
        candidates.map(async (c) => {
            let emb = (c as any).embedding;
            if (!emb) {
                emb = await getEmbedding(c.text);
            }
            return { ...c, score: cosineSimilarity(queryEmb, emb) };
        })
    );
    return scored.sort((a, b) => b.score - a.score).slice(0, topK);
}
