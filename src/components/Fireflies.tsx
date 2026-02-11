"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Fireflies() {
    const [fireflies, setFireflies] = useState<{ id: number; x: number; y: number; size: number; duration: number }[]>([]);

    useEffect(() => {
        // Generate static random positions on mount to avoid hydration mismatch
        const newFireflies = Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100, // random % position
            y: Math.random() * 100,
            size: Math.random() * 4 + 2, // 2px to 6px
            duration: Math.random() * 2 + 2, // 2s to 4s
        }));
        setFireflies(newFireflies);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
            {fireflies.map((fly) => (
                <motion.div
                    key={fly.id}
                    className="absolute rounded-full bg-rama-gold blur-[1px]"
                    style={{
                        left: `${fly.x}%`,
                        top: `${fly.y}%`,
                        width: fly.size,
                        height: fly.size,
                        boxShadow: "0 0 10px rgba(255, 200, 69, 0.8)",
                    }}
                    animate={{
                        x: [0, Math.random() * 60 - 30],
                        y: [0, Math.random() * 60 - 30],
                        opacity: [0, 1, 0],
                        scale: [0.5, 1.2, 0.5],
                    }}
                    transition={{
                        duration: fly.duration,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}
