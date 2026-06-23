import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_LOGIN_ROUTE = process.env.ADMIN_LOGIN_ROUTE || "admin";
const ADMIN_PORTAL_BASE = "/admin-portal";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isAdminLoginPage = pathname === `/${ADMIN_LOGIN_ROUTE}`;
    const isAdminPortal = pathname.startsWith(ADMIN_PORTAL_BASE);
    const isApiAdmin = pathname.startsWith("/api/projects") || pathname.startsWith("/api/reviews") || pathname.startsWith("/api/auth/session") || pathname.startsWith("/api/content");

    if (isAdminLoginPage) {
        const url = request.nextUrl.clone();
        url.pathname = `${ADMIN_PORTAL_BASE}/login`;
        return NextResponse.rewrite(url);
    }

    if (isAdminPortal) {
        const sessionCookie = request.cookies.get("__session")?.value;
        if (!sessionCookie) {
            const url = request.nextUrl.clone();
            url.pathname = "/";
            return NextResponse.redirect(url);
        }
    }

    if (isApiAdmin) {
        const sessionCookie = request.cookies.get("__session")?.value;
        const isSessionEndpoint = pathname === "/api/auth/session";
        const isPublicRead = (pathname === "/api/projects" || pathname === "/api/reviews" || pathname === "/api/content") && request.method === "GET";
        const isPublicPost = pathname === "/api/reviews" && request.method === "POST";
        if (!sessionCookie && !isSessionEndpoint && !isPublicRead && !isPublicPost) {
            return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|assets/).*)"],
};
