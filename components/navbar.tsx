"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus, Bell, Users, LayoutDashboard,
    Settings, LogOut, ChevronDown,
    Moon, Sun, Globe, CheckCircle2,
    Sparkles, ArrowLeft
} from "lucide-react";
import { useAuth } from "@/components/auth-context";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useGoogleLogin } from '@react-oauth/google';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function Navbar({ children, dashboardProps }: { children?: React.ReactNode; dashboardProps?: { isTeamsActive: boolean; setIsTeamsActive: (v: boolean) => void } }) {
    const { user, token, login, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const { setTheme, resolvedTheme } = useTheme();
    const [lang, setLang] = useState<"en" | "am">("en");
    const [notifications, setNotifications] = useState<any[]>([]);
    const [showNotifs, setShowNotifs] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log("Studio verification in progress...");
            try {
                const res = await fetch(`${API_URL}/auth/google`, {
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

    useEffect(() => {
        const savedLang = localStorage.getItem("app_lang");
        if (savedLang === "am" || savedLang === "en") setLang(savedLang);
    }, []);

    const toggleLang = () => {
        const newLang = lang === "en" ? "am" : "en";
        setLang(newLang);
        localStorage.setItem("app_lang", newLang);
        window.dispatchEvent(new Event('language-change'));
    };

    const fetchNotifications = async () => {
        if (!token) return;
        try {
            const res = await fetch(`${API_URL}/api/notifications`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (token) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [token]);

    const markAsRead = async (id: number) => {
        try {
            await fetch(`${API_URL}/api/notifications/${id}/read`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    const isDashboard = pathname === "/dashboard";
    const isEditing = pathname?.startsWith("/edit/");

    return (
        <nav className="fixed top-0 w-full z-50 px-4 md:px-6 py-4 flex justify-between items-center bg-background/5 backdrop-blur-xl border-b border-glass-stroke transition-all duration-500">
            {/* Left: Brand Identity */}
            <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-2 md:gap-3 group">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-primary flex items-center justify-center text-background font-black text-xl md:text-2xl shadow-xl shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform">ቀ</div>
                    <div className="hidden sm:block">
                        <h1 className="font-black text-lg md:text-xl tracking-tighter uppercase text-contrast leading-none">
                            {isDashboard ? "Studio Hub" : "Kelal Link"}
                        </h1>
                        <p className="text-[7px] md:text-[8px] font-black text-neon tracking-[0.3em] uppercase opacity-60">Identity Protocol</p>
                    </div>
                </Link>

                {isEditing && (
                    <>
                        <div className="h-6 w-px bg-glass-stroke hidden md:block mx-2" />
                        <button onClick={() => router.back()} className="p-2.5 rounded-xl bg-glass-fill hover:bg-glass-stroke transition-colors text-primary/80">
                            <ArrowLeft size={16} />
                        </button>
                    </>
                )}
            </div>

            {/* Right: Actions & Universal Menu */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* Major Actions Slot */}
                {children}

                {/* Notification Pulse */}
                {user && (
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifs(!showNotifs)}
                            className={cn(
                                "p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-glass-fill border border-glass-stroke text-primary hover:bg-glass-stroke transition-all relative",
                                showNotifs && "bg-neon/10 border-neon text-neon"
                            )}
                        >
                            <Bell size={18} />
                            {notifications.some(n => !n.is_read) && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background animate-ping" />
                            )}
                        </button>

                        <AnimatePresence>
                            {showNotifs && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    className="absolute right-0 mt-4 w-72 md:w-80 bg-background/95 backdrop-blur-2xl border border-glass-stroke rounded-3xl shadow-2xl z-[60] overflow-hidden"
                                >
                                    <div className="p-5 border-b border-glass-stroke flex justify-between items-center bg-glass-fill/20">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-contrast">Alerts</h3>
                                        <span className="text-[8px] font-bold text-neon uppercase tracking-widest">{notifications.filter(n => !n.is_read).length} Pending</span>
                                    </div>
                                    <div className="max-h-[350px] overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="p-10 text-center text-primary/30 text-[10px] italic">No active frequency...</div>
                                        ) : (
                                            notifications.map(n => (
                                                <div
                                                    key={n.id}
                                                    onClick={() => {
                                                        if (!n.is_read) markAsRead(n.id);
                                                        if (n.link) router.push(n.link);
                                                        setShowNotifs(false);
                                                    }}
                                                    className={cn(
                                                        "p-4 border-b border-glass-stroke/50 hover:bg-glass-fill transition-all cursor-pointer group",
                                                        !n.is_read && "bg-neon/5"
                                                    )}
                                                >
                                                    <p className="text-[10px] font-black uppercase tracking-tight text-contrast mb-1">{n.title}</p>
                                                    <p className="text-[10px] font-medium text-primary/60 leading-tight mb-2">{n.message}</p>
                                                    <div className="flex justify-between items-center text-[8px] font-bold text-primary/30 uppercase italic">
                                                        <span>{new Date(n.created_at).toLocaleDateString()}</span>
                                                        {n.is_read && <CheckCircle2 size={10} className="opacity-40" />}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* Universal Menu */}
                <div className="relative">
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className={cn(
                            "flex items-center gap-2 p-1.5 pr-3 md:pr-4 rounded-xl md:rounded-2xl bg-glass-fill border border-glass-stroke hover:border-primary/30 transition-all group",
                            showSettings && "border-primary/50"
                        )}
                    >
                        <div className="w-8 h-8 rounded-lg md:rounded-xl overflow-hidden bg-primary/10 flex items-center justify-center text-primary border border-white/5">
                            {user?.profile_pic ? (
                                <img src={user.profile_pic} className="w-full h-full object-cover" alt="" />
                            ) : (
                                <Sparkles size={16} />
                            )}
                        </div>
                        <ChevronDown size={14} className={cn("text-primary/40 transition-transform duration-300", showSettings && "rotate-180")} />
                    </button>

                    <AnimatePresence>
                        {showSettings && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowSettings(false)} />
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-4 w-56 md:w-64 glass-card p-2 rounded-[24px] border-glass-stroke shadow-2xl z-50"
                                >
                                    <div className="px-4 py-3 border-b border-glass-stroke">
                                        <p className="text-[8px] font-black text-primary/40 uppercase tracking-[0.2em] mb-1">Signed In As</p>
                                        <p className="text-xs font-black text-contrast truncate">{user?.email || "Guest"}</p>
                                    </div>

                                    <div className="p-1 space-y-1">
                                        {/* Language Toggle */}
                                        <button onClick={toggleLang} className="flex items-center justify-between w-full px-4 py-3 rounded-xl hover:bg-glass-stroke text-primary/80 transition-all">
                                            <div className="flex items-center gap-3">
                                                <Globe size={14} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{lang === 'en' ? 'Amharic' : 'English'}</span>
                                            </div>
                                            <span className="text-[8px] font-black px-2 py-0.5 rounded bg-primary/10 text-primary">{lang === 'en' ? 'AM' : 'EN'}</span>
                                        </button>

                                        {/* Theme Toggle */}
                                        <button onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')} className="flex items-center justify-between w-full px-4 py-3 rounded-xl hover:bg-glass-stroke text-primary/80 transition-all">
                                            <div className="flex items-center gap-3">
                                                {resolvedTheme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                                                <span className="text-[10px] font-black uppercase tracking-widest">{resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                                            </div>
                                        </button>

                                        {user && (
                                            <>
                                                <Link href="/dashboard" onClick={() => setShowSettings(false)} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-glass-stroke text-primary/80 transition-all">
                                                    <LayoutDashboard size={14} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Dashboard</span>
                                                </Link>
                                                <div className="h-px bg-glass-stroke mx-2 my-1" />
                                                <button onClick={() => { logout(); setShowSettings(false); }} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-500/60 transition-all">
                                                    <LogOut size={14} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Terminate Session</span>
                                                </button>
                                            </>
                                        )}

                                        {!user && (
                                            <button
                                                onClick={() => {
                                                    setShowSettings(false);
                                                    window.dispatchEvent(new Event('trigger-studio-login'));
                                                }}
                                                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-primary text-background transition-all"
                                            >
                                                <Sparkles size={14} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Join Studio</span>
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </nav>
    );
}
