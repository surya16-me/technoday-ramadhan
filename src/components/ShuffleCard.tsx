"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle, Quote, Loader2 } from "lucide-react";

interface Comment {
    id: number;
    content: string;
    createdAt: Date;
}

export default function ShuffleCard() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [currentCard, setCurrentCard] = useState<Comment | null>(null);
    const [isShuffling, setIsShuffling] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {
            setIsLoading(true);
            const res = await fetch('/api/comments/shuffle');
            const data = await res.json();
            setComments(data);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const shuffle = () => {
        if (comments.length === 0) return;
        setIsShuffling(true);
        setCurrentCard(null);

        // Simulate shuffling effect
        let count = 0;
        const interval = setInterval(() => {
            const randomIdx = Math.floor(Math.random() * comments.length);
            setCurrentCard(comments[randomIdx]);
            count++;
            if (count > 20) {
                clearInterval(interval);
                setIsShuffling(false);
            }
        }, 100);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-rama-gold" />
            </div>
        );
    }

    if (comments.length === 0) {
        return (
            <div className="text-center p-12 text-zinc-500">
                Belum ada curhatan yang masuk nih.
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="relative w-full max-w-lg aspect-[3/2]">
                <AnimatePresence mode="wait">
                    {currentCard ? (
                        <motion.div
                            key={isShuffling ? "shuffling" : currentCard.id}
                            initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
                            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                            exit={{ scale: 0.8, opacity: 0, rotateY: -90 }}
                            className="absolute inset-0 bg-gradient-to-br from-islamic-green to-teal-900 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl border border-white/20"
                        >
                            <Quote className="w-12 h-12 text-islamic-gold mb-6 opacity-50" />
                            <p className="text-2xl md:text-3xl font-bold text-white leading-relaxed">
                                "{currentCard.content}"
                            </p>
                            <div className="mt-6 text-islamic-gold/60 text-sm font-mono">
                                — Anonymous
                            </div>
                        </motion.div>
                    ) : (
                        <div className="absolute inset-0 bg-zinc-900/50 rounded-3xl border border-white/10 flex items-center justify-center text-zinc-500">
                            <p>Siap untuk mengocok card harapan?</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            <button
                onClick={shuffle}
                disabled={isShuffling}
                className="mt-12 px-8 py-4 bg-gradient-to-r from-racing-red to-orange-600 text-white rounded-full font-bold text-xl shadow-lg hover:shadow-racing-red/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Shuffle className={`w-6 h-6 ${isShuffling ? "animate-spin" : ""}`} />
                {isShuffling ? "Mengocok..." : "Shuffle Card!"}
            </button>
        </div>
    );
}
