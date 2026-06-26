"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageSquare, Plus } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-hot-toast";

interface Review {
    id: string;
    reviewerName: string;
    company?: string;
    rating: number;
    content: string;
    createdAt: string;
}

export function Reviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    
    const [formData, setFormData] = useState({
        reviewerName: "",
        company: "",
        rating: 5,
        content: ""
    });
    const [isPending, setIsPending] = useState(false);
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    const customEasing: [number, number, number, number] = [0.22, 1, 0.36, 1];

    const fetchReviews = async () => {
        try {
            const res = await fetch("/api/reviews");
            if (res.ok) {
                const data = await res.json();
                setReviews(data.reviews || []);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = recaptchaRef.current?.getValue();
        if (!token) {
            toast.error("Please complete the reCAPTCHA verification.", {
                style: { borderRadius: "100px", background: "#333", color: "#fff" }
            });
            return;
        }

        setIsPending(true);

        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, recaptchaToken: token }),
            });

            if (res.ok) {
                toast.success("Thank you! Your review has been submitted for approval.", {
                    style: { borderRadius: "100px", background: "#333", color: "#fff" }
                });
                setFormData({ reviewerName: "", company: "", rating: 5, content: "" });
                setShowForm(false);
                recaptchaRef.current?.reset();
                fetchReviews();
            } else {
                const data = await res.json();
                throw new Error(data.error || "Failed to submit review");
            }
        } catch (error: any) {
            toast.error(error.message || "Something went wrong. Please try again.", {
                style: { borderRadius: "100px", background: "#333", color: "#fff" }
            });
        } finally {
            setIsPending(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                ease: customEasing
            }
        }
    } as const;

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.6, ease: customEasing }
        }
    } as const;

    return (
        <section id="reviews" className="py-24 px-4 sm:px-6 md:py-32 md:px-12 lg:px-20 xl:px-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tighter md:text-5xl mb-4">Client Reviews</h2>
                    <p className="text-neutral-400 text-lg">What clients and collaborators say about working with me.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 self-start md:self-auto px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-semibold transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                >
                    <Plus className={`w-4 h-4 transition-transform duration-300 ${showForm ? "rotate-45" : ""}`} />
                    {showForm ? "Cancel" : "Write a Review"}
                </button>
            </div>

            <AnimatePresence mode="wait">
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: customEasing }}
                        className="overflow-hidden mb-16"
                    >
                        <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-[24px] p-6 sm:p-8 space-y-6">
                            <h3 className="text-xl font-bold tracking-tight mb-2">Share your experience</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="reviewerName" className="text-xs font-semibold uppercase tracking-widest text-neutral-500 ml-1 font-sans">Name</label>
                                    <input
                                        type="text"
                                        id="reviewerName"
                                        placeholder="John Doe"
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition-colors font-sans"
                                        value={formData.reviewerName}
                                        onChange={(e) => setFormData({ ...formData, reviewerName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="company" className="text-xs font-semibold uppercase tracking-widest text-neutral-500 ml-1 font-sans">Company / Role</label>
                                    <input
                                        type="text"
                                        id="company"
                                        placeholder="CEO at TechCorp (Optional)"
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition-colors font-sans"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500 ml-1 font-sans">Rating</span>
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((n) => (
                                        <button
                                            key={n}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, rating: n })}
                                            className="transition-transform active:scale-95 cursor-pointer"
                                        >
                                            <Star className={`w-8 h-8 ${n <= formData.rating ? "fill-yellow-400 text-yellow-400" : "text-neutral-600"}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="content" className="text-xs font-semibold uppercase tracking-widest text-neutral-500 ml-1 font-sans">Review</label>
                                <textarea
                                    id="content"
                                    placeholder="Write your detailed review here..."
                                    rows={4}
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition-colors resize-none font-sans"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    required
                                ></textarea>
                            </div>

                            <div className="flex justify-center">
                                <ReCAPTCHA
                                    ref={recaptchaRef}
                                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                                    theme="dark"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full bg-white text-black h-14 flex items-center justify-center rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 cursor-pointer font-sans"
                            >
                                {isPending ? "Submitting..." : "Submit Review"}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 h-48 animate-pulse" />
                    ))}
                </div>
            ) : reviews.length > 0 ? (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {reviews.map((review) => (
                        <motion.div
                            key={review.id}
                            variants={itemVariants}
                            className="rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-[24px] p-6 sm:p-8 flex flex-col justify-between hover:border-white/10 hover:bg-white/[0.03] transition-all duration-300 group"
                        >
                            <div>
                                <div className="flex items-center gap-1 mb-4 text-yellow-400">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-4 h-4 ${star <= review.rating ? "fill-current" : "text-neutral-700"}`}
                                        />
                                    ))}
                                </div>
                                <p className="text-neutral-300 font-light text-base leading-relaxed mb-6 italic">
                                    "{review.content}"
                                </p>
                            </div>
                            <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold text-white text-sm">{review.reviewerName}</h4>
                                    {review.company && (
                                        <p className="text-xs text-neutral-500 mt-0.5">{review.company}</p>
                                    )}
                                </div>
                                <span className="text-[10px] text-neutral-600 font-mono">
                                    {new Date(review.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short" })}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <div className="text-center py-12 rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-[24px]">
                    <MessageSquare className="w-10 h-10 text-neutral-600 mx-auto mb-4" />
                    <p className="text-neutral-500">No reviews displayed yet. Be the first to write a review!</p>
                </div>
            )}
        </section>
    );
}
