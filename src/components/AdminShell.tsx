"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut, Calendar, LayoutDashboard } from "lucide-react";
import { ReactNode } from "react";

interface AdminShellProps {
    children: ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        await fetch("/api/auth", { method: "DELETE" });
        router.push("/admin/login");
        router.refresh();
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* Navbar */}
            <nav className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/admin" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-racing-red rounded-lg flex items-center justify-center font-bold text-white group-hover:bg-racing-red/80 transition-colors">A</div>
                            <span className="font-bold tracking-wide text-white group-hover:text-gray-200 transition-colors">Admin Dashboard</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-4 border-l border-zinc-700 pl-6 h-8">
                            <Link
                                href="/admin"
                                className={`flex items-center gap-2 text-sm font-medium transition-colors ${pathname === "/admin"
                                    ? "text-white"
                                    : "text-zinc-400 hover:text-rama-gold"
                                    }`}
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                Overview
                            </Link>
                            <Link
                                href="/admin/groups"
                                className={`flex items-center gap-2 text-sm font-medium transition-colors ${pathname === "/admin/groups"
                                    ? "text-white"
                                    : "text-zinc-400 hover:text-rama-gold"
                                    }`}
                            >
                                <Calendar className="w-4 h-4" />
                                Grouping Mini Game
                            </Link>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-zinc-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
}
