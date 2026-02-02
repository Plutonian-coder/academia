"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    Settings,
    PieChart,
    BookOpen
} from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"

const sidebarItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/" },
    { icon: Users, label: "Students", href: "/students" },
    { icon: GraduationCap, label: "Academics", href: "/academics" },
    { icon: PieChart, label: "Analytics", href: "/analytics" },
    { icon: BookOpen, label: "Courses", href: "/courses" },
]

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="hidden h-screen w-64 flex-col bg-[#064e3b] dark:bg-black text-white md:flex shadow-2xl z-50 border-r border-emerald-900 dark:border-neutral-800">
            {/* Branding Area */}
            <div className="flex h-20 shrink-0 items-center justify-between px-6 bg-[#065f46] dark:bg-neutral-900">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-wider">
                    <GraduationCap className="h-8 w-8 text-emerald-300" />
                    <span>ACADEMIA</span>
                </Link>
                <ThemeToggle />
            </div>

            {/* Main Navigation */}
            <div className="flex-1 overflow-y-auto py-6 px-4">
                {/* Nav Section */}
                <div>
                    <h3 className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-emerald-400/80 dark:text-neutral-500">
                        Menu
                    </h3>
                    <nav className="flex flex-col gap-2">
                        {sidebarItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-all hover:bg-emerald-800 dark:hover:bg-neutral-800 hover:translate-x-1",
                                    pathname === item.href
                                        ? "bg-emerald-600 dark:bg-neutral-800 shadow-md text-white ring-1 ring-emerald-400/30 dark:ring-neutral-600"
                                        : "text-emerald-100/90 dark:text-neutral-300"
                                )}
                            >
                                <item.icon className="h-5 w-5 opacity-80" />
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Footer / User Profile */}
            <div className="mt-auto border-t border-emerald-800 dark:border-neutral-800 p-4 bg-[#065f46] dark:bg-neutral-900">
                <Link
                    href="/settings"
                    className="flex items-center gap-3 rounded-lg px-2 py-2 text-emerald-100 dark:text-neutral-300 hover:bg-emerald-800 dark:hover:bg-neutral-800 transition-colors"
                >
                    <div className="h-8 w-8 rounded-full bg-emerald-200 dark:bg-neutral-700 flex items-center justify-center text-emerald-900 dark:text-white font-bold">
                        A
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">Admin User</span>
                        <span className="text-xs text-emerald-300 dark:text-neutral-500">View Profile</span>
                    </div>
                    <Settings className="ml-auto h-4 w-4 opacity-70" />
                </Link>
            </div>
        </aside>
    )
}
