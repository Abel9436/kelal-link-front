"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Link2, Copy, ExternalLink, BarChart2, Check,
    Zap, Shield, Moon, Sun, ArrowRight, Sparkles,
    MousePointer2, Fingerprint, Clock, ShieldAlert, Trash2,
    Lock, Unlock, Share2, Send, QrCode, Activity, Plus, Layers
} from "lucide-react";
import { useTheme } from "next-themes";
import { ModernBackground } from "@/components/modern-background";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const AMHARIC_CHARS = "ሀለሐመሠረሰሸቀበተቸኀነኘአከኸወዐዘዠየደጀገጠጨጰጸፀፈፐ";

const TRANSLATIONS = {
    en: {
        logo: "LINK",
        heroPre: "#ETHIOPIAN-NATIVE-LINKING",
        heroTitle1: "NEXT GEN",
        heroTitle2: "FIDEL",
        heroTitle3: "SPEED.",
        heroSlogan: "The ultimate link experience rooted in heritage, powered by performance.",
        statSpeed: "FAST",
        statSpeedLabel: "Speed",
        statPrivacy: "SECURE",
        statPrivacyLabel: "Privacy",
        inputLongLabel: "Drop Long Link",
        inputLongPlaceholder: "https://very-long-url.com/...",
        inputAliasLabel: "Fidel Alias (Optional)",
        inputAliasPlaceholder: "e.g. አቢ",
        buttonShorten: "Shorten",
        buttonLoading: "VIBING...",
        historyTitle: "DROPS HISTORY",
        historyVibes: "VIBES",
        historyEmpty: "No links dropped yet",
        sidebarIdentityTitle: "Identity First 🇪🇹",
        sidebarIdentityText: "Built for the high-end movement. We didn't just build a shortener; we built a heritage bridge. Your link is your signature. Make it Amharic. Make it legendary.",
        nativeVibeTitle: "THE NATIVE VIBE",
        nativePerformance: "Performance",
        nativePerformanceVal: "ULTRA FAST",
        nativeAccess: "Access",
        nativeAccessVal: "ALWAYS ON",
        nativeDesign: "Design",
        nativeDesignVal: "MODERN ET",
        scrollHint: "HERITAGE V1 / GEN-Z NATIVE",
        resultReady: "LINK READY / ዝግጁ",
        burnAfter: "Burn After",
        burnManual: "Never",
        burn1h: "1 Hour",
        burn24h: "24 Hours",
        burn7d: "7 Days",
        burnCustom: "Pick Time",
        clicksLimit: "Click Limit",
        clicksUnlimited: "Unlimited",
        destructionTitle: "DESTRUCTION PROTOCOL",
        inputPasswordLabel: "Cipher Key (Optional)",
        inputPasswordPlaceholder: "e.g. secret123",
        shareTitle: "SHARE DROP",
        shareTelegram: "Telegram",
        shareWhatsApp: "WhatsApp",
        shareX: "X (Twitter)",
        copySuccess: "COPIED TO CLIPBOARD",
        filterAll: "ALL",
        filterUrls: "URLS",
        filterBundles: "BUNDLES",
        filterTop: "TOP",
        limitLabel: "LIMIT",
        clearHistory: "CLEAR"
    },
    am: {
        logo: "ሊንክ",
        heroPre: "#የኢትዮጵያ-ተወላጅ-ግንኙነት",
        heroTitle1: "ቀጣይ",
        heroTitle2: "ትውልድ",
        heroTitle3: "ፍጥነት።",
        heroSlogan: "በቅርስ ላይ የተመሰረተ፣ በብቃት የሚመራ የመጨረሻው የሊንክ ተሞክሮ።",
        statSpeed: "ፈጣን",
        statSpeedLabel: "ፍጥነት",
        statPrivacy: "አስተማማኝ",
        statPrivacyLabel: "ግላዊነት",
        inputLongLabel: "ረጅም ሊንክ ያስገቡ",
        inputLongPlaceholder: "https://very-long-url.com/...",
        inputAliasLabel: "የፊደል መጠሪያ (አማራጭ)",
        inputAliasPlaceholder: "ለምሳሌ፡ አቢ",
        buttonShorten: "አሳጥር",
        buttonLoading: "በመስራት ላይ...",
        historyTitle: "የቆዩ ሊንኮች",
        historyVibes: "እይታዎች",
        historyEmpty: "ምንም የተቀየረ ሊንክ የለም",
        sidebarIdentityTitle: "ማንነት ይቀድማል 🇪🇹",
        sidebarIdentityText: "ለከፍተኛ እንቅስቃሴ የተገነባ። እኛ ማሳጠሪያ ብቻ አልገነባንም፤ የቅርስ ድልድይ ገንብተናል። የእርስዎ ሊንክ የእርስዎ ፊርማ ነው። አምሀርኛ ያድርጉት። ትውልድ ተሻጋሪ ያድርጉት።",
        nativeVibeTitle: "የሀገረሰብ ድባብ",
        nativePerformance: "ብቃት",
        nativePerformanceVal: "በጣም ፈጣን",
        nativeAccess: "ተደራሽነት",
        nativeAccessVal: "ሁልጊዜም ዝግጁ",
        nativeDesign: "ንድፍ",
        nativeDesignVal: "ዘመናዊ ኢትዮጵያ",
        scrollHint: "ቅርስ ቅጽ 1 / ዘመናዊ ትውልድ",
        resultReady: "ሊንኩ ዝግጁ ነው",
        burnAfter: "የቆይታ ጊዜ",
        burnManual: "ዘላቂ",
        burn1h: "1 ሰዓት",
        burn24h: "24 ሰዓት",
        burn7d: "7 ቀናት",
        burnCustom: "ጊዜ ምረጥ",
        clicksLimit: "የእይታ ገደብ",
        clicksUnlimited: "ያለገደብ",
        destructionTitle: "የራስ-ጥፋት ፕሮቶኮል",
        inputPasswordLabel: "የይለፍ ቃል (አማራጭ)",
        inputPasswordPlaceholder: "ለምሳሌ፡ ሚስጥር123",
        shareTitle: "ሊንኩን ያጋሩ",
        shareTelegram: "ቴሌግራም",
        shareWhatsApp: "ዋትስአፕ",
        shareX: "ኤክስ (ትዊተር)",
        copySuccess: "ኮፒ ተደርጓል",
        filterAll: "ሁሉም",
        filterUrls: "ሊንኮች",
        filterBundles: "ጥቅሎች",
        filterTop: "ታዋቂ",
        limitLabel: "ገደብ",
        clearHistory: "አጽዳ"
    }
};

export default function Home() {
    const [longUrl, setLongUrl] = useState("");
    const [customSlug, setCustomSlug] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const [recentUrls, setRecentUrls] = useState<any[]>([]);
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [lang, setLang] = useState<"en" | "am">("en");
    const [expiresIn, setExpiresIn] = useState<number>(0);
    const [maxClicks, setMaxClicks] = useState<number>(0);
    const [customExpiry, setCustomExpiry] = useState<string>("");
    const [password, setPassword] = useState("");
    const [isBundleMode, setIsBundleMode] = useState(false);
    const [bundleTitle, setBundleTitle] = useState("");
    const [bundleItems, setBundleItems] = useState([{ label: "", url: "" }]);
    const [showQr, setShowQr] = useState(false);
    const [historyFilter, setHistoryFilter] = useState<"all" | "url" | "bundle" | "top">("all");
    const [historyLimit, setHistoryLimit] = useState(10);

    const clearHistory = () => {
        if (confirm(lang === "en" ? "Clear all local history?" : "ሁሉንም ታሪክ ማጽዳት ይፈልጋሉ?")) {
            setRecentUrls([]);
            localStorage.removeItem("recent_urls");
        }
    };

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem("recent_urls");
        if (saved) setRecentUrls(JSON.parse(saved));
        const savedLang = localStorage.getItem("app_lang");
        if (savedLang === "am" || savedLang === "en") setLang(savedLang);
    }, []);

    const toggleLang = () => {
        const newLang = lang === "en" ? "am" : "en";
        setLang(newLang);
        localStorage.setItem("app_lang", newLang);
    };

    const t = TRANSLATIONS[lang];

    const toggleTheme = () => {
        setIsTransitioning(true);
        const newTheme = resolvedTheme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        setTimeout(() => setIsTransitioning(false), 700);
    };

    const handleShorten = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setResult(null);

        if (isBundleMode) {
            try {
                const res = await fetch(`${API_URL}/bundle`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: bundleTitle,
                        items: bundleItems.filter(i => i.url && i.label)
                    }),
                });
                if (!res.ok) throw new Error("Bundle creation failed");
                const data = await res.json();
                setResult(data);
                setBundleTitle("");
                setBundleItems([{ label: "", url: "" }]);
                setIsBundleMode(false);
                // We add bundles to history too
                const updated = [data, ...recentUrls.filter(u => u.slug !== data.slug)];
                setRecentUrls(updated);
                localStorage.setItem("recent_urls", JSON.stringify(updated.slice(0, 50))); // Store up to 50 items in localStorage
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
            return;
        }

        try {
            const res = await fetch(`${API_URL}/shorten`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    long_url: longUrl,
                    custom_slug: customSlug || undefined,
                    expires_in: expiresIn > 0 ? expiresIn : undefined,
                    expires_at: (expiresIn === -1 && customExpiry) ? new Date(customExpiry).toISOString() : undefined,
                    max_clicks: maxClicks > 0 ? maxClicks : undefined,
                    password: password || undefined,
                }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.detail || "Failed to shorten URL");
            }

            const data = await res.json();
            setResult(data);
            setPassword("");
            const updated = [data, ...recentUrls.filter(u => u.slug !== data.slug)];
            setRecentUrls(updated);
            localStorage.setItem("recent_urls", JSON.stringify(updated.slice(0, 50))); // Store up to 50 items in localStorage
            setLongUrl("");
            setCustomSlug("");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!mounted) return null;

    return (
        <motion.div
            animate={isTransitioning ? {
                x: [0, -8, 12, -10, 8, -4, 0],
                y: [0, 4, -6, 5, -4, 2, 0],
                rotate: [0, -0.5, 0.8, -0.6, 0.4, -0.2, 0],
                scale: [1, 1.01, 0.99, 1.005, 1],
            } : { x: 0, y: 0, rotate: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.36, 0.07, 0.19, 0.97] }}
            className="relative min-h-screen selection:bg-neon/30 font-sans overflow-x-hidden text-foreground transition-colors duration-500 pb-24"
        >
            <ModernBackground />

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 px-4 md:px-6 py-4 flex justify-between items-center bg-background/5 backdrop-blur-md border-b border-foreground/5">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 md:gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-primary flex items-center justify-center text-background font-black text-xl md:text-2xl shadow-xl shadow-primary/20 rotate-3 transform hover:rotate-0 transition-transform">ቀ</div>
                    <span className="font-black text-2xl md:text-3xl tracking-tighter uppercase whitespace-nowrap">
                        ቀላል<span className="text-primary italic underline decoration-neon decoration-4 underline-offset-4">LINK</span>
                    </span>
                </motion.div>

                <div className="flex items-center gap-2 md:gap-4">
                    <button onClick={toggleLang} className="px-4 md:px-6 py-3 md:py-4 rounded-2xl md:rounded-3xl glass-card hover:border-primary/60 transition-all text-primary font-black text-xs uppercase tracking-widest border-2">
                        {lang === "en" ? "AM" : "EN"}
                    </button>
                    <button onClick={toggleTheme} className="p-3 md:p-4 rounded-2xl md:rounded-3xl glass-card hover:border-primary/60 transition-all text-primary border-2">
                        <AnimatePresence mode="wait">
                            <motion.div key={resolvedTheme} initial={{ scale: 0, rotate: -180, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} exit={{ scale: 0, rotate: 180, opacity: 0 }} className="text-primary dark:text-neon">
                                {resolvedTheme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                            </motion.div>
                        </AnimatePresence>
                    </button>
                </div>
            </nav>

            <AnimatePresence>
                {isTransitioning && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 0.4, 0] }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-neon pointer-events-none" />
                )}
            </AnimatePresence>

            <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-28 md:pt-40 pb-20">
                <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-start">
                    {/* Hero Sidebar */}
                    <div className="lg:col-span-1 hidden lg:flex flex-col gap-8 pt-12">
                        {[Sparkles, MousePointer2, Fingerprint, Zap].map((Icon, i) => (
                            <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + (i * 0.1) }} className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center text-primary/40 hover:text-primary transition-colors cursor-help">
                                <Icon size={20} />
                            </motion.div>
                        ))}
                    </div>

                    {/* Main Hero & Input */}
                    <div className="lg:col-span-11 grid lg:grid-cols-2 gap-10 md:gap-16">
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 md:space-y-8">
                            <div className="inline-block px-4 md:px-5 py-2 glass-card rounded-full border-neon/30 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-neon animate-pulse">{t.heroPre}</div>
                            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[0.85] tracking-tighter drop-shadow-2xl text-foreground text-contrast">
                                {t.heroTitle1} <br />
                                <span className="text-primary dark:text-neon italic underline decoration-neon decoration-8 underline-offset-8">{t.heroTitle2}</span> <br />
                                {t.heroTitle3}
                            </h1>
                            <div className="flex gap-4 items-center">
                                <div className="h-0.5 w-8 md:w-12 bg-primary" />
                                <p className="text-lg md:text-xl font-medium text-foreground/60 max-w-sm italic leading-relaxed">{t.heroSlogan}</p>
                            </div>
                            <div className="flex gap-8 md:gap-12 pt-4 md:pt-8">
                                <div className="space-y-1 text-center sm:text-left">
                                    <p className="text-3xl md:text-4xl font-black text-neon text-contrast drop-shadow-[0_0_15px_rgba(var(--accent-neon),0.3)]">{t.statSpeed}</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary dark:text-neon">{t.statSpeedLabel}</p>
                                </div>
                                <div className="space-y-1 text-center sm:text-left">
                                    <p className="text-3xl md:text-4xl font-black text-primary dark:text-foreground text-contrast drop-shadow-lg">{t.statPrivacy}</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary dark:text-neon">{t.statPrivacyLabel}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Input Area */}
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-primary/20 rounded-[40px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="relative glass-card rounded-[36px] p-8 md:p-12 border-foreground/5 overflow-hidden active:scale-[0.99] transition-transform">
                                <div className="flex items-center gap-4 mb-8">
                                    <button type="button" onClick={() => setIsBundleMode(false)} className={cn("flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", !isBundleMode ? "bg-primary text-background shadow-lg" : "bg-primary/10 text-primary hover:bg-primary/20")}>Single Drop</button>
                                    <button type="button" onClick={() => setIsBundleMode(true)} className={cn("flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", isBundleMode ? "bg-neon text-background shadow-lg shadow-neon/20" : "bg-neon/10 text-neon hover:bg-neon/20")}>Bundle (Pro)</button>
                                </div>

                                <form onSubmit={handleShorten} className="space-y-8 relative z-10">
                                    {!isBundleMode ? (
                                        <div className="space-y-4">
                                            <label className="text-sm font-black uppercase tracking-[0.4em] text-neon ml-2">{t.inputLongLabel}</label>
                                            <div className="relative group/field">
                                                <div className="absolute inset-y-0 left-6 flex items-center text-primary group-focus-within/field:text-neon transition-colors z-10"><Link2 size={24} /></div>
                                                <input type="url" required placeholder={t.inputLongPlaceholder} value={longUrl} onChange={(e) => setLongUrl(e.target.value)} className="w-full input-style rounded-[24px] py-7 pl-16 pr-8 text-lg font-bold placeholder:text-foreground/40 outline-none transition-all shadow-inner backdrop-blur-sm relative z-0 border-2 border-primary/40 focus:border-neon text-foreground" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="space-y-4">
                                                <label className="text-sm font-black uppercase tracking-[0.4em] text-neon ml-2">Bundle Name</label>
                                                <input type="text" required placeholder="e.g. My Social Drops" value={bundleTitle} onChange={(e) => setBundleTitle(e.target.value)} className="w-full bg-primary/5 border-2 border-primary/20 rounded-2xl py-4 px-6 font-bold outline-none focus:border-neon" />
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-sm font-black uppercase tracking-[0.4em] text-primary ml-2 italic">Links in Bundle</label>
                                                {bundleItems.map((item, idx) => (
                                                    <div key={idx} className="flex gap-2">
                                                        <input placeholder="Label" value={item.label} onChange={(e) => { const n = [...bundleItems]; n[idx].label = e.target.value; setBundleItems(n); }} className="w-1/3 bg-background/50 border border-primary/20 rounded-xl py-3 px-4 text-xs font-bold outline-none" />
                                                        <input placeholder="URL" value={item.url} onChange={(e) => { const n = [...bundleItems]; n[idx].url = e.target.value; setBundleItems(n); }} className="flex-1 bg-background/50 border border-primary/20 rounded-xl py-3 px-4 text-xs font-bold outline-none" />
                                                    </div>
                                                ))}
                                                <button type="button" onClick={() => setBundleItems([...bundleItems, { label: "", url: "" }])} className="w-full py-2 border-2 border-dashed border-primary/20 rounded-xl text-primary/40 hover:text-primary hover:border-primary/40 transition-all text-[10px] font-black">+ ADD ANOTHER LINK</button>
                                            </div>
                                        </div>
                                    )}

                                    {!isBundleMode && (
                                        <>
                                            <div className="space-y-4">
                                                <label className="text-sm font-black uppercase tracking-[0.4em] text-neon ml-2">{t.inputAliasLabel}</label>
                                                <div className="relative group/field">
                                                    <div className="absolute inset-y-0 left-6 flex items-center text-primary group-focus-within/field:text-neon transition-colors z-10"><span className="font-black text-2xl">ሊ</span></div>
                                                    <input type="text" placeholder={t.inputAliasPlaceholder} value={customSlug} onChange={(e) => setCustomSlug(e.target.value)} className="w-full input-style rounded-[24px] py-7 pl-16 pr-8 text-lg font-bold placeholder:text-foreground/40 outline-none transition-all shadow-inner backdrop-blur-sm relative z-0 border-2 border-primary/40 focus:border-neon text-foreground" />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-sm font-black uppercase tracking-[0.4em] text-neon ml-2">{t.inputPasswordLabel}</label>
                                                <div className="relative group/field">
                                                    <div className="absolute inset-y-0 left-6 flex items-center text-primary group-focus-within/field:text-neon transition-colors z-10"><Lock size={20} /></div>
                                                    <input type="password" placeholder={t.inputPasswordPlaceholder} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full input-style rounded-[24px] py-7 pl-16 pr-8 text-lg font-bold placeholder:text-foreground/40 outline-none transition-all shadow-inner backdrop-blur-sm relative z-0 border-2 border-primary/40 focus:border-neon text-foreground" />
                                                </div>
                                            </div>

                                            <div className="space-y-6 p-8 rounded-3xl bg-red-500/5 border border-red-500/10 group/destruction">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Trash2 size={18} className="text-red-500 animate-pulse" />
                                                    <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-red-500">{t.destructionTitle}</h4>
                                                </div>
                                                <div className="grid grid-cols-2 gap-8">
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-2"><Clock size={14} className="text-red-400" /><span className="text-[10px] font-black uppercase tracking-widest text-red-400">{t.burnAfter}</span></div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {[{ label: t.burnManual, val: 0 }, { label: t.burn1h, val: 3600 }, { label: t.burn24h, val: 86400 }, { label: t.burnCustom, val: -1 }].map(opt => (
                                                                <button key={opt.val} type="button" onClick={() => setExpiresIn(opt.val)} className={cn("px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border", expiresIn === opt.val ? "bg-red-500 text-white border-red-500" : "bg-red-500/10 text-red-300 border-red-500/20")}>{opt.label}</button>
                                                            ))}
                                                        </div>
                                                        {expiresIn === -1 && <input type="datetime-local" value={customExpiry} onChange={(e) => setCustomExpiry(e.target.value)} className="w-full bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-3 text-[10px] font-black text-red-400 outline-none" />}
                                                    </div>
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-2"><ShieldAlert size={14} className="text-red-400" /><span className="text-[10px] font-black uppercase tracking-widest text-red-400">{t.clicksLimit}</span></div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {[{ label: t.clicksUnlimited, val: 0 }, { label: "5", val: 5 }, { label: "10", val: 10 }].map(opt => (
                                                                <button key={opt.val} type="button" onClick={() => setMaxClicks(opt.val)} className={cn("px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border", maxClicks === opt.val ? "bg-red-500 text-white border-red-500" : "bg-red-500/10 text-red-300 border-red-500/20")}>{opt.label}</button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <button disabled={isLoading} className="w-full bg-primary hover:bg-neon hover:text-black hover:scale-[1.02] active:scale-95 disabled:opacity-50 text-background font-black py-7 px-10 rounded-[24px] transition-all shadow-[0_20px_40px_rgba(var(--primary),0.3)] text-xl uppercase tracking-widest flex items-center justify-center gap-4 group/btn">
                                        {isLoading ? t.buttonLoading : <>{t.buttonShorten} <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" /></>}
                                    </button>
                                </form>

                                <AnimatePresence>
                                    {error && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-8 p-5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-black flex items-center gap-3 backdrop-blur-md"><Shield size={18} />{error.toUpperCase()}</motion.div>}
                                </AnimatePresence>

                                {/* Flash Result */}
                                {/* Result Card with Responsive Positioning */}
                                <AnimatePresence>
                                    {result && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="mt-8 md:absolute md:-bottom-20 md:left-4 md:right-4 z-20"
                                        >
                                            <div className="glass-card shadow-2xl p-6 md:p-8 rounded-[32px] border-neon/40 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden neo-shadow group">
                                                <div className="min-w-0 relative z-10 w-full sm:w-auto">
                                                    <div className="flex items-center gap-3 mb-2 justify-center sm:justify-start">
                                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neon">{t.resultReady}</p>
                                                        {(expiresIn > 0 || maxClicks > 0) && <span className="text-[8px] font-black py-1 px-2 rounded-lg bg-red-500/20 text-red-500 animate-pulse">SELF-DESTRUCT ACTIVE</span>}
                                                    </div>
                                                    <h3 className="text-xl md:text-3xl font-black truncate tracking-tighter text-contrast text-center sm:text-left">{typeof window !== 'undefined' ? `${window.location.host}/${result.slug}` : `/${result.slug}`}</h3>
                                                </div>
                                                <div className="flex gap-3 relative z-10 w-full sm:w-auto justify-center">
                                                    <button onClick={() => copyToClipboard(`${window.location.protocol}//${window.location.host}/${result.slug}`)} className="p-4 md:p-5 rounded-2xl bg-neon text-black hover:scale-110 transition-transform active:scale-95 flex-1 sm:flex-initial flex items-center justify-center">{copied ? <Check size={24} /> : <Copy size={24} />}</button>
                                                    <button onClick={() => setShowQr(!showQr)} className="px-5 py-4 md:px-6 md:py-5 rounded-2xl glass-card text-neon hover:bg-neon/10 border-neon/30 relative flex items-center gap-3 flex-1 sm:flex-initial justify-center">
                                                        <QrCode size={24} />
                                                        <span className="font-black text-xs uppercase tracking-widest hidden sm:block">QR</span>
                                                        {showQr && (
                                                            <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="absolute bottom-full mb-4 right-0 glass-card p-4 md:p-6 rounded-[24px] md:rounded-[32px] border-neon/40 shadow-2xl z-50 w-56 md:w-64 aspect-square">
                                                                <img src={`${API_URL}/api/qr/${result.slug}`} alt="QR" className="w-full h-full object-contain dark:invert" />
                                                            </motion.div>
                                                        )}
                                                    </button>
                                                </div>
                                                <div className="hidden sm:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-2 translate-x-32 group-hover:translate-x-0 transition-transform bg-background/80 backdrop-blur-xl p-3 rounded-2xl border border-neon/20 z-30">
                                                    <a href={`https://t.me/share/url?url=${encodeURIComponent(`${window.location.protocol}//${window.location.host}/${result.slug}`)}`} target="_blank" className="p-3 rounded-xl hover:bg-neon hover:text-black text-primary transition-all"><Send size={16} /></a>
                                                    <a href={`https://wa.me/?text=${encodeURIComponent(`${window.location.protocol}//${window.location.host}/${result.slug}`)}`} target="_blank" className="p-3 rounded-xl hover:bg-neon hover:text-black text-primary transition-all"><Share2 size={16} /></a>
                                                </div>
                                                <div className="flex sm:hidden w-full gap-4 pt-4 border-t border-white/5 relative z-10">
                                                    <a href={`https://t.me/share/url?url=${encodeURIComponent(`${window.location.protocol}//${window.location.host}/${result.slug}`)}`} target="_blank" className="flex-1 py-3 glass-card rounded-xl flex items-center justify-center text-primary"><Send size={18} /></a>
                                                    <a href={`https://wa.me/?text=${encodeURIComponent(`${window.location.protocol}//${window.location.host}/${result.slug}`)}`} target="_blank" className="flex-1 py-3 glass-card rounded-xl flex items-center justify-center text-primary"><Share2 size={18} /></a>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>

                {/* History Section */}
                <div className="mt-24 md:mt-52 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                    <div className="lg:col-span-8 space-y-8 md:space-y-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <h2 className="text-3xl md:text-4xl font-black tracking-tighter flex items-center gap-4 text-contrast"><BarChart2 size={32} className="text-neon" />{t.historyTitle}</h2>

                            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                                <div className="flex bg-background/40 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
                                    {(["all", "url", "bundle", "top"] as const).map((f) => (
                                        <button
                                            key={f}
                                            onClick={() => setHistoryFilter(f)}
                                            className={cn(
                                                "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                                                historyFilter === f ? "bg-primary text-background shadow-lg" : "text-primary/60 hover:text-primary"
                                            )}
                                        >
                                            {f === "all" ? t.filterAll : f === "url" ? t.filterUrls : f === "bundle" ? t.filterBundles : t.filterTop}
                                        </button>
                                    ))}
                                </div>
                                <div className="h-8 w-[1px] bg-white/10 mx-2" />
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-black text-primary/40 uppercase tracking-widest ml-2">{t.limitLabel}</span>
                                    <select
                                        value={historyLimit}
                                        onChange={(e) => setHistoryLimit(Number(e.target.value))}
                                        className="bg-background/40 border border-white/5 rounded-xl px-3 py-2 text-[9px] font-black text-primary outline-none cursor-pointer hover:border-primary/40 transition-all appearance-none text-center min-w-[50px]"
                                    >
                                        {[5, 10, 20, 50].map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                </div>
                                <button
                                    onClick={clearHistory}
                                    className="p-3 rounded-xl hover:bg-red-500/20 text-red-500/40 hover:text-red-500 transition-all ml-2"
                                    title={t.clearHistory}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="grid gap-4 md:gap-6">
                            {[...recentUrls]
                                .sort((a, b) => {
                                    if (historyFilter === "top") return (b.clicks || 0) - (a.clicks || 0);
                                    return 0; // Maintain original order (default is newest first)
                                })
                                .filter(u => {
                                    if (historyFilter === "all" || historyFilter === "top") return true;
                                    if (historyFilter === "bundle") return !!u.title || Array.isArray(u.items);
                                    return !u.title && !Array.isArray(u.items);
                                })
                                .slice(0, historyLimit)
                                .length > 0 ? [...recentUrls]
                                    .sort((a, b) => {
                                        if (historyFilter === "top") return (b.clicks || 0) - (a.clicks || 0);
                                        return 0;
                                    })
                                    .filter(u => {
                                        if (historyFilter === "all" || historyFilter === "top") return true;
                                        if (historyFilter === "bundle") return !!u.title || Array.isArray(u.items);
                                        return !u.title && !Array.isArray(u.items);
                                    })
                                    .slice(0, historyLimit)
                                    .map((u, i) => (
                                        <motion.div
                                            key={u.slug + i}
                                            initial={{ opacity: 0, x: -30 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            className="group flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-5 md:p-8 rounded-[24px] md:rounded-[32px] glass-card border-white/5 hover:border-neon/20 hover:bg-neon/5 transition-all gap-5 md:gap-6"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-xl md:text-3xl font-black text-primary truncate max-w-[120px] md:max-w-[200px]">{u.slug}</span>
                                                    {(u.title || Array.isArray(u.items)) ? (
                                                        <span className="text-[10px] font-black py-1 px-3 rounded-full bg-neon/10 text-neon uppercase tracking-widest border border-neon/10 italic flex items-center gap-1">
                                                            <Layers size={10} /> {lang === 'en' ? 'BUNDLE' : 'ጥቅል'}
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] font-black py-1 px-3 rounded-full bg-primary/10 text-primary uppercase tracking-widest border border-primary/10 italic">FIDEL</span>
                                                    )}
                                                </div>
                                                <p className="text-foreground/40 text-[11px] md:text-sm truncate font-bold font-mono">{u.title || u.long_url || (lang === 'en' ? "Untitled Drop" : "ያልተሰየመ")}</p>
                                            </div>
                                            <div className="flex items-center justify-between sm:justify-end gap-6 md:gap-8 pt-4 sm:pt-0 border-t sm:border-t-0 border-white/5">
                                                <div className="text-left sm:text-right md:pr-2">
                                                    <span className="text-xl md:text-3xl font-black text-contrast block leading-none">{u.clicks || 0}</span>
                                                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-primary">{t.historyVibes}</span>
                                                </div>
                                                <div className="flex gap-1 md:gap-2">
                                                    <button onClick={() => copyToClipboard(`${window.location.protocol}//${window.location.host}/${u.slug}`)} className="p-2 md:p-3 rounded-xl hover:bg-neon/20 text-foreground/40 hover:text-neon transition-all" title="Copy Link"><Copy size={16} /></button>
                                                    <Link href={`/stats/${u.slug}`} className="p-2 md:p-3 rounded-xl hover:bg-neon/10 text-primary/40 hover:text-neon transition-all" title="View Stats"><Activity size={16} /></Link>
                                                    <Link href={`/stats/${u.slug}`} className="p-2 md:p-3 rounded-xl hover:bg-neon/10 text-neon/40 hover:text-neon transition-all" title="View QR Code"><QrCode size={16} /></Link>
                                                    <a href={`https://t.me/share/url?url=${encodeURIComponent(`${window.location.protocol}//${window.location.host}/${u.slug}`)}`} target="_blank" className="p-2 md:p-3 rounded-xl hover:bg-primary/10 text-primary/40 hover:text-primary transition-all" title="Share on Telegram"><Send size={16} /></a>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )) : (
                                <div className="p-12 md:p-20 rounded-[32px] md:rounded-[40px] border-2 border-dashed border-foreground/5 flex flex-col items-center justify-center glass-card">
                                    <div className="text-primary/20 mb-6">
                                        <Sparkles size={48} className="hidden md:block" />
                                        <Sparkles size={40} className="block md:hidden" />
                                    </div>
                                    <p className="font-black text-xs md:text-sm uppercase tracking-[0.5em] text-primary/40 text-center">{t.historyEmpty}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-8 lg:pl-12">
                        <div className="p-6 md:p-10 rounded-[32px] md:rounded-[40px] bg-primary text-background relative overflow-hidden group shadow-2xl border-2 border-neon/10 w-full">
                            <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:rotate-12 transition-transform duration-[2s]"><Zap size={200} fill="white" /></div>
                            <h3 className="text-2xl md:text-3xl font-black mb-4 md:mb-6 relative z-10 uppercase tracking-tighter">{t.sidebarIdentityTitle}</h3>
                            <p className="text-background/90 text-sm md:text-lg font-bold leading-relaxed md:leading-[1.6] relative z-10 italic">{t.sidebarIdentityText}</p>
                        </div>

                        <div className="p-6 md:p-10 rounded-[32px] md:rounded-[40px] glass-card border-foreground/10 w-full">
                            <h3 className="text-xs font-black uppercase tracking-[0.5em] text-primary dark:text-neon mb-6 md:mb-10">{t.nativeVibeTitle}</h3>
                            <div className="space-y-4 md:space-y-6">
                                {[{ label: t.nativePerformance, val: t.nativePerformanceVal, color: "text-neon" }, { label: t.nativeAccess, val: t.nativeAccessVal, color: "text-foreground" }, { label: t.nativeDesign, val: t.nativeDesignVal, color: "text-primary dark:text-neon" }].map((s, i) => (
                                    <div key={i} className="flex justify-between items-end pb-4 md:pb-5 border-b border-foreground/10">
                                        <span className="text-[10px] md:text-[11px] font-black text-primary/70 uppercase tracking-[0.2em]">{s.label}</span>
                                        <span className={cn("text-lg md:text-xl font-black tracking-tighter", s.color)}>{s.val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Amharic Scrollbar Hint */}
            <div className="fixed bottom-12 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8 px-12 py-5 glass-card rounded-full border-primary/20 pointer-events-none opacity-40 shadow-2xl skew-x-[-12deg]">
                {AMHARIC_CHARS.split("").slice(0, 10).map((c, i) => <span key={i} className="text-primary font-black text-xl">{c}</span>)}
                <span className="text-[10px] font-black uppercase tracking-[0.6em] text-neon px-8 animate-pulse italic">{t.scrollHint}</span>
                {AMHARIC_CHARS.split("").slice(-10).map((c, i) => <span key={i} className="text-primary font-black text-xl">{c}</span>)}
            </div>
        </motion.div>
    );
}
