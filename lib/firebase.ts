import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";

function getApp(): FirebaseApp {
    const { initializeApp, getApps } = require("firebase/app");
    const existing = getApps();
    if (existing.length) return existing[0];
    const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    };
    return initializeApp(firebaseConfig);
}

export function getAuth(): Auth {
    getApp();
    return require("firebase/auth").getAuth();
}

export function getFirestoreDb(): Firestore {
    getApp();
    return require("firebase/firestore").getFirestore();
}
