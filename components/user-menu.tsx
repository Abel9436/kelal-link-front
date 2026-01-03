"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from './auth-context';
import { useGoogleLogin } from '@react-oauth/google';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, LogOut, LayoutDashboard, User as UserIcon, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function UserMenu() {
    const { user, login, logout, isLoading } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log("Studio verification in progress...");
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/google`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ access_token: tokenResponse.access_token })
                });
                const data = await res.json();
                if (data.access_token) {
                    console.log("Studio identity confirmed.");
                    login(data.access_token, data.user);
                }
            } catch (err) {
                console.error("Studio identity handshake failed:", err);
            }
        },
        onError: () => console.error("Studio identity handshake failed.")
    });

    useEffect(() => {
        const handleTriggerLogin = () => {
            if (!user) {
                googleLogin();
            }
        };
        window.addEventListener('trigger-studio-login', handleTriggerLogin);
        return () => window.removeEventListener('trigger-studio-login', handleTriggerLogin);
    }, [user, googleLogin]);

    if (isLoading) return <div className="w-10 h-10 rounded-full bg-glass-fill animate-pulse" />;

    if (!user) {
        return (
            <div className="flex items-center gap-4">
                <button
                    onClick={() => googleLogin()}
                    className="flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-primary text-background font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-[0_15px_30px_rgba(var(--primary),0.3)] group relative overflow-hidden h-[44px]"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <div className="w-5 h-5 bg-white rounded-lg flex items-center justify-center p-1 flex-shrink-0">
                        <svg viewBox="0 0 24 24" className="w-full h-full">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
                        </svg>
                    </div>
                    <span>Continue with Studio</span>
                </button>
            </div>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-glass-fill border border-glass-stroke hover:border-primary/30 transition-all group"
            >
                <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-white/10 group-hover:border-primary/50 transition-colors">
                    {user.profile_pic ? (
                        <Image
                            src={user.profile_pic}
                            alt={user.name || "User"}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary">
                            <UserIcon size={14} />
                        </div>
                    )}
                </div>
                <div className="hidden md:block text-left">
                    <p className="text-[10px] font-black uppercase tracking-tight text-contrast leading-none">{user.name}</p>
                    <p className="text-[8px] font-bold text-primary/60 leading-none mt-1">Studio Creator</p>
                </div>
                <ChevronDown size={14} className={cn("text-primary/40 transition-transform duration-300", isOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-3 w-56 glass-card p-2 rounded-[24px] border-glass-stroke shadow-2xl z-50 overflow-hidden"
                        >
                            <div className="px-4 py-3 border-b border-glass-stroke">
                                <p className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] mb-1">Authenticated As</p>
                                <p className="text-sm font-black text-contrast truncate">{user.email}</p>
                            </div>

                            <div className="p-1 space-y-1">
                                <Link
                                    href="/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-glass-stroke text-primary/80 hover:text-contrast transition-all group"
                                >
                                    <div className="p-1.5 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-background transition-colors">
                                        <LayoutDashboard size={14} />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest">My Drops</span>
                                </Link>

                                <button
                                    onClick={() => { logout(); setIsOpen(false); }}
                                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-500/60 hover:text-red-500 transition-all group"
                                >
                                    <div className="p-1.5 bg-red-500/10 rounded-lg transition-colors">
                                        <LogOut size={14} />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest">Sign Out</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
