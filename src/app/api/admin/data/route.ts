import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET() {
    // 1. Verify Authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token");

    if (!token || token.value !== "authorized") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Read Data
    try {
        const participants = await prisma.trn_register.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(participants);
    } catch (error) {
        console.error("Admin data error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
