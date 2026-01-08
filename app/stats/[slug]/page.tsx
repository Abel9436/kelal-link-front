"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, ArrowLeft, BarChart2, Globe, MousePointer2, Smartphone, Monitor, Tablet, Sparkles, Plus, LayoutDashboard } from "lucide-react";
import { ModernBackground } from "@/components/modern-background";
import { Navbar } from "@/components/navbar";
import { useAuth } from "@/components/auth-context";
import Link from "next/link";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function StatsPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const { token, user } = useAuth();
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [lang, setLang] = useState<"en" | "am">("en");

    useEffect(() => {
        const updateLang = () => {
            const savedLang = localStorage.getItem("app_lang");
            if (savedLang === "am" || savedLang === "en") setLang(savedLang as any);
        };
        updateLang();
        window.addEventListener('language-change', updateLang);
        return () => window.removeEventListener('language-change', updateLang);
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${API_URL}/api/stats/${slug}`, {
                    headers: token ? { "Authorization": `Bearer ${token}` } : {}
                });
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
    }, [slug, token]);

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
            <Navbar>
                <div className="flex items-center gap-2">
                    <Link
                        href="/"
                        className="p-2.5 rounded-xl bg-glass-fill border border-glass-stroke text-primary/60 hover:text-primary hover:bg-glass-stroke transition-all"
                        title={lang === 'en' ? 'Back to Home' : 'ወደ መጀመሪያው ተመለስ'}
                    >
                        <Globe size={18} strokeWidth={2.5} />
                    </Link>

                    {user && (
                        <Link
                            href="/dashboard"
                            className="p-2.5 rounded-xl bg-glass-fill border border-glass-stroke text-primary/60 hover:text-primary hover:bg-glass-stroke transition-all"
                            title={lang === 'en' ? 'Back to Dashboard' : 'ወደ ዳሽቦርድ ተመለስ'}
                        >
                            <LayoutDashboard size={18} strokeWidth={2.5} />
                        </Link>
                    )}
                    {user && (
                        <Link
                            href="/create"
                            className="group relative overflow-hidden bg-primary hover:bg-neon text-background px-4 md:px-6 py-2 md:py-2.5 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] transition-all shadow-[0_10px_30px_rgba(var(--primary),0.2)] flex items-center gap-2.5 hover:scale-105"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            <Plus size={16} strokeWidth={2.5} />
                            <span className="hidden md:inline">New Drop</span>
                        </Link>
                    )}
                </div>
            </Navbar>
            <main className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-20">
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => router.push("/")}
                    className="flex items-center gap-3 text-primary/60 hover:text-primary font-black uppercase tracking-widest text-[10px] md:text-xs mb-8 md:mb-12 group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> {t.back}
                </motion.button>

                <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-end mb-12 md:mb-16">
                    <div className="lg:col-span-8 space-y-4 md:space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="px-3 md:px-4 py-1 rounded-full bg-neon/10 border border-neon/20 text-[9px] md:text-[10px] font-black text-neon animate-pulse uppercase tracking-[0.3em]">
                                {t.pulseOn}
                            </div>
                        </div>
                        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter text-contrast italic break-all sm:break-normal">
                            {t.title} <span className="text-primary dark:text-neon">/{decodeURIComponent(slug)}</span>
                        </h1>
                        <p className="text-primary font-black text-[10px] md:text-xs uppercase tracking-[0.5em]">{t.subtitle}</p>
                    </div>

                    <div className="lg:col-span-4">
                        <div className="glass-card p-6 md:p-10 rounded-[32px] md:rounded-[48px] border-primary/20 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 mb-2">{t.totalClicks}</p>
                            <h2 className="text-5xl md:text-6xl font-black text-contrast">{data.total_clicks}</h2>
                            <Activity className="absolute bottom-6 right-8 text-primary/10 group-hover:scale-125 transition-transform duration-1000 hidden sm:block" size={80} />
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                    {/* QR Code Card */}
                    <div className="glass-card p-8 md:p-10 rounded-[32px] md:rounded-[48px] border-neon/20 bg-neon/5 flex flex-col items-center justify-center space-y-6 group order-3 md:order-1">
                        <div className="text-center space-y-2">
                            <h3 className="text-[12px] md:text-sm font-black uppercase tracking-[0.4em] text-neon">NATIVE QR</h3>
                            <p className="text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">SCAN TO ACCESS</p>
                        </div>
                        <div className="w-40 h-40 md:w-48 md:h-48 p-3 md:p-4 bg-white rounded-2xl md:rounded-3xl shadow-2xl group-hover:scale-105 transition-transform duration-500">
                            <img src={`${API_URL}/api/qr/${slug}`} alt="QR" className="w-full h-full" />
                        </div>
                        <a
                            href={`${API_URL}/api/qr/${slug}`}
                            download={`qr-${slug}.png`}
                            className="w-full sm:w-auto text-center px-6 py-3 rounded-2xl bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:bg-primary hover:text-background transition-all"
                        >
                            DOWNLOAD QR
                        </a>
                    </div>

                    {/* Device Stats */}
                    <div className="glass-card p-8 md:p-10 rounded-[32px] md:rounded-[48px] border-white/5 space-y-6 md:space-y-8 order-1 md:order-2">
                        <div className="flex justify-between items-center">
                            <h3 className="text-[12px] md:text-sm font-black uppercase tracking-[0.4em] text-primary">{t.devices}</h3>
                            <div className="text-primary/20">
                                <Smartphone size={20} className="hidden md:block" />
                                <Smartphone size={18} className="block md:hidden" />
                            </div>
                        </div>
                        <div className="space-y-5 md:space-y-6">
                            {data.device_stats.length > 0 ? data.device_stats.map((s: any, i: number) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-[9px] md:text-[10px] font-black uppercase tracking-widest">
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
                            )) : <p className="text-[10px] text-primary/40 italic">Waiting for connection data...</p>}
                        </div>
                    </div>

                    {/* Referrer Stats */}
                    <div className="glass-card p-8 md:p-10 rounded-[32px] md:rounded-[48px] border-white/5 space-y-6 md:space-y-8 order-2 md:order-3">
                        <div className="flex justify-between items-center">
                            <h3 className="text-[12px] md:text-sm font-black uppercase tracking-[0.4em] text-primary">{t.referrers}</h3>
                            <div className="text-primary/20">
                                <Globe size={20} className="hidden md:block" />
                                <Globe size={18} className="block md:hidden" />
                            </div>
                        </div>
                        <div className="space-y-3 md:space-y-4">
                            {data.top_referers.length > 0 ? data.top_referers.map((r: any, i: number) => (
                                <div key={i} className="flex justify-between items-center p-3 md:p-4 rounded-xl md:rounded-2xl bg-primary/5 border border-primary/10">
                                    <span className="text-[9px] md:text-[10px] font-black truncate max-w-[120px] sm:max-w-none uppercase tracking-widest">{r.referer}</span>
                                    <span className="text-lg md:text-xl font-black text-contrast">{r.count}</span>
                                </div>
                            )) : <p className="text-[10px] text-primary/40 italic">Waiting for inbound data...</p>}
                        </div>
                    </div>
                </div>

                {/* History Timeline */}
                <div className="mt-8 glass-card p-6 md:p-10 rounded-[32px] md:rounded-[48px] border-white/5 relative overflow-hidden h-64 md:h-[300px] flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5" />
                    <div className="relative text-center space-y-4 w-full px-4">
                        <div className="text-primary/20 mx-auto w-fit">
                            <BarChart2 size={48} className="hidden md:block" />
                            <BarChart2 size={40} className="block md:hidden" />
                        </div>
                        <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em] text-primary/40">{t.history}</h4>
                        <div className="flex gap-1 md:gap-2 items-end justify-center h-20 md:h-24">
                            {data.clicks_history && data.clicks_history.length > 0 ? (
                                data.clicks_history.slice(-15).map((h: any, i: number) => {
                                    const maxCount = Math.max(...data.clicks_history.map((d: any) => d.count), 1);
                                    const percentage = (h.count / maxCount) * 100;
                                    return (
                                        <div key={i} className="flex flex-col items-center gap-2 group/bar">
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${Math.max(percentage, 5)}%` }}
                                                transition={{ delay: i * 0.05, type: "spring", stiffness: 100 }}
                                                className={cn("bg-primary/40 rounded-t-lg hover:bg-neon transition-all w-2 sm:w-4 md:w-8 relative", percentage > 0 ? "opacity-100" : "opacity-20")}
                                            >
                                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap text-[8px] font-black text-neon">
                                                    {h.count}
                                                </div>
                                            </motion.div>
                                            <span className="text-[6px] font-black text-primary/30 uppercase tracking-tighter hidden md:block">
                                                {new Date(h.date).getHours()}h
                                            </span>
                                        </div>
                                    );
                                })
                            ) : (
                                [20, 45, 30, 60, 40, 50, 70].map((h, i) => (
                                    <div key={i} className="bg-primary/5 rounded-t-lg w-4 md:w-8" style={{ height: `${h}%` }} />
                                ))
                            )}
                        </div>
                    </div>
                    <div className="absolute top-6 right-6 text-primary/10">
                        <Sparkles size={20} className="hidden md:block" />
                        <Sparkles size={16} className="block md:hidden" />
                    </div>
                </div>
            </main>
        </div>
    );
}
