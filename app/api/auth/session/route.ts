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

        return NextResponse.json({ error: describeSessionError(message), detail: message }, { status: 401 });
    }
}

/** Maps an admin SDK failure to something actionable for the operator. */
function describeSessionError(message: string): string {
    const m = message.toLowerCase();

    if (m.includes("credentials not configured")) {
        return "Server misconfigured: Firebase Admin env vars are missing on this deployment (FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY).";
    }
    if (m.includes("cannot find module") || m.includes("module not found")) {
        return "Server misconfigured: firebase-admin could not be loaded on this deployment.";
    }
    if (m.includes("decoder") || m.includes("pem") || m.includes("private key") || m.includes("begin")) {
        return "Server misconfigured: FIREBASE_PRIVATE_KEY is not a valid PEM key.";
    }
    if (m.includes("invalid_grant") || m.includes("invalid_client") || m.includes("invalid jwt signature")) {
        return "Server misconfigured: the Firebase service account credentials are invalid or revoked.";
    }
    if (m.includes("project id") || m.includes("project_id") || m.includes("determine project")) {
        return "Server misconfigured: FIREBASE_PROJECT_ID is missing or does not match the service account.";
    }
    if (m.includes("clock") || m.includes("skew")) {
        return "Server clock is out of sync. Please try again.";
    }
    if (m.includes("invalid-id-token") || m.includes("invalid_id_token") || m.includes("id token is not a valid")) {
        return "Login token is invalid or expired. Please sign in again.";
    }
    if (m.includes("expired")) {
        return "Login token expired. Please sign in again.";
    }
    if (m.includes("enotfound") || m.includes("econnrefused") || m.includes("fetch failed")) {
        return "Network error reaching Firebase from the server. Please try again.";
    }
    return "Failed to create session.";
}

export async function DELETE() {
    const response = NextResponse.json({ success: true });
    response.cookies.set("__session", "", { maxAge: 0, path: "/" });
    return response;
}
