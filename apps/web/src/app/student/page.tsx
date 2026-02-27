"use client";

import { motion } from "framer-motion";
import {
    BookOpen, CalendarDays, BarChart3, Clock, TrendingUp,
    CheckCircle, AlertCircle, GraduationCap,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useAuthStore } from "@/lib/store";

const stats = [
    { label: "Enrolled Courses", value: "6", icon: BookOpen, color: "#2b6cee" },
    { label: "Attendance", value: "87%", icon: CalendarDays, color: "#22c55e" },
    { label: "Current CGPA", value: "8.4", icon: TrendingUp, color: "#a855f7" },
    { label: "Pending Tasks", value: "3", icon: Clock, color: "#eab308" },
];

const recentActivity = [
    { text: "Assignment submitted: CS201 DBMS Lab 4", time: "2h ago", status: "success" },
    { text: "Attendance marked: CS101 DSA", time: "4h ago", status: "info" },
    { text: "Result published: MT101 Linear Algebra", time: "1d ago", status: "success" },
    { text: "Leave request pending approval", time: "2d ago", status: "warning" },
    { text: "Fee payment due: Semester 4", time: "5d ago", status: "error" },
];

const upcomingClasses = [
    { course: "CS101 – Data Structures", time: "9:00 AM", room: "A-101", day: "Today" },
    { course: "CS201 – DBMS", time: "11:00 AM", room: "B-204", day: "Today" },
    { course: "MT101 – Linear Algebra", time: "2:00 PM", room: "C-301", day: "Today" },
];

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0 },
};

export default function StudentDashboard() {
    const user = useAuthStore((s) => s.user);

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="mb-8">
                    <h1 className="text-3xl font-bold text-white">
                        Welcome back, <span style={{ color: "var(--primary)" }}>{user?.full_name?.split(" ")[0]}</span> 👋
                    </h1>
                    <p className="mt-1" style={{ color: "var(--text-secondary)" }}>
                        Here&apos;s your academic overview for the current semester.
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div variants={containerVariants} initial="hidden" animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat) => (
                        <motion.div key={stat.label} variants={itemVariants} className="stat-card">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                                    {stat.label}
                                </span>
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{ background: `${stat.color}15` }}>
                                    <stat.icon size={16} style={{ color: stat.color }} />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Upcoming Classes */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }} className="glass-card p-6 lg:col-span-1">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <CalendarDays size={18} style={{ color: "var(--primary)" }} />
                            Today&apos;s Schedule
                        </h2>
                        <div className="space-y-3">
                            {upcomingClasses.map((cls, i) => (
                                <div key={i} className="p-3 rounded-lg flex items-center gap-3"
                                    style={{ background: "rgba(255,255,255,0.03)" }}>
                                    <div className="w-1 h-10 rounded-full" style={{ background: "var(--primary)" }} />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-white">{cls.course}</p>
                                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                                            {cls.time} · {cls.room}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Recent Activity */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }} className="glass-card p-6 lg:col-span-2">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <BarChart3 size={18} style={{ color: "var(--primary)" }} />
                            Recent Activity
                        </h2>
                        <div className="space-y-3">
                            {recentActivity.map((activity, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-lg"
                                    style={{ background: "rgba(255,255,255,0.02)" }}>
                                    {activity.status === "success" && <CheckCircle size={16} className="text-green-400 shrink-0" />}
                                    {activity.status === "warning" && <AlertCircle size={16} className="text-yellow-400 shrink-0" />}
                                    {activity.status === "error" && <AlertCircle size={16} className="text-red-400 shrink-0" />}
                                    {activity.status === "info" && <GraduationCap size={16} style={{ color: "var(--primary)" }} className="shrink-0" />}
                                    <p className="text-sm flex-1 text-white">{activity.text}</p>
                                    <span className="text-xs shrink-0" style={{ color: "var(--text-muted)" }}>{activity.time}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Attendance Quick View */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }} className="glass-card p-6 mt-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Attendance Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { course: "CS101 – DSA", pct: 92, total: 24 },
                            { course: "CS201 – DBMS", pct: 85, total: 20 },
                            { course: "MT101 – Linear Algebra", pct: 78, total: 18 },
                        ].map((item, i) => (
                            <div key={i} className="p-4 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-sm font-medium text-white">{item.course}</p>
                                    <span className={`badge ${item.pct >= 85 ? "badge-success" : item.pct >= 75 ? "badge-warning" : "badge-error"}`}>
                                        {item.pct}%
                                    </span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{
                                        width: `${item.pct}%`,
                                        background: item.pct >= 85 ? "#22c55e" : item.pct >= 75 ? "#eab308" : "#ef4444"
                                    }} />
                                </div>
                                <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>
                                    {item.total} classes conducted
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
