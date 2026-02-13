'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSchedules() {
    try {
        const schedules = await prisma.mst_schedule.findMany({
            orderBy: { created_at: "desc" },
        });
        return { success: true, data: schedules };
    } catch (error) {
        return { success: false, error: "Failed to fetch schedules" };
    }
}

export async function createSchedule(data: {
    start_date: string;
    end_date: string;
    status: boolean;
}) {
    try {
        const schedule = await prisma.mst_schedule.create({
            data: {
                start_date: new Date(data.start_date),
                end_date: new Date(data.end_date),
                status: data.status,
            },
        });
        revalidatePath("/admin");
        return { success: true, data: schedule };
    } catch (error) {
        return { success: false, error: "Failed to create schedule" };
    }
}

export async function deleteSchedule(id: number) {
    try {
        await prisma.mst_schedule.delete({
            where: { id },
        });
        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete schedule" };
    }
}

export async function getScheduleStatus() {
    try {
        const now = new Date();
        const activeSchedule = await prisma.mst_schedule.findFirst({
            where: {
                status: true,
                start_date: {
                    lte: now,
                },
                end_date: {
                    gte: now,
                },
            },
        });

        return {
            isOpen: !!activeSchedule,
            schedule: activeSchedule,
        };
    } catch (error) {
        console.error("Failed to check schedule status:", error);
        return { isOpen: false, error: "Failed to check schedule" };
    }
}

export async function updateScheduleStatus(id: number, status: boolean) {
    try {
        const schedule = await prisma.mst_schedule.update({
            where: { id },
            data: { status },
        });
        revalidatePath("/admin");
        return { success: true, data: schedule };
    } catch (error) {
        return { success: false, error: "Failed to update schedule status" };
    }
}

export async function updateSchedule(id: number, data: {
    start_date: string;
    end_date: string;
    status: boolean;
}) {
    try {
        const schedule = await prisma.mst_schedule.update({
            where: { id },
            data: {
                start_date: new Date(data.start_date),
                end_date: new Date(data.end_date),
                status: data.status,
            },
        });
        revalidatePath("/admin");
        return { success: true, data: schedule };
    } catch (error) {
        return { success: false, error: "Failed to update schedule" };
    }
}
