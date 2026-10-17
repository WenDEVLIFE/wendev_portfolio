import type { App } from "firebase-admin/app";
import type { Firestore } from "firebase-admin/firestore";
import type { Auth } from "firebase-admin/auth";

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

function getAdminApp(): App {
    const existing = getApps();
    if (existing.length) return existing[0];

    const missing = [
        !process.env.FIREBASE_PROJECT_ID && "FIREBASE_PROJECT_ID",
        !process.env.FIREBASE_CLIENT_EMAIL && "FIREBASE_CLIENT_EMAIL",
        !process.env.FIREBASE_PRIVATE_KEY && "FIREBASE_PRIVATE_KEY",
    ].filter(Boolean) as string[];

    if (missing.length) {
        throw new Error("Firebase Admin credentials not configured. Missing: " + missing.join(", "));
    }

    const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);

    if (!privateKey) {
        throw new Error("Firebase Admin credentials not configured. Invalid: FIREBASE_PRIVATE_KEY");
    }

    return initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey,
        }),
    });
}

/**
 * Service account keys get mangled in many hosting dashboards.
 * Handles: surrounding quotes, escaped \n, Windows CRLF, base64-encoded keys,
 * and keys with no newlines at all.
 */
function normalizePrivateKey(raw?: string): string | undefined {
    if (!raw) return undefined;

    let key = raw.trim();

    // Strip surrounding quotes added by copy/paste
    if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
        key = key.slice(1, -1);
    }

    // Base64-encoded full key (some hosts do this)
    if (!key.includes("BEGIN") && /^[A-Za-z0-9+/=\s]+$/.test(key)) {
        try {
            const decoded = Buffer.from(key, "base64").toString("utf8");
            if (decoded.includes("BEGIN")) key = decoded;
        } catch {
            /* not base64, keep original */
        }
    }

    // Escaped newlines -> real newlines
    key = key.replace(/\\n/g, "\n");

    return key.trim();
}

export function getAdminDb(): Firestore {
    getAdminApp();
    return getFirestore();
}

export function getAdminAuth(): Auth {
    getAdminApp();
    return getAuth();
}
