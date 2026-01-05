"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft, Edit3, Eye, Rocket, Layout, Clock, ShieldAlert, Heart,
    Smartphone, Tablet, Monitor, Fingerprint, Lock, ArrowRight, Check, Sparkles, Globe, Palette, Share2, Copy, ExternalLink,
    Code
} from "lucide-react";
import { UserMenu } from "@/components/user-menu";
import { useAuth } from "@/components/auth-context";
import { ModernBackground } from "@/components/modern-background";
import { BundleBuilder } from "@/components/bundle-builder";
import { getPlatformInfo } from "@/lib/platforms";
import React from "react";
import { cn } from "@/lib/utils";
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function EditDropPage() {
    const { slug: initialSlug } = useParams();
    const router = useRouter();
    const { token } = useAuth();

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

    useEffect(() => {
        const savedLang = localStorage.getItem("app_lang");
        if (savedLang === "am" || savedLang === "en") setLang(savedLang as any);

        const fetchDrop = async () => {
            try {
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

                if (data.type === 'bundle') {
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
    }, [initialSlug, token, router]);

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

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="relative min-h-screen bg-background text-foreground font-sans selection:bg-neon/30 overflow-hidden">
            <ModernBackground themeColor={themeColor} bgColor={bgColor} />

            {/* Top Navigation - Exact parity with create/page.tsx */}
            <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-background/5 backdrop-blur-xl border-b border-glass-stroke">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push(token ? "/dashboard" : "/")}
                        className="p-3 rounded-2xl bg-glass-fill hover:bg-glass-stroke transition-colors text-primary/80 hover:text-primary"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="h-8 w-px bg-glass-stroke hidden md:block" />
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-widest text-contrast">{lang === 'en' ? 'Bundle Studio' : 'የጥቅል ስቱዲዮ'}</h2>
                        <p className="text-[8px] font-black text-neon tracking-[0.5em] uppercase opacity-80">UNCONSCIOUS BRANDING V1</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex bg-glass-fill p-1 rounded-2xl border border-glass-stroke">
                        <button
                            onClick={() => setActiveTab("edit")}
                            className={cn("px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2", activeTab === "edit" ? "bg-primary text-background shadow-lg" : "text-primary/70 hover:text-primary")}
                        >
                            <Edit3 size={14} /> {lang === 'en' ? 'Edit' : 'አስተካክል'}
                        </button>
                        <button
                            onClick={() => setActiveTab("preview")}
                            className={cn("px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2", activeTab === "preview" ? "bg-neon text-background shadow-lg shadow-neon/20" : "text-primary/70 hover:text-primary")}
                        >
                            <Eye size={14} /> {lang === 'en' ? 'Preview' : 'ቅድመ እይታ'}
                        </button>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || (dropType === 'bundle' && (!title || items.filter(i => i.url).length === 0)) || (dropType === 'url' && !longUrl)}
                        className="bg-primary hover:bg-neon hover:text-black hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 text-background px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary/20 flex items-center gap-2"
                    >
                        {isSaving ? <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" /> : <Rocket size={16} />}
                        {lang === 'en' ? 'Live Now' : 'አሁኑኑ ልቀቅ'}
                    </button>
                    <UserMenu />
                </div>
            </nav>

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
                                                    className="flex-1 bg-transparent py-5 text-sm font-black outline-none text-contrast"
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
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
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
                                            className="flex-1 bg-transparent py-5 text-sm font-black outline-none text-contrast uppercase tracking-widest"
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
                                                    className="w-full bg-glass-fill border-2 border-glass-stroke rounded-2xl px-6 py-4 text-xs font-bold text-contrast focus:border-primary/50 outline-none transition-all placeholder:text-primary/20"
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
                                                    className="w-full bg-glass-fill border-2 border-glass-stroke rounded-2xl px-6 py-4 text-xs font-bold text-contrast focus:border-primary/50 outline-none transition-all placeholder:text-primary/20"
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
                                                    className="w-full bg-glass-fill border-2 border-glass-stroke rounded-[24px] py-5 px-8 text-sm font-bold outline-none focus:border-orange-500 transition-all text-contrast"
                                                />
                                            </div>
                                            <div className="relative group/input">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/70 ml-4 mb-2 block">Social Description</label>
                                                <textarea
                                                    rows={3}
                                                    placeholder="Explore this curated collection of high-performance links..."
                                                    value={metaDescription}
                                                    onChange={(e) => setMetaDescription(e.target.value)}
                                                    className="w-full bg-glass-fill border-2 border-glass-stroke rounded-[24px] py-5 px-8 text-sm font-bold outline-none focus:border-orange-500 transition-all text-contrast resize-none"
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
                                                        className="flex-1 bg-transparent py-5 text-sm font-bold outline-none text-contrast"
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
                                                        className="flex-1 bg-transparent py-5 text-sm font-bold outline-none text-contrast"
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
                                                            className={cn(
                                                                "flex-1 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                                expiresIn === o.v ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "bg-glass-fill text-red-500/60 hover:bg-glass-stroke"
                                                            )}
                                                        >
                                                            {o.l}
                                                        </button>
                                                    ))}
                                                </div>
                                                {expiresIn === -1 && <input type="datetime-local" value={customExpiry} onChange={(e) => setCustomExpiry(e.target.value)} className="w-full bg-glass-fill border-2 border-glass-stroke rounded-2xl px-6 py-4 text-xs font-black text-contrast outline-none focus:border-red-500 transition-all mt-4" />}
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
                                                            className={cn(
                                                                "flex-1 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                                maxClicks === o.v ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20" : "bg-glass-fill text-yellow-500/60 hover:bg-glass-stroke"
                                                            )}
                                                        >
                                                            {o.l}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
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
            </AnimatePresence>
        </div>
    );
}
