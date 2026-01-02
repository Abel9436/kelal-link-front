"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft, Smartphone, Layout, Rocket,
    Sparkles, Eye, Edit3, Check, Globe,
    ArrowRight, Github, Linkedin, Twitter, Instagram,
    Clock, Lock, ShieldAlert, Monitor, Tablet, Fingerprint,
    Heart
} from "lucide-react";
import { ModernBackground } from "@/components/modern-background";
import { BundleBuilder } from "@/components/bundle-builder";
import { getPlatformInfo } from "@/lib/platforms";
import React from "react";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function CreateBundlePage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [items, setItems] = useState([{ id: "1", label: "", url: "" }]);
    const [customSlug, setCustomSlug] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
    const [lang, setLang] = useState<"en" | "am">("en");
    const [expiresIn, setExpiresIn] = useState(0);
    const [customExpiry, setCustomExpiry] = useState("");
    const [maxClicks, setMaxClicks] = useState(0);
    const [password, setPassword] = useState("");
    const [previewDevice, setPreviewDevice] = useState<"mobile" | "tablet" | "desktop">("mobile");

    useEffect(() => {
        const savedLang = localStorage.getItem("app_lang");
        if (savedLang === "am" || savedLang === "en") setLang(savedLang);
    }, []);

    const handleCreate = async () => {
        setIsLoading(true);
        setError("");
        try {
            const res = await fetch(`${API_URL}/bundle`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    items: items.filter(i => i.url && i.label).map(({ label, url }) => ({ label, url })),
                    custom_slug: customSlug || undefined,
                    max_clicks: maxClicks > 0 ? maxClicks : undefined,
                    expires_in: expiresIn > 0 ? expiresIn : undefined,
                    expires_at: (expiresIn === -1 && customExpiry) ? new Date(customExpiry).toISOString() : undefined,
                    password: password || undefined,
                }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || "Creation failed");
            }
            const data = await res.json();
            setResult(data);

            // Add to history
            const saved = localStorage.getItem("recent_urls");
            const history = saved ? JSON.parse(saved) : [];
            const updated = [data, ...history.filter((u: any) => u.slug !== data.slug)];
            localStorage.setItem("recent_urls", JSON.stringify(updated.slice(0, 50)));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-background text-foreground font-sans selection:bg-neon/30 overflow-hidden">
            <ModernBackground />

            {/* Top Navigation */}
            <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-background/5 backdrop-blur-xl border-b border-glass-stroke">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push("/")}
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
                        onClick={handleCreate}
                        disabled={isLoading || !title || items.filter(i => i.url).length === 0}
                        className="bg-primary hover:bg-neon hover:text-black hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 text-background px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary/20 flex items-center gap-2"
                    >
                        {isLoading ? <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" /> : <Rocket size={16} />}
                        {lang === 'en' ? 'Live Now' : 'አሁኑኑ ልቀቅ'}
                    </button>
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

                            <BundleBuilder
                                title={title}
                                setTitle={setTitle}
                                description={description}
                                setDescription={setDescription}
                                items={items}
                                setItems={setItems}
                                lang={lang}
                            />

                            {/* Advanced Settings */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="h-px flex-1 bg-glass-stroke" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/70">Studio Mastery</span>
                                    <div className="h-px flex-1 bg-glass-stroke" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Alias & Password */}
                                    <div className="glass-card p-8 rounded-[40px] border-glass-stroke space-y-6 shadow-xl">
                                        <div className="space-y-4">
                                            <div className="relative group/input">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/80 ml-4 mb-2 block">
                                                    {lang === 'en' ? 'Custom URL Alias' : 'የራስዎ የሊንክ ስም'}
                                                </label>
                                                <div className="flex items-center bg-glass-fill border-2 border-glass-stroke rounded-2xl px-6 focus-within:border-neon transition-all">
                                                    <Fingerprint size={16} className="text-primary/20 group-focus-within/input:text-neon" />
                                                    <input
                                                        type="text"
                                                        placeholder="my-hub"
                                                        value={customSlug}
                                                        onChange={(e) => setCustomSlug(e.target.value)}
                                                        className="flex-1 bg-transparent py-4 pl-4 text-sm font-bold outline-none text-contrast"
                                                    />
                                                </div>
                                            </div>

                                            <div className="relative group/input">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/80 ml-4 mb-2 block">
                                                    {lang === 'en' ? 'Password Protect' : 'የይለፍ ቃል'}
                                                </label>
                                                <div className="flex items-center bg-glass-fill border-2 border-glass-stroke rounded-2xl px-6 focus-within:border-primary transition-all">
                                                    <Lock size={16} className="text-primary/20 group-focus-within/input:text-primary" />
                                                    <input
                                                        type="password"
                                                        placeholder="••••••••"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        className="flex-1 bg-transparent py-4 pl-4 text-sm font-bold outline-none text-contrast"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expiration & Limits */}
                                    <div className="glass-card p-8 rounded-[40px] border-glass-stroke space-y-6 shadow-xl">
                                        <div className="space-y-6">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 px-4">
                                                    <Clock size={12} className="text-primary/60" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/70">{lang === 'en' ? 'Destruction Protocol' : 'የሚጠፋበት ጊዜ'}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {[{ l: "Never", v: 0 }, { l: "1h", v: 3600 }, { l: "24h", v: 86400 }, { l: "C", v: -1 }].map(o => (
                                                        <button
                                                            key={o.v}
                                                            onClick={() => setExpiresIn(o.v)}
                                                            className={cn(
                                                                "flex-1 md:flex-initial px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                                                                expiresIn === o.v ? "bg-primary text-background shadow-lg" : "bg-glass-fill text-primary/80 hover:bg-glass-stroke"
                                                            )}
                                                        >
                                                            {o.l}
                                                        </button>
                                                    ))}
                                                </div>
                                                {expiresIn === -1 && <input type="datetime-local" value={customExpiry} onChange={(e) => setCustomExpiry(e.target.value)} className="w-full bg-glass-fill border border-glass-stroke rounded-xl px-4 py-3 text-[10px] font-black text-primary outline-none" />}
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 px-4">
                                                    <ShieldAlert size={12} className="text-primary/60" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/70">{lang === 'en' ? 'Access Limit' : 'የጠቅታ ገደብ'}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {[{ l: "Unlimited", v: 0 }, { l: "5", v: 5 }, { l: "10", v: 10 }, { l: "50", v: 50 }].map(o => (
                                                        <button
                                                            key={o.v}
                                                            onClick={() => setMaxClicks(o.v)}
                                                            className={cn(
                                                                "flex-1 md:flex-initial px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                                                                maxClicks === o.v ? "bg-primary text-background shadow-lg" : "bg-glass-fill text-primary/80 hover:bg-glass-stroke"
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

                    {/* Right: Live Preview */}
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

                        {/* Device Frame */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={cn(
                                "relative bg-black rounded-[48px] border-[8px] border-[#222] shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-700",
                                previewDevice === 'mobile' ? 'w-[320px] h-[650px]' : previewDevice === 'tablet' ? 'w-[450px] h-[600px]' : 'w-[600px] h-[400px]'
                            )}
                        >
                            {/* Inner Screen */}
                            <div className="w-full h-full bg-background relative flex flex-col items-center pt-16 pb-12 overflow-y-auto no-scrollbar">
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#222] rounded-full z-20" /> {/* Speaker/Notch */}

                                {/* Dynamic Content */}
                                <div className="w-full px-8 space-y-8 flex flex-col items-center">
                                    <div className="w-24 h-24 rounded-[32px] bg-primary/20 flex items-center justify-center text-primary shadow-xl border border-primary/30">
                                        <Layout size={40} />
                                    </div>

                                    <div className="text-center space-y-2">
                                        <h3 className="text-2xl font-black tracking-tighter text-contrast">{title || (lang === 'en' ? "Your Brand Name" : "የልዩ ስምዎ")}</h3>
                                        <p className="text-xs font-bold text-primary/80 leading-relaxed italic">{description || (lang === 'en' ? "Professional Identity Studio" : "ፕሮፌሽናል ዲጂታል መለያ")}</p>
                                    </div>

                                    <div className="w-full space-y-4">
                                        {items.map((item, i) => {
                                            const platform = getPlatformInfo(item.url);
                                            return (
                                                <div
                                                    key={item.id}
                                                    className="w-full p-4 rounded-3xl bg-glass-fill border border-glass-stroke flex items-center justify-between"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={cn("w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary", platform.color)}>
                                                            <platform.icon size={18} />
                                                        </div>
                                                        <span className="text-[11px] font-black uppercase tracking-widest text-primary/80">{item.label || "Link Label"}</span>
                                                    </div>
                                                    <ArrowRight size={14} className="text-primary/20" />
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Footer */}
                                    <div className="pt-8 border-t border-glass-stroke w-full flex flex-col items-center gap-3">
                                        <span className="text-[8px] font-black uppercase tracking-[0.5em] text-primary/80"> Powered By ቀላል Link</span>
                                        <Heart size={14} className="text-red-500/40 fill-red-500/20" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

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
                                        Studio Masterpiece <br /> <span className="text-neon">IS LIVE</span>
                                    </h2>
                                    <p className="text-primary/80 font-medium text-lg italic">Your professional link hub is ready to dominate the digital landscape.</p>
                                </div>
                                <div className="bg-glass-fill rounded-[32px] p-8 border-2 border-neon flex items-center justify-between gap-6 group">
                                    <span className="text-xl md:text-2xl font-black tracking-tighter text-contrast truncate select-all">{`${window.location.host}/bundle/${result.slug}`}</span>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(`${window.location.protocol}//${window.location.host}/bundle/${result.slug}`);
                                            router.push(`/bundle/${result.slug}`);
                                        }}
                                        className="p-5 rounded-2xl bg-neon text-background hover:scale-110 transition-transform active:scale-95 shadow-lg"
                                    >
                                        <ArrowRight size={24} />
                                    </button>
                                </div>
                                <button onClick={() => setResult(null)} className="text-[10px] font-black uppercase tracking-[0.6em] text-primary/80 hover:text-primary transition-colors">Return to Studio</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
