"use client";

import React, { useState, useRef, useEffect } from 'react';
import { HexAlphaColorPicker } from 'react-colorful';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfessionalColorPickerProps {
    color: string;
    onChange: (color: string) => void;
    label: string;
    description?: string;
    disabled?: boolean;
}

export function ProfessionalColorPicker({ color, onChange, label, description, disabled }: ProfessionalColorPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(color);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center px-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-contrast">{label}</span>
                {description && <span className="text-[8px] font-bold text-primary/40 uppercase tracking-widest italic">{description}</span>}
            </div>

            <div className="relative" ref={popoverRef}>
                <button
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                    className={cn(
                        "w-full relative group/color overflow-hidden rounded-[24px] bg-glass-fill border-2 border-glass-stroke transition-all flex items-center p-1.5",
                        !disabled && "hover:border-primary/40 cursor-pointer active:scale-[0.98]",
                        isOpen && "border-primary ring-4 ring-primary/10 shadow-2xl shadow-primary/20",
                        disabled && "opacity-50 grayscale cursor-not-allowed"
                    )}
                >
                    {/* Checkerboard background for transparency preview */}
                    <div className="w-12 h-12 rounded-2xl shadow-inner border border-white/5 relative overflow-hidden"
                        style={{ backgroundImage: 'conic-gradient(#333 0.25turn, #222 0.25turn 0.5turn, #333 0.5turn 0.75turn, #222 0.75turn)', backgroundSize: '8px 8px' }}>
                        <div className="absolute inset-0" style={{ backgroundColor: color }} />
                    </div>

                    <div className="flex-1 px-4 text-left">
                        <span className="text-xs font-black text-contrast uppercase tracking-tighter block truncate">{color}</span>
                        <span className="text-[8px] font-bold text-primary/30 uppercase tracking-widest italic">
                            {color.includes('rgba') ? 'RGBA PERSPECTIVE' : 'HEX PROTOCOL'}
                        </span>
                    </div>

                    <div className="flex items-center gap-1 pr-2">
                        <div onClick={handleCopy} className="p-2 rounded-xl hover:bg-glass-fill text-primary/30 hover:text-primary transition-all">
                            {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                        </div>
                    </div>
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="absolute z-[100] mt-4 p-6 glass-card rounded-[32px] border-glass-stroke shadow-2xl min-w-[280px]"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                        <Palette size={14} />
                                    </div>
                                    <span className="text-[10px] font-black tracking-[0.2em] text-contrast uppercase">Master Engine</span>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="text-primary/30 hover:text-white transition-colors">
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="p-1.5 bg-background/50 rounded-[24px] border border-glass-stroke shadow-inner overflow-hidden">
                                    <HexAlphaColorPicker color={color} onChange={onChange} className="!w-full !rounded-2xl" />
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 bg-glass-fill border border-glass-stroke rounded-2xl px-4 py-3">
                                        <div className="text-[8px] font-black text-primary/40 uppercase tracking-widest">Active</div>
                                        <input
                                            type="text"
                                            value={color}
                                            onChange={(e) => onChange(e.target.value)}
                                            className="flex-1 bg-transparent text-[10px] font-black text-contrast uppercase tracking-[0.2em] outline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 gap-2">
                                        {['#00f2ff', '#ff0055', '#7000ff', '#00ff73', '#ffae00', '#ffffff', '#000000', 'rgba(0,0,0,0)'].map((c, i) => (
                                            <button
                                                key={i}
                                                onClick={() => onChange(c)}
                                                className="h-10 rounded-xl border border-glass-stroke hover:scale-110 active:scale-95 transition-all shadow-lg overflow-hidden relative"
                                                style={{ backgroundImage: 'conic-gradient(#333 0.25turn, #222 0.25turn 0.5turn, #333 0.5turn 0.75turn, #222 0.75turn)', backgroundSize: '8px 8px' }}
                                            >
                                                <div className="absolute inset-0" style={{ backgroundColor: c }} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
