import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "..", ".env.local");

// Load .env.local
if (existsSync(envPath)) {
    const lines = readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx === -1) continue;
        let key = trimmed.slice(0, eqIdx).trim();
        let value = trimmed.slice(eqIdx + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        process.env[key] = value;
    }
}

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
let privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (!projectId || !clientEmail || !privateKey) {
    console.error("Missing credentials");
    process.exit(1);
}

privateKey = privateKey.replace(/\\n/g, "\n");

const { initializeApp, cert, getApps } = createRequire(import.meta.url)("firebase-admin/app");
const { getFirestore } = createRequire(import.meta.url)("firebase-admin/firestore");

const apps = getApps();
const app = apps.length ? apps[0] : initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
const db = getFirestore(app);

async function testQuery() {
    try {
        console.log("Attempting query for isApproved == true ordered by createdAt desc...");
        const snapshot = await db.collection("reviews").where("isApproved", "==", true).orderBy("createdAt", "desc").get();
        console.log("Query Succeeded!");
        console.log("Fetched reviews count:", snapshot.size);
    } catch (e) {
        console.error("Query Failed with error:", e);
    }
}

testQuery().then(() => process.exit(0));
