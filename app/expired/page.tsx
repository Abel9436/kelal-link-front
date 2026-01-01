"use client";

import { motion } from "framer-motion";
import { ShieldAlert, ArrowLeft, Zap, Sparkles, Clock, Trash2 } from "lucide-react";
import Link from "next/link";
import { ModernBackground } from "@/components/modern-background";
import { useEffect, useState } from "react";

export default function ExpiredPage() {
    const [lang, setLang] = useState<"en" | "am">("en");

    useEffect(() => {
        const savedLang = localStorage.getItem("app_lang");
        if (savedLang === "am" || savedLang === "en") setLang(savedLang);
    }, []);

    const t = {
        en: {
            title: "LINK EXPIRED",
            subtitle: "DESTRUCTION PROTOCOL COMPLETE",
            text: "This link has reached its end of life. It has either expired or reached its maximum click limit as requested by the creator.",
            button: "BACK TO BASE",
            tag: "MISSION ENDED",
            status: "STATUS: VANISHED"
        },
        am: {
            title: "ሊንኩ አብቅቷል",
            subtitle: "የራስ-ጥፋት ፕሮቶኮል ተጠናቋል",
            text: "ይህ ሊንክ የአገልግሎት ጊዜው አልቋል። በባለቤቱ በተቀመጠው ገደብ መሰረት ሊንኩ ጠፍቷል ወይም የእይታ ገደቡን ጨርሷል።",
            button: "ወደ መጀመሪያ ተመለስ",
            tag: "ተልዕኮ ተጠናቋል",
            status: "ሁኔታ፡ የለም"
        }
    }[lang];

    return (
        <div className="relative min-h-screen font-sans overflow-hidden text-foreground flex items-center justify-center p-6">
            <ModernBackground />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl w-full relative z-10"
            >
                {/* Main Card */}
                <div className="glass-card rounded-[48px] p-12 md:p-16 border-red-500/20 shadow-2xl shadow-red-500/10 overflow-hidden relative group">
                    {/* Background Glows */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-500/10 rounded-full blur-[100px] group-hover:bg-red-500/20 transition-all duration-1000" />
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />

                    {/* Content */}
                    <div className="relative z-10 text-center space-y-8">
                        {/* Icon Header */}
                        <div className="flex justify-center mb-8">
                            <div className="relative">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        rotate: [0, 5, -5, 0]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-24 h-24 rounded-3xl bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center text-red-500 shadow-[0_0_50px_rgba(239,68,68,0.2)]"
                                >
                                    <ShieldAlert size={48} strokeWidth={2.5} />
                                </motion.div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-background border-4 border-background animate-pulse">
                                    <Trash2 size={14} />
                                </div>
                            </div>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap justify-center gap-4">
                            <span className="px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
                                {t.tag}
                            </span>
                            <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                                {t.status}
                            </span>
                        </div>

                        {/* Heading */}
                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-contrast leading-none">
                                {t.title}
                            </h1>
                            <p className="text-red-500 font-black text-sm uppercase tracking-[0.4em] animate-pulse">
                                {t.subtitle}
                            </p>
                        </div>

                        {/* Description */}
                        <p className="text-foreground/60 text-lg font-medium leading-relaxed max-w-sm mx-auto italic">
                            {t.text}
                        </p>

                        {/* Action Dropdown/Button */}
                        <div className="pt-8">
                            <Link href="/">
                                <motion.button
                                    whileHover={{ scale: 1.05, x: 5 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-12 py-6 rounded-[24px] bg-primary text-background font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 flex items-center justify-center gap-4 mx-auto hover:bg-neon hover:text-black transition-all group/btn"
                                >
                                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                                    {t.button}
                                </motion.button>
                            </Link>
                        </div>
                    </div>

                    {/* Accents */}
                    <div className="absolute top-8 left-8">
                        <Zap size={16} className="text-red-500/20" />
                    </div>
                    <div className="absolute bottom-12 right-12">
                        <Sparkles size={20} className="text-red-500/20" />
                    </div>
                </div>

                {/* Footer Decor */}
                <div className="mt-12 flex justify-center items-center gap-12 opacity-20 pointer-events-none">
                    <Clock size={24} />
                    <div className="h-px w-24 bg-foreground/20" />
                    <span className="text-[10px] font-black uppercase tracking-[1em]">VOIDED</span>
                    <div className="h-px w-24 bg-foreground/20" />
                    <Trash2 size={24} />
                </div>
            </motion.div>
        </div>
    );
}
