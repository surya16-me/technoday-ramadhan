import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const admin = await prisma.mst_user.upsert({
            where: { username: 'admin' },
            update: {},
            create: {
                username: 'admin',
                password: 'technoday-ramadhan',
            },
        });
        return NextResponse.json({ success: true, admin });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
