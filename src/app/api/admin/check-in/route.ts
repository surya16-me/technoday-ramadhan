import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
    try {
        const { id, isCheckedIn } = await request.json();

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const updated = await prisma.trn_register.update({
            where: { id: Number(id) },
            data: { isCheckedIn: Boolean(isCheckedIn) }
        });

        revalidatePath("/admin");
        return NextResponse.json({ success: true, data: updated });
    } catch (error: any) {
        console.error("Check-in error:", error);
        return NextResponse.json({ error: "Failed to update check-in status" }, { status: 500 });
    }
}
