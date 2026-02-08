"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function checkInParticipant({ id, isCheckedIn }: { id: number; isCheckedIn: boolean }) {
    try {
        await prisma.trn_register.update({
            where: { id },
            data: { isCheckedIn }
        });

        // revalidatePath("/admin/dashboard");
        // revalidatePath("/admin/participants");

        return { success: true };
    } catch (error: any) {
        console.error("Check-in error:", error);
        throw new Error("Gagal update status check-in");
    }
}

export async function createParticipant({ name, npk, section }: { name: string; npk: string; section: string }) {
    try {
        if (!name || !npk || !section) {
            throw new Error("Semua field harus diisi");
        }

        const existing = await prisma.trn_register.findUnique({
            where: { npk }
        });

        if (existing) {
            throw new Error("NPK sudah terdaftar");
        }

        await prisma.trn_register.create({
            data: {
                name,
                npk,
                section,
                attendance: "hadir", // Default for walk-in
                isCheckedIn: true,   // Auto check-in
            }
        });

        revalidatePath("/admin/dashboard");
        revalidatePath("/admin/participants");

        return { success: true, message: "Peserta berhasil didaftarkan" };
    } catch (error: any) {
        console.error("Create participant error:", error);
        throw new Error(error.message || "Gagal mendaftarkan peserta");
    }
}

export async function registerParticipant({ name, npk, section, attendance, comment }: { name: string; npk: string; section: string; attendance: string; comment: string }) {
    try {
        // Simple Validation
        if (!name || !npk || !section || !attendance || !comment) {
            throw new Error("Semua field harus diisi!");
        }

        // NPK Validation: only alphanumeric, max 8 characters
        const npkRegex = /^[a-zA-Z0-9]{1,8}$/;
        if (!npkRegex.test(npk)) {
            throw new Error("NPK harus berisi huruf/angka saja, maksimal 8 karakter!");
        }

        // Check for duplicate NPK
        const existingNPK = await prisma.trn_register.findFirst({
            where: { npk }
        });

        if (existingNPK) {
            throw new Error("NPK sudah terdaftar! Gunakan NPK yang berbeda.");
        }

        // Use Prisma Transaction
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create Registration Record
            const newRegister = await tx.trn_register.create({
                data: {
                    name,
                    npk,
                    section,
                    attendance,
                }
            });

            // 2. Create Anonymous Comment Record
            // Completely anonymous - no link to registration
            await tx.trn_comment.create({
                data: {
                    content: comment,
                }
            });

            return newRegister;
        });

        return { success: true, id: result.id };
    } catch (error: any) {
        console.error("Registration error:", error);

        // Handle Prisma unique constraint violation
        if (error.code === 'P2002') {
            throw new Error("NPK sudah terdaftar! Gunakan NPK yang berbeda.");
        }

        throw new Error(error.message || "Gagal mendaftar. Silakan coba lagi.");
    }
}
