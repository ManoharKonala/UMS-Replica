"use client";

import { motion } from "framer-motion";
import {
    Users, BookOpen, Building2, BarChart3, Shield,
    TrendingUp, AlertTriangle, CheckCircle2,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useAuthStore } from "@/lib/store";

const stats = [
    { label: "Total Users", value: "1,247", icon: Users, color: "#2b6cee", change: "+12%" },
    { label: "Active Courses", value: "48", icon: BookOpen, color: "#22c55e", change: "+3" },
    { label: "Housing Occupancy", value: "89%", icon: Building2, color: "#a855f7", change: "+5%" },
    { label: "System Health", value: "99.8%", icon: Shield, color: "#22c55e", change: "Stable" },
];

const systemAlerts = [
    { type: "warning", message: "Database backup scheduled in 2 hours", time: "10:00 AM" },
    { type: "success", message: "SSL certificates renewed successfully", time: "Yesterday" },
    { type: "error", message: "3 failed login attempts from IP 192.168.1.45", time: "2h ago" },
    { type: "info", message: "New semester configuration required", time: "Upcoming" },
];

const userBreakdown = [
    { role: "Students", count: 1050, pct: 84 },
    { role: "Faculty", count: 147, pct: 12 },
    { role: "Admin", count: 50, pct: 4 },
];

export default function AdminDashboard() {
    const user = useAuthStore((s) => s.user);

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-3xl font-bold text-white">
                        Admin Dashboard <span style={{ color: "var(--primary)" }}>⚙️</span>
                    </h1>
                    <p className="mt-1" style={{ color: "var(--text-secondary)" }}>
                        System overview · University Management System
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
                            <div className="flex items-end gap-2">
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                                <span className="text-xs mb-1 font-medium" style={{ color: "#22c55e" }}>{stat.change}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* User Breakdown */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }} className="glass-card p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">User Breakdown</h2>
                        <div className="space-y-4">
                            {userBreakdown.map((item) => (
                                <div key={item.role}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-white">{item.role}</span>
                                        <span style={{ color: "var(--text-muted)" }}>{item.count}</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: `${item.pct}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* System Alerts */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }} className="glass-card p-6 lg:col-span-2">
                        <h2 className="text-lg font-semibold text-white mb-4">System Alerts</h2>
                        <div className="space-y-3">
                            {systemAlerts.map((alert, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-lg"
                                    style={{ background: "rgba(255,255,255,0.02)" }}>
                                    {alert.type === "success" && <CheckCircle2 size={16} className="text-green-400 shrink-0" />}
                                    {alert.type === "warning" && <AlertTriangle size={16} className="text-yellow-400 shrink-0" />}
                                    {alert.type === "error" && <AlertTriangle size={16} className="text-red-400 shrink-0" />}
                                    {alert.type === "info" && <TrendingUp size={16} className="shrink-0" style={{ color: "var(--primary)" }} />}
                                    <p className="text-sm flex-1 text-white">{alert.message}</p>
                                    <span className="text-xs shrink-0" style={{ color: "var(--text-muted)" }}>{alert.time}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
