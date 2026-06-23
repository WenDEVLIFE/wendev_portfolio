import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminAuth } from "@/lib/firebase-admin";

export async function verifyAdmin(req: Request): Promise<NextResponse | null> {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get("__session")?.value;
        if (!sessionCookie) {
            return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
        }
        const decodedClaims = await getAdminAuth().verifySessionCookie(sessionCookie, true);
        const allowedEmails = [
            process.env.ADMIN_EMAIL,
            "wwen485@gmail.com",
            "frouenmedinajr@gmail.com"
        ].filter(Boolean);

        if (!allowedEmails.includes(decodedClaims.email)) {
            return NextResponse.json({ error: "Forbidden." }, { status: 403 });
        }
        return null;
    } catch {
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
}

