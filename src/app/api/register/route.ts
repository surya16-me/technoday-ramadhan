import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, npk, section, attendance, comment } = body;

        // Simple Validation
        if (!name || !npk || !section || !attendance || !comment) {
            return NextResponse.json(
                { error: "Semua field harus diisi!" },
                { status: 400 }
            );
        }

        // NPK Validation: only alphanumeric, max 8 characters
        const npkRegex = /^[a-zA-Z0-9]{1,8}$/;
        if (!npkRegex.test(npk)) {
            return NextResponse.json(
                { error: "NPK harus berisi huruf/angka saja, maksimal 8 karakter!" },
                { status: 400 }
            );
        }

        // Check for duplicate NPK
        const existingNPK = await prisma.trn_register.findFirst({
            where: { npk }
        });

        if (existingNPK) {
            return NextResponse.json(
                { error: "NPK sudah terdaftar! Gunakan NPK yang berbeda." },
                { status: 409 }
            );
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

        return NextResponse.json({ success: true, id: result.id });
    } catch (error: any) {
        console.error("Registration error:", error);

        // Handle Prisma unique constraint violation
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: "NPK sudah terdaftar! Gunakan NPK yang berbeda." },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
