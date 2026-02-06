import { prisma } from "@/lib/prisma";
import { Moon, Users, Lock } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getParticipantsCount() {
    const count = await prisma.trn_register.count();
    return count;
}

export default async function ParticipantsPage() {
    const participantsCount = await getParticipantsCount();

    return (
        <div className="min-h-screen bg-rama-dark-green text-white relative overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 pattern-islamic-geometry opacity-20"></div>
                <div className="absolute inset-0 pattern-stars"></div>
            </div>

            <main className="relative z-10 container mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-4">
                        <Moon className="w-12 h-12 text-rama-gold fill-rama-gold/20" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-rama-gold mb-2">
                        Daftar Peserta
                    </h1>
                    <p className="text-rama-white/70">Ramadhan Pit Stop • TechnoDay 2026</p>

                    <div className="flex items-center justify-center gap-2 mt-4 text-rama-gold">
                        <Users className="w-5 h-5" />
                        <span className="text-2xl font-bold">{participantsCount}</span>
                        <span className="text-rama-white/70">Peserta Terdaftar</span>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-4 justify-center mb-8">
                    <Link
                        href="/"
                        className="px-6 py-2 bg-rama-gold/20 hover:bg-rama-gold/30 border border-rama-gold/50 rounded-lg transition-all"
                    >
                        ← Kembali
                    </Link>
                </div>

                {/* Privacy Notice - Instead of showing participant list */}
                <div className="max-w-2xl mx-auto">
                    <div className="bg-rama-black/40 backdrop-blur-sm border border-rama-gold/20 rounded-xl p-8 text-center">
                        <div className="w-20 h-20 rounded-full bg-rama-gold/20 flex items-center justify-center mx-auto mb-6">
                            <Lock className="w-10 h-10 text-rama-gold" />
                        </div>

                        <h2 className="text-2xl font-bold text-rama-gold mb-4">
                            Data Peserta Dilindungi
                        </h2>

                        <p className="text-rama-white/70 text-lg leading-relaxed mb-6">
                            Untuk menjaga privasi, data peserta tidak ditampilkan secara publik.
                            <br />
                            Hanya admin yang dapat mengakses informasi lengkap peserta.
                        </p>

                        <div className="flex flex-col gap-3 items-center">
                            <div className="flex items-center gap-2 text-rama-white/60 text-sm">
                                <span>🔒</span>
                                <span>Data aman & terenkripsi</span>
                            </div>
                            <div className="flex items-center gap-2 text-rama-white/60 text-sm">
                                <span>👤</span>
                                <span>Privasi terjaga</span>
                            </div>
                            <div className="flex items-center gap-2 text-rama-white/60 text-sm">
                                <span>✅</span>
                                <span>Hanya admin yang bisa akses</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-rama-white/10">
                            <p className="text-rama-white/50 text-sm">
                                Ingin melihat data peserta?
                            </p>
                            <Link
                                href="/admin/login"
                                className="inline-block mt-3 px-6 py-2 bg-rama-gold/20 hover:bg-rama-gold/30 border border-rama-gold/50 rounded-lg transition-all"
                            >
                                Login sebagai Admin
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
