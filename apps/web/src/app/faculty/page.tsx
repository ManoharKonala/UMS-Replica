"use client";

import { motion } from "framer-motion";
import {
    Users, BookOpen, ClipboardCheck, TrendingUp, FileText,
    CheckCircle, Clock, BarChart3,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useAuthStore } from "@/lib/store";

const stats = [
    { label: "Active Courses", value: "4", icon: BookOpen, color: "#2b6cee" },
    { label: "Total Students", value: "142", icon: Users, color: "#22c55e" },
    { label: "Pending Reviews", value: "7", icon: ClipboardCheck, color: "#eab308" },
    { label: "Leave Requests", value: "3", icon: FileText, color: "#a855f7" },
];

const pendingTasks = [
    { task: "Grade CS101 Assignment 5", due: "Today", priority: "high" },
    { task: "Review CS201 Lab 4 submissions", due: "Tomorrow", priority: "medium" },
    { task: "Update CS301 timetable", due: "Feb 18", priority: "low" },
    { task: "Approve leave: Rahul Mehra", due: "Pending", priority: "medium" },
];

const coursePerformance = [
    { course: "CS101 – DSA", enrolled: 45, avgAttendance: 88, avgGPA: 7.8 },
    { course: "CS201 – DBMS", enrolled: 42, avgAttendance: 82, avgGPA: 7.2 },
    { course: "CS301 – OS", enrolled: 38, avgAttendance: 79, avgGPA: 6.9 },
    { course: "MT101 – Linear Algebra", enrolled: 55, avgAttendance: 91, avgGPA: 8.1 },
];

export default function FacultyDashboard() {
    const user = useAuthStore((s) => s.user);

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-3xl font-bold text-white">
                        Good morning, <span style={{ color: "var(--primary)" }}>{user?.full_name?.split(" ")[0]}</span> 🎓
                    </h1>
                    <p className="mt-1" style={{ color: "var(--text-secondary)" }}>
                        Faculty dashboard · {user?.department}
                    </p>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, i) => (
                        <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                            className="stat-card">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{stat.label}</span>
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{ background: `${stat.color}15` }}>
                                    <stat.icon size={16} style={{ color: stat.color }} />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pending Tasks */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }} className="glass-card p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <ClipboardCheck size={18} style={{ color: "var(--primary)" }} />
                            Pending Tasks
                        </h2>
                        <div className="space-y-3">
                            {pendingTasks.map((task, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-lg"
                                    style={{ background: "rgba(255,255,255,0.03)" }}>
                                    <div className={`w-2 h-2 rounded-full ${task.priority === "high" ? "bg-red-400" :
                                            task.priority === "medium" ? "bg-yellow-400" : "bg-green-400"}`} />
                                    <p className="text-sm flex-1 text-white">{task.task}</p>
                                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>{task.due}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Course Performance */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }} className="glass-card p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <BarChart3 size={18} style={{ color: "var(--primary)" }} />
                            Course Performance
                        </h2>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Course</th>
                                    <th>Students</th>
                                    <th>Avg Att.</th>
                                    <th>Avg GPA</th>
                                </tr>
                            </thead>
                            <tbody>
                                {coursePerformance.map((c, i) => (
                                    <tr key={i}>
                                        <td className="text-white font-medium">{c.course}</td>
                                        <td>{c.enrolled}</td>
                                        <td>
                                            <span className={`badge ${c.avgAttendance >= 85 ? "badge-success" : "badge-warning"}`}>
                                                {c.avgAttendance}%
                                            </span>
                                        </td>
                                        <td className="text-white">{c.avgGPA}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
