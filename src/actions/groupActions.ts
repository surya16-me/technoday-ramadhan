"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function generateGroups({ groupCount }: { groupCount: number }) {
    try {
        if (!groupCount || groupCount < 1) {
            throw new Error("Jumlah kelompok harus minimal 1");
        }

        const participants = await prisma.trn_register.findMany({
            where: {
                isCheckedIn: true
            }
        });

        if (participants.length === 0) {
            throw new Error("Belum ada peserta yang hadir untuk dibagi kelompok");
        }

        // 1. Group participants by section
        const participantsBySection: { [key: string]: typeof participants } = {};
        participants.forEach(p => {
            const section = p.section || 'Unassigned';
            if (!participantsBySection[section]) {
                participantsBySection[section] = [];
            }
            participantsBySection[section].push(p);
        });

        // 2. Create a balanced list by picking one from each section in round-robin fashion
        const balancedList: typeof participants = [];
        const sections = Object.keys(participantsBySection);
        let maxCount = 0;

        // Find the maximum number of participants in any section
        sections.forEach(s => {
            // Shuffle each section internally first
            const sectionList = participantsBySection[s];
            for (let i = sectionList.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [sectionList[i], sectionList[j]] = [sectionList[j], sectionList[i]];
            }
            maxCount = Math.max(maxCount, sectionList.length);
        });

        // Pick one from each section repeatedly
        for (let i = 0; i < maxCount; i++) {
            sections.forEach(section => {
                if (participantsBySection[section].length > 0) {
                    balancedList.push(participantsBySection[section].pop()!);
                }
            });
        }

        const participantsToAssign = balancedList;

        const groupThemes = [
            { name: "Ketupat Racing", color: "#FFC845" }, // Gold
            { name: "Opor Speedster", color: "#4ade80" }, // Green
            { name: "Rendang Nitro", color: "#ef4444" }, // Red
            { name: "Marjan Turbo", color: "#f472b6" }, // Pink
            { name: "Sarung Drift", color: "#60a5fa" }, // Blue
            { name: "Peci Power", color: "#a78bfa" }, // Purple
            { name: "Kurma Kinetic", color: "#fb923c" }, // Orange
            { name: "Bedug Boom", color: "#14b8a6" }, // Teal
            { name: "Kolak Express", color: "#d97706" }, // Amber
            { name: "Takjil Turbo", color: "#e879f9" }, // Fuchsia
            { name: "Sahur Sonic", color: "#1e3a8a" }, // Dark Blue
            { name: "Imsak Impulse", color: "#94a3b8" }, // Slate
            { name: "Mudik Motion", color: "#06b6d4" }, // Cyan
            { name: "THR Thunder", color: "#facc15" }, // Yellow
            { name: "Santri Sprint", color: "#84cc16" }, // Lime
            { name: "Masjid Mach", color: "#10b981" }, // Emerald
            { name: "Tadarus Torque", color: "#8b5cf6" }, // Violet
            { name: "Zakat Zoom", color: "#6366f1" }, // Indigo
            { name: "Puasa Power", color: "#f43f5e" }, // Rose
            { name: "Lebaran Light", color: "#fde047" }, // Light Yellow
            { name: "Ngabuburit Nitro", color: "#f97316" }, // Orange Red
            { name: "Sirup Speed", color: "#ec4899" }, // Pink
        ];

        // Reset existing groups
        await (prisma as any).$transaction([
            (prisma as any).trn_register.updateMany({
                data: { groupId: null }
            }),
            (prisma as any).trn_group.deleteMany({})
        ]);

        const result = await (prisma as any).$transaction(async (tx: any) => {
            const createdGroups = [];
            for (let i = 0; i < groupCount; i++) {
                const theme = groupThemes[i % groupThemes.length];
                const groupName = `${theme.name} ${i + 1 > groupThemes.length ? Math.ceil((i + 1) / groupThemes.length) : ''}`.trim();
                const group = await tx.trn_group.create({
                    data: {
                        groupNumber: i + 1,
                        groupName,
                        color: theme.color
                    }
                });
                createdGroups.push(group);
            }

            for (let i = 0; i < participantsToAssign.length; i++) {
                const groupIndex = i % groupCount;
                await tx.trn_register.update({
                    where: { id: participantsToAssign[i].id },
                    data: { groupId: createdGroups[groupIndex].id }
                });
            }

            return createdGroups;
        });

        revalidatePath("/admin/groups");
        revalidatePath("/groups"); // Revalidate public groups page too

        return { success: true, count: result.length };
    } catch (error: any) {
        console.error("Group generation error:", error);
        throw new Error(error.message || "Gagal membuat kelompok");
    }
}

export async function deleteGroups() {
    try {
        await (prisma as any).$transaction([
            (prisma as any).trn_register.updateMany({
                data: { groupId: null }
            }),
            (prisma as any).trn_group.deleteMany({})
        ]);

        revalidatePath("/admin/groups");
        revalidatePath("/groups");

        return { success: true };
    } catch (error: any) {
        console.error("Delete groups error:", error);
        throw new Error("Gagal menghapus kelompok");
    }
}

export async function assignGroup({ participantId, groupId }: { participantId: number; groupId: number | null }) {
    try {
        await (prisma as any).trn_register.update({
            where: { id: participantId },
            data: { groupId }
        });

        revalidatePath("/admin/groups");

        return { success: true };
    } catch (error: any) {
        console.error("Assign group error:", error);
        throw new Error("Gagal memindahkan peserta");
    }
}
