import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        const { password } = await request.json();

        // Check against mst_user
        const user = await prisma.mst_user.findFirst({
            where: {
                username: 'admin', // Default admin user
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: "Password salah!" },
                { status: 401 }
            );
        }

        // Compare hashed password
        const isValid = await bcrypt.compare(password, user.password);

        if (isValid) {
            // Set HttpOnly cookie
            const cookieStore = await cookies();
            cookieStore.set("admin_token", "authorized", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 60 * 60 * 24, // 1 day
                path: "/",
            });

            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json(
                { error: "Password salah!" },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error("Auth error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE() {
    const cookieStore = await cookies();
    cookieStore.delete("admin_token");
    return NextResponse.json({ success: true });
}
