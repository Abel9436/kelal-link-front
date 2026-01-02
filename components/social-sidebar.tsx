
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Instagram, Globe, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SocialSidebar() {
    const socials = [
        { icon: Github, url: "https://github.com/Abel9436", label: "GitHub" },
        { icon: Linkedin, url: "https://www.linkedin.com/in/abelabekele", label: "LinkedIn" },
        { icon: Twitter, url: "https://x.com/abelbk007", label: "Twitter" },
        { icon: Instagram, url: "https://www.instagram.com/abel.techh/", label: "Instagram" },
    ];

    return (
        <div className="fixed left-6 top-1/2 -translate-y-1/2 z-[100] hidden lg:flex flex-col items-center gap-8">
            {/* Top Connector */}
            <motion.div
                initial={{ height: 0 }}
                animate={{ height: 60 }}
                className="w-[2px] bg-gradient-to-b from-transparent via-primary/20 to-primary"
            />

            {/* Social Icons */}
            <div className="flex flex-col gap-5">
                {socials.map((s, i) => (
                    <motion.a
                        key={i}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ x: 5, color: 'rgb(var(--neon))' }}
                        className="p-3 rounded-xl glass-card border-2 border-primary/10 dark:border-none hover:bg-neon/10 text-primary dark:text-primary/40 transition-all duration-300 relative group"
                    >
                        <s.icon size={20} />

                        {/* Tooltip */}
                        <span className="absolute left-full ml-4 px-3 py-1.5 rounded-lg bg-foreground dark:bg-contrast text-background text-[10px] font-black uppercase tracking-widest opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap">
                            {s.label}
                        </span>
                    </motion.a>
                ))}
            </div>

            {/* Vertical Website Link */}
            <motion.a
                href="https://abelo.tech"
                target="_blank"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5, color: 'rgb(var(--neon))' }}
                className="flex items-center gap-3 text-primary dark:text-primary/40 transition-all duration-300 group pt-4"
            >
                <div className="flex flex-col items-center gap-4">
                    <span className="[writing-mode:vertical-lr] text-[10px] font-black uppercase tracking-[0.5em] group-hover:text-neon transition-colors rotate-180">
                        ABEL ABETEKETE
                    </span>
                    <Globe size={18} className="group-hover:rotate-12 transition-transform" />
                </div>
            </motion.a>

            {/* Bottom Connector */}
            <motion.div
                initial={{ height: 0 }}
                animate={{ height: 100 }}
                className="w-[2px] bg-gradient-to-t from-transparent via-primary/20 to-primary"
            />
        </div>
    );
}
