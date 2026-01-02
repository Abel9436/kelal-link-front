
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Sparkles, ExternalLink, Coffee, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DonationPopup() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Show after a short delay for maximum impact
        const timer = setTimeout(() => {
            const hasSeen = sessionStorage.getItem('has_seen_donation');
            if (!hasSeen) {
                setIsOpen(true);
            }
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        sessionStorage.setItem('has_seen_donation', 'true');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-background/90 md:bg-background/80 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-white/95 dark:bg-background/40 border-2 border-primary/20 dark:border-primary/10 backdrop-blur-2xl rounded-[48px] p-8 md:p-12 shadow-[0_50px_100px_rgba(0,0,0,0.15)] dark:shadow-[0_50px_100px_rgba(var(--primary),0.2)] overflow-hidden"
                    >
                        {/* Dynamic Background Accents */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon/10 blur-[100px] translate-y-1/2 -translate-x-1/2" />

                        <button
                            onClick={handleClose}
                            className="absolute top-8 right-8 text-primary/40 hover:text-neon transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="relative z-10 space-y-8 text-center">
                            <div className="flex justify-center">
                                <motion.div
                                    animate={{
                                        rotate: [0, 10, -10, 0],
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-primary to-neon flex items-center justify-center text-background shadow-2xl"
                                >
                                    <Heart size={40} fill="currentColor" />
                                </motion.div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-contrast uppercase italic leading-tight">
                                    Support My <br /> <span className="text-neon">Code Journey</span>
                                </h2>
                                <p className="text-foreground/60 font-medium leading-relaxed max-w-sm mx-auto italic">
                                    "I build tools to simplify your digital life. If ቀላል Link has helped you, consider fueling more innovation with a small donation."
                                </p>
                            </div>

                            <div className="flex flex-col gap-4">
                                <motion.a
                                    href="https://jami.bio/Abelb"
                                    target="_blank"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-6 rounded-[2rem] bg-primary text-background font-black uppercase tracking-widest text-sm shadow-2xl shadow-primary/30 hover:bg-neon transition-all flex items-center justify-center gap-4"
                                >
                                    SUPPORT ON JAMI <Heart size={18} fill="currentColor" className="animate-pulse" />
                                </motion.a>

                                <button
                                    onClick={handleClose}
                                    className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 hover:text-primary transition-colors"
                                >
                                    MAYBE LATER • ይቀጥሉ
                                </button>
                            </div>

                            <div className="pt-4 flex items-center justify-center gap-6 text-primary/20">
                                <Coffee size={20} />
                                <Sparkles size={20} />
                                <Gift size={20} />
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
