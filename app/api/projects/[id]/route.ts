import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { verifyAdmin } from "@/lib/auth-utils";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const authCheck = await verifyAdmin(req);
    if (authCheck) return authCheck;

    try {
        const { id } = await params;
        const body = await req.json();
        await getAdminDb().collection("projects").doc(id).update(body);
        return NextResponse.json({ success: true });
    } catch (e) {
        console.error("PUT /api/projects/[id] error:", e);
        return NextResponse.json({ error: "Failed to update project." }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const authCheck = await verifyAdmin(req);
    if (authCheck) return authCheck;

    try {
        const { id } = await params;
        await getAdminDb().collection("projects").doc(id).delete();
        return NextResponse.json({ success: true });
    } catch (e) {
        console.error("DELETE /api/projects/[id] error:", e);
        return NextResponse.json({ error: "Failed to delete project." }, { status: 500 });
    }
}
