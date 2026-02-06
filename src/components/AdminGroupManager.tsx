"use client";

import { useState } from "react";
import {
    Users,
    RefreshCw,
    Users as UsersIcon,
    Trash2,
    Loader2,
    Settings,
    Eye
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import AdminShell from "@/components/AdminShell";

interface Participant {
    id: number;
    name: string;
    section: string;
}

interface Group {
    id: number;
    groupNumber: number;
    groupName: string;
    color: string;
    participants: Participant[];
}

interface Props {
    initialGroups: Group[];
    attendingCount: number;
}

export default function AdminGroupManager({ initialGroups, attendingCount }: Props) {
    const [groups, setGroups] = useState<Group[]>(initialGroups);
    const [isGenerating, setIsGenerating] = useState(false);
    const [groupCount, setGroupCount] = useState(1);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

    const handleGenerateGroups = async () => {
        setIsGenerating(true);
        setMessage(null);

        try {
            const res = await fetch("/api/admin/groups/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ groupCount }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Gagal membuat kelompok");

            // Refresh data - In a real app we might fetch or the API might return the full tree
            // Here we'll just reload the page to get the updated server data for simplicity 
            // but we can also just update state if the API returned it.
            window.location.reload();

            setMessage({ text: "Kelompok berhasil di-generate secara acak!", type: "success" });
        } catch (error: any) {
            setMessage({ text: error.message, type: "error" });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDeleteGroups = async () => {
        if (!confirm("Hapus semua kelompok? Data peserta akan tetap ada tapi tidak berkelompok.")) return;

        setIsGenerating(true);
        try {
            const res = await fetch("/api/admin/groups/delete", { method: "POST" });
            if (!res.ok) throw new Error("Gagal menghapus kelompok");
            window.location.reload();
        } catch (error: any) {
            setMessage({ text: error.message, type: "error" });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <AdminShell>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-rama-gold flex items-center gap-3">
                        <Settings className="w-8 h-8" />
                        Group Management
                    </h1>
                </div>

                <div className="flex gap-3">
                    <Link
                        href="/groups"
                        target="_blank"
                        className="bg-rama-gold/10 hover:bg-rama-gold/20 text-rama-gold border border-rama-gold/30 px-4 py-2 rounded-xl flex items-center gap-2 transition-all"
                    >
                        <Eye className="w-4 h-4" />
                        Preview Public
                    </Link>
                    <button
                        onClick={handleDeleteGroups}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 px-4 py-2 rounded-xl flex items-center gap-2 transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                        Reset Groups
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Control Panel */}
                <div className="lg:col-span-1">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-24">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-rama-gold">
                            <RefreshCw className="w-5 h-5" />
                            Generate Groups
                        </h2>

                        <div className="space-y-6">
                            <div className="p-4 bg-rama-gold/5 border border-rama-gold/20 rounded-xl">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-white/60 text-sm">Peserta Hadir</span>
                                    <span className="text-rama-gold font-bold">{attendingCount}</span>
                                </div>
                                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-rama-gold h-full w-full opacity-50"></div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-2">
                                    Jumlah Kelompok yang Ingin Dibuat
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={groupCount}
                                    onChange={(e) => setGroupCount(parseInt(e.target.value))}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-rama-gold/50 transition-all text-xl font-bold text-center text-white"
                                />
                                <p className="mt-2 text-xs text-white/40">
                                    ~ {Math.ceil(attendingCount / groupCount)} peserta per kelompok
                                </p>
                            </div>

                            <button
                                onClick={handleGenerateGroups}
                                disabled={isGenerating || attendingCount === 0}
                                className="w-full bg-rama-gold hover:bg-rama-gold-muted text-black font-bold py-4 rounded-xl shadow-lg shadow-rama-gold/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isGenerating ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <RefreshCw className="w-6 h-6" />
                                )}
                                Kocok Kelompok!
                            </button>

                            {message && (
                                <div className={`p-4 rounded-xl text-sm border ${message.type === "success"
                                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                                    : "bg-red-500/10 text-red-500 border-red-500/20"
                                    }`}>
                                    {message.text}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Groups List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <UsersIcon className="w-6 h-6 text-rama-gold" />
                            Status Kelompok Saat Ini ({groups.length})
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AnimatePresence>
                            {groups.map((group) => (
                                <motion.div
                                    key={group.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all"
                                >
                                    <div className="p-4 flex items-center justify-between border-b border-white/10" style={{ backgroundColor: `${group.color}15` }}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-black" style={{ backgroundColor: group.color }}>
                                                {group.groupNumber}
                                            </div>
                                            <span className="font-bold text-lg" style={{ color: group.color }}>{group.groupName}</span>
                                        </div>
                                        <span className="text-xs bg-white/5 px-2 py-1 rounded-md text-white/60">
                                            {group.participants.length} orang
                                        </span>
                                    </div>
                                    <div className="p-4 space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                                        {group.participants.map(p => (
                                            <div key={p.id} className="text-sm py-1 border-b border-white/5 last:border-0 flex justify-between">
                                                <span className="text-white/80">{p.name}</span>
                                                <span className="text-[10px] text-white/30 uppercase">{p.section}</span>
                                            </div>
                                        ))}
                                        {group.participants.length === 0 && (
                                            <span className="text-xs text-white/20 italic">Belum ada anggota</span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {groups.length === 0 && (
                        <div className="bg-white/5 border border-white/10 border-dashed rounded-3xl p-12 text-center">
                            <Users className="w-16 h-16 text-white/10 mx-auto mb-4" />
                            <p className="text-white/40">Belum ada kelompok yang dibuat. Klik tombol "Kocok Kelompok" untuk mulai!</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminShell>
    );
}
