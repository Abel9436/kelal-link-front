
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Sparkles, ExternalLink, Coffee, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DonationPopup() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const checkAndShow = () => {
            const lastClosed = localStorage.getItem('last_donation_closed');
            const now = Date.now();
            const cooldown = 20 * 60 * 1000; // Clinical 20-minute cooldown

            if (!lastClosed || now - parseInt(lastClosed) > cooldown) {
                setIsOpen(true);
            }
        };

        // Initial cinematic trigger
        const timer = setTimeout(checkAndShow, 2000);

        // Background persistence check every minute
        const interval = setInterval(checkAndShow, 60000);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('last_donation_closed', Date.now().toString());
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    {/* High-Fidelity Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-[#020817]/80 backdrop-blur-xl"
                    />

                    {/* Premium Modal Architecture */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40, rotateX: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 40, rotateX: 20 }}
                        transition={{ type: "spring", damping: 20, stiffness: 100 }}
                        className="relative w-full max-w-xl bg-glass-fill border-2 border-glass-stroke backdrop-blur-3xl rounded-[60px] p-10 md:p-16 shadow-[0_80px_160px_rgba(0,0,0,0.4)] overflow-hidden"
                    >
                        {/* Dynamic Luminescence */}
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 blur-[120px] -translate-y-1/2 translate-x-1/2 rounded-full" />
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-neon/15 blur-[120px] translate-y-1/2 -translate-x-1/2 rounded-full" />

                        <button
                            onClick={handleClose}
                            className="absolute top-10 right-10 p-3 rounded-2xl hover:bg-glass-stroke text-primary/40 hover:text-neon transition-all"
                        >
                            <X size={24} />
                        </button>

                        <div className="relative z-10 space-y-12 text-center">
                            <div className="flex justify-center flex-col items-center gap-6">
                                <motion.div
                                    animate={{
                                        rotate: [0, 5, -5, 0],
                                        scale: [1, 1.05, 1],
                                        boxShadow: [
                                            "0 0 20px rgba(var(--primary),0.2)",
                                            "0 0 40px rgba(var(--primary),0.4)",
                                            "0 0 20px rgba(var(--primary),0.2)"
                                        ]
                                    }}
                                    transition={{ duration: 5, repeat: Infinity }}
                                    className="w-28 h-28 rounded-[2.5rem] bg-gradient-to-br from-primary via-primary/80 to-neon flex items-center justify-center text-background shadow-2xl relative group"
                                >
                                    <div className="absolute inset-0 rounded-[2.5rem] bg-white opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
                                    <Heart size={48} fill="currentColor" className="relative z-10" />
                                </motion.div>
                                <div className="px-5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-[0.4em]">Proprietary Excellence</div>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-contrast uppercase italic leading-[0.9] text-balance">
                                    FUEL THE <br /> <span className="text-neon underline decoration-neon/30 underline-offset-8">STUDIO ARCHIVE</span>
                                </h2>
                                <p className="text-foreground/70 text-lg md:text-xl font-bold leading-relaxed max-w-md mx-auto italic">
                                    "I curate high-performance tools for your digital excellence. If Studio has elevated your workflow, consider a masterpiece contribution."
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <motion.a
                                    href="https://kelal.abelo.tech/bundle/support"
                                    target="_blank"
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group relative h-20 rounded-[2rem] bg-primary text-background font-black uppercase tracking-widest text-sm shadow-2xl shadow-primary/40 flex items-center justify-center gap-4 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    <Coffee size={24} />
                                    <span>COFFEE FUEL</span>
                                </motion.a>

                                <motion.a
                                    href="https://jami.bio/Abelb"
                                    target="_blank"
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group relative h-20 rounded-[2rem] bg-glass-fill border-2 border-glass-stroke text-contrast font-black uppercase tracking-widest text-sm hover:border-neon transition-all flex items-center justify-center gap-4"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-neon/10 flex items-center justify-center text-neon group-hover:bg-neon group-hover:text-background transition-colors">
                                        <Heart size={20} fill="currentColor" />
                                    </div>
                                    <span>JAMI DROP</span>
                                </motion.a>
                            </div>

                            <button
                                onClick={() => {
                                    handleClose();
                                    // Trigger the sign-in flow if user is not authenticated
                                    // This is handled via a shared custom event or by simply letting the user
                                    // click the main button, but let's make it work directly if possible.
                                    window.dispatchEvent(new CustomEvent('trigger-studio-login'));
                                }}
                                className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/30 hover:text-primary transition-all hover:tracking-[0.7em]"
                            >
                                CONTINUE TO STUDIO • ይቀጥሉ
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
