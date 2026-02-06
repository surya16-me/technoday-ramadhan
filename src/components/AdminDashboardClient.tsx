"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, Shuffle, Search, Plus, X, Loader2, CheckCircle2, Download, Filter } from "lucide-react";
import ShuffleCard from "@/components/ShuffleCard";
import AdminShell from "@/components/AdminShell";
import Alert from "@/components/Alert";
import { SECTIONS } from "@/lib/constants";
import * as XLSX from "xlsx";

interface Participant {
    id: number;
    name: string;
    npk: string;
    section: string;
    attendance: string;
    isCheckedIn: boolean; // Field added
    groupId?: number | null;
    group?: {
        groupName: string;
        color: string;
    } | null;
    createdAt: Date;
}

interface AdminDashboardClientProps {
    initialParticipants: any[];
    commentsCount: number;
}

export default function AdminDashboardClient({ initialParticipants, commentsCount }: AdminDashboardClientProps) {
    const [activeTab, setActiveTab] = useState<"list" | "shuffle">("list");
    const [participants, setParticipants] = useState(initialParticipants);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterSection, setFilterSection] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Alert State
    const [alertConfig, setAlertConfig] = useState<{
        isOpen: boolean;
        message: string;
        type: "success" | "error";
    }>({
        isOpen: false,
        message: "",
        type: "success"
    });

    const router = useRouter();

    const showAlert = (message: string, type: "success" | "error" = "success") => {
        setAlertConfig({ isOpen: true, message, type });
    };

    // Sync state when props change (e.g. after router.refresh())
    useEffect(() => {
        // console.log("Init Participants:", initialParticipants);
        setParticipants(initialParticipants);
    }, [initialParticipants]);

    // Toggle Check-in Logic
    const toggleCheckIn = async (id: number, currentStatus: boolean) => {
        // Optimistic update
        setParticipants(prev => prev.map(p =>
            p.id === id ? { ...p, isCheckedIn: !currentStatus } : p
        ));

        try {
            const res = await fetch("/api/admin/check-in", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, isCheckedIn: !currentStatus }),
            });
            if (!res.ok) throw new Error("Failed to update");
            router.refresh();
        } catch (error) {
            // Revert on error
            setParticipants(prev => prev.map(p =>
                p.id === id ? { ...p, isCheckedIn: currentStatus } : p
            ));
            showAlert("Gagal update status check-in", "error");
        }
    };

    const filteredParticipants = participants.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.npk.includes(searchTerm);
        const matchesSection = filterSection ? p.section === filterSection : true;
        return matchesSearch && matchesSection;
    });

    const handleExportExcel = () => {
        const dataToExport = filteredParticipants.map(p => ({
            "Nama": p.name,
            "NPK": p.npk,
            "Section": p.section,
            "Status Kehadiran": p.isCheckedIn ? "Hadir (Check-in)" : p.attendance === "hadir" ? "Niat Hadir" : "Absen",
            "Kelompok": p.group?.groupName || "-",
            "Waktu Daftar": new Date(p.createdAt).toLocaleString("id-ID")
        }));

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Peserta TechnoDay");
        XLSX.writeFile(wb, `TechnoDay_Participants_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    return (
        <AdminShell>
            <Alert
                isOpen={alertConfig.isOpen}
                message={alertConfig.message}
                type={alertConfig.type}
                onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Peserta TechnoDay</h1>
                </div>

                <div className="flex gap-4">
                    {/* Add Walk-in Button */}
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-islamic-green hover:bg-emerald-600 text-white rounded-lg font-bold shadow-lg shadow-islamic-green/20 transition-all active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        Daftar Dadakan
                    </button>

                    <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                        <button
                            onClick={() => setActiveTab("list")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "list"
                                ? "bg-zinc-800 text-white shadow-sm"
                                : "text-zinc-400 hover:text-zinc-200"
                                }`}
                        >
                            <Users className="w-4 h-4" />
                            List Check-in
                        </button>
                        <button
                            onClick={() => setActiveTab("shuffle")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "shuffle"
                                ? "bg-zinc-800 text-white shadow-sm"
                                : "text-zinc-400 hover:text-zinc-200"
                                }`}
                        >
                            <Shuffle className="w-4 h-4" />
                            Shuffle Mode
                        </button>
                    </div>
                </div>
            </div>

            {activeTab === "list" ? (
                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Cari nama atau NPK..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-zinc-700 outline-none transition-all placeholder:text-zinc-600"
                            />
                        </div>

                        <div className="relative min-w-[200px]">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <select
                                value={filterSection}
                                onChange={(e) => setFilterSection(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-zinc-700 outline-none transition-all appearance-none text-zinc-300 cursor-pointer"
                            >
                                <option value="">Semua Section</option>
                                {SECTIONS.map(sec => (
                                    <option key={sec} value={sec}>{sec}</option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                            </div>
                        </div>

                        <button
                            onClick={handleExportExcel}
                            className="flex items-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-colors border border-zinc-700"
                            title="Export to Excel"
                        >
                            <Download className="w-5 h-5" />
                            <span className="hidden md:inline">Export</span>
                        </button>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-zinc-950/50 text-zinc-400 border-b border-zinc-800">
                                    <tr>
                                        <th className="px-6 py-4 font-medium w-[50px]">Check-in</th>
                                        <th className="px-6 py-4 font-medium">Nama / NPK</th>
                                        <th className="px-6 py-4 font-medium">Section</th>
                                        <th className="px-6 py-4 font-medium">Kehadiran</th>
                                        <th className="px-6 py-4 font-medium">Kelompok</th>
                                        <th className="px-6 py-4 font-medium text-right">Waktu Daftar</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    {filteredParticipants.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                                                Tidak ada data yang ditemukan.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredParticipants.map((p) => (
                                            <tr key={p.id} className={`transition-colors ${p.isCheckedIn ? 'bg-islamic-green/5' : 'hover:bg-zinc-800/50'}`}>
                                                <td className="px-6 py-4">
                                                    <label className="relative flex items-center justify-center cursor-pointer p-2">
                                                        <input
                                                            type="checkbox"
                                                            className="sr-only"
                                                            checked={!!p.isCheckedIn}
                                                            onChange={() => toggleCheckIn(p.id, !!p.isCheckedIn)}
                                                        />
                                                        <div className={`w-6 h-6 border-2 rounded-md transition-all flex items-center justify-center text-white ${p.isCheckedIn
                                                            ? "bg-islamic-green border-islamic-green"
                                                            : "border-zinc-600 hover:border-zinc-500"
                                                            }`}>
                                                            {p.isCheckedIn && <CheckCircle2 className="w-4 h-4" />}
                                                        </div>
                                                    </label>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className={`font-medium ${p.isCheckedIn ? 'text-islamic-green font-bold' : 'text-white'}`}>{p.name}</div>
                                                    <div className="text-zinc-500 text-xs">{p.npk}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-rama-gold text-sm">{p.section}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {p.isCheckedIn ? (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-islamic-green/20 text-islamic-green border border-islamic-green/30">
                                                            Hadir
                                                        </span>
                                                    ) : p.attendance === "hadir" ? (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-400">
                                                            Niat Hadir
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-racing-red/10 text-racing-red">
                                                            Absen
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {p.group ? (
                                                        <span
                                                            className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase transition-colors"
                                                            style={{
                                                                backgroundColor: `${p.group.color}15`,
                                                                color: p.group.color,
                                                                border: `1px solid ${p.group.color}30`
                                                            }}
                                                        >
                                                            {p.group.groupName}
                                                        </span>
                                                    ) : (
                                                        <span className="text-zinc-600 text-xs italic">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right text-zinc-500 tabular-nums">
                                                    {new Date(p.createdAt).toLocaleDateString("id-ID", {
                                                        day: "numeric",
                                                        month: "short",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <ShuffleCard />
            )}

            {/* Create Participant Modal */}
            {isCreateModalOpen && (
                <CreateParticipantModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onSuccess={(msg) => {
                        setIsCreateModalOpen(false);
                        router.refresh();
                        showAlert(msg || "Peserta berhasil didaftarkan!", "success");
                    }}
                    onError={(msg) => showAlert(msg, "error")}
                />
            )}
        </AdminShell>
    );
}

function CreateParticipantModal({
    onClose,
    onSuccess,
    onError
}: {
    onClose: () => void,
    onSuccess: (msg: string) => void,
    onError: (msg: string) => void
}) {
    const [formData, setFormData] = useState({ name: "", npk: "", section: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/admin/participants/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            onSuccess(data.message);
        } catch (error: any) {
            onError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold mb-1">Daftar Dadakan</h2>
                <p className="text-zinc-500 text-sm mb-6">Peserta ini akan otomatis di-check-in.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Nama Lengkap</label>
                        <input
                            required
                            className="w-full bg-black/50 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:border-islamic-green outline-none transition-colors"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">NPK</label>
                        <input
                            required
                            className="w-full bg-black/50 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:border-islamic-green outline-none transition-colors"
                            value={formData.npk}
                            onChange={e => setFormData({ ...formData, npk: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Section</label>
                        <select
                            required
                            className="w-full bg-black/50 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:border-islamic-green outline-none transition-colors appearance-none"
                            value={formData.section}
                            onChange={e => setFormData({ ...formData, section: e.target.value })}
                        >
                            <option value="">Pilih Section</option>
                            {SECTIONS.map(sec => (
                                <option key={sec} value={sec}>{sec}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-islamic-green hover:bg-emerald-600 text-white font-bold py-3 rounded-xl mt-4 flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Simpan & Check-in
                    </button>
                </form>
            </div>
        </div>
    );
}
