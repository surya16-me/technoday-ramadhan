"use client";

import { motion } from "framer-motion";

export default function FloatingKetupat({
    delay = 0,
    x = 0,
    y = 0,
    size = 64,
    rotate = 45
}: {
    delay?: number;
    x?: number;
    y?: number;
    size?: number;
    rotate?: number;
}) {
    return (
        <motion.div
            initial={{ y: y, x: x, rotate: rotate, opacity: 0 }}
            animate={{
                y: [y, y - 20, y],
                rotate: [rotate, rotate + 5, rotate - 5, rotate],
                opacity: 1
            }}
            transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay
            }}
            className="absolute z-0 pointer-events-none drop-shadow-2xl"
            style={{ width: size, height: size }}
        >
            {/* CSS-only Ketupat Shape */}
            <div className="w-full h-full relative">
                <div className="absolute inset-0 bg-gradient-to-br from-rama-green to-rama-gold transform rotate-45 rounded-sm opacity-80 border border-rama-white/20"></div>
                <div className="absolute inset-[15%] bg-rama-maroon/20 transform rotate-45 rounded-sm"></div>
                {/* Weaving lines */}
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-rama-black/30 -rotate-45 transform origin-center"></div>
                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-rama-black/30 -rotate-45 transform origin-center"></div>
            </div>
        </motion.div>
    );
}
