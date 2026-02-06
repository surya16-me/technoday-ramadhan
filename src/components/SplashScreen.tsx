"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Check, Zap } from "lucide-react";

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
    const [step, setStep] = useState(0);

    useEffect(() => {
        // Sequence of lights
        const timeouts = [
            setTimeout(() => setStep(1), 300),  // Light 1
            setTimeout(() => setStep(2), 600), // Light 2
            setTimeout(() => setStep(3), 900), // Light 3
            setTimeout(() => setStep(4), 1200), // Light 4
            setTimeout(() => setStep(5), 1500), // Light 5
            setTimeout(() => setStep(6), 2200), // GO! (Green) - paused slightly for tension
            setTimeout(() => onFinish(), 3500), // Finish
        ];

        return () => timeouts.forEach((t) => clearTimeout(t));
    }, [onFinish]);

    return (
        <motion.div
            className="fixed inset-0 z-50 bg-rama-dark-green flex flex-col items-center justify-center pointer-events-none"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1 } }}
        >
            {/* Racing Lights Container */}
            <div className="bg-black/40 p-6 rounded-3xl border border-rama-gold/20 backdrop-blur-sm mb-12 shadow-2xl">
                <div className="flex gap-4 md:gap-8">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex flex-col gap-2 bg-black/50 p-2 rounded-lg border border-white/10">
                            {/* Off Light (Red placeholder) */}
                            <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full transition-all duration-100 ${step >= 6
                                ? "bg-transparent opacity-20" // Go state (reds off)
                                : step >= i
                                    ? "bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.8)] scale-110" // Red On
                                    : "bg-[#2a0a0a]" // Off
                                }`}></div>

                            {/* Green Light (Only on at step 6) */}
                            <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full transition-all duration-100 ${step === 6
                                ? "bg-green-500 shadow-[0_0_40px_rgba(34,197,94,0.9)] scale-110"
                                : "bg-[#051a0d]"
                                }`}></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Text Animation */}
            <div className="h-24 flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {step < 5 && (
                        <motion.h2
                            key="preparing"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-rama-gold/60 text-xs md:text-xl font-sans uppercase tracking-widest md:tracking-[0.5em] text-center px-4"
                        >
                            P r e p a r i n g   P i t   L a n e . . .
                        </motion.h2>
                    )}
                    {step >= 5 && step < 6 && (
                        <motion.h2
                            key="ready"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1.2 }}
                            exit={{ opacity: 0, scale: 2 }}
                            className="text-red-500 text-3xl md:text-4xl font-black font-sans uppercase tracking-widest"
                        >
                            READY
                        </motion.h2>
                    )}
                    {step === 6 && (
                        <motion.div
                            key="go"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1.5 }}
                            className="text-center"
                        >
                            <h1 className="text-green-500 text-5xl md:text-8xl font-black font-sans italic tracking-tighter drop-shadow-[0_0_30px_rgba(34,197,94,0.8)]">
                                GO!
                            </h1>
                            <p className="text-white mt-4 text-xs md:text-sm font-serif italic tracking-wide">Ramadhan Kareem</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
