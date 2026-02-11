"use client";

import { motion } from "framer-motion";

export default function Lanterns() {
    return (
        <div className="absolute top-0 left-0 w-full h-64 pointer-events-none z-0 overflow-hidden">
            {/* Decorative Strings */}
            <svg className="absolute top-0 left-0 w-full h-full" preserveAspectRatio="none">
                <path d="M0,0 Q100,60 200,0 T400,0 T600,0 T800,0 T1000,0 T1200,0 T1400,0" fill="none" stroke="#FFC845" strokeWidth="1" strokeOpacity="0.5" />
                <path d="M-50,0 Q50,90 150,0 T350,0 T550,0 T750,0 T950,0 T1150,0" fill="none" stroke="#FFC845" strokeWidth="1" strokeOpacity="0.3" />
            </svg>

            {/* Hanging Lanterns */}
            {[10, 25, 40, 60, 75, 90].map((left, i) => (
                <Lantern key={i} left={`${left}%`} delay={i * 0.2} duration={2 + i * 0.5} scale={0.6 + (i % 3) * 0.2} />
            ))}
        </div>
    );
}

function Lantern({ left, delay, duration, scale }: { left: string, delay: number, duration: number, scale: number }) {
    return (
        <motion.div
            initial={{ rotate: -8 }}
            animate={{ rotate: 8 }}
            transition={{
                repeat: Infinity,
                repeatType: "mirror",
                duration: duration,
                ease: "easeInOut",
                delay: delay
            }}
            className="absolute top-0 origin-top"
            style={{ left, scale }}
        >
            <div className="flex flex-col items-center">
                {/* String */}
                <div className="w-[1px] h-20 bg-rama-gold/50"></div>

                {/* Lantern Body */}
                <div className="relative">
                    <svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Top Hook */}
                        <path d="M20 0L20 5" stroke="#FFC845" strokeWidth="2" />
                        {/* Dome */}
                        <path d="M10 10C10 5 15 5 20 5C25 5 30 5 30 10L35 15L5 15L10 10Z" fill="#FFC845" />
                        {/* Main Body */}
                        <rect x="5" y="15" width="30" height="35" rx="2" fill="#FFC845" fillOpacity="0.8" />
                        {/* Pattern inside */}
                        <path d="M10 20L20 30L30 20" stroke="#0b211d" strokeWidth="1" />
                        <path d="M10 35L20 25L30 35" stroke="#0b211d" strokeWidth="1" />
                        <path d="M10 40L20 50L30 40" stroke="#0b211d" strokeWidth="1" />
                        {/* Bottom */}
                        <path d="M15 50L25 50L20 60L15 50Z" fill="#FFC845" />
                    </svg>

                    {/* Main Inner Light Source */}
                    <motion.div
                        animate={{
                            opacity: [0.6, 1, 0.7, 0.9, 0.6, 1, 0.8],
                            scale: [0.9, 1.1, 0.95, 1.05, 0.9, 1.1, 0.95],
                            backgroundColor: ["#fef9c3", "#fde047", "#fef9c3", "#eab308", "#fef9c3"] // yellow-100 -> yellow-300 -> yellow-100 -> yellow-500
                        }}
                        transition={{
                            duration: Math.random() * 2 + 1.5, // Randomize duration slightly for each instance
                            repeat: Infinity,
                            ease: "easeInOut",
                            times: [0, 0.2, 0.4, 0.6, 0.8, 0.9, 1],
                            delay: Math.random() // Random startup
                        }}
                        className="absolute top-[18px] left-[10px] w-[20px] h-[30px] rounded-full blur-md z-10 block"
                    />

                    {/* Outer Ambient Glow - Softer & Larger */}
                    <motion.div
                        animate={{ opacity: [0.2, 0.5, 0.3] }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: delay
                        }}
                        className="absolute top-[10px] left-[0px] w-[40px] h-[50px] bg-orange-400/30 blur-xl rounded-full z-0 block"
                    />
                </div>
            </div>
        </motion.div>
    );
}
