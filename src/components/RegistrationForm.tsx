"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Loader2, Send, User, CreditCard, Smile, Briefcase } from "lucide-react";
import { SECTIONS } from "@/lib/constants";
import { useRegisterParticipant } from "@/hooks/useParticipants";

import { validateInput } from "@/lib/validation";

import { getScheduleStatus } from "@/actions/scheduleActions";

// ... existing imports

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: "",
    npk: "",
    section: "",
    attendance: "hadir",
    comment: "",
  });

  const [validationError, setValidationError] = useState<string | null>(null);
  const [scheduleStatus, setScheduleStatus] = useState({ isOpen: false, loading: true });

  useEffect(() => {
    getScheduleStatus().then((data) => {
      setScheduleStatus({ isOpen: data.isOpen, loading: false });
    });
  }, []);

  const mutation = useRegisterParticipant();

  if (scheduleStatus.loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-rama-gold/60">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p>Memuat status pendaftaran...</p>
      </div>
    );
  }

  if (!scheduleStatus.isOpen) {
    return (
      <div className="w-full max-w-md mx-auto relative p-8 text-center bg-black/20 rounded-2xl border border-rama-gold/20 backdrop-blur-sm">
        <div className="w-20 h-20 bg-rama-maroon/20 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-rama-maroon/10">
          <AlertCircle className="w-10 h-10 text-rama-maroon" />
        </div>
        <h3 className="text-2xl font-bold text-rama-gold mb-4 font-serif">Pendaftaran Ditutup</h3>
        <p className="text-rama-white/80 leading-relaxed">
          Mohon maaf, pendaftaran saat ini sedang ditutup. <br />
          Silakan cek kembali sesuai jadwal yang ditentukan.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validate Input
    const nameValidation = validateInput(formData.name);
    if (!nameValidation.isValid) {
      setValidationError(`Nama: ${nameValidation.message}`);
      return;
    }

    const commentValidation = validateInput(formData.comment);
    if (!commentValidation.isValid) {
      setValidationError(`Komentar: ${commentValidation.message}`);
      return;
    }

    const submitData = {
      ...formData,
      attendance: "hadir"
    };
    mutation.mutate(submitData, {
      onSuccess: () => {
        setFormData({ name: "", npk: "", section: "", attendance: "hadir", comment: "" });
        setValidationError(null);
      }
    });
  };

  const handleReset = () => {
    mutation.reset();
  };

  return (
    <div className="w-full max-w-md mx-auto relative">
      <AnimatePresence mode="wait">
        {mutation.isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="w-20 h-20 bg-rama-green/20 rounded-full flex items-center justify-center mb-6 ring-4 ring-rama-green/10 animate-pulse">
              <CheckCircle2 className="w-10 h-10 text-rama-green" />
            </div>
            <h3 className="text-3xl font-bold text-rama-gold mb-2 font-serif tracking-wide">Alhamdulillah!</h3>
            <p className="text-rama-white/80 text-lg mb-8 leading-relaxed">
              Pendaftaran antum berhasil dicatat. <br /> Sampai jumpa di Ramadhan Pit Stop!
            </p>
            <button
              onClick={handleReset}
              className="px-8 py-3 bg-gradient-to-r from-rama-green to-teal-800 text-white rounded-xl font-medium hover:shadow-[0_0_20px_rgba(22,48,43,0.6)] transition-all active:scale-95 border border-white/10"
            >
              Daftar Lagi
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSubmit}
            className="space-y-6 p-6 md:p-8"
          >
            <div className="space-y-5">
              {/* Name */}
              <div className="group">
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-rama-gold/80 ml-1">Nama Lengkap</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-rama-gold/50 group-focus-within:text-rama-gold transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-rama-black/40 border-2 border-rama-white/5 focus:border-rama-gold/50 focus:bg-rama-black/60 outline-none transition-all text-white placeholder:text-zinc-600 focus:shadow-[0_0_15px_rgba(163,133,96,0.15)]"
                    placeholder="Masukkan nama antum"
                  />
                </div>
              </div>

              {/* NPK */}
              <div className="group">
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-rama-gold/80 ml-1">NPK</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-rama-gold/50 group-focus-within:text-rama-gold transition-colors">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <input
                    required
                    type="text"
                    value={formData.npk}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);
                      setFormData({ ...formData, npk: value });
                    }}
                    maxLength={8}
                    pattern="[a-zA-Z0-9]{1,8}"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-rama-black/40 border-2 border-rama-white/5 focus:border-rama-gold/50 focus:bg-rama-black/60 outline-none transition-all text-white placeholder:text-zinc-600 focus:shadow-[0_0_15px_rgba(163,133,96,0.15)]"
                    placeholder="Max 8 karakter (huruf/angka)"
                  />
                </div>
                <p className="mt-1.5 text-[10px] text-rama-white/40 ml-1">
                  *Hanya huruf dan angka, maksimal 8 karakter
                </p>
              </div>

              {/* Section Dropdown */}
              <div className="group">
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-rama-gold/80 ml-1">Section</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-rama-gold/50 group-focus-within:text-rama-gold transition-colors">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <select
                    required
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-rama-black/40 border-2 border-rama-white/5 focus:border-rama-gold/50 focus:bg-rama-black/60 outline-none transition-all text-white placeholder:text-zinc-600 focus:shadow-[0_0_15px_rgba(163,133,96,0.15)] appearance-none"
                  >
                    <option value="" disabled className="bg-rama-dark-green text-gray-500">Pilih Section</option>
                    {SECTIONS.map((sec) => (
                      <option key={sec} value={sec} className="bg-rama-dark-green">{sec}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-rama-gold/50">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Attendance */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-rama-gold/80 ml-1">Kesediaan Hadir</label>
                <div className="flex gap-4">
                  <label className="flex-1 cursor-pointer group">
                    <input
                      type="radio"
                      name="attendance"
                      value="hadir"
                      checked={formData.attendance === "hadir"}
                      onChange={(e) => setFormData({ ...formData, attendance: e.target.value })}
                      className="peer sr-only"
                    />
                    <div className="h-full p-4 rounded-xl border-2 border-rama-white/5 bg-rama-black/30 text-center peer-checked:bg-rama-white/5 peer-checked:text-rama-green peer-checked:border-rama-green transition-all hover:bg-rama-white/5 flex flex-col items-center gap-2 group-hover:scale-[1.02]">
                      <span className="text-2xl group-hover:animate-bounce">👍</span>
                      <span className="font-medium">Gas Hadir</span>
                    </div>
                  </label>
                  <label className="flex-1 cursor-pointer group">
                    <input
                      type="radio"
                      name="attendance"
                      value="hadir_kocak"
                      checked={formData.attendance === "hadir_kocak"}
                      onChange={(e) => setFormData({ ...formData, attendance: e.target.value })}
                      className="peer sr-only"
                    />
                    <div className="h-full p-4 rounded-xl border-2 border-rama-white/5 bg-rama-black/30 text-center peer-checked:bg-rama-white/5 peer-checked:text-rama-maroon peer-checked:border-rama-maroon transition-all hover:bg-rama-white/5 flex flex-col items-center gap-2 group-hover:scale-[1.02]">
                      <span className="text-2xl group-hover:animate-pulse">✋</span>
                      <span className="font-medium">Hadir Hadir Hadir</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Komentar Kocak */}
              <div className="group">
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-rama-gold/80 ml-1">
                  Pesan, Kesan, Impian, Harapan, Curhatan, dll
                </label>
                <div className="relative">
                  <div className="absolute top-3.5 left-4 flex items-start pointer-events-none text-rama-gold/50 group-focus-within:text-rama-gold transition-colors">
                    <Smile className="w-5 h-5" />
                  </div>
                  <textarea
                    required
                    rows={3}
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-rama-black/40 border-2 border-rama-white/5 focus:border-rama-gold/50 focus:bg-rama-black/60 outline-none transition-all text-white placeholder:text-zinc-600 resize-none focus:shadow-[0_0_15px_rgba(163,133,96,0.15)]"
                    placeholder="Ceritain harapan, impian, kesan, pesan, dll..."
                  />
                  <p className="mt-2 text-[10px] text-rama-white/50 italic text-right">
                    *Apa yang kamu tulis 100% aman & anonim! 🔒
                  </p>
                </div>
              </div>
            </div>

            {validationError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 text-rama-maroon text-sm bg-rama-maroon/10 p-4 rounded-xl border-2 border-rama-maroon/30 shadow-lg shadow-rama-maroon/10"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 animate-pulse" />
                <div className="flex-1">
                  <p className="font-semibold mb-1">⚠️ Periksa Input Antum!</p>
                  <p>{validationError}</p>
                </div>
              </motion.div>
            )}

            {mutation.isError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 text-rama-maroon text-sm bg-rama-maroon/10 p-4 rounded-xl border-2 border-rama-maroon/30 shadow-lg shadow-rama-maroon/10"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 animate-pulse" />
                <div className="flex-1">
                  <p className="font-semibold mb-1">⚠️ Oops!</p>
                  <p>{mutation.error?.message || "Terjadi kesalahan sistem. Hubungi panitia."}</p>
                </div>
              </motion.div>
            )}

            <div className="pt-2">
              <button
                disabled={mutation.isPending}
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-rama-gold to-yellow-700 text-white font-bold text-lg shadow-[0_4px_20px_rgba(163,133,96,0.3)] hover:shadow-[0_6px_25px_rgba(163,133,96,0.4)] hover:-translate-y-1 active:translate-y-0 active:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out skew-y-12"></div>
                {mutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Mendaftarkan...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    Submit Pendaftaran
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
