import { prisma } from "@/lib/prisma";
import { Moon, Users, Trophy, ChevronLeft } from "lucide-react";
import Link from "next/link";
import GroupsList from "@/components/GroupsList";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getGroupsWithParticipants() {
    // @ts-ignore
    const groups = await (prisma as any).trn_group.findMany({
        include: {
            participants: {
                orderBy: {
                    name: 'asc'
                }
            }
        },
        orderBy: {
            groupNumber: 'asc'
        }
    });

    return groups;
}

interface GroupWithParticipants {
    id: number;
    groupNumber: number;
    groupName: string;
    color: string;
    participants: {
        id: number;
        name: string;
        section: string;
    }[];
}

export default async function GroupsDisplayPage() {
    const groups = await getGroupsWithParticipants() as unknown as GroupWithParticipants[];

    return (
        <div className="min-h-screen bg-rama-dark-green text-white relative overflow-hidden font-sans">
            {/* Background Ambience */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 pattern-islamic-geometry opacity-20"></div>
                <div className="absolute inset-0 pattern-stars"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 via-transparent to-black/20"></div>
            </div>

            <main className="relative z-10 container mx-auto px-4 py-12 min-h-screen flex flex-col">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="flex justify-center mb-4">
                        <div className="p-4 bg-rama-gold/10 rounded-full border border-rama-gold/30 animate-pulse">
                            <Trophy className="w-12 h-12 text-rama-gold" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-majestic text-rama-gold font-bold tracking-wide animate-holy-glow mb-4">
                        MINI GAME TEAMS
                    </h1>
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-[1px] w-8 md:w-20 bg-rama-gold/30"></div>
                        <p className="text-rama-white/70 uppercase tracking-[0.3em] text-sm md:text-base">TechnoDay 2026</p>
                        <div className="h-[1px] w-8 md:w-20 bg-rama-gold/30"></div>
                    </div>
                </div>

                {/* Back Link */}
                <div className="mb-8 flex justify-center">
                    <Link href="/" className="flex items-center gap-2 text-rama-gold/60 hover:text-rama-gold transition-colors group">
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Home</span>
                    </Link>
                </div>

                {/* Groups Grid */}
                {groups.length > 0 ? (
                    <GroupsList initialGroups={groups} />
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                            <Users className="w-10 h-10 text-rama-white/20" />
                        </div>
                        <h3 className="text-2xl font-bold text-rama-gold/50 mb-2">Groups not yet formed</h3>
                        <p className="text-rama-white/40">The admin is currently preparing the battlefield.</p>
                    </div>
                )}

                {/* Info footer */}
                <div className="text-center mt-20 text-rama-white/30 text-xs">
                    <p>© 2026 TechnoDay • Ramadhan Pit Stop Mini Games</p>
                </div>
            </main>
        </div>
    );
}
