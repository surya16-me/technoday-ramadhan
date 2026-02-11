"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle, Quote, Sparkles, Maximize2, Minimize2 } from "lucide-react";
import { useShuffleComments } from "@/hooks/useComments";
import { Comment } from "@/services/commentService";

export default function ShuffleCard() {
    const { data: comments = [], isLoading, isError, refetch } = useShuffleComments();
    const [currentCard, setCurrentCard] = useState<Comment | null>(null);
    const [isShuffling, setIsShuffling] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // SFX References (Optional: Add audio elements later if requested)

    const shuffle = async () => {
        if (!comments || comments.length === 0) return;

        // Refetch to get latest comments before shuffling
        await refetch();

        setIsShuffling(true);
        setCurrentCard(null);

        // Dramatic Shuffle Sequence
        let duration = 3000; // 3 seconds total shuffle
        let intervalTime = 50; // Start fast
        let elapsed = 0;

        const shuffleInterval = () => {
            const randomIdx = Math.floor(Math.random() * comments.length);
            setCurrentCard(comments[randomIdx]);

            elapsed += intervalTime;

            // Slow down towards the end
            if (elapsed > duration * 0.7) intervalTime += 20;

            if (elapsed < duration) {
                setTimeout(shuffleInterval, intervalTime);
            } else {
                setIsShuffling(false);
                // Final pick
                const finalIdx = Math.floor(Math.random() * comments.length);
                setCurrentCard(comments[finalIdx]);
            }
        };

        shuffleInterval();
    };

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center p-12">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-rama-gold border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-rama-gold font-mono animate-pulse">Memuat Kartu...</p>
                </div>
            </div>
        );
    }

    if (isError) return <div className="text-center p-12 text-zinc-500">Gagal memuat kartu. Silakan refresh.</div>;
    if (comments.length === 0) return <div className="text-center p-12 text-zinc-500">Belum ada curhatan yang masuk nih.</div>;

    return (
        <div className={`flex flex-col items-center justify-center transition-all duration-500 ${isFullscreen ? 'fixed inset-0 z-50 bg-black/95 p-10' : 'py-12 w-full'}`}>

            {/* Control Bar */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-3 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                    title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                >
                    {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
                </button>
            </div>

            {/* Main Card Area */}
            <div className={`relative w-full perspective-1000 ${isFullscreen ? 'max-w-4xl h-[70vh]' : 'max-w-2xl h-[400px]'}`}>
                <AnimatePresence mode="wait">
                    {currentCard ? (
                        <motion.div
                            key={isShuffling ? "shuffling" : currentCard.id}
                            initial={{ scale: 0.9, opacity: 0, rotateX: 90 }}
                            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                            exit={{ scale: 0.9, opacity: 0, rotateX: -90 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className={`absolute inset-0 w-full h-full rounded-3xl p-8 md:p-16 flex flex-col items-center justify-center text-center shadow-[0_0_50px_rgba(255,200,69,0.15)] border border-rama-gold/30 bg-gradient-to-br from-zinc-900 via-black to-zinc-900 overflow-hidden relative group`}
                        >
                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-rama-gold to-transparent opacity-50"></div>
                            <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-rama-gold to-transparent opacity-50"></div>

                            {!isShuffling && (
                                <>
                                    <div className="absolute top-10 left-10 opacity-20"><Quote size={60} className="text-rama-gold rotate-180" /></div>
                                    <div className="absolute bottom-10 right-10 opacity-20"><Quote size={60} className="text-rama-gold" /></div>

                                    {/* Flash Effect on Reveal */}
                                    <motion.div
                                        initial={{ opacity: 1 }}
                                        animate={{ opacity: 0 }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        className="absolute inset-0 bg-white pointer-events-none z-50"
                                    />

                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1.5, opacity: 0 }}
                                        transition={{ duration: 1 }}
                                        className="absolute inset-0 bg-rama-gold/20 rounded-3xl"
                                    />
                                </>
                            )}

                            {/* Content */}
                            <div className="relative z-10 max-w-2xl w-full overflow-hidden">
                                {isShuffling ? (
                                    <div className="relative h-40 overflow-hidden mask-linear-fade flex items-center justify-center">
                                        <AnimatePresence mode="popLayout">
                                            {currentCard && (
                                                <motion.div
                                                    key={currentCard.id + Math.random()} // Force unique key for rapid updates
                                                    initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                                                    animate={{ opacity: 0.5, y: 0, filter: "blur(4px)" }}
                                                    exit={{ opacity: 0, y: -50, filter: "blur(10px)" }}
                                                    transition={{ duration: 0.1, ease: "linear" }}
                                                    className="absolute w-full"
                                                >
                                                    <p className={`font-serif italic text-center text-zinc-500/80 ${isFullscreen ? 'text-2xl' : 'text-xl'} line-clamp-2`}>
                                                        "{currentCard.content}"
                                                    </p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <motion.p
                                        key="final-reveal"
                                        initial={{ scale: 1.2, filter: "blur(10px)", opacity: 0 }}
                                        animate={{ scale: 1, filter: "blur(0px)", opacity: 1 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                        className={`font-serif italic font-medium leading-relaxed ${isFullscreen ? 'text-3xl md:text-5xl' : 'text-2xl md:text-3xl'} text-rama-gold drop-shadow-lg`}
                                    >
                                        "{currentCard.content}"
                                    </motion.p>
                                )}

                                {!isShuffling && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="mt-8 flex items-center justify-center gap-2 text-zinc-400 font-mono text-sm uppercase tracking-widest"
                                    >
                                        <Sparkles size={16} className="text-rama-gold" />
                                        Anonymous Message
                                        <Sparkles size={16} className="text-rama-gold" />
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <div className="absolute inset-0 w-full h-full bg-zinc-900/40 backdrop-blur-sm rounded-3xl border-2 border-dashed border-zinc-700 flex flex-col items-center justify-center text-zinc-500 gap-4">
                            <Shuffle size={48} className="opacity-50" />
                            <p className="text-xl font-medium">Siap guncang panggung?</p>
                            <p className="text-sm">Klik tombol di bawah untuk mulai mengocok!</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Action Button */}
            <div className="mt-12 relative z-50">
                <button
                    onClick={shuffle}
                    disabled={isShuffling}
                    className={`group relative px-10 py-5 bg-rama-gold text-black rounded-full font-black text-xl md:text-2xl tracking-wider shadow-[0_0_30px_rgba(255,200,69,0.3)] hover:shadow-[0_0_50px_rgba(255,200,69,0.6)] hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    <div className="absolute inset-0 rounded-full border-2 border-white/20 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500"></div>
                    <span className="flex items-center gap-3">
                        {isShuffling ? (
                            <>
                                <Shuffle className="w-6 h-6 animate-spin" />
                                SHUFFLING...
                            </>
                        ) : (
                            <>
                                SHUFFLE CARD
                                <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                            </>
                        )}
                    </span>
                </button>
            </div>
        </div>
    );
}
