"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function FloatingStars() {
    const [stars, setStars] = useState<{ id: number; left: number; top: number; size: number; delay: number }[]>([]);

    useEffect(() => {
        const newStars = Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 100,
            size: Math.random() * 3 + 1, // 1px to 4px
            delay: Math.random() * 5,
        }));
        setStars(newStars);
    }, []);

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {stars.map((star) => (
                <Star key={star.id} {...star} />
            ))}
        </div>
    );
}

function Star({ left, top, size, delay }: { left: number; top: number; size: number; delay: number }) {
    return (
        <motion.div
            className="absolute bg-white rounded-full shadow-[0_0_4px_2px_rgba(255,255,255,0.3)]"
            style={{
                left: `${left}%`,
                top: `${top}%`,
                width: size,
                height: size,
            }}
            animate={{
                opacity: [0.2, 1, 0.2],
                y: [0, -20, 0],
            }}
            transition={{
                duration: 3 + Math.random() * 3, // 3-6 seconds
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay,
            }}
        />
    );
}
