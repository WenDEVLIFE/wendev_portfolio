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
        console.error("Session creation error:", e);
        return NextResponse.json({ error: "Failed to create session." }, { status: 401 });
    }
}

export async function DELETE() {
    const response = NextResponse.json({ success: true });
    response.cookies.set("__session", "", { maxAge: 0, path: "/" });
    return response;
}
