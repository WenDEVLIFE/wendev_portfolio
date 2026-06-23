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
            "medinajrfrouen@gmail.com"
        ].filter((e): e is string => typeof e === "string" && e.length > 0);

        console.log("verifyAdmin - Active User Email:", decodedClaims.email);
        console.log("verifyAdmin - Allowed Emails:", allowedEmails);

        const lowerAllowed = allowedEmails.map(e => e.toLowerCase());
        const userEmail = decodedClaims.email?.toLowerCase();

        if (!userEmail || !lowerAllowed.includes(userEmail)) {
            console.warn("verifyAdmin - Forbidden access attempt by:", decodedClaims.email);
            return NextResponse.json({ error: "Forbidden." }, { status: 403 });
        }
        return null;
    } catch (e) {
        console.error("verifyAdmin - Auth verification failed:", e);
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
}

