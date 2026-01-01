"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, ArrowLeft, BarChart2, Globe, MousePointer2, Smartphone, Monitor, Tablet, Sparkles } from "lucide-react";
import { ModernBackground } from "@/components/modern-background";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function StatsPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [lang, setLang] = useState<"en" | "am">("en");

    useEffect(() => {
        const savedLang = localStorage.getItem("app_lang");
        if (savedLang === "am" || savedLang === "en") setLang(savedLang);

        const fetchStats = async () => {
            try {
                const res = await fetch(`${API_URL}/api/stats/${slug}`);
                if (!res.ok) throw new Error("Stats not found");
                const json = await res.json();
                setData(json);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
        // Poll every 30s for the "Live Pulse" feel
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, [slug]);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-background"><ModernBackground /><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full" /></div>;

    if (!data) return <div className="min-h-screen flex items-center justify-center bg-background text-foreground"><ModernBackground /><div className="text-center space-y-4 relative z-10"><h1 className="text-4xl font-black italic">MISSION VOID</h1><button onClick={() => router.push("/")} className="text-primary font-black uppercase tracking-widest">BACK TO BASE</button></div></div>;

    const t = {
        en: {
            title: "LIVE PULSE",
            subtitle: "SOCIAL INTELLIGENCE PROTOCOL",
            totalClicks: "Total Engagements",
            devices: "Source Devices",
            referrers: "Top Channels",
            history: "Temporal Flow",
            pulseOn: "PROTOCOLS ACTIVE",
            back: "RETURN TO HQ"
        },
        am: {
            title: "የቀጥታ ስታቲስቲክስ",
            subtitle: "የengagement መረጃዎች",
            totalClicks: "አጠቃላይ እይታዎች",
            devices: "የመመልከቻ መሳሪያዎች",
            referrers: "ዋና አማራጮች",
            history: "የጊዜ ፍሰት",
            pulseOn: "መረጃዎች እየተሰበሰቡ ነው",
            back: "ወደ መጀመሪያው ተመለስ"
        }
    }[lang];

    return (
        <div className="relative min-h-screen font-sans text-foreground overflow-x-hidden">
            <ModernBackground />

            <main className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20">
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => router.push("/")}
                    className="flex items-center gap-3 text-primary/60 hover:text-primary font-black uppercase tracking-widest text-xs mb-12 group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> {t.back}
                </motion.button>

                <div className="grid lg:grid-cols-12 gap-12 items-end mb-16">
                    <div className="lg:col-span-8 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="px-4 py-1 rounded-full bg-neon/10 border border-neon/20 text-[10px] font-black text-neon animate-pulse uppercase tracking-[0.3em]">
                                {t.pulseOn}
                            </div>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-contrast italic">
                            {t.title} <span className="text-primary dark:text-neon">/{slug}</span>
                        </h1>
                        <p className="text-primary font-black text-xs uppercase tracking-[0.5em]">{t.subtitle}</p>
                    </div>

                    <div className="lg:col-span-4">
                        <div className="glass-card p-10 rounded-[48px] border-primary/20 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 mb-2">{t.totalClicks}</p>
                            <h2 className="text-6xl font-black text-contrast">{data.total_clicks}</h2>
                            <Activity className="absolute bottom-6 right-8 text-primary/10 group-hover:scale-125 transition-transform duration-1000" size={80} />
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* QR Code Card */}
                    <div className="glass-card p-10 rounded-[48px] border-neon/20 bg-neon/5 flex flex-col items-center justify-center space-y-6 group">
                        <div className="text-center space-y-2">
                            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-neon">NATIVE QR</h3>
                            <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest">SCAN TO ACCESS</p>
                        </div>
                        <div className="w-48 h-48 p-4 bg-white rounded-3xl shadow-2xl group-hover:scale-105 transition-transform duration-500">
                            <img src={`${API_URL}/api/qr/${slug}`} alt="QR" className="w-full h-full" />
                        </div>
                        <a
                            href={`${API_URL}/api/qr/${slug}`}
                            download={`qr-${slug}.png`}
                            className="px-6 py-3 rounded-2xl bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:bg-primary hover:text-background transition-all"
                        >
                            DOWNLOAD QR
                        </a>
                    </div>

                    {/* Device Stats */}
                    <div className="glass-card p-10 rounded-[48px] border-white/5 space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-primary">{t.devices}</h3>
                            <Smartphone size={20} className="text-primary/20" />
                        </div>
                        <div className="space-y-6">
                            {data.device_stats.length > 0 ? data.device_stats.map((s: any, i: number) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="flex items-center gap-2">
                                            {s.device === "Mobile" && <Smartphone size={12} />}
                                            {s.device === "Desktop" && <Monitor size={12} />}
                                            {s.device === "Tablet" && <Tablet size={12} />}
                                            {s.device}
                                        </span>
                                        <span>{Math.round((s.count / Math.max(1, data.total_clicks)) * 100)}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(s.count / Math.max(1, data.total_clicks)) * 100}%` }}
                                            className="h-full bg-primary"
                                        />
                                    </div>
                                </div>
                            )) : <p className="text-xs text-primary/40 italic">Waiting for connection data...</p>}
                        </div>
                    </div>

                    {/* Referrer Stats */}
                    <div className="glass-card p-10 rounded-[48px] border-white/5 space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-primary">{t.referrers}</h3>
                            <Globe size={20} className="text-primary/20" />
                        </div>
                        <div className="space-y-4">
                            {data.top_referers.length > 0 ? data.top_referers.map((r: any, i: number) => (
                                <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-primary/5 border border-primary/10">
                                    <span className="text-[10px] font-black truncate max-w-[150px] uppercase tracking-widest">{r.referer}</span>
                                    <span className="text-xl font-black text-contrast">{r.count}</span>
                                </div>
                            )) : <p className="text-xs text-primary/40 italic">Waiting for inbound data...</p>}
                        </div>
                    </div>
                </div>

                {/* History Timeline placeholder */}
                <div className="mt-8 glass-card p-10 rounded-[48px] border-white/5 relative overflow-hidden h-[300px] flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5" />
                    <div className="relative text-center space-y-4">
                        <BarChart2 className="mx-auto text-primary/20" size={48} />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/40">{t.history}</h4>
                        <div className="flex gap-2 items-end h-20">
                            {[20, 45, 30, 60, 80, 50, 90, 40, 70, 55].map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ delay: i * 0.05 }}
                                    className="w-4 bg-primary/20 rounded-t-lg hover:bg-neon transition-colors"
                                />
                            ))}
                        </div>
                    </div>
                    <div className="absolute top-6 right-6">
                        <Sparkles size={20} className="text-primary/10" />
                    </div>
                </div>
            </main>
        </div>
    );
}
