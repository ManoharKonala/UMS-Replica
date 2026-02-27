"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    GraduationCap, LayoutDashboard, BookOpen, CalendarDays,
    BarChart3, Building2, MessageCircle, FileText, CreditCard,
    Briefcase, Award, Settings, LogOut, Users, ClipboardList,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";

const studentLinks = [
    { href: "/student", label: "Dashboard", icon: LayoutDashboard },
    { href: "/student/courses", label: "My Courses", icon: BookOpen },
    { href: "/student/attendance", label: "Attendance", icon: CalendarDays },
    { href: "/student/results", label: "Results", icon: BarChart3 },
    { href: "/student/timetable", label: "Timetable", icon: ClipboardList },
    { href: "/student/fees", label: "Fees & Aid", icon: CreditCard },
    { href: "/student/placements", label: "Placements", icon: Briefcase },
    { href: "/student/certificates", label: "Certificates", icon: Award },
    { href: "/student/housing", label: "Housing", icon: Building2 },
    { href: "/student/chat", label: "Chat Hub", icon: MessageCircle },
    { href: "/student/leaves", label: "Leave Mgmt", icon: FileText },
];

const facultyLinks = [
    { href: "/faculty", label: "Dashboard", icon: LayoutDashboard },
    { href: "/faculty/courses", label: "My Courses", icon: BookOpen },
    { href: "/faculty/attendance", label: "Mark Attendance", icon: CalendarDays },
    { href: "/faculty/results", label: "Results", icon: BarChart3 },
    { href: "/faculty/leaves", label: "Leave Requests", icon: FileText },
    { href: "/faculty/chat", label: "Chat Hub", icon: MessageCircle },
];

const adminLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/users", label: "Users", icon: Users },
    { href: "/dashboard/courses", label: "Courses", icon: BookOpen },
    { href: "/dashboard/housing", label: "Housing", icon: Building2 },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuthStore();

    const links = user?.role === "admin" ? adminLinks
        : user?.role === "faculty" ? facultyLinks
            : studentLinks;

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    return (
        <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="sidebar fixed left-0 top-0 h-screen w-64 flex flex-col z-50"
        >
            {/* Logo */}
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #2b6cee, #a855f7)" }}>
                    <GraduationCap size={22} className="text-white" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-white">UMS</h1>
                    <p className="text-xs capitalize" style={{ color: "var(--text-muted)" }}>{user?.role} Panel</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link key={link.href} href={link.href}
                            className={`sidebar-link ${isActive ? "active" : ""}`}>
                            <link.icon size={18} />
                            <span>{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Info & Logout */}
            <div className="p-4 border-t" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                        style={{ background: "linear-gradient(135deg, #2b6cee, #a855f7)" }}>
                        {user?.full_name?.charAt(0) || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{user?.full_name}</p>
                        <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{user?.email}</p>
                    </div>
                </div>
                <button onClick={handleLogout}
                    className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </motion.aside>
    );
}
