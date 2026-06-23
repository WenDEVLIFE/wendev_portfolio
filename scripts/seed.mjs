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
    console.error("Missing Firebase Admin credentials. Check FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in .env.local");
    process.exit(1);
}

privateKey = privateKey.replace(/\\n/g, "\n");

const { initializeApp, cert, getApps } = createRequire(import.meta.url)("firebase-admin/app");
const { getFirestore } = createRequire(import.meta.url)("firebase-admin/firestore");

const apps = getApps();
const app = apps.length ? apps[0] : initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
const db = getFirestore(app);

const SEED_PROJECTS = [
    { name: "SudoTech+", description: "A tech startup website that establishes brand credibility and connects businesses with modern software solutions.", tags: ["React", "Node.js", "JavaScript"], url: "https://www.sudotech.plus/", domain: "sudotech.plus", image: "/assets/projects_pics/sudotech.png" },
    { name: "Aid Anchor", description: "A disaster preparedness app that helps communities access life-saving first aid knowledge and coordinate relief efforts during emergencies.", tags: ["Flutter", "Dart", "Firebase"], url: "https://github.com/WenDEVLIFE/aid_anchor", domain: "github.com", image: "/assets/projects_pics/aidanchor.jpeg" },
    { name: "ClassAce", description: "A student productivity app that solves academic disorganization by centralizing class schedules, assignments, and deadlines in one place.", tags: ["Kotlin", "Firebase"], url: "https://github.com/WenDEVLIFE/ClassAce", domain: "github.com", image: "/assets/projects_pics/classace.jpeg" },
    { name: "DPR CAR RENTAL", description: "An AI-powered fleet management solution that automates reservations, tracks vehicle availability, and streamlines rental operations for car businesses.", tags: ["Flutter", "Dart", "Firebase"], url: "https://github.com/WenDEVLIFE/dpr_car_rentals", domain: "github.com", image: "/assets/projects_pics/dprcar.jpeg" },
    { name: "Print Finder", description: "A locator platform that solves the hassle of finding reliable printing services by connecting users with nearby print shops in real time.", tags: ["Kotlin", "Firebase"], url: "#", domain: "github.com", image: "/assets/projects_pics/printfinder.jpeg" },
    { name: "QR Code Generator", description: "A dual-purpose scanning and generation tool that simplifies contactless data sharing for businesses and event organizers.", tags: ["Flutter", "Dart"], url: "#", domain: "github.com", image: "/assets/projects_pics/qrcode.jpeg" },
    { name: "Housing Management", description: "A data-driven property management system that uses ML models to analyze housing trends and optimize real estate investments.", tags: ["Python", "TensorFlow", "Jupyter Notebooks"], url: "#", domain: "github.com", image: "/assets/projects_pics/housing.jpeg" },
    { name: "NaveyGate", description: "A digital access control platform that replaces paper-based gate passes with QR authentication for secure facility and visitor management.", tags: ["Flutter", "Dart", "TensorFlow", "Firebase", "Jupyter Notebooks"], url: "#", domain: "github.com", image: "/assets/projects_pics/naveygate.jpg" },
    { name: "Mandaya App", description: "A cultural preservation platform that bridges indigenous heritage with modern education through interactive content and community engagement.", tags: ["Flutter", "Dart"], url: "#", domain: "github.com", image: "/assets/projects_pics/mandaya.jpeg" },
    { name: "Wenlance IOS App", description: "A freelance business management app that helps independent professionals track clients, manage projects, and handle payments in one workflow.", tags: ["Swift", "Firebase"], url: "#", domain: "github.com", image: "/assets/projects_pics/wenlance.jpg" },
];

async function seed() {
    console.log(`Seeding ${SEED_PROJECTS.length} projects into Firestore...`);
    const batch = db.batch();
    const collection = db.collection("projects");
    for (const project of SEED_PROJECTS) {
        const docRef = collection.doc();
        batch.set(docRef, { ...project, createdAt: new Date().toISOString() });
    }
    await batch.commit();
    console.log("Done! All projects seeded.");
    process.exit(0);
}

seed().catch(err => { console.error("Seed failed:", err); process.exit(1); });
