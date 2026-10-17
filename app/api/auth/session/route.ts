import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";

export async function POST(req: Request) {
    try {
        const { idToken } = await req.json();
        if (!idToken) {
            return NextResponse.json({ error: "No ID token provided." }, { status: 400 });
        }

        const expiresIn = 60 * 60 * 24 * 5 * 1000;
        const sessionCookie = await getAdminAuth().createSessionCookie(idToken, { expiresIn });

        const response = NextResponse.json({ success: true });
        response.cookies.set("__session", sessionCookie, {
            maxAge: expiresIn / 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "lax",
        });

        return response;
    } catch (e) {
        const message = e instanceof Error ? e.message : "Unknown error";
        console.error("Session creation error:", e);

        // Surface actionable configuration problems instead of a blanket 401
        let reason = "Failed to create session.";
        if (message.includes("credentials not configured")) {
            reason = "Server misconfigured: Firebase Admin credentials are missing on this deployment.";
        } else if (message.includes("DECODER") || message.includes("PEM") || message.includes("private key")) {
            reason = "Server misconfigured: FIREBASE_PRIVATE_KEY is not a valid PEM key.";
        } else if (message.includes("invalid-id-token") || message.includes("expired")) {
            reason = "Login token expired. Please sign in again.";
        }

        return NextResponse.json({ error: reason, detail: message }, { status: 401 });
    }
}

export async function DELETE() {
    const response = NextResponse.json({ success: true });
    response.cookies.set("__session", "", { maxAge: 0, path: "/" });
    return response;
}
