import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * TEMPORARY diagnostic endpoint. Reports what the deployed runtime can and
 * cannot load, so failures can be diagnosed without dashboard access.
 * Remove once the firebase-admin load issue is resolved.
 */
export async function GET() {
    const out: Record<string, unknown> = {
        node: process.version,
        execArgv: process.execArgv,
        nodeOptions: process.env.NODE_OPTIONS ?? null,
    };

    const describe = (e: unknown) => {
        const err = e as { code?: string; message?: string };
        return err?.code ?? err?.message?.slice(0, 140) ?? String(e);
    };

    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require("jose");
        out.joseRequire = "ok";
    } catch (e) {
        out.joseRequire = describe(e);
    }

    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require("firebase-admin/auth");
        out.adminAuthRequire = "ok";
    } catch (e) {
        out.adminAuthRequire = describe(e);
    }

    try {
        await import("firebase-admin/auth");
        out.adminAuthImport = "ok";
    } catch (e) {
        out.adminAuthImport = describe(e);
    }

    return NextResponse.json(out);
}
