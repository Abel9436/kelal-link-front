"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Shield, ArrowRight, Sparkles, Fingerprint } from "lucide-react";
import { ModernBackground } from "@/components/modern-background";
import { Navbar } from "@/components/navbar";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function UnlockPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [lang, setLang] = useState<"en" | "am">("en");

    useEffect(() => {
        const updateLang = () => {
            const savedLang = localStorage.getItem("app_lang");
            if (savedLang === "am" || savedLang === "en") setLang(savedLang);
        };
        updateLang();
        window.addEventListener('language-change', updateLang);
        return () => window.removeEventListener('language-change', updateLang);
    }, []);

    const t = {
        en: {
            title: "CIPHER REQUIRED",
            subtitle: "SECURE ACCESS PROTOCOL",
            label: "Enter Access Key",
            placeholder: "Type cipher here...",
            button: "DECRYPT & PROCEED",
            error: "Incorrect cipher key. Access denied.",
            hint: "This drop is protected with high-level encryption."
        },
        am: {
            title: "ሚስጥር ቃል ያስፈልጋል",
            subtitle: "ደህንነቱ የተጠበቀ መግቢያ",
            label: "የመግቢያ ኮድ ያስገቡ",
            placeholder: "ሚስጥሩን እዚህ ይተይቡ...",
            button: "ፍታ እና ቀጥል",
            error: "የተሳሳተ ሚስጥር ቃል። መግባት አይቻልም።",
            hint: "ይህ ሊንክ በከፍተኛ ምስጠራ የተጠበቀ ነው።"
        }
    }[lang];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch(`${API_URL}/unlock/${slug}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            if (!res.ok) {
                throw new Error("Invalid password");
            }

            const data = await res.json();
            // Redirect to the actual long URL
            window.location.href = data.long_url;
        } catch (err) {
            setError(t.error);
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen font-sans overflow-hidden text-foreground flex items-center justify-center p-6">
            <ModernBackground />
            <Navbar />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full relative z-10"
            >
                <div className="glass-card rounded-[48px] p-10 md:p-14 border-primary/20 shadow-2xl relative overflow-hidden group">
                    {/* Animated Glow */}
                    <motion.div
                        animate={{ opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-neon/5 pointer-events-none"
                    />

                    <div className="relative z-10 space-y-10">
                        {/* Header */}
                        <div className="text-center space-y-4">
                            <div className="flex justify-center mb-6">
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_30px_rgba(var(--primary),0.2)]"
                                >
                                    <Fingerprint size={40} strokeWidth={1.5} />
                                </motion.div>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-contrast uppercase italic">
                                {t.title}
                            </h1>
                            <p className="text-primary font-black text-[10px] uppercase tracking-[0.4em]">
                                {t.subtitle}
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-2">
                                    {t.label}
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-5 flex items-center text-primary/40">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        placeholder={t.placeholder}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-background/50 border-2 border-primary/20 rounded-3xl py-6 pl-14 pr-6 text-foreground font-bold outline-none focus:border-neon transition-all backdrop-blur-md"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary hover:bg-neon hover:text-black py-6 rounded-3xl font-black uppercase tracking-widest text-background transition-all flex items-center justify-center gap-4 group/btn shadow-[0_20px_40px_rgba(var(--primary),0.2)]"
                            >
                                {isLoading ? "..." : (
                                    <>
                                        {t.button} <Unlock size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Messages */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0 }}
                                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-black text-center"
                                >
                                    {error.toUpperCase()}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex items-center gap-3 text-primary/40 text-[9px] font-black uppercase tracking-widest pt-4 border-t border-primary/10">
                            <Shield size={12} />
                            {t.hint}
                        </div>
                    </div>

                    {/* Accents */}
                    <div className="absolute top-6 right-6">
                        <Sparkles size={16} className="text-primary/10" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
