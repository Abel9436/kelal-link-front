"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Layers, ArrowRight, ExternalLink, Sparkles, LayoutGrid, List } from "lucide-react";
import { ModernBackground } from "@/components/modern-background";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function BundlePage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const [bundle, setBundle] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState<"grid" | "list">("grid");

    useEffect(() => {
        const fetchBundle = async () => {
            try {
                const res = await fetch(`${API_URL}/api/bundle/${slug}`);
                if (!res.ok) throw new Error("Bundle not found");
                const json = await res.json();
                setBundle(json);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBundle();
    }, [slug]);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-background"><ModernBackground /><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-12 h-12 border-4 border-neon border-t-transparent rounded-full" /></div>;

    if (!bundle) return <div className="min-h-screen flex items-center justify-center bg-background"><ModernBackground /><div className="text-center relative z-10"><h1 className="text-4xl font-black italic">BUNDLE DISSOLVED</h1><button onClick={() => router.push("/")} className="mt-4 text-neon font-black">RETURN</button></div></div>;

    return (
        <div className="relative min-h-screen bg-background text-foreground font-sans selection:bg-neon/30 overflow-x-hidden">
            <ModernBackground />

            {/* Header */}
            <header className="fixed top-0 w-full z-50 p-6 flex justify-between items-center bg-background/5 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-neon flex items-center justify-center text-black font-black rotate-6 shadow-lg shadow-neon/20">ቀ</div>
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-[0.3em]">{bundle.title}</h2>
                        <p className="text-[8px] font-black text-neon tracking-widest uppercase">BUNDLE COLLECTION / {slug}</p>
                    </div>
                </div>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                    <button onClick={() => setView("grid")} className={cn("p-2 rounded-lg transition-all", view === "grid" ? "bg-neon text-black" : "text-primary/40")}><LayoutGrid size={16} /></button>
                    <button onClick={() => setView("list")} className={cn("p-2 rounded-lg transition-all", view === "list" ? "bg-neon text-black" : "text-primary/40")}><List size={16} /></button>
                </div>
            </header>

            <main className="relative z-10 max-w-6xl mx-auto px-6 pt-40 pb-32">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                    <div className="flex items-end gap-6 border-l-4 border-neon pl-8">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-neon block mb-2">SHARED DROPS</span>
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-contrast drop-shadow-2xl italic leading-none">{bundle.title}</h1>
                        </div>
                        <div className="hidden md:block pb-1">
                            <Layers className="text-primary/20" size={48} />
                        </div>
                    </div>

                    <div className={cn(
                        "grid gap-6",
                        view === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                    )}>
                        {bundle.items.map((item: any, i: number) => (
                            <motion.a
                                key={i}
                                href={item.url}
                                target="_blank"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className={cn(
                                    "group relative glass-card p-10 rounded-[48px] border-white/5 hover:border-neon/40 hover:bg-neon/5 transition-all flex flex-col justify-between overflow-hidden",
                                    view === "list" ? "flex-row items-center py-6" : "aspect-square"
                                )}
                            >
                                <div className="absolute -right-8 -top-8 text-8xl font-black text-primary/5 pointer-events-none group-hover:text-neon/5 transition-colors">
                                    {(i + 1).toString().padStart(2, '0')}
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-black text-contrast group-hover:text-neon transition-colors mb-2 uppercase italic">{item.label}</h3>
                                    <p className="text-xs text-primary/40 truncate max-w-full font-mono">{item.url}</p>
                                </div>
                                <div className="relative z-10 flex justify-end">
                                    <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center group-hover:bg-neon group-hover:text-black transition-all group-hover:scale-110 shadow-xl border border-white/5 group-hover:border-neon">
                                        <ArrowRight size={24} className="-rotate-45 group-hover:rotate-0 transition-transform" />
                                    </div>
                                </div>
                            </motion.a>
                        ))}
                    </div>

                    <div className="pt-20 text-center space-y-8">
                        <div className="inline-flex flex-col items-center">
                            <Sparkles className="text-neon mb-4 animate-bounce" size={32} />
                            <p className="text-sm font-black uppercase tracking-[0.6em] text-primary/30">BUILT WITH HERITAGE TECH</p>
                        </div>
                        <button
                            onClick={() => router.push("/")}
                            className="bg-primary/5 border border-primary/20 text-primary hover:bg-neon hover:text-black hover:border-neon transition-all px-12 py-5 rounded-3xl font-black uppercase tracking-widest text-xs flex items-center gap-4 mx-auto"
                        >
                            CREATE YOUR OWN DROP <ExternalLink size={16} />
                        </button>
                    </div>
                </motion.div>
            </main>

            {/* Ethiopian Pattern Bottom Decoration */}
            <div className="fixed bottom-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-red-500 to-green-600 opacity-20" />
        </div>
    );
}
