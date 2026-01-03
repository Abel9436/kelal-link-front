"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth-context';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Link2, Layers, BarChart3,
    Trash2, ExternalLink, Copy, Check, Search,
    Filter, ArrowLeft, Plus, Globe, Shield, Clock,
    Activity, ChevronRight, Zap, Share2, TrendingUp, MousePointer,
    Calendar, SortAsc, History, Info, Edit3
} from 'lucide-react';
import { ModernBackground } from '@/components/modern-background';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const Sparkline = ({ color = "#10b981" }) => (
    <svg viewBox="0 0 100 30" className="w-full h-8 opacity-40">
        <path
            d="M0 25 L10 20 L20 28 L30 15 L40 22 L50 10 L60 18 L70 5 L80 15 L90 8 L100 20"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default function DashboardPage() {
    const { user, token, isLoading } = useAuth();
    const router = useRouter();
    const [drops, setDrops] = useState<{ urls: any[], bundles: any[] }>({ urls: [], bundles: [] });
    const [fetching, setFetching] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<'all' | 'link' | 'bundle'>('all');
    const [sortBy, setSortBy] = useState<'date' | 'clicks' | 'name'>('date');
    const [copied, setCopied] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/');
            return;
        }

        if (user && token) {
            fetchDrops();
        }
    }, [user, token, isLoading]);

    const fetchDrops = async () => {
        try {
            const res = await fetch(`${API_URL}/api/me/drops`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setDrops(data);
            }
        } catch (err) {
            console.error("Failed to fetch drops:", err);
        } finally {
            setFetching(false);
        }
    };

    const deleteDrop = async (slug: string) => {
        if (!confirm("Are you sure you want to purge this drop from existence? This cannot be undone.")) return;

        try {
            const res = await fetch(`${API_URL}/api/drops/${slug}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setDrops(prev => ({
                    urls: prev.urls.filter(u => u.slug !== slug),
                    bundles: prev.bundles.filter(b => b.slug !== slug)
                }));
            }
        } catch (err) {
            console.error("Deletion failed:", err);
        }
    };

    const copyToClipboard = (slug: string) => {
        const url = `${window.location.origin}/${slug}`;
        navigator.clipboard.writeText(url);
        setCopied(slug);
        setTimeout(() => setCopied(null), 2000);
    };

    if (isLoading || fetching) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
                <ModernBackground />
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-primary font-black uppercase tracking-[0.5em] text-xs">Accessing Studio Archive...</p>
            </div>
        );
    }

    const allDrops = [...drops.urls.map(u => ({ ...u, type: 'link' })), ...drops.bundles.map(b => ({ ...b, type: 'bundle' }))];

    const filteredAndSortedDrops = allDrops
        .filter(d => {
            const matchesSearch = (d.slug || "").toLowerCase().includes(search.toLowerCase()) ||
                (d.title || "").toLowerCase().includes(search.toLowerCase()) ||
                (d.long_url || "").toLowerCase().includes(search.toLowerCase());
            const matchesFilter = filter === 'all' || (filter === 'link' && d.type === 'link') || (filter === 'bundle' && d.type === 'bundle');
            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
            if (sortBy === 'clicks') return (b.clicks || 0) - (a.clicks || 0);
            if (sortBy === 'name') return (a.title || a.slug).localeCompare(b.title || b.slug);
            return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        });

    const totalDrops = allDrops.length;
    const totalClicks = allDrops.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
    const mostActive = allDrops.length > 0 ? [...allDrops].sort((a, b) => (b.clicks || 0) - (a.clicks || 0))[0] : null;

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-neon/30 overflow-x-hidden">
            <ModernBackground themeColor={mostActive?.theme_color} bgColor={mostActive?.bg_color} />

            <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-background/5 backdrop-blur-xl border-b border-glass-stroke">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.push('/')} className="p-3 rounded-2xl bg-glass-fill hover:bg-glass-stroke transition-colors text-primary/80">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="h-8 w-px bg-glass-stroke hidden md:block" />
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-widest text-contrast">Studio Dashboard</h2>
                        <p className="text-[8px] font-black text-neon tracking-[0.5em] uppercase opacity-80">Creator Control Center</p>
                    </div>
                </div>

                <Link
                    href="/create"
                    className="bg-primary hover:bg-neon hover:text-black px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-primary/20 flex items-center gap-2"
                >
                    <Plus size={14} />
                    New Drop
                </Link>
            </nav>

            <main className="max-w-7xl mx-auto px-6 pt-32 pb-24 space-y-12">
                {/* Intelligence Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="glass-card p-8 rounded-[40px] border-glass-stroke relative overflow-hidden group hover:border-primary/40 transition-all">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[40px] -translate-y-1/2 translate-x-1/2" />
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                                <Zap size={20} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">Total Drops</span>
                        </div>
                        <div className="flex items-end justify-between">
                            <h3 className="text-5xl font-black text-contrast tracking-tighter leading-none">{totalDrops}</h3>
                            <div className="text-right">
                                <span className="text-[10px] font-black text-neon block">+12%</span>
                                <span className="text-[8px] font-bold text-primary/30 uppercase tracking-widest">Growth</span>
                            </div>
                        </div>
                        <div className="mt-6">
                            <Sparkline color="#10b981" />
                        </div>
                    </div>

                    <div className="glass-card p-8 rounded-[40px] border-glass-stroke relative overflow-hidden group hover:border-neon/40 transition-all">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-neon/5 blur-[40px] -translate-y-1/2 translate-x-1/2" />
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-2xl bg-neon/10 text-neon">
                                <MousePointer size={20} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neon/60">Engagements</span>
                        </div>
                        <div className="flex items-end justify-between">
                            <h3 className="text-5xl font-black text-contrast tracking-tighter leading-none">{totalClicks}</h3>
                            <div className="text-right">
                                <span className="text-[10px] font-black text-neon block">Active</span>
                                <span className="text-[8px] font-bold text-primary/30 uppercase tracking-widest">Intelligence</span>
                            </div>
                        </div>
                        <div className="mt-6">
                            <Sparkline color="#00f2ff" />
                        </div>
                    </div>

                    <div className="glass-card p-8 rounded-[40px] border-glass-stroke relative overflow-hidden group hover:border-contrast/20 transition-all">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-2xl bg-contrast/5 text-contrast">
                                <TrendingUp size={20} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-contrast/50">Top Asset</span>
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-xl font-black text-contrast tracking-tighter leading-tight truncate uppercase italic">
                                {mostActive ? (mostActive.title || mostActive.slug) : "None yet"}
                            </h3>
                            <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest mt-1">
                                {mostActive ? `${mostActive.clicks} Clicks` : "No activity recorded"}
                            </p>
                        </div>
                    </div>

                    <div className="glass-card p-8 rounded-[40px] border-glass-stroke relative overflow-hidden group hover:border-primary/40 transition-all">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                                <Layers size={20} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">Studio Capacity</span>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-contrast uppercase tracking-widest italic text-xs">V1 Protocol</span>
                                <span className="text-[10px] font-black text-primary uppercase">Elite</span>
                            </div>
                            <div className="h-2 w-full bg-glass-fill border border-glass-stroke rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min((totalDrops / 50) * 100, 100)}%` }}
                                    className="h-full bg-primary"
                                />
                            </div>
                            <p className="text-[8px] font-bold text-primary/30 uppercase tracking-[0.2em]">{totalDrops}/50 Mastery Drops Used</p>
                        </div>
                    </div>
                </div>

                {/* Search, Filter & Sort */}
                <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                    <div className="relative w-full lg:max-w-2xl group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-neon transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search clinical studio drops..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-glass-fill border border-glass-stroke rounded-[24px] py-5 pl-16 pr-6 text-sm font-bold outline-none focus:border-neon focus:bg-background transition-all"
                        />
                    </div>

                    <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                        <div className="flex bg-glass-fill p-1.5 rounded-[22px] border border-glass-stroke">
                            {(['all', 'link', 'bundle'] as const).map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={cn(
                                        "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                        filter === f ? "bg-primary text-background shadow-lg" : "text-primary/60 hover:text-primary"
                                    )}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        <div className="flex bg-glass-fill p-1.5 rounded-[22px] border border-glass-stroke">
                            {[
                                { id: 'date', icon: Calendar, label: 'Latest' },
                                { id: 'clicks', icon: TrendingUp, label: 'Engagement' },
                                { id: 'name', icon: SortAsc, label: 'Identity' }
                            ].map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => setSortBy(s.id as any)}
                                    className={cn(
                                        "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                                        sortBy === s.id ? "bg-contrast text-background shadow-lg" : "text-primary/60 hover:text-primary"
                                    )}
                                >
                                    <s.icon size={12} />
                                    <span className="hidden sm:inline">{s.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Drops List */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <AnimatePresence mode="popLayout">
                                {filteredAndSortedDrops.map((drop, idx) => (
                                    <motion.div
                                        key={drop.slug}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className={cn(
                                            "group glass-card p-6 rounded-[40px] border-glass-stroke hover:border-primary/30 transition-all flex flex-col justify-between relative overflow-hidden",
                                            drop.type === 'bundle' && "border-l-4"
                                        )}
                                        style={drop.type === 'bundle' ? { borderLeftColor: drop.theme_color || '#00f2ff' } : {}}
                                    >
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <div
                                                    className="p-3 rounded-2xl transition-colors"
                                                    style={{
                                                        backgroundColor: drop.type === 'bundle' ? (drop.theme_color + '15') : 'rgba(var(--primary), 0.1)',
                                                        color: drop.type === 'bundle' ? drop.theme_color : 'var(--primary)'
                                                    }}
                                                >
                                                    {drop.type === 'bundle' ? <Layers size={18} /> : <Link2 size={18} />}
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    {drop.password && <Shield size={14} className="text-neon" />}
                                                    {drop.expires_at && <Clock size={14} className="text-red-500" />}
                                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-glass-fill border border-glass-stroke">
                                                        <Activity size={10} className="text-primary" />
                                                        <span className="text-[10px] font-black text-contrast">{drop.clicks}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="text-2xl font-black text-contrast truncate leading-none uppercase italic tracking-tighter">
                                                        {drop.slug ? decodeURIComponent(drop.slug) : drop.title}
                                                    </h3>
                                                    {drop.type === 'bundle' && (
                                                        <span className="text-[8px] font-black px-2 py-0.5 rounded-full bg-neon/10 text-neon border border-neon/20 uppercase tracking-[0.2em] italic">Studio</span>
                                                    )}
                                                </div>
                                                <p className="text-[10px] font-bold text-primary/40 truncate italic">
                                                    {drop.type === 'bundle' ? `${drop.items.length} Linked Assets` : drop.long_url}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 mt-10 p-1 bg-glass-fill rounded-[24px] border border-glass-stroke">
                                            <button
                                                onClick={() => copyToClipboard(drop.slug)}
                                                className="flex-1 py-3.5 rounded-2xl bg-background shadow-sm border border-glass-stroke hover:border-primary transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                                            >
                                                {copied === drop.slug ? <Check size={14} className="text-neon" /> : <Copy size={16} />}
                                                {copied === drop.slug ? 'Deployed' : 'Copy'}
                                            </button>

                                            <div className="flex gap-1 pr-2">
                                                <button
                                                    onClick={() => router.push(`/stats/${drop.slug}`)}
                                                    className="h-12 w-12 flex items-center justify-center rounded-2xl hover:bg-glass-stroke transition-all text-primary/40 hover:text-primary"
                                                    title="Intelligence"
                                                >
                                                    <BarChart3 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => router.push(`/edit/${drop.slug}`)}
                                                    className="h-12 w-12 flex items-center justify-center rounded-2xl hover:bg-glass-stroke transition-all text-primary/40 hover:text-primary"
                                                    title="Recalibrate"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const shareUrl = drop.type === 'bundle' ? `${window.location.origin}/bundle/${drop.slug}` : `${window.location.origin}/${drop.slug}`;
                                                        if (navigator.share) {
                                                            navigator.share({ title: `ቀላል Link - ${drop.slug}`, url: shareUrl });
                                                        } else {
                                                            copyToClipboard(drop.slug);
                                                        }
                                                    }}
                                                    className="h-12 w-12 flex items-center justify-center rounded-2xl hover:bg-glass-stroke transition-all text-primary/40 hover:text-primary"
                                                    title="Broadcast"
                                                >
                                                    <Share2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => window.open(drop.type === 'bundle' ? `/bundle/${drop.slug}` : `/${drop.slug}`, '_blank')}
                                                    className="h-12 w-12 flex items-center justify-center rounded-2xl hover:bg-glass-stroke transition-all text-primary/40 hover:text-primary"
                                                    title="View Content"
                                                >
                                                    <ExternalLink size={18} />
                                                </button>
                                                <button
                                                    onClick={() => deleteDrop(drop.slug)}
                                                    className="h-12 w-12 flex items-center justify-center rounded-2xl hover:bg-red-500/10 transition-all text-red-500/30 hover:text-red-500"
                                                    title="Purge"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {!fetching && totalDrops === 0 && (
                            <div className="flex flex-col items-center justify-center py-32 text-center space-y-8 glass-card rounded-[60px] border-2 border-dashed border-glass-stroke">
                                <div className="w-24 h-24 rounded-[40px] bg-primary/5 flex items-center justify-center text-primary/20">
                                    <Layers size={48} />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-3xl font-black text-contrast uppercase tracking-tighter italic leading-none">Studio Silence</h3>
                                    <p className="text-sm font-bold text-primary/40 max-w-xs mx-auto">Absolute zero activity detected. Initialize your first professional drop to begin monitoring.</p>
                                </div>
                                <Link
                                    href="/"
                                    className="bg-primary text-background px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center gap-4"
                                >
                                    Initialize First Asset <Plus size={18} />
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Performance Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Creator Profile */}
                        <div className="glass-card p-10 rounded-[50px] border-glass-stroke relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 blur-[80px] -translate-y-1/2 translate-x-1/2" />
                            <div className="flex items-center gap-6 mb-10">
                                <div className="w-20 h-20 rounded-[30px] bg-gradient-to-br from-primary via-primary/80 to-neon flex items-center justify-center text-background text-3xl font-black shadow-2xl relative group">
                                    <div className="absolute inset-0 rounded-[30px] bg-white opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
                                    {user?.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-contrast tracking-tighter leading-none">{user?.name || "Professional Creator"}</h2>
                                    <p className="text-[10px] font-black text-neon tracking-[0.4em] uppercase mt-2">Elite Mastery</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex justify-between items-end pb-5 border-b border-glass-stroke">
                                    <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest italic">Member Since</span>
                                    <span className="text-sm font-black text-contrast uppercase tracking-tighter">Jan 2026</span>
                                </div>
                                <div className="flex justify-between items-end pb-5 border-b border-glass-stroke">
                                    <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest italic">Drop Limit</span>
                                    <span className="text-sm font-black text-contrast uppercase tracking-tighter">Unlimited</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest italic">Intelligence Status</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-neon animate-pulse" />
                                        <span className="text-xs font-black text-neon uppercase tracking-widest">Active</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Feed */}
                        <div className="glass-card p-10 rounded-[50px] border-glass-stroke">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <History size={18} className="text-primary" />
                                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-primary">Recent Logs</h3>
                                </div>
                                <div className="px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[8px] font-black text-primary/40 uppercase tracking-widest">Real-time</div>
                            </div>

                            <div className="space-y-8">
                                {[
                                    { type: 'created', label: 'Drop Initialized', time: '2m ago', icon: Plus },
                                    { type: 'shared', label: 'Asset Broadcasted', time: '14m ago', icon: Share2 },
                                    { type: 'viewed', label: 'Intelligence Checked', time: '1h ago', icon: Activity },
                                    { type: 'security', label: 'Shield Protocol Verified', time: '3h ago', icon: Shield }
                                ].map((log, i) => (
                                    <div key={i} className="flex gap-4 group">
                                        <div className="w-px bg-glass-stroke relative">
                                            <div className="absolute top-0 -left-1 w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                                        </div>
                                        <div className="flex-1 pb-2">
                                            <div className="flex justify-between items-start">
                                                <p className="text-[11px] font-black text-contrast uppercase tracking-tighter italic">{log.label}</p>
                                                <span className="text-[9px] font-bold text-primary/20 uppercase">{log.time}</span>
                                            </div>
                                            <p className="text-[8px] font-bold text-primary/30 uppercase tracking-widest mt-1">Status: Success Protocol</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Studio Tips */}
                        <div className="p-10 rounded-[50px] bg-primary text-background relative overflow-hidden group shadow-2xl">
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 blur-[40px] translate-y-1/2 translate-x-1/2" />
                            <Info size={32} className="text-background/20 absolute top-8 right-8" />
                            <h3 className="text-xl font-black mb-4 uppercase tracking-tighter italic">Studio mastery</h3>
                            <p className="text-[11px] font-bold leading-relaxed italic opacity-80 uppercase tracking-widest">
                                Use clinical aliases to increase click-through intelligence by up to 40%. The Pro Studio protocol recommends 5-8 character unique slugs.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
