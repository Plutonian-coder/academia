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
    BookOpen,
    TrendingUp,
    Zap
} from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"

const sidebarItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/" },
    { icon: PieChart, label: "Analytics", href: "/analytics" },
    { icon: Users, label: "Students", href: "/students" },
    { icon: GraduationCap, label: "Academics", href: "/academics" },
    { icon: BookOpen, label: "Courses", href: "/courses" },
]

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="hidden h-screen w-64 flex-col bg-black text-white md:flex border-r border-neutral-900 shadow-none">
            {/* Branding Area */}
            <div className="flex h-20 shrink-0 items-center justify-between px-6 border-b border-neutral-900">
                <Link href="/" className="flex items-center gap-3 font-bold text-xl tracking-tighter">
                    <div className="h-8 w-8 bg-[#BFF549] flex items-center justify-center shadow-[0_0_15px_rgba(191,245,73,0.3)]">
                        <GraduationCap className="h-5 w-5 text-black" />
                    </div>
                    <span className="text-white tracking-widest text-lg font-mono">
                        ACADEMIA
                    </span>
                </Link>
                <div className="scale-75 origin-right">
                    <ThemeToggle />
                </div>
            </div>

            {/* Main Navigation */}
            <div className="flex-1 overflow-y-auto py-8 px-4">
                {/* Nav Section */}
                <div>
                    <h3 className="mb-4 px-2 text-[10px] font-mono uppercase tracking-widest text-[#BFF549]">
                        Menu
                    </h3>
                    <nav className="flex flex-col gap-1">
                        {sidebarItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-3 text-sm font-medium transition-all duration-200 border-l-2 border-transparent",
                                    pathname === item.href
                                        ? "text-[#BFF549] bg-neutral-900/50 border-[#BFF549]"
                                        : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                                )}
                            >
                                <item.icon className={cn("h-4 w-4", pathname === item.href ? "text-[#BFF549]" : "text-neutral-500")} />
                                <span className="tracking-wide">{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Footer / User Profile */}
            <div className="mt-auto border-t border-neutral-900 p-6">
                <Link
                    href="/settings"
                    className="flex items-center gap-3 hover:bg-neutral-900 p-2 transition-colors"
                >
                    <div className="h-10 w-10 bg-neutral-800 flex items-center justify-center text-[#BFF549] font-bold text-sm font-mono border border-neutral-700">
                        ADM
                    </div>
                    <div className="flex flex-col flex-1">
                        <span className="text-sm font-medium text-white tracking-wide">Admin User</span>
                        <span className="text-xs text-neutral-500 font-mono">System Admin</span>
                    </div>
                    <Settings className="h-4 w-4 text-neutral-600 hover:text-[#BFF549] transition-colors" />
                </Link>
            </div>
        </aside>
    )
}
