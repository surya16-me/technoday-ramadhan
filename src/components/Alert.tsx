"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { useEffect } from "react";

interface AlertProps {
    isOpen: boolean;
    message: string;
    type?: "success" | "error";
    onClose: () => void;
    autoClose?: boolean;
    duration?: number;
}

export default function Alert({
    isOpen,
    message,
    type = "success",
    onClose,
    autoClose = true,
    duration = 3000
}: AlertProps) {

    useEffect(() => {
        if (isOpen && autoClose) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isOpen, autoClose, duration, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] w-full max-w-md px-4 pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md ${type === "success"
                                ? "bg-islamic-green/90 border-islamic-green/50 text-white shadow-islamic-green/20"
                                : "bg-racing-red/90 border-racing-red/50 text-white shadow-racing-red/20"
                            }`}
                    >
                        <div className={`p-2 rounded-full ${type === "success" ? "bg-white/20" : "bg-white/20"}`}>
                            {type === "success" ? (
                                <CheckCircle2 className="w-6 h-6 animate-bounce" />
                            ) : (
                                <AlertCircle className="w-6 h-6 animate-pulse" />
                            )}
                        </div>

                        <div className="flex-1">
                            <h4 className="font-bold text-sm uppercase tracking-wider">
                                {type === "success" ? "Berhasil!" : "Gagal!"}
                            </h4>
                            <p className="text-sm opacity-90">{message}</p>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
