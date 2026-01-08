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
    Calendar, SortAsc, History, Info, Edit3, Code, X,
    Sparkles, Fingerprint, Rocket, Users, UserPlus, Lock, Bell, CheckCircle2
} from 'lucide-react';
import { UserMenu } from "@/components/user-menu";
import { ModernBackground } from '@/components/modern-background';
import { Navbar } from "@/components/navbar";
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
    const { user, token, logout, updateUser, isLoading } = useAuth();
    const router = useRouter();
    const [drops, setDrops] = useState<{ urls: any[], bundles: any[] }>({ urls: [], bundles: [] });
    const [fetching, setFetching] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<'all' | 'link' | 'bundle'>('all');
    const [sortBy, setSortBy] = useState<'date' | 'clicks' | 'name'>('date');
    const [copied, setCopied] = useState<string | null>(null);
    const [embedDrop, setEmbedDrop] = useState<any>(null);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [profileError, setProfileError] = useState("");
    const [team, setTeam] = useState<{ owned: any[], joined: any[] }>({ owned: [], joined: [] });
    const [isTeamsActive, setIsTeamsActive] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("manager");
    const [notifications, setNotifications] = useState<any[]>([]);
    const [showNotifs, setShowNotifs] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/');
            return;
        }
        if (user) {
            setNewUsername(user.username || "");
        }

        if (user && token) {
            fetchDrops();
            if (isTeamsActive) fetchTeam();
            fetchNotifications();

            const interval = setInterval(fetchNotifications, 30000); // Pool every 30s
            return () => clearInterval(interval);
        }
    }, [user, token, isLoading, router, isTeamsActive]);

    const fetchNotifications = async () => {
        try {
            const res = await fetch(`${API_URL}/api/notifications`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
            }
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        }
    };

    const markAsRead = async (id: number) => {
        try {
            await fetch(`${API_URL}/api/notifications/${id}/read`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (err) {
            console.error("Failed to mark as read:", err);
        }
    };

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

    const fetchTeam = async () => {
        try {
            const res = await fetch(`${API_URL}/api/team`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setTeam(data);
            }
        } catch (err) {
            console.error("Failed to fetch team:", err);
        }
    };

    const inviteCollaborator = async () => {
        if (!inviteEmail) return;
        try {
            const res = await fetch(`${API_URL}/api/team/invite`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ collaborator_email: inviteEmail, role: inviteRole })
            });
            if (res.ok) {
                setInviteEmail("");
                fetchTeam();
                alert("Collaboration protocol established.");
            } else {
                const err = await res.json();
                alert(err.detail || "Invitation failed");
            }
        } catch (err) {
            console.error("Invite failed:", err);
        }
    };

    const removeCollaborator = async (id: number) => {
        if (!confirm("De-authorize this collaborator?")) return;
        try {
            const res = await fetch(`${API_URL}/api/team/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchTeam();
            }
        } catch (err) {
            console.error("Removal failed:", err);
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

    const handleUpdateProfile = async () => {
        if (!user || !token) return;
        setIsUpdatingProfile(true);
        setProfileError("");

        try {
            const res = await fetch(`${API_URL}/api/user/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ username: newUsername })
            });

            if (res.ok) {
                const updatedUser = await res.json();
                updateUser(updatedUser);
                setShowProfileModal(false);
            } else {
                const errorData = await res.json();
                setProfileError(errorData.detail || "Failed to update profile.");
            }
        } catch (err) {
            setProfileError("An unexpected error occurred.");
            console.error("Profile update failed:", err);
        } finally {
            setIsUpdatingProfile(false);
        }
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

            <Navbar dashboardProps={{ isTeamsActive, setIsTeamsActive }}>
                <div className="flex items-center gap-2 md:gap-4 mr-2">
                    <Link
                        href="/"
                        className="p-2.5 rounded-xl bg-glass-fill border border-glass-stroke text-primary/60 hover:text-primary hover:bg-glass-stroke transition-all"
                        title="Return to Landing Page"
                    >
                        <Globe size={18} strokeWidth={2.5} />
                    </Link>

                    <button
                        onClick={() => setIsTeamsActive(!isTeamsActive)}
                        className={cn(
                            "flex items-center gap-2.5 px-4 md:px-6 py-2 md:py-2.5 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] transition-all",
                            isTeamsActive
                                ? "bg-neon text-background shadow-[0_0_20px_rgba(var(--neon),0.3)]"
                                : "bg-glass-fill text-primary border border-glass-stroke hover:bg-glass-stroke"
                        )}
                    >
                        <Users size={16} strokeWidth={2.5} />
                        <span className="hidden md:inline">Teams</span>
                    </button>

                    <Link
                        href="/create"
                        className="group relative overflow-hidden bg-primary hover:bg-neon text-background px-4 md:px-6 py-2 md:py-2.5 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] transition-all shadow-[0_10px_30px_rgba(var(--primary),0.2)] flex items-center gap-2.5 hover:scale-105"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        <Plus size={16} strokeWidth={2.5} />
                        <span className="hidden md:inline">New Drop</span>
                    </Link>
                </div>
            </Navbar>

            <main className="max-w-7xl mx-auto px-6 pt-32 pb-24 space-y-12">
                {isTeamsActive ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-12"
                    >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8">
                            <div className="space-y-2 md:space-y-4">
                                <h1 className="text-4xl md:text-6xl font-black text-contrast tracking-tighter uppercase italic leading-[0.8] mb-1 md:mb-2">Team Access</h1>
                                <p className="text-[10px] md:text-xs font-bold text-primary/40 uppercase tracking-[0.2em] md:tracking-[0.4em]">Establish secure collaboration protocols</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                                <div className="relative flex-1 group">
                                    <UserPlus className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-neon" size={16} />
                                    <input
                                        type="email"
                                        placeholder="Internal Email..."
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        className="w-full md:w-64 bg-glass-fill border border-glass-stroke rounded-[20px] py-4 pl-14 pr-4 text-xs font-bold outline-none focus:border-neon transition-all"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <select
                                        value={inviteRole}
                                        onChange={(e) => setInviteRole(e.target.value)}
                                        className="bg-glass-fill border border-glass-stroke rounded-[20px] px-4 py-4 text-[10px] font-black uppercase tracking-widest text-primary/70 outline-none focus:border-neon transition-all"
                                    >
                                        <option value="manager">MGR</option>
                                        <option value="analyst">ANL</option>
                                    </select>
                                    <button
                                        onClick={inviteCollaborator}
                                        className="flex-1 bg-neon text-black px-6 py-4 rounded-[20px] font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-neon/20 flex items-center justify-center gap-3"
                                    >
                                        <Fingerprint size={16} />
                                        Authorize
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Collaborators I Manage */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                                        <Users size={20} />
                                    </div>
                                    <h2 className="text-xl font-black text-contrast uppercase tracking-tighter">Your Collaborators</h2>
                                </div>

                                <div className="space-y-4">
                                    {team.owned.length === 0 ? (
                                        <div className="glass-card p-12 rounded-[40px] border-glass-stroke border-dashed text-center">
                                            <p className="text-[10px] font-black text-primary/30 uppercase tracking-[0.5em]">No authorized managers yet</p>
                                        </div>
                                    ) : (
                                        team.owned.map(col => (
                                            <div key={col.id} className="glass-card p-6 rounded-[32px] border-glass-stroke flex items-center justify-between group hover:border-primary/40 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden">
                                                        {col.collaborator_pic ? <img src={col.collaborator_pic} alt="" className="w-full h-full object-cover" /> : <Sparkles size={16} />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-contrast uppercase tracking-tighter">{col.collaborator_name || 'Protocol Member'}</p>
                                                        <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest italic">
                                                            @{col.collaborator_username} • {col.role} • Access: {col.bundle_title}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeCollaborator(col.id)}
                                                    className="p-4 rounded-2xl bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Studios I can Manage */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 rounded-2xl bg-neon/10 text-neon">
                                        <Fingerprint size={20} />
                                    </div>
                                    <h2 className="text-xl font-black text-contrast uppercase tracking-tighter">Joint Studios</h2>
                                </div>

                                <div className="space-y-4">
                                    {team.joined.length === 0 ? (
                                        <div className="glass-card p-12 rounded-[40px] border-glass-stroke border-dashed text-center">
                                            <p className="text-[10px] font-black text-primary/30 uppercase tracking-[0.5em]">No joined teams yet</p>
                                        </div>
                                    ) : (
                                        team.joined.map(col => (
                                            <div key={col.id} className="glass-card p-6 rounded-[32px] border-glass-stroke flex items-center justify-between group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-neon/10 flex items-center justify-center overflow-hidden">
                                                        {col.owner_pic ? <img src={col.owner_pic} alt="" className="w-full h-full object-cover" /> : <Rocket size={16} />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-contrast uppercase tracking-tighter">{col.bundle_title === 'Global' ? `${col.owner_name}'s Studio` : col.bundle_title}</p>
                                                        <p className="text-[10px] font-bold text-neon/60 uppercase tracking-widest italic">{col.bundle_title === 'Global' ? `@${col.owner_username}` : `Invited by @${col.owner_username}`}</p>
                                                    </div>
                                                </div>
                                                <div className="px-4 py-2 rounded-xl bg-neon/10 border border-neon/20">
                                                    <span className="text-[8px] font-black text-neon uppercase tracking-widest">{col.role}</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            <div className="glass-card p-6 md:p-8 rounded-[32px] md:rounded-[40px] border-glass-stroke relative overflow-hidden group hover:border-primary/40 transition-all">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[40px] -translate-y-1/2 translate-x-1/2" />
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                                        <Zap size={20} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">Total Drops</span>
                                </div>
                                <div className="flex items-end justify-between">
                                    <h3 className="text-4xl md:text-5xl font-black text-contrast tracking-tighter leading-none">{totalDrops}</h3>
                                    <div className="text-right">
                                        <span className="text-[10px] font-black text-neon block">+12%</span>
                                        <span className="text-[8px] font-bold text-primary/30 uppercase tracking-widest">Growth</span>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <Sparkline color="#10b981" />
                                </div>
                            </div>

                            <div className="glass-card p-6 md:p-8 rounded-[32px] md:rounded-[40px] border-glass-stroke relative overflow-hidden group hover:border-neon/40 transition-all">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-neon/5 blur-[40px] -translate-y-1/2 translate-x-1/2" />
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 rounded-2xl bg-neon/10 text-neon">
                                        <MousePointer size={20} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neon/60">Engagements</span>
                                </div>
                                <div className="flex items-end justify-between">
                                    <h3 className="text-4xl md:text-5xl font-black text-contrast tracking-tighter leading-none">{totalClicks}</h3>
                                    <div className="text-right">
                                        <span className="text-[10px] font-black text-neon block">Active</span>
                                        <span className="text-[8px] font-bold text-primary/30 uppercase tracking-widest">Intelligence</span>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <Sparkline color="#00f2ff" />
                                </div>
                            </div>

                            <div className="hidden lg:block glass-card p-6 md:p-8 rounded-[32px] md:rounded-[40px] border-glass-stroke relative overflow-hidden group hover:border-contrast/20 transition-all">
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

                            <div className="hidden sm:block glass-card p-6 md:p-8 rounded-[32px] md:rounded-[40px] border-glass-stroke relative overflow-hidden group hover:border-primary/40 transition-all">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                                        <Layers size={20} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">Studio Capacity</span>
                                </div>
                                <div className="space-y-4">
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
                                                "px-4 md:px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
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
                                                            {drop.is_cloaked && <Shield size={14} className="text-neon animate-pulse" />}
                                                            {drop.password && <Lock size={14} className="text-primary/60" />}
                                                            {drop.expires_at && <Clock size={14} className="text-red-500" />}
                                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-glass-fill border border-glass-stroke">
                                                                <Activity size={10} className="text-primary" />
                                                                <span className="text-[10px] font-black text-contrast">{drop.clicks}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1.5 md:mb-2 text-ellipsis overflow-hidden">
                                                            <h3 className="text-xl md:text-2xl font-black text-contrast truncate leading-none uppercase italic tracking-tighter">
                                                                {drop.slug ? decodeURIComponent(drop.slug) : drop.title}
                                                            </h3>
                                                            <div className="flex gap-1">
                                                                {drop.type === 'bundle' && (
                                                                    <span className="text-[8px] font-black px-2 py-0.5 rounded-full bg-neon/10 text-neon border border-neon/20 uppercase tracking-[0.2em] italic">Studio</span>
                                                                )}
                                                                {user && drop.user_id !== user.id && (
                                                                    <span className="text-[8px] font-black px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-[0.2em] italic flex items-center gap-1">
                                                                        <Users size={8} /> SHARED
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <p className="text-[10px] font-bold text-primary/40 truncate italic">
                                                            {drop.type === 'bundle' ? `${drop.items.length} Linked Assets` : drop.long_url}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-8 md:mt-10 p-1 bg-glass-fill rounded-[20px] md:rounded-[24px] border border-glass-stroke">
                                                    <button
                                                        onClick={() => copyToClipboard(drop.slug)}
                                                        className="flex-1 py-3 md:py-3.5 rounded-xl md:rounded-2xl bg-background shadow-sm border border-glass-stroke hover:border-primary transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                                                    >
                                                        {copied === drop.slug ? <Check size={14} className="text-neon" /> : <Copy size={16} />}
                                                        {copied === drop.slug ? 'Deployed' : 'Copy'}
                                                    </button>

                                                    <div className="flex justify-center gap-1 md:gap-1.5 px-2 pb-2 sm:pb-0">
                                                        <button
                                                            onClick={() => router.push(`/stats/${drop.slug}`)}
                                                            className="h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-xl md:rounded-2xl hover:bg-glass-stroke transition-all text-primary/40 hover:text-primary"
                                                            title="Intelligence"
                                                        >
                                                            <BarChart3 size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => router.push(`/edit/${drop.slug}`)}
                                                            className="h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-xl md:rounded-2xl hover:bg-glass-stroke transition-all text-primary/40 hover:text-primary"
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
                                                            className="h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-xl md:rounded-2xl hover:bg-glass-stroke transition-all text-primary/40 hover:text-primary"
                                                            title="Broadcast"
                                                        >
                                                            <Share2 size={18} />
                                                        </button>
                                                        {user && drop.user_id === user.id && (
                                                            <button
                                                                onClick={() => deleteDrop(drop.slug)}
                                                                className="h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-xl md:rounded-2xl hover:bg-red-500/10 transition-all text-red-500/30 hover:text-red-500"
                                                                title="Purge"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        )}
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
                    </>
                )}
            </main>

            {/* Embed Modal */}
            <AnimatePresence>
                {embedDrop && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={() => setEmbedDrop(null)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-xl bg-glass-card p-10 md:p-12 rounded-[48px] border border-primary/20 shadow-2xl overflow-hidden"
                        >
                            <button onClick={() => setEmbedDrop(null)} className="absolute top-6 right-6 p-3 rounded-2xl bg-glass-fill hover:bg-glass-stroke transition-colors text-primary/40">
                                <X size={20} />
                            </button>

                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 rounded-3xl bg-primary/10 text-primary">
                                        <Code size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-contrast uppercase tracking-tighter italic">Studio Embed Protocol</h2>
                                        <p className="text-[10px] font-black text-neon tracking-[0.4em] uppercase opacity-70">Integrate Anywhere</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Embed Link */}
                                    <div className="space-y-3">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-2 italic">Raw Embed Link</span>
                                        <div className="bg-glass-fill p-5 rounded-[24px] border border-glass-stroke flex items-center justify-between gap-4 group">
                                            <span className="text-xs font-bold text-contrast truncate flex-1 select-all italic">
                                                {`${window.location.origin}/bundle/${embedDrop.slug}?embed=true`}
                                            </span>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(`${window.location.origin}/bundle/${embedDrop.slug}?embed=true`);
                                                    alert("Embed link copied!");
                                                }}
                                                className="p-3 rounded-xl bg-primary text-background hover:scale-105 transition-transform"
                                            >
                                                <Copy size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Iframe Snippet */}
                                    <div className="space-y-3">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-2 italic">Masterpiece iFrame Snippet</span>
                                        <div className="bg-black/40 p-5 rounded-[24px] border border-white/5 relative group">
                                            <code className="text-[10px] font-mono text-primary/60 break-all leading-relaxed block overflow-y-auto max-h-24 no-scrollbar">
                                                {`<iframe src="${window.location.origin}/bundle/${embedDrop.slug}?embed=true" width="100%" height="600px" frameborder="0"></iframe>`}
                                            </code>
                                            <button
                                                onClick={() => {
                                                    const code = `<iframe src="${window.location.origin}/bundle/${embedDrop.slug}?embed=true" width="100%" height="600px" frameborder="0"></iframe>`;
                                                    navigator.clipboard.writeText(code);
                                                    alert("Snippet copied!");
                                                }}
                                                className="absolute top-4 right-4 p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-background transition-all"
                                            >
                                                <Copy size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 rounded-[32px] bg-primary/5 border border-primary/10">
                                    <p className="text-[10px] font-bold text-primary/40 leading-relaxed italic uppercase tracking-widest">
                                        Clinical Note: This link provides a "Stealth Mode" view perfectly optimized for CMS widgets and external application containers.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Profile Settings Modal */}
            <AnimatePresence>
                {showProfileModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={() => setShowProfileModal(false)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-glass-card p-10 md:p-12 rounded-[48px] border border-primary/20 shadow-2xl overflow-hidden"
                        >
                            <button onClick={() => setShowProfileModal(false)} className="absolute top-6 right-6 p-3 rounded-2xl bg-glass-fill hover:bg-glass-stroke transition-colors text-primary/40">
                                <X size={20} />
                            </button>

                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 rounded-3xl bg-primary/10 text-primary">
                                        <Fingerprint size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-contrast uppercase tracking-tighter italic">Studio Identity Protocol</h2>
                                        <p className="text-[10px] font-black text-neon tracking-[0.4em] uppercase opacity-70">Claim your URL</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center px-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-primary/40 italic">Claimed Username</span>
                                            {user?.username && (
                                                <Link
                                                    href={`/studio/${user.username}`}
                                                    target="_blank"
                                                    className="text-[8px] font-black text-neon hover:underline flex items-center gap-1"
                                                >
                                                    VIEW HUB <ExternalLink size={10} />
                                                </Link>
                                            )}
                                        </div>
                                        <div className="relative group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40 font-black text-[10px] group-focus-within:text-primary transition-colors uppercase whitespace-nowrap">
                                                {typeof window !== 'undefined' ? window.location.host : ''}/studio/
                                            </div>
                                            <input
                                                type="text"
                                                value={newUsername}
                                                onChange={(e) => setNewUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                                                placeholder="username"
                                                className="w-full bg-glass-fill border-2 border-glass-stroke rounded-[24px] py-5 pl-[160px] md:pl-[180px] pr-8 text-sm font-black text-contrast outline-none focus:border-primary transition-all"
                                            />
                                        </div>
                                        {profileError && <p className="text-[10px] font-black text-red-500/80 uppercase tracking-widest px-4 italic">{profileError}</p>}
                                        <p className="text-[10px] font-black text-primary/30 uppercase italic px-4 leading-relaxed">
                                            This username defines your public Portfolio Hub URL where all your drops are showcased.
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleUpdateProfile}
                                        disabled={isUpdatingProfile || newUsername === user?.username}
                                        className="w-full bg-primary text-background font-black py-6 rounded-[24px] hover:bg-neon hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:scale-100 transition-all text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
                                    >
                                        {isUpdatingProfile ? <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" /> : <Rocket size={16} />}
                                        Synchronize ID
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
