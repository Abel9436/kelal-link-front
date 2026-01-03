"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, ExternalLink, Sparkles } from 'lucide-react';

export function CoffeeWidget() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -20 }}
            animate={{
                opacity: 1,
                scale: 1,
                y: [0, -10, 0],
                x: [0, 5, 0],
                rotate: [0, -2, 2, 0]
            }}
            transition={{
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                x: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.1}
            className="fixed top-24 left-8 z-[100] cursor-grab active:cursor-grabbing"
        >
            <motion.a
                href="https://buymeacoffee.com/abeltech"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative flex items-center gap-3 bg-background/80 md:bg-background/60 backdrop-blur-2xl border-2 border-primary/30 dark:border-primary/20 p-2 pr-6 rounded-full shadow-[0_30px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_60px_rgba(var(--primary),0.2)] hover:border-neon transition-all duration-700"
            >
                {/* Dynamic Gradient Shimmer */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-primary/5 dark:via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                {/* Animated Inner Glow */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/10 to-neon/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Floating Coffee Icon */}
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-neon flex items-center justify-center text-background shadow-lg rotate-0 group-hover:rotate-[360deg] transition-transform duration-1000">
                    <Coffee size={20} className="animate-pulse" />

                    {/* Floating Particles */}
                    <div className="absolute -top-1 -right-1">
                        <Sparkles size={14} className="text-white/60 animate-bounce" />
                    </div>
                </div>

                <div className="flex flex-col">
                    <span className="text-[9px] font-bold md:font-black text-primary/70 dark:text-primary/60 uppercase tracking-[0.3em] leading-none mb-1">
                        Fuel The Studio
                    </span>
                    <span className="text-sm font-black text-foreground dark:text-contrast uppercase tracking-tighter flex items-center gap-2">
                        BUY ME A COFFEE <ExternalLink size={12} className="text-neon" />
                    </span>
                </div>

                {/* Live Status Indicator */}
                <div className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.8)]"></span>
                </div>
            </motion.a>
        </motion.div>
    );
}
