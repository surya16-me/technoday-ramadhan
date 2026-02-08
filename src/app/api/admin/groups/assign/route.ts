import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { participantId, groupId } = body;

        if (!participantId || groupId === undefined) {
            return NextResponse.json(
                { error: "Participant ID and Group ID are required" },
                { status: 400 }
            );
        }

        // If groupId is null, it means unassign (move back to pool)
        // If groupId is a number, it means assign to that group

        const updated = await prisma.trn_register.update({
            where: { id: participantId },
            data: { groupId: groupId }
        });

        return NextResponse.json({ success: true, data: updated });
    } catch (error: any) {
        console.error("Group assignment error:", error);
        return NextResponse.json({ error: "Gagal memindahkan peserta" }, { status: 500 });
    }
}
