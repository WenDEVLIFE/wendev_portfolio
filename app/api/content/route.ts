import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { verifyAdmin } from "@/lib/auth-utils";
import { DEFAULT_CONTENT, type SiteContent } from "@/lib/default-content";

const DOC_PATH = "config/site";

async function getContent(): Promise<SiteContent> {
    try {
        const doc = await getAdminDb().doc(DOC_PATH).get();
        if (doc.exists) {
            return { ...DEFAULT_CONTENT, ...doc.data() } as SiteContent;
        }
    } catch {}
    return DEFAULT_CONTENT;
}

export async function GET() {
    const content = await getContent();
    return NextResponse.json({ content });
}

export async function PUT(req: Request) {
    const authCheck = await verifyAdmin(req);
    if (authCheck) return authCheck;

    try {
        const updates = await req.json();
        await getAdminDb().doc(DOC_PATH).set(updates, { merge: true });
        return NextResponse.json({ success: true });
    } catch (e) {
        console.error("PUT /api/content error:", e);
        return NextResponse.json({ error: "Failed to update content." }, { status: 500 });
    }
}
