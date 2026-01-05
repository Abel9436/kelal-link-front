"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Zap, Sparkles, Globe, ArrowRight, Shield, Heart, ExternalLink, MousePointer2, Layers, Link as LinkIcon
} from "lucide-react";
import { ModernBackground } from "@/components/modern-background";
import { cn } from "@/lib/utils";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function StudioHubPage() {
    const { username } = useParams();
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStudio = async () => {
            try {
                const res = await fetch(`${API_URL}/api/studio/${username}`);
                if (!res.ok) throw new Error("Studio not found");
                const json = await res.json();
                setData(json);
            } catch (err: any) {
                setError(err.message);
                setTimeout(() => router.push("/"), 5000);
            } finally {
                setLoading(false);
            }
        };
        fetchStudio();
    }, [username, router]);

    // Brand Sync
    useEffect(() => {
        if (data?.user) {
            document.title = `${data.user.name} | Studio Hub`;
            if (data.user.profile_pic) {
                const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
                if (link) {
                    link.href = data.user.profile_pic;
                } else {
                    const newLink = document.createElement('link');
                    newLink.rel = 'icon';
                    newLink.href = data.user.profile_pic;
                    document.getElementsByTagName('head')[0].appendChild(newLink);
                }
            }
        }
    }, [data]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <ModernBackground />
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
            />
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
            <ModernBackground />
            <div className="relative z-10 space-y-6">
                <Shield size={64} className="text-red-500 mx-auto animate-pulse" />
                <h1 className="text-4xl font-black text-contrast uppercase italic">STUDIO NOT FOUND</h1>
                <p className="text-primary/60 font-medium italic">THE REQUESTED CREATIVE SPACE DOES NOT EXIST IN THIS DIMENSION.</p>
                <button onClick={() => router.push("/")} className="px-8 py-3 rounded-2xl bg-primary text-background font-black uppercase tracking-widest text-xs">Return Home</button>
            </div>
        </div>
    );

    const { user, drops } = data;

    return (
        <div className="relative min-h-screen selection:bg-neon/30 text-foreground overflow-x-hidden pb-32 font-sans">
            <ModernBackground themeColor="#00f2ff" />

            {/* Header / Identity */}
            <div className="max-w-2xl mx-auto px-6 pt-24 md:pt-32 space-y-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center text-center space-y-8"
                >
                    <div className="relative group/avatar">
                        <div className="absolute inset-0 bg-primary/20 blur-3xl group-hover:bg-primary/40 transition-all duration-700" />
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            className="relative w-32 h-32 md:w-36 md:h-36 rounded-[3.5rem] bg-glass-deep border-4 border-primary shadow-2xl flex items-center justify-center overflow-hidden"
                        >
                            {user.profile_pic ? (
                                <img src={user.profile_pic} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <Sparkles size={48} className="text-primary" />
                            )}
                        </motion.div>
                        <div className="absolute -bottom-2 -right-2 bg-neon text-background text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg border-4 border-background">
                            PRO STUDIO
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic leading-none text-contrast">
                            {user.name}
                        </h1>
                        <div className="flex items-center justify-center gap-3">
                            <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-widest">
                                @{user.username}
                            </span>
                            <span className="text-primary/40 text-[10px] font-black uppercase tracking-widest italic decoration-primary/20 underline underline-offset-4">
                                CREATIVE ARCHIVE
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Vertical Links List (Linktree Style) */}
                <div className="space-y-4 pt-12">
                    {drops.map((drop: any, i: number) => {
                        const isBundle = drop.type === "bundle";
                        return (
                            <motion.div
                                key={`${drop.type}-${drop.slug}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="w-full"
                            >
                                <Link
                                    href={isBundle ? `/bundle/${drop.slug}` : `/${drop.slug}`}
                                    target={isBundle ? "_self" : "_blank"}
                                    className="group block relative w-full"
                                >
                                    <div
                                        className="relative glass-card p-6 md:p-7 rounded-[2.5rem] border border-glass-stroke overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-xl hover:shadow-2xl flex items-center justify-between gap-4"
                                        style={{
                                            backgroundColor: isBundle ? 'rgba(0, 0, 0, 0.4)' : 'rgba(10, 10, 10, 0.6)',
                                            borderColor: isBundle ? `${drop.theme_color}30` : 'rgba(255, 255, 255, 0.05)'
                                        }}
                                    >
                                        <div className="flex items-center gap-6 z-10">
                                            <div
                                                className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-glass-fill flex items-center justify-center transition-all group-hover:rotate-12"
                                                style={{ color: isBundle ? drop.theme_color : '#00f2ff' }}
                                            >
                                                {isBundle ? <Layers size={24} /> : <LinkIcon size={24} />}
                                            </div>
                                            <div className="text-left">
                                                <h3 className="text-lg md:text-xl font-black text-contrast uppercase tracking-tighter italic">
                                                    {drop.title}
                                                </h3>
                                                <p className="text-[9px] font-black text-primary/40 uppercase tracking-widest italic">
                                                    {isBundle ? "Masterpiece Bundle" : "Deep Link Protocol"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 z-10 text-primary/20 group-hover:text-primary transition-colors">
                                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                        </div>

                                        {/* Dynamic Glow */}
                                        <div
                                            className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-r from-transparent via-white/5 to-transparent"
                                            style={{ backgroundColor: isBundle ? drop.theme_color : '#00f2ff' }}
                                        />
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}

                    {drops.length === 0 && (
                        <div className="text-center py-20 border-2 border-dashed border-glass-stroke rounded-[3rem] space-y-4">
                            <Zap className="mx-auto text-primary/20 animate-pulse" size={48} />
                            <p className="text-[10px] font-black text-primary/40 uppercase tracking-[0.5em]">No active drops in this archive</p>
                        </div>
                    )}
                </div>

                {/* Footer Branding */}
                <div className="pt-24 flex flex-col items-center gap-8">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/20">
                            PRO POWERED BY የቀላል LINK STUDIO
                        </span>
                    </div>
                    <Link href="/" className="px-8 py-3.5 rounded-full bg-primary/5 border border-primary/20 text-[9px] font-black uppercase tracking-widest text-primary/60 hover:text-primary hover:border-primary transition-all">
                        Build Your Own Portfolio Hub
                    </Link>
                </div>
            </div>
        </div>
    );
}
