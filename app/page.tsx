"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Link2, Copy, Check, QrCode, ExternalLink,
    Github, Linkedin, Twitter, Instagram, GithubIcon,
    Moon, Sun, Sparkles, Layout, Rocket,
    ArrowRight, MessageSquare, Zap, Layers,
    Smartphone, MousePointer2, Fingerprint, Activity,
    BarChart2, Trash2, ShieldAlert, Clock, Lock,
    ChevronRight, Mail, Send, Share2, Heart,
    Activity as ActivityIcon, Shield
} from "lucide-react";
import { useTheme } from "next-themes";
import { ModernBackground } from "@/components/modern-background";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const AMHARIC_CHARS = "ሀለሐመሠረሰሸቀበተቸኀነኘአከኸወዐዘዠየደጀገጠጨጰጸፀፈፐ";

const TRANSLATIONS = {
    en: {
        shortenBtn: "Shorten",
        inputPlaceholder: "Elevate your link here...",
        customAlias: "fidel/alias",
        heroPre: "Ethiopian Engineering Studio",
        heroTitle1: "CURATE",
        heroTitle2: "UNIFIED",
        heroTitle3: "DROPS",
        heroSlogan: "Beyond simple links. A professional-grade toolkit for the modern creator, built with the spirit of Ethiopian innovation.",
        statSpeed: "0.4ms",
        statSpeedLabel: "STUDIO LATENCY",
        statPrivacy: "E2E",
        statPrivacyLabel: "IDENTITY PROTOCOL",
        inputLongLabel: "TARGET DESTINATION",
        inputLongPlaceholder: "DROP YOUR LONG URL...",
        inputAliasLabel: "NATIVE SLUG (OPTIONAL)",
        inputAliasPlaceholder: "CUSTOM-IDENTITY",
        inputPasswordLabel: "ACCESS SHIELD (OPTIONAL)",
        inputPasswordPlaceholder: "PROTECT YOUR DROP...",
        destructionTitle: "SELF-DESTRUCT PROTOCOL",
        burnAfter: "BURN AFTER",
        burnManual: "NEVER",
        burn1h: "1 HOUR",
        burn24h: "24 HOURS",
        burnCustom: "CUSTOM",
        clicksLimit: "CLICKS LIMIT",
        clicksUnlimited: "UNLIMITED",
        buttonShorten: "GENERATE DROP",
        buttonLoading: "STUDIO IS BUILDING...",
        resultReady: "STUDIO DROP SECURED",
        historyTitle: "STUDIO ARCHIVE",
        historyVibes: "ENGAGEMENT",
        historyEmpty: "YOUR STUDIO IS SILENT. START DROPPING.",
        filterAll: "ALL DROPS",
        filterUrls: "LINKS",
        filterBundles: "STUDIO",
        filterTop: "ELITE",
        limitLabel: "SCOPE",
        clearHistory: "PURGE ARCHIVE",
        sidebarIdentityTitle: "STUDIO MASTERY",
        sidebarIdentityText: "Abel Bekele is an Ethiopian digital architect crafting high-performance tools for a global audience.",
        nativeVibeTitle: "NATIVE PERFORMANCE",
        nativePerformance: "LUMINESCENCE",
        nativePerformanceVal: "99.9%",
        nativeAccess: "ACCESS",
        nativeAccessVal: "GLOBAL",
        nativeDesign: "CRAFT",
        nativeDesignVal: "ETHIOP",
        creatorTitle: "FOUNDER & ARCHITECT",
        creatorName: "ABEL BEKELE",
        creatorRole: "DIGITAL ARCHITECTURE STUDIO",
        creatorBio: "I design high-impact digital experiences that bridge the gap between complex engineering and human-centric design, rooted in the rich heritage of Ethiopian excellence.",
        viewPortfolio: "MASTER STUDIO",
        connectTitle: "INITIATE PROTOCOL",
        scrollHint: "CONTINUE EXPLORING",
        allHistory: "ALL",
        urlsOnly: "URLS",
        bundlesOnly: "STUDIO",
        topPerforming: "ELITE",
        expiry: "EXPIRY",
        never: "NEVER",
        custom: "CUSTOM",
        maxClicks: "MAX CLICKS",
        unlimited: "UNLIMITED",
        passwordProtected: "PASSWORD"
    },
    am: {
        shortenBtn: "አሳጥር",
        inputPlaceholder: "ሊንክዎን እዚህ ያሳጥሩ...",
        customAlias: "የራስዎን ስም ይስጡት",
        heroPre: "የኢትዮጵያ የምህንድስና ስቱዲዮ",
        heroTitle1: "ሁሉንም",
        heroTitle2: "ሊንክ",
        heroTitle3: "አሳጥር",
        heroSlogan: "ከቀላል ሊንክ ባሻገር። ለዘመናዊ ፈጣሪዎች የተገነባ ፕሮፌሽናል መሳሪያ፣ በኢትዮጵያ የፈጠራ መንፈስ የታነጸ።",
        statSpeed: "0.4ms",
        statSpeedLabel: "የስራ ፍጥነት",
        statPrivacy: "E2E",
        statPrivacyLabel: "ደህንነት",
        inputLongLabel: "ዋናው ሊንክ",
        inputLongPlaceholder: "ረጅሙን ሊንክ እዚህ ያስገቡ...",
        inputAliasLabel: "ልዩ ስም (ካለዎት)",
        inputAliasPlaceholder: "ለምሳሌ፡- abel-bio",
        inputPasswordLabel: "የይለፍ ቃል (አማራጭ)",
        inputPasswordPlaceholder: "ደህንነት ይጠብቁ...",
        destructionTitle: "ራስን የማጥፋት ፕሮቶኮል",
        burnAfter: "የሚያበቃበት ጊዜ",
        burnManual: "አያበቃም",
        burn1h: "ከ1 ሰዓት በኋላ",
        burn24h: "ከ24 ሰዓት በኋላ",
        burnCustom: "ሌላ ጊዜ",
        clicksLimit: "የጠቅታ ብዛት",
        clicksUnlimited: "ገደብ የለሽ",
        buttonShorten: "አጥርቶ ፍጠር",
        buttonLoading: "ስቱዲዮው እየገነባ ነው...",
        resultReady: "አዲሱ ሊንክ ዝግጁ ነው",
        historyTitle: "የታሪክ መዝገብ",
        historyVibes: "ተጠቃሚዎች",
        historyEmpty: "ምንም የታሪክ መዝገብ የለም።",
        filterAll: "ሁሉም",
        filterUrls: "ሊንኮች",
        filterBundles: "ጥቅሎች",
        filterTop: "ታዋቂ",
        limitLabel: "ብዛት",
        clearHistory: "ታሪክ አጥፋ",
        sidebarIdentityTitle: "የስቱዲዮ ብቃት",
        sidebarIdentityText: "አቤል በቀለ ለዓለም አቀፍ ተጠቃሚዎች ባለከፍተኛ ብቃት ዲጂታል መሳሪያዎችን የሚገነባ ኢትዮጵያዊ ዲጂታል አርክቴክት ነው።",
        nativeVibeTitle: "የሀገር በቀል ጥራት",
        nativePerformance: "ብቃት",
        nativePerformanceVal: "99.9%",
        nativeAccess: "ተደራሽነት",
        nativeAccessVal: "ዓለም አቀፍ",
        nativeDesign: "ጥበብ",
        nativeDesignVal: "ኢትዮጵያዊ",
        creatorTitle: "መስራች እና መሃንዲስ",
        creatorName: "አቤል በቀለ",
        creatorRole: "ዲጂታል አርክቴክቸር ስቱዲዮ",
        creatorBio: "በከፍተኛ ምህንድስና እና በሰው ተኮር ዲዛይን መካከል ያለውን ልዩነት የሚያጥቡ ዲጂታል ተሞክሮዎችን እቀይሳለሁ።",
        viewPortfolio: "ስራዎቼን እይ",
        connectTitle: "ያግኙኝ",
        scrollHint: "ወደ ታች ይቀጥሉ",
        allHistory: "ሁሉም",
        urlsOnly: "ሊንኮች",
        bundlesOnly: "ስቱዲዮ",
        topPerforming: "ታዋቂ",
        expiry: "የሚጠፋበት",
        never: "አያበቃም",
        custom: "ልዩ",
        maxClicks: "የጠቅታ ገደብ",
        unlimited: "ያልተገደበ",
        passwordProtected: "ይለፍ ቃል"
    }
};

export default function Home() {
    const router = useRouter();
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
            router.push("/create");
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
            localStorage.setItem("recent_urls", JSON.stringify(updated.slice(0, 50)));
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
            className="relative min-h-screen selection:bg-neon/10 font-sans overflow-x-hidden text-foreground transition-colors duration-500 pb-24"
        >
            <ModernBackground />

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 px-4 md:px-6 py-4 flex justify-between items-center bg-background/5 backdrop-blur-md border-b border-glass-stroke">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 md:gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-primary flex items-center justify-center text-background font-black text-xl md:text-2xl shadow-xl shadow-primary/20 rotate-3 transform hover:rotate-0 transition-transform">ቀ</div>
                    <span className="font-black text-2xl md:text-3xl tracking-tighter uppercase whitespace-nowrap text-foreground">
                        ቀላል<span className="text-primary italic underline decoration-neon decoration-4 underline-offset-4">LINK</span>
                    </span>
                </motion.div>

                <div className="flex items-center gap-2 md:gap-4">
                    <button onClick={toggleLang} className="px-4 md:px-6 py-3 md:py-4 rounded-2xl md:rounded-3xl glass-card border-glass-stroke hover:border-primary transition-all text-primary font-black text-xs uppercase tracking-widest border-2">
                        {lang === "en" ? "AM" : "EN"}
                    </button>
                    <button onClick={toggleTheme} className="p-3 md:p-4 rounded-2xl md:rounded-3xl glass-card border-glass-stroke hover:border-primary transition-all text-primary border-2">
                        <AnimatePresence mode="wait">
                            <motion.div key={resolvedTheme} initial={{ scale: 0, rotate: -180, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} exit={{ scale: 0, rotate: 180, opacity: 0 }} className="text-primary">
                                {resolvedTheme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                            </motion.div>
                        </AnimatePresence>
                    </button>
                </div>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-28 md:pt-40 pb-20">
                <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-start">
                    {/* Hero Sidebar */}
                    <div className="lg:col-span-1 hidden lg:flex flex-col gap-8 pt-12">
                        {[Sparkles, MousePointer2, Fingerprint, Zap].map((Icon, i) => (
                            <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + (i * 0.1) }} className="w-12 h-12 rounded-2xl glass-card border-glass-stroke flex items-center justify-center text-primary/40 hover:text-primary transition-colors cursor-help">
                                <Icon size={20} />
                            </motion.div>
                        ))}
                    </div>

                    {/* Main Hero & Input */}
                    <div className="lg:col-span-11 grid lg:grid-cols-2 gap-10 md:gap-16">
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 md:space-y-8">
                            <div className="inline-block px-4 md:px-5 py-2 glass-card rounded-full border-primary/20 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-primary">{t.heroPre}</div>
                            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[0.85] tracking-tighter text-contrast uppercase italic">
                                {t.heroTitle1} <br />
                                <span className="text-neon italic underline decoration-neon/40 decoration-8 underline-offset-8">{t.heroTitle2}</span> <br />
                                {t.heroTitle3}
                            </h1>
                            <div className="flex gap-4 items-center">
                                <div className="h-0.5 w-8 md:w-12 bg-primary" />
                                <p className="text-lg md:text-xl font-bold text-foreground/80 max-w-sm italic leading-relaxed">{t.heroSlogan}</p>
                            </div>
                            <div className="flex gap-8 md:gap-12 pt-4 md:pt-8">
                                <div className="space-y-1 text-center sm:text-left">
                                    <p className="text-3xl md:text-4xl font-black text-primary text-contrast">{t.statSpeed}</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">{t.statSpeedLabel}</p>
                                </div>
                                <div className="space-y-1 text-center sm:text-left">
                                    <p className="text-3xl md:text-4xl font-black text-primary text-contrast">{t.statPrivacy}</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">{t.statPrivacyLabel}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Input Area */}
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-primary/10 rounded-[40px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="relative glass-card rounded-[36px] p-8 md:p-12 border-glass-stroke overflow-hidden shadow-2xl">
                                <div className="flex items-center gap-4 mb-8">
                                    <button type="button" onClick={() => setIsBundleMode(false)} className={cn("flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", !isBundleMode ? "bg-primary text-background shadow-lg" : "bg-glass-fill text-primary/80 hover:bg-glass-stroke")}>Single Drop</button>
                                    <button type="button" onClick={() => setIsBundleMode(true)} className={cn("flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", isBundleMode ? "bg-neon text-background shadow-lg shadow-neon/20" : "bg-glass-fill text-neon/90 hover:bg-glass-stroke")}>Bundle (Pro)</button>
                                </div>

                                <form onSubmit={handleShorten} className="space-y-8 relative z-10">
                                    {!isBundleMode ? (
                                        <>
                                            <div className="space-y-4">
                                                <label className="text-sm font-black uppercase tracking-[0.4em] text-primary/40 ml-2">{t.inputLongLabel}</label>
                                                <div className="relative group/field">
                                                    <div className="absolute inset-y-0 left-6 flex items-center text-primary group-focus-within/field:text-neon transition-colors z-10"><Link2 size={24} /></div>
                                                    <input type="url" required placeholder={t.inputLongPlaceholder} value={longUrl} onChange={(e) => setLongUrl(e.target.value)} className="w-full input-style rounded-[24px] py-7 pl-16 pr-8 text-lg font-bold placeholder:text-foreground/30 outline-none transition-all shadow-inner backdrop-blur-sm relative z-0 border-2 border-glass-stroke focus:border-neon text-foreground" />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-sm font-black uppercase tracking-[0.4em] text-primary/70 ml-2">{t.inputAliasLabel}</label>
                                                <div className="relative group/field">
                                                    <div className="absolute inset-y-0 left-6 flex items-center text-primary group-focus-within/field:text-neon transition-colors z-10"><span className="font-black text-2xl">ሊ</span></div>
                                                    <input type="text" placeholder={t.inputAliasPlaceholder} value={customSlug} onChange={(e) => setCustomSlug(e.target.value)} className="w-full input-style rounded-[24px] py-7 pl-16 pr-8 text-lg font-bold placeholder:text-foreground/30 outline-none transition-all shadow-inner backdrop-blur-sm relative z-0 border-2 border-glass-stroke focus:border-neon text-foreground" />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-sm font-black uppercase tracking-[0.4em] text-primary/70 ml-2">{t.inputPasswordLabel}</label>
                                                <div className="relative group/field">
                                                    <div className="absolute inset-y-0 left-6 flex items-center text-primary group-focus-within/field:text-neon transition-colors z-10"><Lock size={20} /></div>
                                                    <input type="password" placeholder={t.inputPasswordPlaceholder} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full input-style rounded-[24px] py-7 pl-16 pr-8 text-lg font-bold placeholder:text-foreground/30 outline-none transition-all shadow-inner backdrop-blur-sm relative z-0 border-2 border-glass-stroke focus:border-neon text-foreground" />
                                                </div>
                                            </div>

                                            <div className="space-y-6 p-8 rounded-3xl bg-red-500/5 border border-red-500/10 group/destruction">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Trash2 size={18} className="text-red-500 animate-pulse" />
                                                    <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-red-500">{t.destructionTitle}</h4>
                                                </div>
                                                <div className="grid grid-cols-2 gap-8">
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-2"><Clock size={14} className="text-red-600" /><span className="text-[10px] font-black uppercase tracking-widest text-red-600">{t.burnAfter}</span></div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {[{ label: t.burnManual, val: 0 }, { label: t.burn1h, val: 3600 }, { label: t.burn24h, val: 86400 }, { label: t.burnCustom, val: -1 }].map(opt => (
                                                                <button key={opt.val} type="button" onClick={() => setExpiresIn(opt.val)} className={cn("px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border", expiresIn === opt.val ? "bg-red-500 text-white border-red-500" : "bg-red-500/10 text-red-600/80 border-red-500/20")}>{opt.label}</button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-2"><ShieldAlert size={14} className="text-red-600" /><span className="text-[10px] font-black uppercase tracking-widest text-red-600">{t.clicksLimit}</span></div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {[{ label: t.clicksUnlimited, val: 0 }, { label: "5", val: 5 }, { label: "10", val: 10 }].map(opt => (
                                                                <button key={opt.val} type="button" onClick={() => setMaxClicks(opt.val)} className={cn("px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border", maxClicks === opt.val ? "bg-red-500 text-white border-red-500" : "bg-red-500/10 text-red-600/80 border-red-500/20")}>{opt.label}</button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                                            <div className="relative inline-block w-full text-center">
                                                <div className="w-24 h-24 rounded-[2.5rem] bg-neon/10 border-2 border-neon/20 flex items-center justify-center text-neon mx-auto">
                                                    <Layout size={40} />
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-4">
                                                {[
                                                    { id: 'expiry', icon: Clock, label: t.expiry, val: expiresIn === 0 ? t.never : (expiresIn === -1 ? t.custom : `${expiresIn / 3600}h`) },
                                                    { id: 'clicks', icon: ShieldAlert, label: t.maxClicks, val: maxClicks === 0 ? t.unlimited : maxClicks },
                                                    { id: 'password', icon: Lock, label: t.passwordProtected, val: password ? 'ON' : 'OFF' }
                                                ].map((opt) => (
                                                    <div key={opt.id} className="flex-1 min-w-[120px] bg-glass-fill border border-glass-stroke p-4 rounded-3xl">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <opt.icon size={14} className="text-primary/70" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-primary/80 text-center">{opt.label}</span>
                                                        </div>
                                                        <span className="text-xs font-black text-primary uppercase block text-center">{opt.val}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <button type="button" onClick={() => router.push("/create")} className="w-full bg-neon text-background font-black py-6 rounded-[24px] transition-all shadow-xl text-sm uppercase tracking-widest flex items-center justify-center gap-4 group/btn hover:scale-[1.02] active:scale-95">Open Studio <Rocket size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></button>
                                        </motion.div>
                                    )}

                                    <button disabled={isLoading} className="w-full bg-primary hover:bg-neon hover:text-black hover:scale-[1.02] active:scale-95 disabled:opacity-50 text-background font-black py-7 px-10 rounded-[24px] transition-all shadow-xl text-xl uppercase tracking-widest flex items-center justify-center gap-4 group/btn">
                                        {isLoading ? t.buttonLoading : <>{t.buttonShorten} <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" /></>}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* History Section */}
                <div className="mt-24 md:mt-52">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <h2 className="text-3xl md:text-4xl font-black tracking-tighter flex items-center gap-4 text-contrast uppercase italic"><BarChart2 size={32} className="text-primary" />{t.historyTitle}</h2>
                        <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                            <div className="flex bg-glass-fill p-1.5 rounded-2xl border border-glass-stroke">
                                {(["all", "url", "bundle", "top"] as const).map((f) => (
                                    <button key={f} onClick={() => setHistoryFilter(f)} className={cn("px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all", historyFilter === f ? "bg-primary text-background shadow-lg" : "text-primary/60 hover:text-primary")}>
                                        {f === "all" ? t.filterAll : f === "url" ? t.filterUrls : f === "bundle" ? t.filterBundles : t.filterTop}
                                    </button>
                                ))}
                            </div>
                            <button onClick={clearHistory} className="p-3 rounded-xl hover:bg-red-500/20 text-red-500/40 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-8 space-y-4 md:space-y-6">
                            {recentUrls
                                .filter(u => {
                                    if (historyFilter === "all" || historyFilter === "top") return true;
                                    if (historyFilter === "bundle") return !!u.title || Array.isArray(u.items);
                                    return !u.title && !Array.isArray(u.items);
                                })
                                .sort((a, b) => historyFilter === "top" ? (b.clicks || 0) - (a.clicks || 0) : 0)
                                .slice(0, historyLimit)
                                .map((u, i) => (
                                    <motion.div key={u.slug + i} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="group flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-5 md:p-8 rounded-[32px] glass-card border-glass-stroke hover:border-primary/20 hover:bg-primary/5 transition-all gap-5">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-xl md:text-3xl font-black text-primary truncate">{u.slug}</span>
                                                {(u.title || Array.isArray(u.items)) && <span className="text-[10px] font-black py-1 px-3 rounded-full bg-primary/10 text-primary uppercase tracking-widest border border-primary/10 italic flex items-center gap-1"><Layers size={10} /> STUDIO</span>}
                                            </div>
                                            <p className="text-foreground/40 text-[11px] md:text-sm truncate font-bold font-mono">{u.title || u.long_url || "Untitled Drop"}</p>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end gap-6 md:gap-8 pt-4 sm:pt-0 border-t sm:border-t-0 border-glass-stroke">
                                            <div className="text-left sm:text-right">
                                                <span className="text-xl md:text-3xl font-black text-contrast block leading-none">{u.clicks || 0}</span>
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60">VIBES</span>
                                            </div>
                                            <div className="flex gap-1">
                                                <button onClick={() => copyToClipboard(`${window.location.protocol}//${window.location.host}/${u.slug}`)} className="p-3 rounded-xl hover:bg-primary/20 text-foreground/40 hover:text-primary transition-all"><Copy size={16} /></button>
                                                <Link href={`/stats/${u.slug}`} className="p-3 rounded-xl hover:bg-primary/10 text-primary/40 hover:text-primary transition-all"><Activity size={16} /></Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            {recentUrls.length === 0 && (
                                <div className="p-20 rounded-[40px] border-2 border-dashed border-glass-stroke flex flex-col items-center justify-center glass-card">
                                    <Sparkles size={48} className="text-primary/10 mb-6" />
                                    <p className="font-black text-xs uppercase tracking-[0.5em] text-primary/20 text-center">{t.historyEmpty}</p>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="p-10 rounded-[40px] bg-primary text-background relative overflow-hidden group shadow-2xl">
                                <h3 className="text-2xl md:text-3xl font-black mb-6 relative z-10 uppercase tracking-tighter">{t.sidebarIdentityTitle}</h3>
                                <p className="text-background font-bold text-sm md:text-lg font-bold leading-relaxed relative z-10 italic">{t.sidebarIdentityText}</p>
                            </div>

                            <div className="p-10 rounded-[40px] glass-card border-glass-stroke shadow-xl">
                                <h3 className="text-xs font-black uppercase tracking-[0.5em] text-primary mb-10">{t.nativeVibeTitle}</h3>
                                <div className="space-y-6">
                                    {[{ label: t.nativePerformance, val: t.nativePerformanceVal, color: "text-primary" }, { label: t.nativeAccess, val: t.nativeAccessVal, color: "text-foreground" }, { label: t.nativeDesign, val: t.nativeDesignVal, color: "text-primary" }].map((s, i) => (
                                        <div key={i} className="flex justify-between items-end pb-5 border-b border-glass-stroke">
                                            <span className="text-[10px] font-black text-primary/50 uppercase tracking-[0.2em]">{s.label}</span>
                                            <span className={cn("text-xl font-black tracking-tighter", s.color)}>{s.val}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Creator Section */}
                <div className="mt-52 relative py-20 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                    <div className="flex flex-col lg:flex-row gap-20 items-start">
                        <div className="lg:w-1/2 space-y-10 relative z-10">
                            <div className="space-y-4">
                                <div className="px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary w-fit uppercase tracking-[0.4em]">{t.creatorTitle}</div>
                                <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-contrast leading-[0.85] uppercase italic">{t.creatorName}</h2>
                                <p className="text-primary font-black text-xs uppercase tracking-[0.6em] ml-2">{t.creatorRole}</p>
                            </div>
                            <p className="text-foreground/80 text-lg md:text-xl font-bold leading-relaxed max-w-lg italic border-l-4 border-primary pl-6">"{t.creatorBio}"</p>
                            <div className="flex flex-wrap gap-4">
                                <a href="https://abelo.tech" target="_blank" className="px-8 py-5 rounded-2xl bg-primary text-background font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl flex items-center gap-3 group">{t.viewPortfolio} <ExternalLink size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></a>
                                <div className="flex gap-2">
                                    {[
                                        { icon: <Linkedin size={20} />, url: "https://www.linkedin.com/in/abelabekele" },
                                        { icon: <GithubIcon size={20} />, url: "https://github.com/Abel9436" },
                                        { icon: <Twitter size={20} />, url: "https://x.com/abelbk007" },
                                        { icon: <Instagram size={20} />, url: "https://www.instagram.com/abel.techh/" }
                                    ].map((s, i) => (
                                        <a key={i} href={s.url} target="_blank" className="p-5 rounded-2xl glass-card border-glass-stroke text-primary hover:bg-primary hover:text-background transition-all hover:-translate-y-2">{s.icon}</a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-1/2 w-full grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                            {[
                                { title: "AI WORKFLOWS", desc: "Automating 50+ departments", icon: <Zap /> },
                                { title: "DATA PIPELINES", desc: "Millions of records handled", icon: <Layers /> },
                                { title: "MOBILITY PRO", desc: "Flutter platforms", icon: <Smartphone /> },
                                { title: "SMART AGENTS", desc: "LLM automation", icon: <Activity /> }
                            ].map((p, i) => (
                                <motion.div key={i} whileHover={{ y: -10 }} className="p-8 rounded-[36px] glass-card border-glass-stroke group hover:border-primary/40 transition-all shadow-xl">
                                    <div className="text-primary mb-6 p-4 bg-primary/10 rounded-2xl w-fit group-hover:bg-primary group-hover:text-background transition-all">{p.icon}</div>
                                    <h4 className="font-black text-xl text-contrast mb-2 uppercase tracking-tight">{p.title}</h4>
                                    <p className="text-foreground/50 text-[10px] font-black uppercase tracking-widest">{p.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Amharic Decorative Sidebar */}
            <div className="fixed bottom-12 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8 px-12 py-5 glass-card rounded-full border-glass-stroke pointer-events-none opacity-40 shadow-2xl skew-x-[-12deg] z-40">
                {AMHARIC_CHARS.split("").slice(0, 5).map((c, i) => <span key={i} className="text-primary font-black text-xl">{c}</span>)}
                <span className="text-[10px] font-black uppercase tracking-[0.6em] text-primary/60 px-8 animate-pulse italic">{t.scrollHint}</span>
                {AMHARIC_CHARS.split("").slice(-5).map((c, i) => <span key={i} className="text-primary font-black text-xl">{c}</span>)}
            </div>
        </motion.div>
    );
}
