"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageSquare, Plus, X } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-hot-toast";
import { useTheme } from "next-themes";
import "./ReviewsScroll.css";

interface Review {
    id: string;
    reviewerName: string;
    company?: string;
    rating: number;
    content: string;
    createdAt: string;
}

function ReviewCard({ review }: { review: Review }) {
    return (
        <div className="review-card flex-shrink-0 w-[350px] rounded-3xl border border-border bg-card backdrop-blur-[24px] p-6 sm:p-8 flex flex-col justify-between hover:border-border/80 hover:bg-card/80 transition-all duration-300 group">
            <div>
                <div className="flex items-center gap-1 mb-4 text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={`w-4 h-4 ${star <= review.rating ? "fill-current" : "text-muted-foreground/30"}`}
                        />
                    ))}
                </div>
                <p className="text-muted-foreground font-light text-base leading-relaxed mb-6 italic">
                    &ldquo;{review.content}&rdquo;
                </p>
            </div>
            <div className="border-t border-border/50 pt-4 flex items-center justify-between">
                <div>
                    <h4 className="font-semibold text-foreground text-sm">{review.reviewerName}</h4>
                    {review.company && (
                        <p className="text-xs text-muted-foreground/70 mt-0.5">{review.company}</p>
                    )}
                </div>
                <span className="text-[10px] text-muted-foreground/60 font-mono">
                    {new Date(review.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short" })}
                </span>
            </div>
        </div>
    );
}

export function Reviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const [formData, setFormData] = useState({
        reviewerName: "",
        company: "",
        rating: 5,
        content: ""
    });
    const [isPending, setIsPending] = useState(false);
    const recaptchaRef = useRef<ReCAPTCHA>(null);

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
            toast.error("Please complete the reCAPTCHA verification.");
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
                toast.success("Thank you! Your review has been submitted for approval.");
                setFormData({ reviewerName: "", company: "", rating: 5, content: "" });
                setShowForm(false);
                recaptchaRef.current?.reset();
                fetchReviews();
            } else {
                const data = await res.json();
                throw new Error(data.error || "Failed to submit review");
            }
        } catch (error: any) {
            toast.error(error.message || "Something went wrong. Please try again.");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <section id="reviews" className="py-24 px-4 sm:px-6 md:py-32 md:px-12 lg:px-20 xl:px-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tighter md:text-5xl mb-4">Client Reviews</h2>
                    <p className="text-muted-foreground text-lg">What clients and collaborators say about working with me.</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 self-start md:self-auto px-6 py-3 rounded-full bg-muted border border-border hover:bg-muted/80 text-sm font-semibold transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Write a Review
                </button>
            </div>

            {/* Review Dialog */}
            <AnimatePresence>
                {showForm && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowForm(false)}
                        />
                        {/* Dialog */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                            className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
                        >
                            <form
                                onSubmit={handleSubmit}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full max-w-xl rounded-3xl border border-border bg-card backdrop-blur-[24px] p-6 sm:p-8 space-y-6 shadow-2xl pointer-events-auto max-h-[90vh] overflow-y-auto"
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold tracking-tight">Share your experience</h3>
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="p-2 rounded-full hover:bg-muted transition-colors cursor-pointer"
                                    >
                                        <X className="w-4 h-4 text-muted-foreground" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="reviewerName" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70 ml-1 font-sans">Name</label>
                                        <input
                                            type="text"
                                            id="reviewerName"
                                            placeholder="John Doe"
                                            className="w-full bg-muted border border-border rounded-2xl px-5 py-4 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-ring transition-colors font-sans"
                                            value={formData.reviewerName}
                                            onChange={(e) => setFormData({ ...formData, reviewerName: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="company" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70 ml-1 font-sans">Company / Role</label>
                                        <input
                                            type="text"
                                            id="company"
                                            placeholder="CEO at TechCorp (Optional)"
                                            className="w-full bg-muted border border-border rounded-2xl px-5 py-4 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-ring transition-colors font-sans"
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70 ml-1 font-sans">Rating</span>
                                    <div className="flex items-center gap-2">
                                        {[1, 2, 3, 4, 5].map((n) => (
                                            <button
                                                key={n}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, rating: n })}
                                                className="transition-transform active:scale-95 cursor-pointer"
                                            >
                                                <Star className={`w-8 h-8 ${n <= formData.rating ? "fill-yellow-400 text-yellow-400" : "text-border"}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="content" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70 ml-1 font-sans">Review</label>
                                    <textarea
                                        id="content"
                                        placeholder="Write your detailed review here..."
                                        rows={4}
                                        className="w-full bg-muted border border-border rounded-2xl px-5 py-4 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-ring transition-colors resize-none font-sans"
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        required
                                    ></textarea>
                                </div>

                                <div className="flex justify-center">
                                    <ReCAPTCHA
                                        ref={recaptchaRef}
                                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                                        theme={mounted ? (resolvedTheme === 'dark' ? 'dark' : 'light') : 'dark'}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full bg-accent text-accent-foreground h-14 flex items-center justify-center rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 cursor-pointer font-sans"
                                >
                                    {isPending ? "Submitting..." : "Submit Review"}
                                </button>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {isLoading ? (
                <div className="reviews-scroll-viewport">
                    <div className="reviews-scroll-track">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="review-card flex-shrink-0 w-[350px] rounded-3xl border border-border bg-card p-8 h-48 animate-pulse" />
                        ))}
                    </div>
                </div>
            ) : reviews.length > 0 ? (
                <div className="reviews-scroll-viewport">
                    <div className="reviews-scroll-track">
                        {/* Original set */}
                        {reviews.map((review) => (
                            <ReviewCard key={review.id} review={review} />
                        ))}
                        {/* Duplicate set for seamless loop */}
                        {reviews.map((review) => (
                            <ReviewCard key={`dup-${review.id}`} review={review} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 rounded-3xl border border-border bg-card backdrop-blur-[24px]">
                    <MessageSquare className="w-10 h-10 text-muted-foreground/60 mx-auto mb-4" />
                    <p className="text-muted-foreground/80">No reviews displayed yet. Be the first to write a review!</p>
                </div>
            )}
        </section>
    );
}
