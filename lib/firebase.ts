import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";

import { getApps, initializeApp } from "firebase/app";
import { getAuth as getFirebaseAuth } from "firebase/auth";

function getApp(): FirebaseApp {
    const existing = getApps();
    if (existing.length) return existing[0];

    // NEXT_PUBLIC_* vars are inlined at build time. If they are added in the
    // host dashboard after a build, they stay undefined until a redeploy.
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        throw new Error(
            "Firebase client config is missing. Add the NEXT_PUBLIC_FIREBASE_* variables to this deployment and redeploy."
        );
    }

    return initializeApp({
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    });
}

export function getAuth(): Auth {
    getApp();
    return getFirebaseAuth();
}
