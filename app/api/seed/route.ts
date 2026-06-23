import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { verifyAdmin } from "@/lib/auth-utils";

const SEED_PROJECTS = [
    {
        name: "SudoTech+",
        description: "A tech startup website that establishes brand credibility and connects businesses with modern software solutions.",
        tags: ["React", "Node.js", "JavaScript"],
        url: "https://www.sudotech.plus/",
        domain: "sudotech.plus",
        image: "/assets/projects_pics/sudotech.png",
    },
    {
        name: "Aid Anchor",
        description: "A disaster preparedness app that helps communities access life-saving first aid knowledge and coordinate relief efforts during emergencies.",
        tags: ["Flutter", "Dart", "Firebase"],
        url: "https://github.com/WenDEVLIFE/aid_anchor",
        domain: "github.com",
        image: "/assets/projects_pics/aidanchor.jpeg",
    },
    {
        name: "ClassAce",
        description: "A student productivity app that solves academic disorganization by centralizing class schedules, assignments, and deadlines in one place.",
        tags: ["Kotlin", "Firebase"],
        url: "https://github.com/WenDEVLIFE/ClassAce",
        domain: "github.com",
        image: "/assets/projects_pics/classace.jpeg",
    },
    {
        name: "DPR CAR RENTAL",
        description: "An AI-powered fleet management solution that automates reservations, tracks vehicle availability, and streamlines rental operations for car businesses.",
        tags: ["Flutter", "Dart", "Firebase"],
        url: "https://github.com/WenDEVLIFE/dpr_car_rentals",
        domain: "github.com",
        image: "/assets/projects_pics/dprcar.jpeg",
    },
    {
        name: "Print Finder",
        description: "A locator platform that solves the hassle of finding reliable printing services by connecting users with nearby print shops in real time.",
        tags: ["Kotlin", "Firebase"],
        url: "#",
        domain: "github.com",
        image: "/assets/projects_pics/printfinder.jpeg",
    },
    {
        name: "QR Code Generator",
        description: "A dual-purpose scanning and generation tool that simplifies contactless data sharing for businesses and event organizers.",
        tags: ["Flutter", "Dart"],
        url: "#",
        domain: "github.com",
        image: "/assets/projects_pics/qrcode.jpeg",
    },
    {
        name: "Housing Management",
        description: "A data-driven property management system that uses ML models to analyze housing trends and optimize real estate investments.",
        tags: ["Python", "TensorFlow", "Jupyter Notebooks"],
        url: "#",
        domain: "github.com",
        image: "/assets/projects_pics/housing.jpeg",
    },
    {
        name: "NaveyGate",
        description: "A digital access control platform that replaces paper-based gate passes with QR authentication for secure facility and visitor management.",
        tags: ["Flutter", "Dart", "TensorFlow", "Firebase", "Jupyter Notebooks"],
        url: "#",
        domain: "github.com",
        image: "/assets/projects_pics/naveygate.jpg",
    },
    {
        name: "Mandaya App",
        description: "A cultural preservation platform that bridges indigenous heritage with modern education through interactive content and community engagement.",
        tags: ["Flutter", "Dart"],
        url: "#",
        domain: "github.com",
        image: "/assets/projects_pics/mandaya.jpeg",
    },
    {
        name: "Wenlance IOS App",
        description: "A freelance business management app that helps independent professionals track clients, manage projects, and handle payments in one workflow.",
        tags: ["Swift", "Firebase"],
        url: "#",
        domain: "github.com",
        image: "/assets/projects_pics/wenlance.jpg",
    },
];

export async function POST(req: Request) {
    const authCheck = await verifyAdmin(req);
    if (authCheck) return authCheck;

    try {
        const batch = getAdminDb().batch();
        const collection = getAdminDb().collection("projects");

        for (const project of SEED_PROJECTS) {
            const docRef = collection.doc();
            batch.set(docRef, {
                ...project,
                createdAt: new Date().toISOString(),
            });
        }

        await batch.commit();
        return NextResponse.json({ success: true, count: SEED_PROJECTS.length });
    } catch (e) {
        console.error("Seed error:", e);
        return NextResponse.json({ error: "Failed to seed projects." }, { status: 500 });
    }
}
