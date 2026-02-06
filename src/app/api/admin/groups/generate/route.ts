import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { groupCount } = body;

        if (!groupCount || groupCount < 1) {
            return NextResponse.json(
                { error: "Jumlah kelompok harus minimal 1" },
                { status: 400 }
            );
        }

        const participants = await prisma.trn_register.findMany({
            where: {
                isCheckedIn: true
            }
        });

        if (participants.length === 0) {
            return NextResponse.json(
                { error: "Belum ada peserta yang hadir untuk dibagi kelompok" },
                { status: 400 }
            );
        }

        const shuffled = [...participants];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

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
                const group = await tx.trn_group.create({
                    data: {
                        groupNumber: i + 1,
                        groupName: `${theme.name} ${i + 1 > groupThemes.length ? Math.ceil((i + 1) / groupThemes.length) : ''}`.trim(),
                        color: theme.color
                    }
                });
                createdGroups.push(group);
            }

            for (let i = 0; i < shuffled.length; i++) {
                const groupIndex = i % groupCount;
                await tx.trn_register.update({
                    where: { id: shuffled[i].id },
                    data: { groupId: createdGroups[groupIndex].id }
                });
            }

            return createdGroups;
        });

        return NextResponse.json({ success: true, count: result.length });
    } catch (error: any) {
        console.error("Group generation error:", error);
        return NextResponse.json({ error: "Gagal membuat kelompok" }, { status: 500 });
    }
}
