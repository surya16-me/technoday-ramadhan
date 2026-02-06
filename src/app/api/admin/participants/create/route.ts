import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
    try {
        const { name, npk, section } = await request.json();

        if (!name || !npk || !section) {
            return NextResponse.json(
                { error: "Nama, NPK, dan Section wajib diisi" },
                { status: 400 }
            );
        }

        // Check if NPK exists
        const existing = await prisma.trn_register.findUnique({
            where: { npk }
        });

        if (existing) {
            // If already exists, just mark as checked in
            const updated = await prisma.trn_register.update({
                where: { npk },
                data: {
                    attendance: "hadir",
                    isCheckedIn: true
                }
            });
            revalidatePath("/admin");
            return NextResponse.json({ success: true, message: "Peserta sudah terdaftar, status diupdate ke Hadir & Check-in", data: updated });
        }

        // Create new
        const newParticipant = await prisma.trn_register.create({
            data: {
                name,
                npk,
                section,
                attendance: "hadir",
                isCheckedIn: true
            }
        });

        revalidatePath("/admin");
        return NextResponse.json({ success: true, message: "Peserta dadakan berhasil didaftarkan!", data: newParticipant });
    } catch (error: any) {
        console.error("Create participant error:", error);
        return NextResponse.json({ error: "Gagal mendaftarkan peserta" }, { status: 500 });
    }
}
