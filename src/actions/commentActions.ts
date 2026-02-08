"use server";

import { prisma } from "@/lib/prisma";

export async function shuffleComments() {
    try {
        // Get all comments and shuffle them
        const comments = await prisma.trn_comment.findMany({
            select: {
                id: true,
                content: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Shuffle the comments array (Fisher-Yates algorithm)
        const shuffled = [...comments];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return shuffled;
    } catch (error) {
        console.error("Shuffle comments error:", error);
        throw new Error("Gagal mengocok komentar");
    }
}
