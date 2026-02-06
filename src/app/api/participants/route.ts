import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // Get all participants (without comments)
        const participants = await prisma.trn_register.findMany({
            select: {
                id: true,
                name: true,
                npk: true,
                section: true,
                attendance: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({
            total: participants.length,
            participants
        });
    } catch (error) {
        console.error("Participants list error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
