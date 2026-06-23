import type { App } from "firebase-admin/app";
import type { Firestore } from "firebase-admin/firestore";
import type { Auth } from "firebase-admin/auth";

function getAdminApp(): App {
    const { cert, getApps, initializeApp } = require("firebase-admin/app");
    const existing = getApps();
    if (existing.length) return existing[0];
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    if (!process.env.FIREBASE_PROJECT_ID || !privateKey) {
        throw new Error("Firebase Admin credentials not configured.");
    }
    return initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey,
        }),
    });
}

export function getAdminDb(): Firestore {
    getAdminApp();
    return require("firebase-admin/firestore").getFirestore();
}

export function getAdminAuth(): Auth {
    getAdminApp();
    return require("firebase-admin/auth").getAuth();
}
