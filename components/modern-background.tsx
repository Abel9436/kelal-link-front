"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const AMHARIC_CHARS = "ሀለሐመሠረሰሸቀበተቸኀነኘአከኸወዐዘዠየደጀገጠጨጰጸፀፈፐ";

export function ModernBackground() {
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
        <div className="fixed inset-0 -z-10 overflow-hidden bg-background transition-colors duration-500">
            {/* Cinematic GIF Background */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-black">
                <img
                    src="/1231.gif"
                    alt="Ethiopian Heritage"
                    className="w-full h-full object-cover opacity-[0.4] dark:opacity-[0.6] contrast-110 saturate-[0.8]"
                    onLoad={() => console.log("GIF Loaded")}
                />
                {/* Professional Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-background via-background/40 to-background z-10" />
                {/* Central Vignette for Content Readability */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(var(--background),0.4)_100%)] z-15" />
                <div className="absolute inset-0 bg-emerald-950/20 dark:bg-emerald-950/30 z-20 backdrop-blur-[6px]" />
            </div>

            {/* Dynamic Orbs */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 blur-[120px] z-30" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-green-600/10 dark:bg-green-600/20 blur-[120px] z-30" />

            {/* Floating Amharic Characters */}
            {elements.map((el) => (
                <motion.div
                    key={el.id}
                    initial={{ opacity: 0, y: "100vh" }}
                    animate={{
                        opacity: [0, 0.15, 0],
                        y: ["100vh", "-10vh"],
                        x: [`${el.x}vw`, `${el.x + (Math.random() * 10 - 5)}vw`],
                        rotate: [0, 360]
                    }}
                    transition={{
                        duration: el.duration,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute pointer-events-none text-emerald-600/20 dark:text-emerald-400/15 font-bold select-none z-40"
                    style={{ fontSize: el.size }}
                >
                    {el.char}
                </motion.div>
            ))}

            {/* Heritage Pattern Texture */}
            <div className="absolute inset-0 heritage-pattern opacity-[0.05] dark:opacity-[0.1] z-50 pointer-events-none" />

            {/* Scanline Effect for Cinematic Look */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%] pointer-events-none z-50 opacity-20" />
        </div>
    );
}
