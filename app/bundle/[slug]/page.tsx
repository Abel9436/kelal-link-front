
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    ExternalLink, Share2, Heart, Shield,
    Layers, Zap, Sparkles, Globe, ArrowRight
} from "lucide-react";
import { ModernBackground } from "@/components/modern-background";
import { getPlatformInfo } from "@/lib/platforms";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function BundleViewPage() {
    const { slug } = useParams();
    const router = useRouter();
    const [bundle, setBundle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBundle = async () => {
            try {
                const res = await fetch(`${API_URL}/api/bundle/${slug}`);
                if (!res.ok) throw new Error("Bundle not found or secured");
                const data = await res.json();
                setBundle(data);
            } catch (err: any) {
                setError(err.message);
                // Redirect if not found (might be private or deleted)
                setTimeout(() => router.push("/"), 3000);
            } finally {
                setLoading(false);
            }
        };
        fetchBundle();
    }, [slug, router]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
            />
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
            <Shield size={64} className="text-red-500 mb-6 animate-pulse" />
            <h1 className="text-3xl font-black text-contrast mb-4 uppercase italic">ACCESS DENIED</h1>
            <p className="text-primary/60 font-medium italic underline decoration-red-500/30 underline-offset-4">{error.toUpperCase()}</p>
        </div>
    );

    return (
        <div className="relative min-h-screen bg-background selection:bg-neon/30 text-foreground overflow-x-hidden pb-20" style={{ backgroundColor: bundle.bg_color }}>
            <ModernBackground themeColor={bundle.theme_color} bgColor={bundle.bg_color} />

            <div className="max-w-2xl mx-auto px-6 pt-24 md:pt-32 space-y-12 relative z-10">
                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-6"
                >
                    <div className="relative inline-block">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 6, repeat: Infinity }}
                            className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] md:rounded-[3.5rem] bg-glass-deep border-4 shadow-2xl flex items-center justify-center text-background"
                            style={{ borderColor: bundle.theme_color, backgroundColor: bundle.theme_color }}
                        >
                            <Layers size={48} className="md:size-64" />
                        </motion.div>
                        <div
                            className="absolute -bottom-2 -right-2 text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter shadow-lg border-2 border-background"
                            style={{ backgroundColor: bundle.theme_color }}
                        >
                            STUDIO V1
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none" style={{ color: bundle.title_color }}>
                            {bundle.title}
                        </h1>
                        <p className="text-sm md:text-lg font-bold italic leading-relaxed max-w-md mx-auto" style={{ color: bundle.text_color }}>
                            {bundle.description}
                        </p>
                    </div>
                </motion.div>

                {/* Items List */}
                <div className="space-y-4">
                    {bundle.items.map((item: any, i: number) => {
                        const platform = getPlatformInfo(item.url);
                        return (
                            <motion.a
                                key={i}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                whileHover="hover"
                                className="group relative block w-full"
                            >
                                <motion.div
                                    variants={{ hover: { opacity: 1, scale: 1.02 } }}
                                    initial={{ opacity: 0, scale: 1 }}
                                    className="absolute inset-0 rounded-[2.5rem] blur-2xl transition-opacity duration-500"
                                    style={{ backgroundColor: bundle.theme_color + '30' }}
                                />
                                <motion.div
                                    variants={{ hover: { borderColor: bundle.theme_color, backgroundColor: bundle.theme_color + '08' } }}
                                    className="relative glass-card p-6 md:p-8 rounded-[2.5rem] border transition-colors flex items-center justify-between gap-4 overflow-hidden shadow-xl active:scale-95"
                                    style={{ borderColor: bundle.theme_color + '20', backgroundColor: bundle.card_color }}
                                >
                                    <div className="flex items-center gap-6">
                                        <motion.div
                                            variants={{ hover: { backgroundColor: bundle.theme_color, color: '#000', rotate: 12 } }}
                                            className={cn("w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-glass-fill flex items-center justify-center transition-all", platform.color)}
                                        >
                                            <platform.icon size={28} />
                                        </motion.div>
                                        <div className="min-w-0">
                                            <motion.h3
                                                variants={{ hover: { color: bundle.theme_color } }}
                                                className="text-xl md:text-2xl font-black tracking-tighter uppercase transition-colors truncate"
                                                style={{ color: bundle.title_color }}
                                            >
                                                {item.label}
                                            </motion.h3>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] truncate" style={{ color: bundle.text_color + '80' }}>
                                                {new URL(item.url).hostname}
                                            </p>
                                        </div>
                                    </div>
                                    <motion.div variants={{ hover: { x: 8, color: bundle.theme_color } }} className="text-primary/20 transition-all">
                                        <ArrowRight size={24} />
                                    </motion.div>
                                </motion.div>
                            </motion.a>
                        );
                    })}
                </div>

                {/* Footer Branding */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="pt-12 border-t border-glass-stroke flex flex-col items-center gap-6 text-center"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30 flex items-center gap-2" style={{ color: bundle.text_color }}>
                            CRAFTED WITH <Heart size={12} className="text-red-500/40" /> BY ABEL BEKELE
                        </span>
                    </div>
                    <div className="flex gap-4">
                        <motion.a
                            href="https://jami.bio/Abelb"
                            target="_blank"
                            whileHover={{ backgroundColor: bundle.theme_color, color: '#000', scale: 1.05 }}
                            className="px-6 py-3 rounded-2xl glass-card border-glass-stroke text-[10px] font-black uppercase tracking-widest text-primary transition-all"
                        >
                            Support Creator
                        </motion.a>
                        <button onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            alert("Link copied!");
                        }} className="p-3 rounded-2xl glass-card border-glass-stroke text-primary hover:bg-primary hover:text-background transition-all">
                            <Share2 size={16} />
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
