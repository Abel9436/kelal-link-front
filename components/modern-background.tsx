"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const AMHARIC_CHARS = "ሀለሐመሠረሰሸቀበተቸኀነኘአከኸወዐዘዠየደጀገጠጨጰጸፀፈፐ";

export function ModernBackground({ themeColor = "#10b981", bgColor, bgImage }: { themeColor?: string; bgColor?: string; bgImage?: string }) {
    const [elements, setElements] = useState<{ id: number; char: string; x: number; y: number; size: number; duration: number }[]>([]);

    useEffect(() => {
        const newElements = Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            char: AMHARIC_CHARS[Math.floor(Math.random() * AMHARIC_CHARS.length)],
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 30 + 15,
            duration: Math.random() * 15 + 15,
        }));
        setElements(newElements);
    }, []);

    return (
        <div
            className="fixed inset-0 -z-10 overflow-hidden bg-background transition-colors duration-500"
            style={bgColor ? { backgroundColor: bgColor } : {}}
        >
            {/* Cinematic GIF Background */}
            <div
                className="absolute inset-0 z-0 overflow-hidden bg-background"
                style={bgColor ? { backgroundColor: bgColor } : {}}
            >
                {/* Background Image Layer */}
                {bgImage && (
                    <div
                        className="absolute inset-0 z-1 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
                        style={{
                            backgroundImage: `url(${bgImage})`,
                            opacity: 0.35
                        }}
                    />
                )}

                {/* Cinematic Depth Orbs */}
                <div
                    className="absolute top-1/4 left-1/4 w-[60%] h-[60%] rounded-full blur-[120px] animate-pulse opacity-10 dark:opacity-20"
                    style={{ backgroundColor: themeColor, zIndex: 2 }}
                />
                <div
                    className="absolute bottom-1/4 right-1/4 w-[60%] h-[60%] rounded-full blur-[120px] animate-pulse-slow opacity-10 dark:opacity-20"
                    style={{ backgroundColor: themeColor, zIndex: 2 }}
                />

                {/* Professional Overlays */}
                <div className={cn(
                    "absolute inset-0 z-10 bg-gradient-to-b",
                    bgImage ? "from-transparent via-background/40 to-background" : "from-background via-background/60 dark:via-background/40 to-background"
                )} />
                {/* Central Vignette for Content Readability */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(var(--background),0.6)_100%)] z-15" />
                <div className="absolute inset-0 z-20 backdrop-blur-[4px] dark:backdrop-blur-[6px] opacity-10" style={{ backgroundColor: themeColor }} />
            </div>

            {/* Dynamic Orbs */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] z-30 opacity-10" style={{ backgroundColor: themeColor }} />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] z-30 opacity-10" style={{ backgroundColor: themeColor }} />

            {/* Floating Amharic Characters */}
            {elements.map((el) => (
                <motion.div
                    key={el.id}
                    initial={{ opacity: 0, y: "100vh" }}
                    animate={{
                        opacity: [0, 0.1, 0],
                        y: ["100vh", "-10vh"],
                        x: [`${el.x}vw`, `${el.x + (Math.random() * 10 - 5)}vw`],
                        rotate: [0, 360]
                    }}
                    transition={{
                        duration: el.duration,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute pointer-events-none font-bold select-none z-40"
                    style={{ fontSize: el.size, color: themeColor }}
                >
                    {el.char}
                </motion.div>
            ))}

            {/* Heritage Pattern Texture */}
            <div className="absolute inset-0 heritage-pattern opacity-[0.02] dark:opacity-[0.1] z-50 pointer-events-none" />

            {/* Scanline Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%] pointer-events-none z-50 opacity-20" />
        </div>
    );
}
