"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut, Calendar, LayoutDashboard, Menu, X, Users } from "lucide-react";
import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AdminShellProps {
    children: ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await fetch("/api/auth", { method: "DELETE" });
        router.push("/admin/login");
        router.refresh();
    };

    const navItems = [
        { href: "/admin", label: "Overview", icon: LayoutDashboard },
        { href: "/admin/groups", label: "Grouping Mini Game", icon: Users },
    ];

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* Navbar */}
            <nav className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-zinc-400 hover:text-white"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <Link href="/admin" className="flex items-center gap-3 group">
                            <div className="w-8 h-8 bg-gradient-to-br from-racing-red to-red-700 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-racing-red/20">A</div>
                            <span className="font-bold tracking-wide text-white group-hover:text-gray-200 transition-colors hidden sm:block">Admin Dashboard</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1 border-l border-zinc-700 pl-6 h-8 ml-2">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${isActive
                                            ? "bg-white/10 text-white shadow-inner"
                                            : "text-zinc-400 hover:text-rama-gold hover:bg-white/5"
                                            }`}
                                    >
                                        <item.icon className={`w-4 h-4 ${isActive ? "text-rama-gold" : ""}`} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="text-zinc-400 hover:text-racing-red flex items-center gap-2 text-sm font-medium transition-colors ml-auto md:ml-0"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-64 bg-zinc-900 border-r border-zinc-800 z-50 md:hidden shadow-2xl flex flex-col"
                        >
                            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                                <span className="font-bold text-lg text-white">Menu</span>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 py-4 px-2 space-y-1">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                                ? "bg-rama-gold/10 text-rama-gold border border-rama-gold/20"
                                                : "text-zinc-400 hover:text-white hover:bg-white/5"
                                                }`}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            <span className="font-medium">{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>

                            <div className="p-4 border-t border-zinc-800">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-racing-red hover:bg-racing-red/10 transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="font-medium">Logout</span>
                                </button>
                                <div className="mt-4 text-center text-xs text-zinc-600">
                                    TechnoDay v1.0
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
}
