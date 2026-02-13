"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, Shuffle, Search, Plus, X, Loader2, CheckCircle2, Download, Filter, Calendar, Trash2, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import ShuffleCard from "@/components/ShuffleCard";
import AdminShell from "@/components/AdminShell";
import Alert from "@/components/Alert";
import { SECTIONS } from "@/lib/constants";
import * as XLSX from "xlsx";
import { useCheckInParticipant, useCreateParticipant } from "@/hooks/useParticipants";
import { createSchedule, deleteSchedule, updateScheduleStatus, updateSchedule } from "@/actions/scheduleActions";
import DatePicker from "react-datepicker";
import ModalConfirmation from "@/components/ModalConfirmation";

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
    initialSchedules: any[];
}

export default function AdminDashboardClient({ initialParticipants, commentsCount, initialSchedules }: AdminDashboardClientProps) {
    const [activeTab, setActiveTab] = useState<"list" | "shuffle" | "schedule">("list");
    const [participants, setParticipants] = useState(initialParticipants);
    const [schedules, setSchedules] = useState(initialSchedules);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterSection, setFilterSection] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [activeSchedule, setActiveSchedule] = useState<any | null>(null); // For editing

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Confirmation Modal State
    const [confirmationConfig, setConfirmationConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        variant: "danger" | "default" | "success";
        isLoading: boolean;
    }>({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => { },
        variant: "default",
        isLoading: false
    });

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
    const checkInMutation = useCheckInParticipant();

    const showAlert = (message: string, type: "success" | "error" = "success") => {
        setAlertConfig({ isOpen: true, message, type });
    };

    // Sync state when props change (e.g. after router.refresh())
    useEffect(() => {
        setParticipants(initialParticipants);
    }, [initialParticipants]);

    // Check-in Confirmation State
    const [checkInTarget, setCheckInTarget] = useState<{ id: number; currentStatus: boolean; name: string } | null>(null);

    // Toggle Check-in Logic (Triggers Modal)
    const toggleCheckIn = (id: number, currentStatus: boolean, name: string) => {
        setCheckInTarget({ id, currentStatus, name });
    };

    // Execute Check-in after confirmation
    const confirmCheckIn = () => {
        if (!checkInTarget) return;

        const { id, currentStatus } = checkInTarget;

        // Optimistic update
        setParticipants(prev => prev.map(p =>
            p.id === id ? { ...p, isCheckedIn: !currentStatus } : p
        ));

        checkInMutation.mutate({ id, isCheckedIn: !currentStatus }, {
            onSuccess: () => {
                setCheckInTarget(null);
                showAlert(`Berhasil ${!currentStatus ? 'check-in' : 'cancel check-in'} peserta!`, "success");
            },
            onError: (error) => {
                // Revert on error
                setParticipants(prev => prev.map(p =>
                    p.id === id ? { ...p, isCheckedIn: currentStatus } : p
                ));
                setCheckInTarget(null);
                showAlert("Gagal update status check-in", "error");
            }
        });
    };

    const filteredParticipants = participants.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.npk.includes(searchTerm);
        const matchesSection = filterSection ? p.section === filterSection : true;
        return matchesSearch && matchesSection;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredParticipants.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredParticipants.length / itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterSection]);

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
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold shadow-lg shadow-islamic-green/20 transition-all active:scale-95"
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
                        <button
                            onClick={() => setActiveTab("schedule")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "schedule"
                                ? "bg-zinc-800 text-white shadow-sm"
                                : "text-zinc-400 hover:text-zinc-200"
                                }`}
                        >
                            <Calendar className="w-4 h-4" />
                            Jadwal
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
                                <option value="Bukan Peserta">Bukan Peserta</option>
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
                                    {currentItems.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                                                Tidak ada data yang ditemukan.
                                            </td>
                                        </tr>
                                    ) : (
                                        currentItems.map((p) => (
                                            <tr key={p.id} className={`transition-colors ${p.isCheckedIn ? 'bg-islamic-green/5' : 'hover:bg-zinc-800/50'}`}>
                                                <td className="px-6 py-4">
                                                    <label className="relative flex items-center justify-center cursor-pointer p-2">
                                                        <input
                                                            type="checkbox"
                                                            className="sr-only"
                                                            checked={!!p.isCheckedIn}
                                                            onChange={() => toggleCheckIn(p.id, !!p.isCheckedIn, p.name)}
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

                        {/* Pagination Footer */}
                        {filteredParticipants.length > 0 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-zinc-900/50">
                                <div className="text-sm text-zinc-500">
                                    Menampilkan {indexOfFirstItem + 1} sampai {Math.min(indexOfLastItem, filteredParticipants.length)} dari {filteredParticipants.length} data
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <span className="text-sm font-medium text-zinc-300 px-2 min-w-[80px] text-center">
                                        Halaman {currentPage} / {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : activeTab === "schedule" ? (
                <div className="space-y-4">
                    <div className="flex justify-between items-center bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                        <div>
                            <h2 className="text-lg font-bold text-white">Atur Jadwal Registrasi</h2>
                            <p className="text-zinc-400 text-sm">Jadwal pembukaan dan penutupan form registrasi.</p>
                        </div>
                        <button
                            onClick={() => setIsScheduleModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold shadow-lg shadow-islamic-green/20 transition-all active:scale-95"
                        >
                            <Plus className="w-5 h-5" />
                            Tambah Jadwal
                        </button>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-zinc-950/50 text-zinc-400 border-b border-zinc-800">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Status</th>
                                        <th className="px-6 py-4 font-medium">Mulai</th>
                                        <th className="px-6 py-4 font-medium">Selesai</th>
                                        <th className="px-6 py-4 font-medium text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    {schedules.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                                                Belum ada jadwal yang dibuat.
                                            </td>
                                        </tr>
                                    ) : (
                                        schedules.map((s) => (
                                            <tr key={s.id} className="hover:bg-zinc-800/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="sr-only peer"
                                                            checked={s.status}
                                                            onChange={() => {
                                                                setConfirmationConfig({
                                                                    isOpen: true,
                                                                    title: s.status ? "Non-aktifkan Jadwal?" : "Aktifkan Jadwal?",
                                                                    message: s.status
                                                                        ? "Jadwal ini tidak akan berlaku lagi untuk pendaftaran."
                                                                        : "Jadwal ini akan dibuka untuk pendaftaran.",
                                                                    variant: s.status ? "danger" : "success",
                                                                    isLoading: false,
                                                                    onConfirm: async () => {
                                                                        setConfirmationConfig(prev => ({ ...prev, isLoading: true }));
                                                                        try {
                                                                            const res = await updateScheduleStatus(s.id, !s.status);
                                                                            if (res.success) {
                                                                                setSchedules(prev => prev.map(item =>
                                                                                    item.id === s.id ? { ...item, status: !s.status } : item
                                                                                ));
                                                                                showAlert("Status jadwal diperbarui", "success");
                                                                            } else {
                                                                                throw new Error(res.error);
                                                                            }
                                                                        } catch (error) {
                                                                            showAlert("Gagal update status", "error");
                                                                        } finally {
                                                                            setConfirmationConfig(prev => ({ ...prev, isOpen: false, isLoading: false }));
                                                                        }
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                        <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                                    </label>
                                                </td>
                                                <td className="px-6 py-4 text-zinc-300">
                                                    {new Date(s.start_date).toLocaleString("id-ID")}
                                                </td>
                                                <td className="px-6 py-4 text-zinc-300">
                                                    {new Date(s.end_date).toLocaleString("id-ID")}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => {
                                                            setActiveSchedule(s);
                                                            setIsScheduleModalOpen(true);
                                                        }}
                                                        className="text-zinc-500 hover:text-rama-gold transition-colors p-2"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setConfirmationConfig({
                                                                isOpen: true,
                                                                title: "Hapus Jadwal?",
                                                                message: "Tindakan ini tidak dapat dibatalkan.",
                                                                variant: "danger",
                                                                isLoading: false,
                                                                onConfirm: async () => {
                                                                    setConfirmationConfig(prev => ({ ...prev, isLoading: true }));
                                                                    try {
                                                                        const result = await deleteSchedule(s.id);
                                                                        if (result.success) {
                                                                            setSchedules(prev => prev.filter(item => item.id !== s.id));
                                                                            showAlert("Jadwal dihapus", "success");
                                                                        } else {
                                                                            throw new Error(result.error);
                                                                        }
                                                                    } catch (e) {
                                                                        showAlert("Gagal menghapus jadwal", "error");
                                                                    } finally {
                                                                        setConfirmationConfig(prev => ({ ...prev, isOpen: false, isLoading: false }));
                                                                    }
                                                                }
                                                            });
                                                        }}
                                                        className="text-zinc-500 hover:text-racing-red transition-colors p-2"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
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
            )
            }

            {/* Check-in Confirmation Modal */}
            {
                checkInTarget && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative text-center">
                            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 ${!checkInTarget.currentStatus ? 'bg-islamic-green/20' : 'bg-racing-red/20'}`}>
                                {!checkInTarget.currentStatus ? (
                                    <CheckCircle2 className="w-8 h-8 text-islamic-green" />
                                ) : (
                                    <X className="w-8 h-8 text-racing-red" />
                                )}
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">
                                {!checkInTarget.currentStatus ? "Konfirmasi Check-In" : "Batalkan Check-In"}
                            </h3>
                            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                                {!checkInTarget.currentStatus ? (
                                    <>Apakah antum yakin ingin melakukan check-in untuk peserta <b>{checkInTarget.name}</b>?</>
                                ) : (
                                    <>Apakah antum yakin ingin membatalkan status check-in untuk <b>{checkInTarget.name}</b>?</>
                                )}
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setCheckInTarget(null)}
                                    className="flex-1 py-2.5 px-4 rounded-xl font-medium border border-zinc-700 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={() => confirmCheckIn()}
                                    className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-white transition-all active:scale-95 shadow-lg ${!checkInTarget.currentStatus
                                        ? "bg-islamic-green hover:bg-emerald-600 shadow-islamic-green/20"
                                        : "bg-racing-red hover:bg-red-700 shadow-racing-red/20"
                                        }`}
                                >
                                    {!checkInTarget.currentStatus ? "Ya, Check-In" : "Ya, Batalkan"}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Create Participant Modal */}
            {
                isCreateModalOpen && (
                    <CreateParticipantModal
                        onClose={() => setIsCreateModalOpen(false)}
                        onSuccess={(msg) => {
                            // refetch handled by hook via router.refresh() 
                            // But we want to close modal and show alert
                            setIsCreateModalOpen(false);
                            showAlert(msg || "Peserta berhasil didaftarkan!", "success");
                        }}
                        onError={(msg) => showAlert(msg, "error")}
                    />
                )
            }
            {/* Schedule Modal */}
            {
                isScheduleModalOpen && (
                    <CreateScheduleModal
                        initialData={activeSchedule}
                        onClose={() => {
                            setIsScheduleModalOpen(false);
                            setActiveSchedule(null);
                        }}
                        onSuccess={(schedule) => {
                            if (activeSchedule) {
                                setSchedules(prev => prev.map(s => s.id === schedule.id ? schedule : s));
                                showAlert("Jadwal berhasil diperbarui!", "success");
                            } else {
                                setSchedules(prev => [schedule, ...prev]);
                                showAlert("Jadwal berhasil ditambahkan!", "success");
                            }
                            setIsScheduleModalOpen(false);
                            setActiveSchedule(null);
                        }}
                        onError={(msg) => showAlert(msg, "error")}
                    />
                )
            }

            <ModalConfirmation
                isOpen={confirmationConfig.isOpen}
                title={confirmationConfig.title}
                message={confirmationConfig.message}
                onConfirm={confirmationConfig.onConfirm}
                onCancel={() => setConfirmationConfig(prev => ({ ...prev, isOpen: false }))}
                variant={confirmationConfig.variant}
                isLoading={confirmationConfig.isLoading}
            />
        </AdminShell >
    );
}

function CreateScheduleModal({
    initialData,
    onClose,
    onSuccess,
    onError
}: {
    initialData?: any,
    onClose: () => void,
    onSuccess: (schedule: any) => void,
    onError: (msg: string) => void
}) {
    const [formData, setFormData] = useState({
        start_date: initialData ? new Date(initialData.start_date) : new Date(),
        end_date: initialData ? new Date(initialData.end_date) : new Date(Date.now() + 86400000), // +1 day
        status: initialData ? initialData.status : true
    });
    const [isLoading, setIsLoading] = useState(false);
    const isEditing = !!initialData;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const payload = {
                ...formData,
                start_date: formData.start_date.toISOString(),
                end_date: formData.end_date.toISOString()
            };

            let result;
            if (isEditing) {
                result = await updateSchedule(initialData.id, payload);
            } else {
                result = await createSchedule(payload);
            }

            if (!result.success) throw new Error(result.error || `Gagal ${isEditing ? 'memperbarui' : 'membuat'} jadwal`);

            onSuccess(result.data);
        } catch (error: any) {
            onError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold mb-1">{isEditing ? "Edit Jadwal" : "Tambah Jadwal"}</h2>
                <p className="text-zinc-500 text-sm mb-6">Atur waktu pembukaan form registrasi.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Waktu Mulai</label>
                        <DatePicker
                            selected={formData.start_date}
                            onChange={(date: Date | null) => date && setFormData({ ...formData, start_date: date })}
                            showTimeSelect
                            dateFormat="Pp"
                            className="w-full bg-black/50 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:border-islamic-green outline-none transition-colors"
                            wrapperClassName="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Waktu Selesai</label>
                        <DatePicker
                            selected={formData.end_date}
                            onChange={(date: Date | null) => date && setFormData({ ...formData, end_date: date })}
                            showTimeSelect
                            dateFormat="Pp"
                            className="w-full bg-black/50 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:border-islamic-green outline-none transition-colors"
                            wrapperClassName="w-full"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="status"
                            checked={formData.status}
                            onChange={e => setFormData({ ...formData, status: e.target.checked })}
                            className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-islamic-green focus:ring-islamic-green"
                        />
                        <label htmlFor="status" className="text-sm text-zinc-300">Status Aktif</label>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl mt-4 flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                        {isEditing ? "Simpan Perubahan" : "Simpan Jadwal"}
                    </button>
                </form>
            </div>
        </div>
    );
}

import { validateInput } from "@/lib/validation";

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
    const createMutation = useCreateParticipant();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate
        const nameValidation = validateInput(formData.name);
        if (!nameValidation.isValid) {
            onError(nameValidation.message || "Input tidak valid");
            return;
        }

        createMutation.mutate(formData, {
            onSuccess: (data) => onSuccess(data.message),
            onError: (error: any) => onError(error?.message || "Failed to create participant")
        });
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
                            placeholder="Contoh: Fulan bin Fulan"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">NPK</label>
                        <input
                            required
                            className="w-full bg-black/50 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:border-islamic-green outline-none transition-colors"
                            value={formData.npk}
                            onChange={e => setFormData({ ...formData, npk: e.target.value })}
                            placeholder="Contoh: 123456"
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
                        disabled={createMutation.isPending}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl mt-4 flex items-center justify-center gap-2"
                    >
                        {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                        Simpan & Check-in
                    </button>
                </form>
            </div>
        </div>
    );
}
