import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { verifyAdmin } from "@/lib/auth-utils";

const getCollection = () => getAdminDb().collection("projects");

export async function GET() {
    try {
        const snapshot = await getCollection().orderBy("createdAt", "desc").get();
        const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json({ projects });
    } catch (e) {
        console.error("GET /api/projects error:", e);
        return NextResponse.json({ error: "Failed to fetch projects." }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const authCheck = await verifyAdmin(req);
    if (authCheck) return authCheck;

    try {
        const body = await req.json();
        const docRef = await getCollection().add({
            ...body,
            createdAt: new Date().toISOString(),
        });
        return NextResponse.json({ id: docRef.id }, { status: 201 });
    } catch (e) {
        console.error("POST /api/projects error:", e);
        return NextResponse.json({ error: "Failed to create project." }, { status: 500 });
    }
}
