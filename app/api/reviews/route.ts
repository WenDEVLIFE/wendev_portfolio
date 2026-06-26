import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { verifyAdmin } from "@/lib/auth-utils";
import { DocumentData, Query } from "firebase-admin/firestore";

const getCollection = () => getAdminDb().collection("reviews");

export async function GET(req: Request) {
    try {
        const authCheck = await verifyAdmin(req);
        const isAdmin = authCheck === null;

        let query: Query<DocumentData, DocumentData> = getCollection();
        if (!isAdmin) {
            query = query.where("isApproved", "==", true);
        }
        const snapshot = await query.orderBy("createdAt", "desc").get();
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
        const authCheck = await verifyAdmin(req);
        const isAdmin = authCheck === null;

        if (!isAdmin) {
            const { recaptchaToken } = body;
            if (!recaptchaToken) {
                return NextResponse.json({ error: "Please complete the reCAPTCHA verification." }, { status: 400 });
            }
            const params = new URLSearchParams();
            params.append("secret", process.env.RECAPTCHA_SECRET_KEY || "");
            params.append("response", recaptchaToken);
            const recaptchaRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: params.toString(),
            });
            const recaptchaData = await recaptchaRes.json();
            if (!recaptchaData.success) {
                return NextResponse.json({ error: "reCAPTCHA verification failed. Please try again." }, { status: 400 });
            }
        }

        const isApproved = isAdmin ? (body.isApproved ?? true) : false;

        const docRef = await getCollection().add({
            reviewerName: body.reviewerName,
            company: body.company || "",
            rating: body.rating,
            content: body.content,
            isApproved,
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
