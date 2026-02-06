import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        // @ts-ignore
        await (prisma as any).$transaction([
            // @ts-ignore
            (prisma as any).trn_register.updateMany({
                data: { groupId: null }
            }),
            // @ts-ignore
            (prisma as any).trn_group.deleteMany({})
        ]);

        return NextResponse.json({ success: true, message: "Semua kelompok berhasil dihapus" });
    } catch (error: any) {
        console.error("Group delete error:", error);
        return NextResponse.json({ error: "Gagal menghapus kelompok" }, { status: 500 });
    }
}
