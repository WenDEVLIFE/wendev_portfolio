"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getAuth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

/** Turns Firebase/network errors into something actionable. */
function describeAuthError(err: unknown): string {
    const code = (err as { code?: string })?.code;
    switch (code) {
        case "auth/invalid-api-key":
        case "auth/api-key-not-valid":
            return "Firebase client config is missing on this deployment. Add the NEXT_PUBLIC_FIREBASE_* variables in Vercel and redeploy (they are baked in at build time).";
        case "auth/configuration-not-found":
            return "Email/Password sign-in is not enabled in the Firebase console for this project.";
        case "auth/unauthorized-domain":
            return "This domain is not in Firebase Authentication > Settings > Authorized domains.";
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
            return "Incorrect email or password.";
        case "auth/too-many-requests":
            return "Too many attempts. Please wait a few minutes and try again.";
        case "auth/network-request-failed":
            return "Network error reaching Firebase. Check your connection and try again.";
        default:
            return err instanceof Error ? err.message : "Login failed.";
    }
}

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const userCred = await signInWithEmailAndPassword(getAuth(), email, password);
            const idToken = await userCred.user.getIdToken();

            const res = await fetch("/api/auth/session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                throw new Error(data?.error || "Session creation failed.");
            }

            router.push("/admin-portal");
        } catch (err: unknown) {
            setError(describeAuthError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-6">
            <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Admin Access</h1>
                    <p className="text-sm text-muted-foreground mt-1">Sign in to manage your portfolio.</p>
                </div>

                {error && (
                    <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className="w-full rounded-xl bg-muted border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-ring transition-colors"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        className="w-full rounded-xl bg-muted border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-ring transition-colors"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-accent text-accent-foreground py-3 text-sm font-bold tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    {loading ? "Signing in..." : "Sign In"}
                </button>
            </form>
        </div>
    );
}
