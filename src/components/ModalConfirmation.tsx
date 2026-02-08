"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Loader2 } from "lucide-react";

interface ModalConfirmationProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
    variant?: "danger" | "default" | "success";
}

export default function ModalConfirmation({
    isOpen,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    isLoading = false,
    variant = "default"
}: ModalConfirmationProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={!isLoading ? onCancel : undefined}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-[#0f2b26] border border-rama-gold/30 rounded-2xl shadow-2xl p-6 overflow-hidden"
                    >
                        {/* Header Decoration */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rama-gold/50 to-transparent"></div>

                        <div className="flex items-start gap-4 mb-6">
                            <div className={`p-3 rounded-full border ${variant === "danger"
                                ? "bg-red-500/10 border-red-500/30 text-red-500"
                                : "bg-rama-gold/10 border-rama-gold/30 text-rama-gold"
                                }`}>
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                                <p className="text-white/60 text-sm leading-relaxed">{message}</p>
                            </div>
                            <button
                                onClick={!isLoading ? onCancel : undefined}
                                className="text-white/40 hover:text-white transition-colors"
                                disabled={isLoading}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={onCancel}
                                disabled={isLoading}
                                className="px-4 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all disabled:opacity-50"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={isLoading}
                                className={`px-4 py-2 rounded-lg text-sm font-bold shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variant === "danger"
                                    ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20"
                                    : "bg-rama-gold hover:bg-rama-gold-muted text-black shadow-rama-gold/20"
                                    }`}
                            >
                                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
