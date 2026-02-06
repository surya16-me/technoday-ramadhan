"use client";

import { useState } from "react";
import { MessageSquare, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Comment {
    id: number;
    content: string;
    createdAt: Date;
}

interface CommentsListClientProps {
    initialComments: Comment[];
}

const cardThemes = [
    "bg-gradient-to-br from-[#064e3b] to-[#022c22] border-[#34d399]/30 text-[#34d399]", // Islamic Green
    "bg-gradient-to-br from-[#422006] to-[#451a03] border-[#fbbf24]/30 text-[#fbbf24]", // Desert Gold
    "bg-gradient-to-br from-[#3f0f15] to-[#450a0a] border-[#fda4af]/30 text-[#fda4af]", // Dates Maroon (Warm)
    "bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] border-[#94a3b8]/30 text-[#e2e8f0]", // Midnight Prayer (Navy/Silver)
    "bg-gradient-to-br from-[#134e4a] to-[#042f2e] border-[#2dd4bf]/30 text-[#2dd4bf]", // Twilight Teal
];

// Helper to get consistent theme based on id
const getTheme = (id: number) => cardThemes[id % cardThemes.length];

export default function CommentsListClient({ initialComments }: CommentsListClientProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const totalPages = Math.ceil(initialComments.length / itemsPerPage);
    const paginatedComments = initialComments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (initialComments.length === 0) {
        return (
            <div className="text-center py-20">
                <MessageSquare className="w-16 h-16 text-rama-white/20 mx-auto mb-4" />
                <p className="text-rama-white/50 text-lg">Belum ada curhatan yang masuk</p>
                <a
                    href="/"
                    className="inline-block mt-4 px-6 py-2 bg-rama-gold/20 hover:bg-rama-gold/30 border border-rama-gold/50 rounded-lg transition-all"
                >
                    Daftar Sekarang
                </a>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Masonry Grid Layout using CSS Columns */}
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                <AnimatePresence mode="popLayout">
                    {paginatedComments.map((comment, index) => {
                        const themeClass = getTheme(comment.id);
                        return (
                            <motion.div
                                key={comment.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className={`break-inside-avoid relative rounded-2xl p-6 border shadow-lg backdrop-blur-sm group hover:-translate-y-1 transition-transform duration-300 ${themeClass}`}
                            >
                                {/* Pattern Overlay */}
                                <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] rounded-2xl pointer-events-none"></div>

                                {/* Card Header */}
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <Quote className="w-8 h-8 opacity-40 rotate-180" />
                                    <span className="text-[10px] font-mono opacity-50 border border-current px-2 py-0.5 rounded-full">
                                        #{initialComments.length - (currentPage - 1) * itemsPerPage - index}
                                    </span>
                                </div>

                                {/* Content */}
                                <p className="text-white/90 text-lg leading-relaxed font-medium mb-6 relative z-10 font-sans">
                                    "{comment.content}"
                                </p>

                                {/* Footer */}
                                <div className="flex items-center justify-end border-t border-white/10 pt-4 relative z-10">
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs font-bold opacity-70">Anonymous</span>
                                        <span className="text-[10px] opacity-40">
                                            {new Date(comment.createdAt).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12 py-8 border-t border-white/10">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-110 active:scale-95"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-2">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            // Logic to show movable window of pages
                            let pageNum = i + 1;
                            if (totalPages > 5) {
                                if (currentPage > 3) pageNum = currentPage - 2 + i;
                                if (pageNum > totalPages) pageNum = totalPages - 4 + i;
                            }

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${currentPage === pageNum
                                        ? "bg-rama-gold text-black shadow-lg shadow-rama-gold/20 scale-110"
                                        : "bg-white/5 text-white/50 hover:bg-white/10"
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-110 active:scale-95"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            )}
        </div>
    );
}
