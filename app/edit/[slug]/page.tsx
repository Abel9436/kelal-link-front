"use client";
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Edit3, Eye, Rocket, Layout, Clock, ShieldAlert, Heart,
    Smartphone, Tablet, Monitor, Fingerprint, Lock, ArrowRight, Check, Sparkles, Globe, Palette, Share2, Copy, ExternalLink,
    Code, Shield, X, UserPlus, Link2, TrendingUp, ChevronDown,
    Users as UsersIcon, LayoutDashboard
} from "lucide-react";
import { useAuth } from "@/components/auth-context";
import { ModernBackground } from "@/components/modern-background";
import { BundleBuilder } from "@/components/bundle-builder";
import { getPlatformInfo } from "@/lib/platforms";
import React from "react";
import { Navbar } from "@/components/navbar";
import { cn } from "@/lib/utils";
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function EditDropPage() {
    const { slug: initialSlug } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { token, user } = useAuth();

    // Logic State
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState("");
    const [dropType, setDropType] = useState<"url" | "bundle" | null>(null);

    // Form States - 100% PARITY with create/page.tsx
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [items, setItems] = useState<{ id: string; label: string; url: string; isSpotlight?: boolean }[]>([{ id: "1", label: "", url: "", isSpotlight: false }]);
    const [customSlug, setCustomSlug] = useState("");
    const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
    const [lang, setLang] = useState<"en" | "am">("en");
    const [expiresIn, setExpiresIn] = useState(0);
    const [customExpiry, setCustomExpiry] = useState("");
    const [maxClicks, setMaxClicks] = useState(0);
    const [password, setPassword] = useState("");
    const [previewDevice, setPreviewDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
    const [themeColor, setThemeColor] = useState("#00f2ff");
    const [bgColor, setBgColor] = useState("#0a0a0a");
    const [textColor, setTextColor] = useState("#888888");
    const [titleColor, setTitleColor] = useState("#ffffff");
    const [cardColor, setCardColor] = useState("rgba(255,255,255,0.05)");
    const [metaTitle, setMetaTitle] = useState("");
    const [metaDescription, setMetaDescription] = useState("");
    const [bgImage, setBgImage] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [longUrl, setLongUrl] = useState("");
    const [isCloaked, setIsCloaked] = useState(false);
    const [expiresAt, setExpiresAt] = useState<string | null>(null);
    const [managerToken, setManagerToken] = useState<string | null>(null);
    const [analystToken, setAnalystToken] = useState<string | null>(null);

    // Collaboration States
    const [collaborators, setCollaborators] = useState<any[]>([]);
    const [inviteEmail, setInviteEmail] = useState("");
    const [isInviting, setIsInviting] = useState(false);
    const [bundleId, setBundleId] = useState<number | null>(null);
    const [inviteRole, setInviteRole] = useState("manager");
    const [accessLevel, setAccessLevel] = useState("restricted"); // restricted, view, edit
    const [ownerId, setOwnerId] = useState<number | null>(null);
    const [userRole, setUserRole] = useState<string>("viewer");
    const [showShareModal, setShowShareModal] = useState(false);
    const [shareTab, setShareTab] = useState<'people' | 'settings'>('people');
    const [showCopied, setShowCopied] = useState(false);

    const fetchCollaborators = async (bId: number) => {
        try {
            const res = await fetch(`${API_URL}/api/team`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                // Filter collaborators who are linked to THIS specific bundle
                const filtered = data.owned.filter((c: any) => c.bundle_id === bId || c.bundle_title === "Global");
                setCollaborators(filtered);
            }
        } catch (err) {
            console.error("Failed to fetch team", err);
        }
    };

    const handleInvite = async () => {
        if (!inviteEmail || !bundleId) return;
        setIsInviting(true);
        try {
            const res = await fetch(`${API_URL}/api/team/invite`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    collaborator_email: inviteEmail,
                    bundle_id: bundleId,
                    role: inviteRole
                })
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || "Invitation failed");
            }
            setInviteEmail("");
            fetchCollaborators(bundleId);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsInviting(false);
        }
    };

    const handleAccessLevelChange = async (newLevel: string) => {
        setAccessLevel(newLevel);
        try {
            const endpoint = dropType === "bundle" ? `${API_URL}/api/bundle/${initialSlug}` : `${API_URL}/api/url/${initialSlug}`;
            await fetch(endpoint, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ access_level: newLevel }),
            });
        } catch (err) {
            console.error("Failed to update access level", err);
        }
    };

    const handleRemoveCollaborator = async (colId: number) => {
        try {
            const res = await fetch(`${API_URL}/api/team/${colId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok && bundleId) {
                fetchCollaborators(bundleId);
            }
        } catch (err) {
            console.error("Failed to remove collaborator", err);
        }
    };

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
        const fetchDrop = async () => {
            try {
                // Check for Invite Token auto-join
                const inviteTokenFromUrl = searchParams.get('token');
                if (inviteTokenFromUrl && token) {
                    await fetch(`${API_URL}/api/bundle/join/${initialSlug}?token=${inviteTokenFromUrl}`, {
                        method: 'POST',
                        headers: { "Authorization": `Bearer ${token}` }
                    }).catch(e => console.error("Auto-join failed:", e));

                    // Cleanup URL
                    const newUrl = window.location.pathname;
                    window.history.replaceState({}, '', newUrl);
                }

                const res = await fetch(`${API_URL}/api/drop/${initialSlug}`, {
                    headers: token ? { "Authorization": `Bearer ${token}` } : {}
                });
                if (!res.ok) {
                    if (res.status === 404) router.push("/dashboard");
                    throw new Error("Failed to load drop details");
                }

                const data = await res.json();
                setDropType(data.type);
                setCustomSlug(data.slug);
                setMaxClicks(data.max_clicks || 0);
                setIsCloaked(data.is_cloaked || false);
                setAccessLevel(data.access_level || "restricted");
                setOwnerId(data.user_id);
                setUserRole(data.user_role || "viewer");
                setExpiresAt(data.expires_at || null);
                setManagerToken(data.manager_token || null);
                setAnalystToken(data.analyst_token || null);

                const canReallyEdit = (data.user_role === 'owner' || data.user_role === 'manager' || data.access_level === 'edit');
                if (!canReallyEdit) setActiveTab("preview");

                if (data.type === 'bundle') {
                    setBundleId(data.id);
                    setTitle(data.title);
                    setDescription(data.description || "");
                    if (data.items && data.items.length > 0) {
                        setItems(data.items.map((it: any, idx: number) => ({ ...it, id: String(idx + 1), isSpotlight: it.is_spotlight })));
                    } else {
                        setItems([{ id: "1", label: "", url: "" }]);
                    }
                    setThemeColor(data.theme_color || "#00f2ff");
                    setBgColor(data.bg_color || "#0a0a0a");
                    setTextColor(data.text_color || "#888888");
                    setTitleColor(data.title_color || "#ffffff");
                    setCardColor(data.card_color || "rgba(255,255,255,0.05)");
                    setMetaTitle(data.meta_title || "");
                    setMetaDescription(data.meta_description || "");
                    setBgImage(data.bg_image || "");
                    setProfileImage(data.profile_image || "");
                    fetchCollaborators(data.id);
                } else {
                    setLongUrl(data.long_url);
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (token && initialSlug) fetchDrop();
    }, [initialSlug, token, router, searchParams]);


    const handleSave = async () => {
        setIsSaving(true);
        setError("");
        try {
            const endpoint = dropType === "bundle" ? `${API_URL}/api/bundle/${initialSlug}` : `${API_URL}/api/url/${initialSlug}`;
            const body: any = {
                custom_slug: customSlug || undefined,
                max_clicks: maxClicks > 0 ? maxClicks : 0,
                expires_at: (expiresIn === -1 && customExpiry) ? new Date(customExpiry).toISOString() : undefined,
                password: password || undefined,
                meta_title: metaTitle || undefined,
                meta_description: metaDescription || undefined,
                bg_image: bgImage || undefined,
                profile_image: profileImage || undefined,
                is_cloaked: isCloaked,
                access_level: accessLevel,
            };

            if (dropType === 'bundle') {
                body.title = title;
                body.description = description;
                body.items = items.filter(i => i.url && i.label).map(({ label, url, isSpotlight }) => ({ label, url, is_spotlight: isSpotlight }));
                body.theme_color = themeColor;
                body.bg_color = bgColor;
                body.text_color = textColor;
                body.title_color = titleColor;
                body.card_color = cardColor;
            } else {
                body.long_url = longUrl;
            }

            const res = await fetch(endpoint, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || "Update failed");
            }
            const data = await res.json();
            setResult(data);

            if (data.slug !== initialSlug) {
                window.history.replaceState(null, "", `/edit/${data.slug}`);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const canEdit = userRole === 'owner' || userRole === 'manager' || accessLevel === 'edit';
    const isOwner = userRole === 'owner';
    const activeToken = inviteRole === 'manager' ? managerToken : analystToken;

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="relative min-h-screen bg-background text-foreground font-sans selection:bg-neon/30 overflow-hidden">
            <ModernBackground themeColor={themeColor} bgColor={bgColor} />

            <Navbar>
                <div className="flex items-center gap-2 md:gap-4 h-full">
                    <Link
                        href="/"
                        className="p-2.5 rounded-xl bg-glass-fill border border-glass-stroke text-primary/60 hover:text-primary hover:bg-glass-stroke transition-all"
                        title={lang === 'en' ? 'Back to Home' : 'ወደ መጀመሪያው ተመለስ'}
                    >
                        <Globe size={18} strokeWidth={2.5} />
                    </Link>

                    <Link
                        href="/dashboard"
                        className="p-2.5 rounded-xl bg-glass-fill border border-glass-stroke text-primary/60 hover:text-primary hover:bg-glass-stroke transition-all"
                        title={lang === 'en' ? 'Back to Dashboard' : 'ወደ ዳሽቦርድ ተመለስ'}
                    >
                        <LayoutDashboard size={18} strokeWidth={2.5} />
                    </Link>

                    {/* Mode Toggle Hub */}
                    <div className="flex bg-glass-fill/50 p-1 rounded-2xl border border-glass-stroke backdrop-blur-md">
                        <button
                            onClick={() => setActiveTab("edit")}
                            className={cn(
                                "px-4 md:px-6 py-2 rounded-xl text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2.5",
                                activeTab === "edit"
                                    ? "bg-primary text-background shadow-[0_0_20px_rgba(var(--primary),0.3)]"
                                    : "text-primary/60 hover:text-primary hover:bg-glass-stroke"
                            )}
                        >
                            <Edit3 size={18} strokeWidth={2.5} />
                            <span className="hidden sm:inline">{lang === 'en' ? 'Edit' : 'አስተካክል'}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("preview")}
                            className={cn(
                                "px-4 md:px-6 py-2 rounded-xl text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2.5",
                                activeTab === "preview"
                                    ? "bg-neon text-background shadow-[0_0_20px_rgba(var(--neon),0.3)]"
                                    : "text-primary/60 hover:text-primary hover:bg-glass-stroke"
                            )}
                        >
                            <Eye size={18} strokeWidth={2.5} />
                            <span className="hidden sm:inline">{lang === 'en' ? 'Preview' : 'ቅድመ እይታ'}</span>
                        </button>
                    </div>

                    {/* Secondary Navigation */}
                    <div className="hidden md:flex bg-glass-fill/50 p-1 rounded-2xl border border-glass-stroke backdrop-blur-md">
                        <button
                            onClick={() => router.push(`/stats/${initialSlug}`)}
                            className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 hover:text-primary hover:bg-glass-stroke transition-all flex items-center gap-2"
                            title={lang === 'en' ? 'View Statistics' : 'ስታቲስቲክስ ይመልከቱ'}
                        >
                            <TrendingUp size={16} strokeWidth={2.5} />
                        </button>
                        <button
                            onClick={() => window.open(`${window.location.origin}/${initialSlug}`, '_blank')}
                            className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 hover:text-primary hover:bg-glass-stroke transition-all flex items-center gap-2"
                            title={lang === 'en' ? 'Open Live Page' : 'ቀጥታ ገጹን ክፈት'}
                        >
                            <ExternalLink size={16} strokeWidth={2.5} />
                        </button>
                    </div>

                    {/* Action Hub */}
                    <div className="flex items-center gap-3">
                        {canEdit && (
                            <button
                                onClick={handleSave}
                                disabled={isSaving || (dropType === 'bundle' && (!title || items.filter(i => i.url).length === 0)) || (dropType === 'url' && !longUrl)}
                                className="group relative overflow-hidden bg-primary hover:bg-neon text-background px-5 md:px-8 py-2 md:py-3 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.3em] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 shadow-[0_10px_30px_rgba(var(--primary),0.2)] flex items-center gap-3"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                {isSaving ? (
                                    <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Rocket size={18} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                                )}
                                <span className="hidden sm:inline">{lang === 'en' ? 'Live Now' : 'አሁኑኑ ልቀቅ'}</span>
                                <span className="sm:hidden">{lang === 'en' ? 'Live' : 'ሊቀቅ'}</span>
                            </button>
                        )}

                        {dropType === 'bundle' && (
                            <button
                                onClick={() => setShowShareModal(true)}
                                className="group relative overflow-hidden bg-neon hover:bg-neon/80 text-black px-5 md:px-7 py-2 md:py-3 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.3em] transition-all hover:scale-[1.02] active:scale-95 shadow-[0_10px_30px_rgba(var(--neon),0.2)] flex items-center gap-3"
                            >
                                <Share2 size={18} strokeWidth={2.5} />
                                <span className="hidden sm:inline">{lang === 'en' ? 'Share' : 'አጋራ'}</span>
                            </button>
                        )}
                    </div>
                </div>
            </Navbar>

            <main className="relative z-10 pt-28 pb-32 h-[calc(100vh-112px)] overflow-hidden">
                <div className="max-w-[1400px] mx-auto px-6 h-full grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left: Editor */}
                    <div className={cn(
                        "lg:col-span-7 h-full overflow-y-auto pr-4 custom-scrollbar pb-20",
                        activeTab === 'preview' ? 'hidden lg:block' : 'block'
                    )}>
                        <div className="space-y-12">
                            <div className="flex flex-col gap-2">
                                <span className="text-neon text-[10px] font-black tracking-[0.5em] uppercase">Phase 01</span>
                                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-contrast italic">
                                    {lang === 'en' ? 'Craft your digital identity.' : 'ዲጂታል ማንነትዎን ይገንቡ።'}
                                </h1>
                            </div>

                            {dropType === 'bundle' ? (
                                <BundleBuilder
                                    title={title}
                                    setTitle={setTitle}
                                    description={description}
                                    setDescription={setDescription}
                                    items={items}
                                    setItems={setItems}
                                    lang={lang}
                                    readOnly={!canEdit}
                                />
                            ) : (
                                <div className="space-y-8">
                                    <div className="glass-card p-10 rounded-[40px] border-glass-stroke shadow-xl space-y-8">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                                                <Globe size={20} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black uppercase tracking-widest text-contrast">{lang === 'en' ? 'Target Destination' : 'ዋናው ሊንክ'}</span>
                                                <span className="text-[8px] font-bold text-primary/50 uppercase tracking-[0.2em]">Redirect target node</span>
                                            </div>
                                        </div>
                                        <div className="relative group/input">
                                            <div className="flex items-center bg-glass-fill border-2 border-glass-stroke rounded-[24px] px-8 focus-within:border-primary transition-all">
                                                <Rocket size={16} className="text-primary/20 group-focus-within/input:text-primary mr-4" />
                                                <input
                                                    type="url"
                                                    placeholder="Target URL (e.g. https://google.com)"
                                                    value={longUrl}
                                                    onChange={(e) => setLongUrl(e.target.value)}
                                                    className="flex-1 bg-transparent py-5 text-sm font-black outline-none text-contrast disabled:opacity-50"
                                                    disabled={!canEdit}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Visual Identity - Exact grid parity */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="h-px flex-1 bg-glass-stroke" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/70">Visual Identity</span>
                                    <div className="h-px flex-1 bg-glass-stroke" />
                                </div>

                                <div className="glass-card p-10 rounded-[40px] border-glass-stroke shadow-xl space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                                            <Palette size={20} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black uppercase tracking-widest text-contrast">{lang === 'en' ? 'Core Branding' : 'የብራንድ ቀለም'}</span>
                                            <span className="text-[8px] font-bold text-primary/50 uppercase tracking-[0.2em]">Select your studio accent</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                                        {[
                                            { label: lang === 'en' ? 'Accent' : 'ዋና ቀለም', value: themeColor, setter: setThemeColor, desc: 'Impact' },
                                            { label: lang === 'en' ? 'Background' : 'ዳራ ቀለም', value: bgColor, setter: setBgColor, desc: 'Atmosphere' },
                                            { label: lang === 'en' ? 'Card' : 'ካርድ ቀለም', value: cardColor, setter: setCardColor, desc: 'Node Depth' },
                                            { label: lang === 'en' ? 'Title' : 'የርዕስ ቀለም', value: titleColor, setter: setTitleColor, desc: 'Focus' },
                                            { label: lang === 'en' ? 'Text' : 'የፅሁፍ ቀለም', value: textColor, setter: setTextColor, desc: 'Clarity' }
                                        ].map((c, i) => (
                                            <div key={i} className="space-y-3">
                                                <div className="flex justify-between items-center px-2">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-contrast">{c.label}</span>
                                                    <span className="text-[8px] font-bold text-primary/40 uppercase tracking-widest italic">{c.desc}</span>
                                                </div>
                                                <div className="relative group/color overflow-hidden rounded-[24px] bg-glass-fill border-2 border-glass-stroke hover:border-primary/40 transition-all flex items-center p-1">
                                                    <input
                                                        type="color"
                                                        value={c.value.startsWith('rgba') ? '#ffffff' : c.value}
                                                        onChange={(e) => c.setter(e.target.value)}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                                        disabled={!canEdit}
                                                    />
                                                    <div className="w-12 h-12 rounded-2xl shadow-inner border border-white/5" style={{ backgroundColor: c.value }} />
                                                    <div className="flex-1 px-4">
                                                        <span className="text-xs font-black text-contrast uppercase tracking-tighter block truncate">{c.value}</span>
                                                        <span className="text-[8px] font-bold text-primary/30 uppercase tracking-widest italic">Color State</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="relative group/custom flex items-center bg-glass-fill border-2 border-glass-stroke rounded-[24px] px-8 focus-within:border-primary transition-all max-w-md">
                                        <Palette size={14} className="text-primary/30 mr-4" />
                                        <span className="text-[10px] font-black text-primary/30 mr-4 uppercase">Direct Input</span>
                                        <input
                                            type="text"
                                            placeholder="#HEXCODE"
                                            value={themeColor}
                                            onChange={(e) => setThemeColor(e.target.value)}
                                            className="flex-1 bg-transparent py-5 text-sm font-black outline-none text-contrast uppercase tracking-widest disabled:opacity-50"
                                            disabled={!canEdit}
                                        />
                                        <div className="w-8 h-8 rounded-xl border-2 border-white/10 shadow-lg" style={{ backgroundColor: themeColor }} />
                                    </div>

                                    {/* Image & Media Expansion */}
                                    <div className="pt-8 border-t border-glass-stroke space-y-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-neon/10 flex items-center justify-center text-neon">
                                                <Sparkles size={14} />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-contrast">{lang === 'en' ? 'Media & Identity' : 'ሚዲያ እና ማንነት'}</span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center px-2">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-contrast">{lang === 'en' ? 'Background Image URL' : 'የዳራ ምስል URL'}</span>
                                                    <span className="text-[8px] font-bold text-primary/40 uppercase tracking-[0.2em]">GIF or Image</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={bgImage}
                                                    onChange={(e) => setBgImage(e.target.value)}
                                                    placeholder="https://example.com/background.gif"
                                                    className="w-full bg-glass-fill border-2 border-glass-stroke rounded-2xl px-6 py-4 text-xs font-bold text-contrast focus:border-primary/50 outline-none transition-all placeholder:text-primary/20 disabled:opacity-50"
                                                    disabled={!canEdit}
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center px-2">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-contrast">{lang === 'en' ? 'Custom Profile URL' : 'የፕሮፋይል ምስል URL'}</span>
                                                    <span className="text-[8px] font-bold text-primary/40 uppercase tracking-[0.2em]">Identity</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={profileImage}
                                                    onChange={(e) => setProfileImage(e.target.value)}
                                                    placeholder="https://example.com/me.png"
                                                    className="w-full bg-glass-fill border-2 border-glass-stroke rounded-2xl px-6 py-4 text-xs font-bold text-contrast focus:border-primary/50 outline-none transition-all placeholder:text-primary/20 disabled:opacity-50"
                                                    disabled={!canEdit}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Studio Mastery Section */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="h-px flex-1 bg-glass-stroke" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/70">Studio Mastery</span>
                                    <div className="h-px flex-1 bg-glass-stroke" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                                    {/* SEO Expansion */}
                                    <div className="glass-card p-10 rounded-[40px] border-glass-stroke space-y-8 shadow-xl bg-black/40">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500">
                                                <Share2 size={20} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black uppercase tracking-widest text-contrast">{lang === 'en' ? 'Social Expansion' : 'የሶሻል ሚዲያ መረጃ'}</span>
                                                <span className="text-[8px] font-bold text-orange-500/50 uppercase tracking-[0.2em]">SEO & Social Preview</span>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="relative group/input">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/70 ml-4 mb-2 block">Preview Title</label>
                                                <input
                                                    type="text"
                                                    placeholder="The Ultimate Studio Drop..."
                                                    value={metaTitle}
                                                    onChange={(e) => setMetaTitle(e.target.value)}
                                                    className="w-full bg-glass-fill border-2 border-glass-stroke rounded-[24px] py-5 px-8 text-sm font-bold outline-none focus:border-orange-500 transition-all text-contrast disabled:opacity-50"
                                                    disabled={!canEdit}
                                                />
                                            </div>
                                            <div className="relative group/input">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/70 ml-4 mb-2 block">Social Description</label>
                                                <textarea
                                                    rows={3}
                                                    placeholder="Explore this curated collection of high-performance links..."
                                                    value={metaDescription}
                                                    onChange={(e) => setMetaDescription(e.target.value)}
                                                    className="w-full bg-glass-fill border-2 border-glass-stroke rounded-[24px] py-5 px-8 text-sm font-bold outline-none focus:border-orange-500 transition-all text-contrast resize-none disabled:opacity-50"
                                                    disabled={!canEdit}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Identity & Control */}
                                    <div className="glass-card p-10 rounded-[40px] border-glass-stroke space-y-8 shadow-xl bg-black/40">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                                                <Fingerprint size={20} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black uppercase tracking-widest text-contrast">{lang === 'en' ? 'Identity Control' : 'ደህንነት እና መለያ'}</span>
                                                <span className="text-[8px] font-bold text-primary/50 uppercase tracking-[0.2em]">Access & Security Protocol</span>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="relative group/input">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/70 ml-4 mb-2 block">Custom URL Alias</label>
                                                <div className="flex items-center bg-glass-fill border-2 border-glass-stroke rounded-[24px] px-8 focus-within:border-neon transition-all">
                                                    <Fingerprint size={18} className="text-primary/20 group-focus-within/input:text-neon mr-4" />
                                                    <input
                                                        type="text"
                                                        placeholder="my-studio"
                                                        value={customSlug}
                                                        onChange={(e) => setCustomSlug(e.target.value)}
                                                        className="flex-1 bg-transparent py-5 text-sm font-bold outline-none text-contrast disabled:opacity-50"
                                                        disabled={!canEdit}
                                                    />
                                                </div>
                                            </div>
                                            <div className="relative group/input">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/70 ml-4 mb-2 block">Access Shield (Password)</label>
                                                <div className="flex items-center bg-glass-fill border-2 border-glass-stroke rounded-[24px] px-8 focus-within:border-primary transition-all">
                                                    <Lock size={18} className="text-primary/20 group-focus-within/input:text-primary mr-4" />
                                                    <input
                                                        type="password"
                                                        placeholder="••••••••"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        className="flex-1 bg-transparent py-5 text-sm font-bold outline-none text-contrast disabled:opacity-50"
                                                        disabled={!canEdit}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expiry Protocol */}
                                    <div className="glass-card p-10 rounded-[40px] border-glass-stroke shadow-xl bg-black/40">
                                        <div className="space-y-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3 px-4">
                                                    <Clock size={16} className="text-red-500" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-red-500">{lang === 'en' ? 'Destruction Protocol' : 'የሚጠፋበት ጊዜ'}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {[{ l: "Never", v: 0 }, { l: "1h", v: 3600 }, { l: "24h", v: 86400 }, { l: "Custom", v: -1 }].map(o => (
                                                        <button
                                                            key={o.v}
                                                            onClick={() => setExpiresIn(o.v)}
                                                            disabled={!canEdit}
                                                            className={cn(
                                                                "flex-1 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                                expiresIn === o.v ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "bg-glass-fill text-red-500/60 hover:bg-glass-stroke",
                                                                !canEdit && "opacity-50 cursor-not-allowed"
                                                            )}
                                                        >
                                                            {o.l}
                                                        </button>
                                                    ))}
                                                </div>
                                                {expiresIn === -1 && <input type="datetime-local" value={customExpiry} onChange={(e) => setCustomExpiry(e.target.value)} disabled={!canEdit} className="w-full bg-glass-fill border-2 border-glass-stroke rounded-2xl px-6 py-4 text-xs font-black text-contrast outline-none focus:border-red-500 transition-all mt-4 disabled:opacity-50" />}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Access Limit */}
                                    <div className="glass-card p-10 rounded-[40px] border-glass-stroke shadow-xl bg-black/40">
                                        <div className="space-y-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3 px-4">
                                                    <ShieldAlert size={16} className="text-yellow-500" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-yellow-500">{lang === 'en' ? 'Accessibility Scope' : 'የጠቅታ ገደብ'}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {[{ l: "Unlimited", v: 0 }, { l: "5", v: 5 }, { l: "10", v: 10 }, { l: "50", v: 50 }].map(o => (
                                                        <button
                                                            key={o.v}
                                                            onClick={() => setMaxClicks(o.v)}
                                                            disabled={!canEdit}
                                                            className={cn(
                                                                "flex-1 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                                maxClicks === o.v ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20" : "bg-glass-fill text-yellow-500/60 hover:bg-glass-stroke",
                                                                !canEdit && "opacity-50 cursor-not-allowed"
                                                            )}
                                                        >
                                                            {o.l}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stealth Mode */}
                                    <div className="glass-card p-10 rounded-[40px] border-glass-stroke shadow-xl bg-black/40 group/stealth hover:border-neon/30 transition-all">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "p-3 rounded-2xl transition-all duration-500",
                                                    isCloaked ? "bg-neon/10 text-neon shadow-[0_0_20px_rgba(0,242,255,0.2)]" : "bg-glass-fill text-primary/40"
                                                )}>
                                                    <Shield size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-black text-contrast uppercase tracking-tighter italic">Stealth Protocol</h3>
                                                    <p className="text-[9px] font-bold text-primary/30 uppercase tracking-widest group-hover/stealth:text-neon/50 transition-colors">Enterprise Privacy Mode</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setIsCloaked(!isCloaked)}
                                                disabled={!canEdit}
                                                className={cn(
                                                    "w-14 h-8 rounded-full border-2 transition-all p-1 flex items-center relative",
                                                    isCloaked ? "border-neon bg-neon/10" : "border-glass-stroke bg-glass-fill",
                                                    !canEdit && "opacity-50 cursor-not-allowed"
                                                )}
                                            >
                                                <motion.div
                                                    animate={{ x: isCloaked ? 24 : 0 }}
                                                    className={cn(
                                                        "w-6 h-6 rounded-full shadow-lg",
                                                        isCloaked ? "bg-neon shadow-neon/40" : "bg-primary/20"
                                                    )}
                                                />
                                            </button>
                                        </div>
                                        <p className="mt-6 text-[10px] font-bold text-primary/40 leading-relaxed uppercase tracking-widest italic px-2">
                                            Enable cloaking to mask the source from bots and implement advanced referrer-less redirection protocols.
                                        </p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Live Preview - 100% PARITY WITH create/page.tsx */}
                    <div className={cn(
                        "lg:col-span-5 h-full flex flex-col items-center justify-center relative",
                        activeTab === 'edit' ? 'hidden lg:flex' : 'flex'
                    )}>
                        <div className="absolute top-0 right-0 p-4 hidden lg:flex bg-glass-fill rounded-full border border-glass-stroke gap-2 z-20">
                            {(['mobile', 'tablet', 'desktop'] as const).map(d => (
                                <button
                                    key={d}
                                    onClick={() => setPreviewDevice(d)}
                                    className={cn(
                                        "p-2 rounded-xl transition-all",
                                        previewDevice === d ? "bg-primary text-background" : "text-primary/70 hover:bg-glass-stroke"
                                    )}
                                >
                                    {d === 'mobile' ? <Smartphone size={16} /> : d === 'tablet' ? <Tablet size={16} /> : <Monitor size={16} />}
                                </button>
                            ))}
                        </div>

                        {/* Device Frame - Matching create/page.tsx strictly */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={cn(
                                "relative bg-black rounded-[48px] border-[8px] border-[#222] shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-700",
                                previewDevice === 'mobile' ? 'w-[320px] h-[650px]' : previewDevice === 'tablet' ? 'w-[450px] h-[600px]' : 'w-[600px] h-[400px]'
                            )}
                            style={{ borderColor: themeColor + '30' }}
                        >
                            {/* Inner Screen */}
                            <div className="w-full h-full relative flex flex-col items-center pt-16 pb-12 overflow-y-auto no-scrollbar" style={{ backgroundColor: bgColor }}>
                                {/* Background Image Layer in Preview */}
                                {bgImage && (
                                    <div
                                        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                                        style={{
                                            backgroundImage: `url(${bgImage})`,
                                            opacity: 0.35
                                        }}
                                    />
                                )}
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#222] rounded-full z-20" /> {/* Speaker/Notch */}

                                {/* Dynamic Content */}
                                <div className="relative w-full px-8 space-y-8 flex flex-col items-center z-10">
                                    <div
                                        className="w-24 h-24 rounded-[32px] flex items-center justify-center text-background shadow-xl border border-white/10 transition-colors overflow-hidden z-10"
                                        style={{ backgroundColor: themeColor }}
                                    >
                                        {profileImage ? (
                                            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <Layout size={40} />
                                        )}
                                    </div>

                                    <div className="text-center space-y-2 z-10">
                                        <h3 className="text-2xl font-black tracking-tighter italic" style={{ color: titleColor }}>{dropType === 'bundle' ? (title || (lang === 'en' ? "Your Brand Name" : "የልዩ ስምዎ")) : "DESTINATION NODE"}</h3>
                                        <p className="text-xs font-bold leading-relaxed italic" style={{ color: textColor }}>{dropType === 'bundle' ? (description || (lang === 'en' ? "Professional Identity Studio" : "ፕሮፌሽናል ዲጂታል መለያ")) : "REDETECTED NODE"}</p>
                                    </div>

                                    <div className="w-full space-y-4 z-10">
                                        {dropType === 'bundle' ? items.map((item, i) => {
                                            const platform = getPlatformInfo(item.url);
                                            return (
                                                <div
                                                    key={item.id}
                                                    className={cn(
                                                        "w-full p-4 rounded-3xl border flex items-center justify-between group/preview-item hover:border-white/20 transition-all shadow-lg relative overflow-hidden",
                                                        item.isSpotlight && "border-2"
                                                    )}
                                                    style={{
                                                        backgroundColor: item.isSpotlight ? themeColor + '10' : cardColor,
                                                        borderColor: item.isSpotlight ? themeColor : themeColor + '20'
                                                    }}
                                                >
                                                    {item.isSpotlight && (
                                                        <motion.div
                                                            animate={{ x: ["-100%", "200%"] }}
                                                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 pointer-events-none"
                                                        />
                                                    )}
                                                    <div className="flex items-center gap-4 relative z-10">
                                                        <div
                                                            className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-background transition-colors", platform.color)}
                                                            style={{ backgroundColor: themeColor }}
                                                        >
                                                            <platform.icon size={18} />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: textColor }}>{item.label || "Link Label"}</span>
                                                            {item.isSpotlight && <span className="text-[8px] font-black text-neon uppercase italic tracking-widest" style={{ color: themeColor }}>Spotlight</span>}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 relative z-10">
                                                        {item.isSpotlight && <Sparkles size={12} className="text-neon animate-pulse" style={{ color: themeColor }} />}
                                                        <ArrowRight size={14} className="text-primary/20 group-hover/preview-item:translate-x-1 transition-transform" style={{ color: themeColor }} />
                                                    </div>
                                                </div>
                                            );
                                        }) : (
                                            <div className="p-8 rounded-[32px] border-2 border-neon/20 bg-neon/5 text-center">
                                                <Globe size={32} className="mx-auto text-neon opacity-40 mb-2" />
                                                <p className="text-[10px] font-black text-contrast truncate italic uppercase tracking-widest">{longUrl || "https://..."}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div className="pt-8 border-t border-glass-stroke w-full flex flex-col items-center gap-3">
                                        <span className="text-[8px] font-black uppercase tracking-[0.5em] opacity-50" style={{ color: textColor }}> Powered By ቀላል Link</span>
                                        <Heart size={14} className="text-red-500/40 fill-red-500/20" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            {/* Success Modal - 100% PARITY WITH create/page.tsx */}
            <AnimatePresence>
                {result && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/80 backdrop-blur-xl" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="relative w-full max-w-2xl bg-glass-card p-8 md:p-16 rounded-[48px] border border-neon/40 shadow-[0_50px_100px_rgba(var(--neon),0.2)] text-center overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-neon/10 blur-[100px] -translate-y-1/2 translate-x-1/2" />
                            <div className="relative z-10 space-y-10">
                                <div className="w-24 h-24 rounded-[2.5rem] bg-neon flex items-center justify-center text-background mx-auto shadow-[0_0_30px_rgba(var(--accent-neon),0.5)]">
                                    <Check size={48} />
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-contrast italic uppercase leading-none">
                                        Studio Masterpiece <br /> <span className="text-neon">SYNCHRONIZED</span>
                                    </h2>
                                    <p className="text-primary/80 font-medium text-lg italic">Your professional identity evolution is complete and live across the digital landscape.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-glass-fill rounded-[32px] p-8 border-2 border-neon flex items-center justify-between gap-6 group">
                                        <div className="flex-1 text-left">
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 block mb-2">STUDIO LINK</span>
                                            <span className="text-xl md:text-2xl font-black tracking-tighter text-contrast truncate select-all">{`${window.location.host}/${dropType === 'bundle' ? 'bundle/' : ''}${decodeURIComponent(result.slug)}`}</span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(`${window.location.protocol}//${window.location.host}/${dropType === 'bundle' ? 'bundle/' : ''}${result.slug}`);
                                            }}
                                            className="p-5 rounded-2xl bg-neon text-background hover:scale-110 transition-transform active:scale-95 shadow-lg group-hover:shadow-neon/40"
                                        >
                                            <Copy size={24} />
                                        </button>
                                    </div>

                                    <div className="bg-glass-fill rounded-[32px] p-8 border-2 border-primary/20 flex flex-col items-center gap-6 group">
                                        <div className="relative p-4 bg-white rounded-3xl overflow-hidden shadow-2xl group-hover:scale-105 transition-transform">
                                            <img
                                                src={`${API_URL}/api/qr/${result.slug}?color=${encodeURIComponent(themeColor)}`}
                                                alt="Studio QR"
                                                className="w-32 h-32"
                                            />
                                        </div>
                                        <div className="text-center">
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 block mb-2">DYNAMIC QR STUDIO</span>
                                            <a
                                                href={`${API_URL}/api/qr/${result.slug}?color=${encodeURIComponent(themeColor)}`}
                                                download={`qr-${result.slug}.png`}
                                                className="text-xs font-black text-primary hover:text-neon transition-colors underline underline-offset-4"
                                            >
                                                DOWNLOAD QR
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {dropType === 'bundle' && (
                                    <div className="bg-glass-fill rounded-[32px] p-8 border-2 border-primary/20 flex flex-col items-stretch gap-4 text-left group">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Code size={14} className="text-primary/40" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40">MASTERPIECE EMBED CODE</span>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const code = `<iframe src="${window.location.protocol}//${window.location.host}/bundle/${result.slug}?embed=true" width="100%" height="600px" frameborder="0"></iframe>`;
                                                    navigator.clipboard.writeText(code);
                                                    alert("Embed code copied to clipboard!");
                                                }}
                                                className="text-[10px] font-black text-neon hover:underline"
                                            >
                                                COPY CODE
                                            </button>
                                        </div>
                                        <div className="bg-black/40 p-4 rounded-xl border border-white/5 overflow-hidden">
                                            <code className="text-[10px] font-mono text-primary/60 break-all leading-tight block">
                                                {`<iframe src="${window.location.protocol}//${window.location.host}/bundle/${result.slug}?embed=true" width="100%" height="600px" frameborder="0"></iframe>`}
                                            </code>
                                        </div>
                                        <p className="text-[9px] font-bold text-primary/30 uppercase italic">Paste this snippet into any HTML site or CMS (WordPress, Webflow, etc.)</p>
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                    <Link href={`/${dropType === 'bundle' ? 'bundle/' : ''}${result.slug}`} className="flex-1 bg-white text-black font-black py-6 rounded-[24px] transition-all shadow-xl text-sm uppercase tracking-widest flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95">
                                        View Live Drop <ExternalLink size={18} />
                                    </Link>
                                    <button onClick={() => setResult(null)} className="flex-1 bg-glass-fill border border-glass-stroke text-contrast font-black py-6 rounded-[24px] hover:bg-glass-stroke transition-all text-sm uppercase tracking-widest">
                                        Return to Editor
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Share Modal */}
                {showShareModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 overflow-hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowShareModal(false)}
                            className="absolute inset-0 bg-background/80 dark:bg-[#020617]/90 backdrop-blur-3xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="relative w-full max-w-2xl bg-card-bg dark:bg-[#0a0f1e]/80 border border-glass-stroke rounded-[40px] shadow-2xl dark:shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
                            style={{ maxHeight: 'calc(100vh - 40px)' }}
                        >
                            {/* Premium Header Grid */}
                            <div className="relative p-8 pb-4 border-b border-glass-stroke overflow-hidden flex-shrink-0">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon/40 to-transparent" />

                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-neon flex items-center justify-center text-black shadow-lg shadow-neon/20 rotate-3">
                                            <Share2 size={24} strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black uppercase tracking-tighter italic text-contrast flex items-center gap-2">
                                                {lang === 'en' ? 'Studio Access' : 'የስቱዲዮ መግቢያ'}
                                                <span className="text-[10px] font-bold bg-glass-fill border border-glass-stroke px-2 py-0.5 rounded-full text-primary/60 normal-case tracking-normal not-italic ml-2">v4.0 Alpha</span>
                                            </h3>
                                            <p className="text-[10px] font-bold text-primary/40 uppercase tracking-[0.2em] italic">{lang === 'en' ? 'Identity & Collaboration Protocol' : 'የማንነት እና የትብብር ደንብ'}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowShareModal(false)}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-glass-fill border border-glass-stroke text-primary/40 hover:text-contrast hover:bg-glass-stroke transition-all active:scale-95"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Premium Tabs */}
                                <div className="flex items-center gap-1 mt-8 p-1 bg-glass-fill rounded-2xl w-fit border border-glass-stroke">
                                    <button
                                        onClick={() => setShareTab('people')}
                                        className={cn(
                                            "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                                            shareTab === 'people' ? "bg-primary dark:bg-white text-background dark:text-black shadow-lg shadow-primary/10 dark:shadow-white/10" : "text-primary/40 hover:text-primary hover:bg-primary/5"
                                        )}
                                    >
                                        <UsersIcon size={14} />
                                        {lang === 'en' ? 'Collaborators' : 'ተባባሪዎች'}
                                    </button>
                                    <button
                                        onClick={() => setShareTab('settings')}
                                        className={cn(
                                            "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                                            shareTab === 'settings' ? "bg-primary dark:bg-white text-background dark:text-black shadow-lg shadow-primary/10 dark:shadow-white/10" : "text-primary/40 hover:text-primary hover:bg-primary/5"
                                        )}
                                    >
                                        <Shield size={14} />
                                        {lang === 'en' ? 'Permissions' : 'መብቶች'}
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-y-auto no-scrollbar flex-1">
                                <AnimatePresence mode="wait">
                                    {shareTab === 'people' ? (
                                        <motion.div
                                            key="people"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="p-8 space-y-8"
                                        >
                                            {/* Invite Box */}
                                            {isOwner && (
                                                <div className="relative group">
                                                    <div className="absolute -inset-1 bg-gradient-to-r from-neon/10 to-transparent rounded-[32px] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                                                    <div className="relative bg-glass-fill border border-glass-stroke rounded-[28px] p-6 space-y-4 shadow-inner">
                                                        <div className="flex flex-col md:flex-row gap-3">
                                                            <div className="relative flex-1 group/field">
                                                                <UserPlus size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within/field:text-neon transition-colors" />
                                                                <input
                                                                    type="email"
                                                                    placeholder={lang === 'en' ? "Invite by creator email..." : "በኢሜይል ይጋብዙ..."}
                                                                    value={inviteEmail}
                                                                    onChange={(e) => setInviteEmail(e.target.value)}
                                                                    className="w-full bg-input-bg border-2 border-transparent focus:border-neon/30 rounded-2xl py-4 pl-14 pr-4 text-xs font-bold outline-none transition-all text-contrast"
                                                                />
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <div className="relative">
                                                                    <select
                                                                        value={inviteRole}
                                                                        onChange={(e) => setInviteRole(e.target.value)}
                                                                        className="h-[56px] bg-input-bg border-2 border-transparent hover:border-glass-stroke rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest text-primary/60 outline-none focus:border-neon/30 appearance-none cursor-pointer pr-10"
                                                                    >
                                                                        <option value="manager">{lang === 'en' ? 'Manager' : 'አስተዳዳሪ'}</option>
                                                                        <option value="analyst">{lang === 'en' ? 'Analyst' : 'ተንታኝ'}</option>
                                                                    </select>
                                                                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/40 pointer-events-none" />
                                                                </div>
                                                                <button
                                                                    onClick={handleInvite}
                                                                    disabled={isInviting || !inviteEmail}
                                                                    className="bg-neon text-black px-8 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all hover:scale-[1.05] active:scale-95 disabled:opacity-50 shadow-xl shadow-neon/20 h-[56px] flex items-center justify-center min-w-[120px]"
                                                                >
                                                                    {isInviting ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : (lang === 'en' ? "Invite" : "ጋብዝ")}
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <p className="text-[10px] font-bold text-primary/30 uppercase italic px-2">
                                                            {inviteRole === 'manager'
                                                                ? (lang === 'en' ? 'Managers have full edit access and can manage other collaborators' : 'አስተዳዳሪዎች ሙሉ የማስተካከያ እና የተባባሪዎችን የማስተዳደር መብት አላቸው')
                                                                : (lang === 'en' ? 'Analysts can only view engagement statistics and real-time data' : 'ተንታኞች ስታቲስቲክስን እና የቀጥታ መረጃዎችን ብቻ ማየት ይችላሉ')}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Creators List */}
                                            <div className="space-y-4 pt-4">
                                                <div className="flex items-center justify-between px-2">
                                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">{lang === 'en' ? 'Authorized Entities' : 'የተፈቀደላቸው አካላት'}</h4>
                                                    <span className="text-[9px] font-bold text-neon/60 bg-neon/5 px-2 py-0.5 rounded-md border border-neon/10">{collaborators.length + 1} {lang === 'en' ? 'Active' : 'ገባሪ'}</span>
                                                </div>

                                                <div className="grid gap-2">
                                                    {/* Owner Identity */}
                                                    <div className="flex items-center justify-between p-5 rounded-[28px] bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 group relative overflow-hidden">
                                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                                            <Sparkles size={60} strokeWidth={1} className="text-primary" />
                                                        </div>
                                                        <div className="flex items-center gap-4 relative z-10">
                                                            <div className="w-14 h-14 rounded-2xl bg-primary text-background flex items-center justify-center shadow-xl shadow-primary/20 rotate-1">
                                                                <Sparkles size={24} strokeWidth={2.5} />
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <p className="text-sm font-black text-contrast tracking-tight italic">{user?.email}</p>
                                                                    <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[8px] font-black text-primary uppercase tracking-widest">{lang === 'en' ? 'Root' : 'ባለቤት'}</span>
                                                                </div>
                                                                <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest italic mt-0.5">{lang === 'en' ? 'Primary Studio Owner' : 'ዋናው የስቱዲዮ ባለቤት'}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Collaborators Flow */}
                                                    {collaborators.map((col) => (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            key={col.id}
                                                            className="flex items-center justify-between p-5 rounded-[28px] hover:bg-glass-fill border border-transparent hover:border-glass-stroke transition-all group/user"
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-14 h-14 rounded-2xl bg-glass-fill border border-glass-stroke flex items-center justify-center overflow-hidden shadow-inner font-black text-neon text-lg relative group-hover/user:border-neon/30 transition-colors">
                                                                    {col.collaborator_pic ? (
                                                                        <img src={col.collaborator_pic} alt="" className="w-full h-full object-cover opacity-80 group-hover/user:opacity-100 transition-opacity" />
                                                                    ) : col.collaborator_email[0].toUpperCase()}
                                                                    {col.role === 'manager' && (
                                                                        <div className="absolute -bottom-1 -right-1 p-1 bg-background border border-white/10 rounded-lg text-neon shadow-lg">
                                                                            <Shield size={10} strokeWidth={3} />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <p className="text-sm font-black text-contrast tracking-tight italic">{col.collaborator_name || col.collaborator_email.split('@')[0]}</p>
                                                                        <span className={cn(
                                                                            "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border",
                                                                            col.role === 'manager' ? "bg-neon/10 border-neon/20 text-neon" : "bg-primary/10 border-primary/20 text-primary"
                                                                        )}>
                                                                            {col.role === 'manager' ? (lang === 'en' ? 'Manager' : 'አስተዳዳሪ') : (lang === 'en' ? 'Analyst' : 'ተንታኝ')}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-[10px] font-bold text-primary/30 uppercase italic mt-0.5">{col.collaborator_email}</p>
                                                                </div>
                                                            </div>
                                                            {isOwner && (
                                                                <button
                                                                    onClick={() => handleRemoveCollaborator(col.id)}
                                                                    className="opacity-0 group-hover/user:opacity-100 w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-500/10 rounded-xl transition-all active:scale-95"
                                                                    title="Revoke access"
                                                                >
                                                                    <X size={18} />
                                                                </button>
                                                            )}
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="settings"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="p-8 space-y-8"
                                        >
                                            <div className="bg-glass-fill border border-glass-stroke rounded-[32px] overflow-hidden">
                                                <div className="p-8 border-b border-glass-stroke bg-gradient-to-br from-glass-fill to-transparent">
                                                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                                                        <div className="flex gap-5 items-start">
                                                            <div className={cn(
                                                                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 shadow-2xl relative",
                                                                accessLevel === 'restricted' ? "bg-red-500/20 text-red-500 shadow-red-500/10" : "bg-neon/20 text-neon shadow-neon/10"
                                                            )}>
                                                                <div className="absolute inset-0 bg-current opacity-10 blur-xl animate-pulse" />
                                                                {accessLevel === 'restricted' ? <Lock size={28} strokeWidth={2.5} className="relative z-10" /> : <Globe size={28} strokeWidth={2.5} className="relative z-10" />}
                                                            </div>
                                                            <div className="space-y-1.5 pt-1">
                                                                <div className="relative group/select">
                                                                    <select
                                                                        value={accessLevel}
                                                                        onChange={(e) => handleAccessLevelChange(e.target.value)}
                                                                        disabled={!isOwner}
                                                                        className="bg-transparent border-none text-sm font-black text-contrast outline-none cursor-pointer hover:text-neon transition-colors uppercase tracking-widest py-1 disabled:opacity-50 disabled:cursor-not-allowed appearance-none pr-8"
                                                                    >
                                                                        <option value="restricted" className="bg-background">{lang === 'en' ? 'Private Protocol' : 'የተዘጋ መግቢያ'}</option>
                                                                        <option value="view" className="bg-background">{lang === 'en' ? 'Public (View Only)' : 'ለማንኛውም ሰው (ማየት)'}</option>
                                                                        <option value="edit" className="bg-background">{lang === 'en' ? 'Public (Allow Edits)' : 'ለማንኛውም ሰው (ማስተካከል)'}</option>
                                                                    </select>
                                                                    <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-primary/40 group-hover/select:text-neon transition-colors" />
                                                                </div>
                                                                <p className="text-[10px] font-bold text-primary/40 uppercase italic leading-relaxed max-w-[320px]">
                                                                    {accessLevel === 'restricted'
                                                                        ? (lang === 'en' ? "Only authorized entities can access this studio drop" : "ተፈቀደላቸው አካላት ብቻ በዚህ ስቱዲዮ ውስጥ መግባት ይችላሉ")
                                                                        : (lang === 'en' ? "Anyone with the frequency link can access this studio drop" : "ይህ ሊንክ ያለው ማንኛውም የኢንተርኔት ተጠቃሚ ስቱዲዮውን ማግኘት ይችላል")}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-8 space-y-6">
                                                    <div className="flex flex-col gap-4">
                                                        <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 px-2">{lang === 'en' ? 'Studio Invite Link' : 'የስቱዲዮ መጋበዣ ሊንክ'}</h5>
                                                        <div className="relative flex items-center">
                                                            <div className="flex-1 bg-input-bg border border-glass-stroke rounded-2xl px-5 py-4 text-[11px] font-mono text-primary/60 truncate italic">
                                                                {`${window.location.protocol}//${window.location.host}/edit/${initialSlug}${activeToken ? `?token=${activeToken}` : ''}`}
                                                            </div>
                                                            <div className="absolute right-2 flex gap-2">
                                                                <button
                                                                    onClick={() => {
                                                                        const url = `${window.location.protocol}//${window.location.host}/edit/${initialSlug}${activeToken ? `?token=${activeToken}` : ''}`;
                                                                        navigator.clipboard.writeText(url);
                                                                        setShowCopied(true);
                                                                        setTimeout(() => setShowCopied(false), 2000);
                                                                    }}
                                                                    className={cn(
                                                                        "w-12 h-12 flex items-center justify-center rounded-xl transition-all relative overflow-hidden",
                                                                        showCopied ? "bg-neon text-black" : "bg-glass-fill border border-glass-stroke text-contrast hover:bg-glass-stroke"
                                                                    )}
                                                                >
                                                                    <AnimatePresence mode="wait">
                                                                        {showCopied ? (
                                                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} key="check">
                                                                                <Check size={20} strokeWidth={3} />
                                                                            </motion.div>
                                                                        ) : (
                                                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} key="link">
                                                                                <Link2 size={20} strokeWidth={2.5} />
                                                                            </motion.div>
                                                                        )}
                                                                    </AnimatePresence>
                                                                </button>
                                                                <Link
                                                                    href={`/edit/${initialSlug}${activeToken ? `?token=${activeToken}` : ''}`}
                                                                    target="_blank"
                                                                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-glass-fill border border-glass-stroke text-contrast hover:bg-glass-stroke transition-all"
                                                                >
                                                                    <ExternalLink size={20} strokeWidth={2.5} />
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                                        <div className="p-6 rounded-[28px] bg-glass-fill border border-glass-stroke space-y-2">
                                                            <div className="flex items-center gap-3 text-neon">
                                                                <Clock size={16} />
                                                                <span className="text-[10px] font-black uppercase tracking-widest">{lang === 'en' ? 'Expiry Pulse' : 'የማብቂያ ጊዜ'}</span>
                                                            </div>
                                                            <p className="text-[11px] font-bold text-contrast">{expiresAt ? new Date(expiresAt).toLocaleString() : (lang === 'en' ? 'No Expiry Set' : 'ገደብ የለውም')}</p>
                                                        </div>
                                                        <div className="p-6 rounded-[28px] bg-glass-fill border border-glass-stroke space-y-2">
                                                            <div className="flex items-center gap-3 text-primary">
                                                                <Fingerprint size={16} />
                                                                <span className="text-[10px] font-black uppercase tracking-widest">{lang === 'en' ? 'Access Shield' : 'የጥበቃ ዘዴ'}</span>
                                                            </div>
                                                            <p className="text-[11px] font-bold text-contrast">{password ? 'ENCRYPTED' : (lang === 'en' ? 'Open Access' : 'ክፍት')}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="p-8 bg-card-bg dark:bg-[#0a0f1e]/80 border-t border-glass-stroke flex items-center justify-between gap-4 flex-shrink-0">
                                <p className="hidden sm:block text-[9px] font-bold text-primary/30 uppercase tracking-[0.3em] italic">
                                    {lang === 'en' ? 'Studio Handshake Secured • Kelal Protocol 4.0' : 'የተጠበቀ የስቱዲዮ መግቢያ • ኬላ ፕሮቶኮል 4.0'}
                                </p>
                                <div className="flex gap-3 w-full sm:w-auto">
                                    <button
                                        onClick={() => setShowShareModal(false)}
                                        className="flex-1 sm:flex-none px-10 py-4 rounded-2xl bg-primary dark:bg-white text-background dark:text-black text-[11px] font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/10 dark:shadow-white/5"
                                    >
                                        {lang === 'en' ? 'Done' : 'ተጠናቋል'}
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
