"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus, Bell, Users, LayoutDashboard,
    Settings, LogOut, ChevronDown,
    Moon, Sun, Globe, CheckCircle2,
    Sparkles, ArrowLeft, Activity, Users as UsersIcon,
    TrendingUp, Zap, MousePointer2, Layers, BarChart3,
    Smartphone, Monitor, ChevronRight, Shield
} from "lucide-react";
import { ModernBackground } from "@/components/modern-background";
import { Navbar } from "@/components/navbar";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface GlobalStats {
    total_users: number;
    users_7d: number;
    total_links: number;
    total_bundles: number;
    total_clicks: number;
    clicks_24h: number;
    growth_7d: number;
    device_stats: { device: string; count: number }[];
    top_referrers: { referer: string; count: number }[];
    click_history: { date: string; count: number }[];
}

export default function GlobalAnalyticsPage() {
    const [stats, setStats] = useState<GlobalStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${API_URL}/api/public-stats`);
                if (!res.ok) throw new Error("Could not load global intelligence.");
                const data = await res.json();
                setStats(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const StatCard = ({ label, value, icon: Icon, color, trend }: any) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 md:p-8 rounded-[32px] border-glass-stroke relative overflow-hidden group shadow-2xl"
        >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon size={80} style={{ color }} />
            </div>
            <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-glass-fill border border-glass-stroke" style={{ color }}>
                        <Icon size={20} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/50">{label}</span>
                </div>
                <div className="flex items-baseline gap-3">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-contrast italic">
                        {value.toLocaleString()}
                    </h2>
                    {trend && (
                        <div className="flex items-center gap-1 text-[10px] font-black text-neon uppercase tracking-widest bg-neon/10 px-2 py-0.5 rounded-full italic">
                            <TrendingUp size={10} /> +{trend}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-16 h-16 border-t-4 border-r-4 border-primary rounded-full blur-sm"
            />
            <Activity className="absolute text-primary animate-pulse" size={24} />
        </div>
    );

    return (
        <div className="relative min-h-screen bg-background selection:bg-neon/30 overflow-x-hidden pb-32">
            <ModernBackground themeColor="#00f2ff" />
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 pt-32 space-y-24 relative z-10">
                {/* Header Phase */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4 max-w-2xl">
                        <div className="flex items-center gap-3">
                            <span className="p-2 rounded-lg bg-neon/20 text-neon animate-pulse">
                                <Zap size={14} />
                            </span>
                            <span className="text-neon text-[10px] font-black tracking-[0.5em] uppercase">Global Intelligence</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-contrast uppercase italic leading-[0.9]">
                            Public <br /> <span className="text-primary">Performance</span>
                        </h1>
                        <p className="text-primary/50 text-sm md:text-lg font-bold italic leading-relaxed max-w-md">
                            Real-time metrics from the Kelal Link ecosystem. Witness the growth of digital identities across the world.
                        </p>
                    </div>

                    <div className="p-6 md:p-8 glass-card rounded-[32px] border-neon/20 bg-neon/5 flex items-center gap-8">
                        <div>
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-neon/60 block mb-1">Last 24h Flow</span>
                            <div className="text-3xl font-black italic text-neon flex items-center gap-2">
                                <Activity size={24} /> {stats?.clicks_24h.toLocaleString()}
                            </div>
                        </div>
                        <div className="w-px h-12 bg-neon/10" />
                        <div>
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/60 block mb-1">Growth Index</span>
                            <div className="text-3xl font-black italic text-primary flex items-center gap-2">
                                <TrendingUp size={24} /> +{stats?.growth_7d}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Core Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    <StatCard
                        label="Digital Footprint"
                        value={stats?.total_clicks || 0}
                        icon={MousePointer2}
                        color="#00f2ff"
                        trend={stats?.clicks_24h}
                    />
                    <StatCard
                        label="Pro Creators"
                        value={stats?.total_users || 0}
                        icon={Users}
                        color="#ffae00"
                        trend={stats?.users_7d}
                    />
                    <StatCard
                        label="Studios Created"
                        value={stats?.total_bundles || 0}
                        icon={Sparkles}
                        color="#7000ff"
                    />
                    <StatCard
                        label="Total Drops"
                        value={(stats?.total_links || 0) + (stats?.total_bundles || 0)}
                        icon={Layers}
                        color="#ff0055"
                        trend={stats?.growth_7d}
                    />
                </div>

                {/* Advanced Visuals Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Activity Timeline */}
                    <div className="lg:col-span-8 glass-card p-10 rounded-[40px] border-glass-stroke shadow-2xl space-y-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                                    <BarChart3 size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-black uppercase tracking-widest text-contrast">Activity Timeline</span>
                                    <span className="text-[8px] font-bold text-primary/50 uppercase tracking-[0.2em]">Last 7 days click propagation</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-[300px] flex items-end gap-2 md:gap-4 px-2">
                            {stats?.click_history.map((day, i) => {
                                const max = Math.max(...stats.click_history.map(h => h.count), 1);
                                const height = (day.count / max) * 100;
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                        <div className="w-full relative">
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${height}%` }}
                                                className="w-full bg-gradient-to-t from-primary/20 via-primary to-neon rounded-t-2xl relative"
                                            >
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-contrast text-background px-2 py-1 rounded-lg text-[10px] font-black italic whitespace-nowrap">
                                                    {day.count} Clicks
                                                </div>
                                            </motion.div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-[8px] font-black text-primary/30 uppercase tracking-widest rotate-45 mt-2">
                                                {day.date.split('-').slice(1).join('/')}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Distribution Cards */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Devices */}
                        <div className="glass-card p-8 rounded-[40px] border-glass-stroke shadow-xl space-y-6">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40">Hardware Profile</span>
                            <div className="space-y-4">
                                {stats?.device_stats.map((d, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-3xl bg-glass-fill border border-glass-stroke hover:border-primary/30 transition-all">
                                        <div className="flex items-center gap-3">
                                            {d.device.toLowerCase() === 'mobile' ? <Smartphone size={16} /> : <Monitor size={16} />}
                                            <span className="text-[10px] font-black uppercase tracking-widest text-contrast">{d.device}</span>
                                        </div>
                                        <span className="text-xs font-black italic text-primary">{d.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Referrers */}
                        <div className="glass-card p-8 rounded-[40px] border-glass-stroke shadow-xl space-y-6">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40">Propagation Sources</span>
                            <div className="space-y-4">
                                {stats?.top_referrers.map((r, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-3xl bg-glass-fill border border-glass-stroke">
                                        <div className="flex items-center gap-3 truncate">
                                            <Globe size={14} className="text-primary/40 shrink-0" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-contrast truncate">{r.referer}</span>
                                        </div>
                                        <span className="text-xs font-black italic text-neon">{r.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Global Presence Banner */}
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="relative rounded-[50px] overflow-hidden bg-primary p-12 md:p-20 text-background group cursor-pointer"
                    onClick={() => window.location.href = "/"}
                >
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                        <Globe size={300} strokeWidth={1} />
                    </div>
                    <div className="relative z-10 max-w-4xl space-y-8">
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.9]">
                            Join the <br /> Digital Revolution.
                        </h2>
                        <p className="text-background/80 text-lg md:text-2xl font-bold italic leading-relaxed">
                            Every click, every studio, every link matters. Build your premium digital footprint with Kelal Link today.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <div className="px-10 py-5 bg-background text-primary rounded-[24px] font-black uppercase tracking-widest text-sm flex items-center gap-4 group-hover:bg-contrast transition-colors">
                                Create Your Studio <ChevronRight size={20} />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* System Integrity */}
                <div className="flex flex-col items-center gap-6 pt-12 opacity-30">
                    <div className="flex items-center gap-3">
                        <Shield className="text-neon" size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em]">System Protocols Active & Secure</span>
                    </div>
                    <div className="text-[8px] font-bold text-center uppercase tracking-widest max-w-md italic">
                        All analytics are aggregated in real-time using distributed intelligence.
                        No sensitive user data is exposed in public intelligence clusters.
                    </div>
                </div>
            </div>
        </div>
    );
}
