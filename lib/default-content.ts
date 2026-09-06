export interface SiteContent {
    hero: {
        name: string;
        tagline: string;
        badge: string;
        ctaPrimary: { label: string; href: string };
        ctaSecondary: { label: string; href: string };
        profileImage: string;
    };
    about: {
        heading: string;
        title: string;
        description: string;
        statNumber: string;
        statLabel: string;
    };
    nav: {
        links: { label: string; href: string }[];
        businessHours: string;
        logo: string;
        logoAlt: string;
    };
    footer: {
        copyright: string;
        links: { label: string; href: string }[];
    };
    contact: {
        heading: string;
        description: string;
        email: string;
        formLabels: { name: string; email: string; message: string };
        formPlaceholders: { name: string; email: string; message: string };
        sendText: string;
        sendingText: string;
        emailDirectText: string;
    };
    projects: {
        heading: string;
        subtitle: string;
    };
    techStack: { name: string; icon: string }[];
    iconMap: Record<string, string>;
}

export const DEFAULT_CONTENT: SiteContent = {
    hero: {
        name: "Frouen<br />Medina Jr.",
        tagline: "Passionate full stack developer with expertise in Flutter, React, Node.js, and cloud technologies.",
        badge: "Accepting New Clients",
        ctaPrimary: { label: "View Selected Work", href: "#projects" },
        ctaSecondary: { label: "View CV & Certificates", href: "https://drive.google.com/drive/u/2/folders/1E0Syh-hwKiPOon_cfONmJ9wIWMHWqGH8" },
        profileImage: "/assets/logo/WHITE-LOGO-PNG.png",
    },
    about: {
        heading: "Design meets Engineering",
        title: "Software Developer",
        description: "Develop Web and mobile applications to meet the needs of modern businesses to upscale their operations.",
        statNumber: "10+",
        statLabel: "Production Apps",
    },
    nav: {
        links: [
            { label: "About", href: "#about" },
            { label: "Projects", href: "#projects" },
            { label: "Reviews", href: "#reviews" },
            { label: "Contact", href: "#contact" },
        ],
        businessHours: "Mon - Fri, 8AM - 5PM PH Time",
        logo: "/assets/logo/WHITE-LOGO-PNG.png",
        logoAlt: "Frouen Logo",
    },
    footer: {
        copyright: "© 2026 Frouen Medina.",
        links: [
            { label: "GitHub", href: "https://github.com/wendevlife" },
            { label: "LinkedIn", href: "https://linkedin.com/in/wendevlife" },
        ],
    },
    contact: {
        heading: "Let's Build.",
        description: "Ready to elevate your digital presence? I am currently accepting strategic design and development projects.",
        email: "medinajrfrouen@gmail.com",
        formLabels: { name: "Name", email: "Email", message: "Message" },
        formPlaceholders: { name: "John Doe", email: "john@example.com", message: "How can I help you?" },
        sendText: "Send Message",
        sendingText: "Sending...",
        emailDirectText: "Or email directly",
    },
    projects: {
        heading: "Solutions That Drive Impact",
        subtitle: "Web and mobile applications designed to solve real business problems.",
    },
    techStack: [
        { name: "Flutter", icon: "/assets/icons/flutter.svg" },
        { name: "React", icon: "/assets/icons/reactjs.svg" },
        { name: "Node.js", icon: "/assets/icons/nigganodes.svg" },
        { name: "Python", icon: "/assets/icons/python.svg" },
        { name: "Firebase", icon: "/assets/icons/firebase.svg" },
        { name: "Docker", icon: "/assets/icons/docker.svg" },
        { name: "PostgreSQL", icon: "/assets/icons/pgsql.svg" },
        { name: "MongoDB", icon: "/assets/icons/mongodb.svg" },
        { name: "TensorFlow", icon: "/assets/icons/tensorflow.svg" },
        { name: "Jupyter Notebooks", icon: "/assets/icons/jupyter.svg" },
        { name: "Supabase", icon: "/assets/icons/supabase.svg" },
        { name: "Jetpack Compose", icon: "/assets/icons/jetpackcompose.svg" },
        { name: "Swift", icon: "/assets/icons/swift.svg" },
        { name: "Kotlin", icon: "/assets/icons/kotlin.svg" },
        { name: "Java", icon: "/assets/icons/java.svg" },
    ],
    iconMap: {
        "React": "/assets/icons/reactjs.svg",
        "Node.js": "/assets/icons/nigganodes.svg",
        "JavaScript": "/assets/icons/javascript.svg",
        "Flutter": "/assets/icons/flutter.svg",
        "Dart": "/assets/icons/dart.svg",
        "Firebase": "/assets/icons/firebase.svg",
        "Kotlin": "/assets/icons/kotlin.svg",
        "Swift": "/assets/icons/swift.svg",
        "Python": "/assets/icons/python.svg",
        "Docker": "/assets/icons/docker.svg",
        "PostgreSQL": "/assets/icons/pgsql.svg",
        "MongoDB": "/assets/icons/mongodb.svg",
        "MySQL": "/assets/icons/mysql.svg",
        "Java": "/assets/icons/java.svg",
        "Jetpack Compose": "/assets/icons/jetpackcompose.svg",
        "TensorFlow": "/assets/icons/tensorflow.svg",
        "Supabase": "/assets/icons/supabase.svg",
        "Jupyter Notebooks": "/assets/icons/jupyter.svg",
    },
};
