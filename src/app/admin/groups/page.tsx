import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import AdminGroupManager from "../../../components/AdminGroupManager";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminGroupsPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token");

    if (!token || token.value !== "authorized") {
        redirect("/admin/login");
    }

    // Load available participants who are attending
    const participants = await prisma.trn_register.findMany({
        where: {
            attendance: "hadir",
            isCheckedIn: true
        },
        select: { id: true, name: true, section: true }
    });

    // Load current groups
    // @ts-ignore
    const currentGroups = await (prisma as any).trn_group.findMany({
        include: {
            participants: {
                select: { id: true, name: true, section: true }
            }
        },
        orderBy: { groupNumber: 'asc' }
    });

    return (
        <AdminGroupManager
            initialGroups={currentGroups}
            attendingCount={participants.length}
        />
    );
}
