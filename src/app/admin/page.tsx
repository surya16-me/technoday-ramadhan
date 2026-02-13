import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import AdminDashboardClient from "@/components/AdminDashboardClient";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token");

    if (!token || token.value !== "authorized") {
        redirect("/admin/login");
    }

    // Load participants from database
    const participants = await prisma.trn_register.findMany({
        select: {
            id: true,
            name: true,
            npk: true,
            section: true,
            attendance: true,
            groupId: true,
            group: {
                select: {
                    groupName: true,
                    color: true
                }
            },
            createdAt: true,
            isCheckedIn: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    // Get total comments count
    const commentsCount = await prisma.trn_comment.count();

    // Load schedules
    const schedules = await prisma.mst_schedule.findMany({
        orderBy: { created_at: 'desc' }
    });

    return <AdminDashboardClient
        initialParticipants={participants}
        commentsCount={commentsCount}
        initialSchedules={schedules}
    />;
}
