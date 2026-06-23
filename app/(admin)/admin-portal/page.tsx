"use client";

import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { getAuth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { LogOut, FolderKanban, MessageSquareText, Plus, Upload, Pencil, Star } from "lucide-react";

interface Project {
    id: string;
    name: string;
    description: string;
    tags: string[];
    url: string;
    domain: string;
    image: string;
    createdAt: string;
}

interface Review {
    id: string;
    reviewerName: string;
    company?: string;
    rating: number;
    content: string;
    isApproved: boolean;
    createdAt: string;
}

const defaultProject = {
    name: "",
    description: "",
    tags: "",
    url: "",
    domain: "",
    image: "",
};

const defaultReview = {
    reviewerName: "",
    company: "",
    rating: 5,
    content: "",
};

export default function AdminDashboardPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [activeTab, setActiveTab] = useState<"projects" | "reviews">("projects");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(defaultProject);
    const [seeding, setSeeding] = useState(false);
    const router = useRouter();

    const fetchData = async () => {
        const [projRes, revRes] = await Promise.all([
            fetch("/api/projects"),
            fetch("/api/reviews"),
        ]);
        if (projRes.ok) {
            const data = await projRes.json();
            setProjects(data.projects || []);
        }
        if (revRes.ok) {
            const data = await revRes.json();
            setReviews(data.reviews || []);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleLogout = async () => {
        await signOut(getAuth());
        await fetch("/api/auth/session", { method: "DELETE" });
        router.push("/");
    };

    const startEdit = (p: Project) => {
        setEditingId(p.id);
        setForm({ name: p.name, description: p.description, tags: p.tags.join(", "), url: p.url, domain: p.domain, image: p.image });
        setShowForm(true);
    };

    const cancelForm = () => {
        setForm(defaultProject);
        setEditingId(null);
        setShowForm(false);
    };

    const saveProject = async (e: React.FormEvent) => {
        e.preventDefault();
        const tags = form.tags.split(",").map(t => t.trim()).filter(Boolean);
        const payload = { ...form, tags };

        if (editingId) {
            await fetch(`/api/projects/${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
        } else {
            await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
        }
        cancelForm();
        fetchData();
    };

    const deleteProject = async (id: string) => {
        if (!confirm("Delete this project?")) return;
        const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
        if (res.ok) fetchData();
    };

    const seedProjects = async () => {
        if (!confirm("Seed all 10 default projects into Firestore?")) return;
        setSeeding(true);
        const res = await fetch("/api/seed", { method: "POST" });
        if (res.ok) fetchData();
        setSeeding(false);
    };

    const [reviewForm, setReviewForm] = useState(defaultReview);
    const [showReviewForm, setShowReviewForm] = useState(false);

    const createReview = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch("/api/reviews", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...reviewForm, isApproved: true }),
        });
        if (res.ok) {
            setReviewForm(defaultReview);
            setShowReviewForm(false);
            fetchData();
        }
    };

    const toggleReviewApproval = async (id: string, current: boolean) => {
        const res = await fetch(`/api/reviews/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isApproved: !current }),
        });
        if (res.ok) fetchData();
    };

    const deleteReview = async (id: string) => {
        if (!confirm("Delete this review?")) return;
        const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
        if (res.ok) fetchData();
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
                <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors">
                    <LogOut className="w-4 h-4" /> Sign Out
                </button>
            </div>

            <div className="flex gap-4 mb-8">
                <button onClick={() => setActiveTab("projects")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === "projects" ? "bg-white/10 text-white" : "text-neutral-400 hover:text-white"}`}>
                    <FolderKanban className="w-4 h-4" /> Projects ({projects.length})
                </button>
                <button onClick={() => setActiveTab("reviews")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === "reviews" ? "bg-white/10 text-white" : "text-neutral-400 hover:text-white"}`}>
                    <MessageSquareText className="w-4 h-4" /> Reviews ({reviews.length})
                </button>
            </div>

            {activeTab === "projects" && (
                <div className="space-y-4">
                    <div className="flex gap-3">
                        <button onClick={() => { cancelForm(); setShowForm(!showForm); }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-sm font-medium hover:bg-white/20 transition-colors">
                            <Plus className="w-4 h-4" /> {showForm ? "Cancel" : "Add Project"}
                        </button>
                        <button onClick={seedProjects} disabled={seeding}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-neutral-400 hover:text-white transition-colors">
                            <Upload className="w-4 h-4" /> {seeding ? "Seeding..." : "Seed Default Projects"}
                        </button>
                    </div>

                    {showForm && (
                        <form onSubmit={saveProject} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Project name" required
                                    className="rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30" />
                                <input value={form.domain} onChange={e => setForm({ ...form, domain: e.target.value })} placeholder="Domain (e.g. sudotech.plus)"
                                    className="rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30" />
                                <input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="Project URL"
                                    className="rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30" />
                                <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="Image path (e.g. /assets/...)"
                                    className="rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30" />
                            </div>
                            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={2} required
                                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30" />
                            <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="Tags (comma-separated, e.g. React, Node.js)"
                                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30" />
                            <button type="submit" className="px-6 py-2.5 bg-white text-black rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">
                                {editingId ? "Update Project" : "Create Project"}
                            </button>
                        </form>
                    )}

                    {projects.map(p => (
                        <div key={p.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex items-start justify-between">
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h3 className="font-semibold">{p.name}</h3>
                                    {p.domain && <span className="text-[10px] font-mono text-neutral-500">{p.domain}</span>}
                                </div>
                                <p className="text-sm text-neutral-400 mt-1">{p.description}</p>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {(p.tags || []).map(t => (
                                        <span key={t} className="text-[10px] font-medium text-neutral-500 bg-white/5 px-2 py-1 rounded-full border border-white/10">{t}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0 ml-4">
                                <button onClick={() => startEdit(p)} className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors">
                                    <Pencil className="w-3 h-3" /> Edit
                                </button>
                                <button onClick={() => deleteProject(p.id)} className="text-xs text-red-400 hover:text-red-300 transition-colors">Delete</button>
                            </div>
                        </div>
                    ))}
                    {projects.length === 0 && <p className="text-sm text-neutral-500">No projects yet. Add one or seed the defaults.</p>}
                </div>
            )}

            {activeTab === "reviews" && (
                <div className="space-y-4">
                    <button onClick={() => setShowReviewForm(!showReviewForm)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-sm font-medium hover:bg-white/20 transition-colors">
                        <Plus className="w-4 h-4" /> {showReviewForm ? "Cancel" : "Add Review"}
                    </button>

                    {showReviewForm && (
                        <form onSubmit={createReview} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input value={reviewForm.reviewerName} onChange={e => setReviewForm({ ...reviewForm, reviewerName: e.target.value })} placeholder="Reviewer name" required
                                    className="rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30" />
                                <input value={reviewForm.company} onChange={e => setReviewForm({ ...reviewForm, company: e.target.value })} placeholder="Company (optional)"
                                    className="rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30" />
                            </div>
                            <textarea value={reviewForm.content} onChange={e => setReviewForm({ ...reviewForm, content: e.target.value })} placeholder="Review comment" rows={3} required
                                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30" />
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-neutral-400">Rating:</span>
                                {[1, 2, 3, 4, 5].map(n => (
                                    <button key={n} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: n })}>
                                        <Star className={`w-5 h-5 ${n <= reviewForm.rating ? "fill-yellow-400 text-yellow-400" : "text-neutral-600"}`} />
                                    </button>
                                ))}
                            </div>
                            <button type="submit" className="px-6 py-2.5 bg-white text-black rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">
                                Add Review
                            </button>
                        </form>
                    )}

                    {reviews.map(r => (
                        <div key={r.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <span className="font-semibold text-sm">{r.reviewerName}</span>
                                    {r.company && <span className="text-xs text-neutral-500 ml-2">{r.company}</span>}
                                    <span className="text-xs text-neutral-600 ml-3">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => toggleReviewApproval(r.id, r.isApproved)}
                                        className={`text-xs px-3 py-1 rounded-full border transition-colors ${r.isApproved ? "border-green-500/30 text-green-400" : "border-yellow-500/30 text-yellow-400"}`}>
                                        {r.isApproved ? "Approved" : "Pending"}
                                    </button>
                                    <button onClick={() => deleteReview(r.id)} className="text-xs text-red-400 hover:text-red-300 transition-colors">Delete</button>
                                </div>
                            </div>
                            <p className="text-sm text-neutral-400">{r.content}</p>
                        </div>
                    ))}
                    {reviews.length === 0 && <p className="text-sm text-neutral-500">No reviews yet.</p>}
                </div>
            )}
        </div>
    );
}
