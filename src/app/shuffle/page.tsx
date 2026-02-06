import { prisma } from "@/lib/prisma";
import { Moon, MessageSquare } from "lucide-react";
import Link from "next/link";
import CommentsListClient from "@/components/CommentsListClient";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getAllComments() {
    const comments = await prisma.trn_comment.findMany({
        select: {
            id: true,
            content: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return comments;
}

export default async function CommentsListPage() {
    const comments = await getAllComments();

    return (
        <div className="min-h-screen bg-rama-dark-green text-white relative overflow-hidden font-sans selection:bg-rama-gold selection:text-black">
            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 pattern-islamic-geometry opacity-20"></div>
                <div className="absolute inset-0 pattern-stars"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/20 to-transparent"></div>
            </div>

            <main className="relative z-10 container mx-auto px-4 py-8 md:py-16">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-4 bg-white/5 rounded-full mb-6 border border-white/10 backdrop-blur-sm shadow-xl relative group">
                        <div className="absolute inset-0 bg-rama-gold/20 rounded-full filter blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-1000"></div>
                        <Moon className="w-8 h-8 text-rama-gold fill-rama-gold mr-3" />
                        <span className="text-2xl md:text-3xl font-bold text-rama-gold tracking-widest uppercase font-majestic">
                            Technoday Wall
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                        Harapan & Curhatan
                    </h1>

                    <div className="flex items-center justify-center gap-2 text-rama-white/60 text-sm md:text-base">
                        <MessageSquare className="w-4 h-4" />
                        <span>Total <strong className="text-rama-gold">{comments.length}</strong> pesan terkumpul dari teman-teman</span>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-center mb-12">
                    <Link
                        href="/"
                        className="group flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all hover:scale-105 active:scale-95"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">←</span>
                        <span>Kembali ke Home</span>
                    </Link>
                </div>

                {/* Client List Component */}
                <CommentsListClient initialComments={comments} />

                {/* Footer Info */}
                <div className="text-center mt-24 mb-12 opacity-40 text-xs tracking-widest uppercase">
                    TechnoDay 2026 • Ramadhan Pit Stop
                </div>
            </main>
        </div>
    );
}
