import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { verifyAdmin } from "@/lib/auth-utils";

const getCollection = () => getAdminDb().collection("reviews");

export async function GET() {
    try {
        const snapshot = await getCollection().where("isApproved", "==", true).orderBy("createdAt", "desc").get();
        const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json({ reviews });
    } catch (e) {
        console.error("GET /api/reviews error:", e);
        return NextResponse.json({ error: "Failed to fetch reviews." }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const docRef = await getCollection().add({
            reviewerName: body.reviewerName,
            company: body.company || "",
            rating: body.rating,
            content: body.content,
            isApproved: false,
            createdAt: new Date().toISOString(),
        });
        return NextResponse.json({ id: docRef.id }, { status: 201 });
    } catch (e) {
        console.error("POST /api/reviews error:", e);
        return NextResponse.json({ error: "Failed to submit review." }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const authCheck = await verifyAdmin(req);
    if (authCheck) return authCheck;

    try {
        const { id, ...data } = await req.json();
        await getCollection().doc(id).update(data);
        return NextResponse.json({ success: true });
    } catch (e) {
        console.error("PUT /api/reviews error:", e);
        return NextResponse.json({ error: "Failed to update review." }, { status: 500 });
    }
}
