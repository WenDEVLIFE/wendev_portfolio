export const PROJECT_SECTIONS = ["Web", "Mobile", "Application", "AI", "ML"] as const;

export type ProjectSection = (typeof PROJECT_SECTIONS)[number];
