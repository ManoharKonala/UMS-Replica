"use client";

import { motion } from "framer-motion";
import { Building2, Wrench, Wifi, Wind, Bath, BookOpen, AlertTriangle, CheckCircle2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";

const roomInfo = {
    building: "Hostel A", room: "A-101", type: "Double Sharing",
    floor: "1st Floor", amenities: ["WiFi", "AC", "Attached Bath"],
    roommate: "Rahul Mehra",
};

const maintenanceRequests = [
    { id: 1, title: "AC not cooling properly", priority: "high", status: "in_progress", date: "Feb 14" },
    { id: 2, title: "Bathroom tap leaking", priority: "medium", status: "pending", date: "Feb 12" },
    { id: 3, title: "Window latch broken", priority: "low", status: "resolved", date: "Feb 8" },
];

const amenityIcons: Record<string, any> = { WiFi: Wifi, AC: Wind, "Attached Bath": Bath, "Study Desk": BookOpen };

export default function HousingPage() {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Building2 size={28} style={{ color: "var(--primary)" }} /> Residence Management
                    </h1>
                    <p className="mt-1" style={{ color: "var(--text-secondary)" }}>Your housing details and maintenance requests</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Room Details */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-6 lg:col-span-1">
                        <h2 className="text-lg font-semibold text-white mb-4">My Room</h2>
                        <div className="space-y-4">
                            {[
                                ["Building", roomInfo.building], ["Room", roomInfo.room],
                                ["Type", roomInfo.type], ["Floor", roomInfo.floor],
                                ["Roommate", roomInfo.roommate],
                            ].map(([label, value]) => (
                                <div key={label} className="flex justify-between">
                                    <span className="text-sm" style={{ color: "var(--text-muted)" }}>{label}</span>
                                    <span className="text-sm font-medium text-white">{value}</span>
                                </div>
                            ))}
                            <div className="pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                                <p className="text-xs font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Amenities</p>
                                <div className="flex flex-wrap gap-2">
                                    {roomInfo.amenities.map((a) => {
                                        const Icon = amenityIcons[a] || Wifi;
                                        return (
                                            <span key={a} className="badge badge-info flex items-center gap-1">
                                                <Icon size={12} />{a}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Maintenance Requests */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }} className="glass-card p-6 lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Wrench size={18} style={{ color: "var(--primary)" }} /> Maintenance Requests
                            </h2>
                            <button className="btn-primary text-sm py-2 px-4">+ New Request</button>
                        </div>
                        <div className="space-y-3">
                            {maintenanceRequests.map((req) => (
                                <div key={req.id} className="p-4 rounded-lg flex items-center gap-4"
                                    style={{ background: "rgba(255,255,255,0.03)" }}>
                                    <div className={`w-2 h-2 rounded-full ${req.priority === "high" ? "bg-red-400" :
                                            req.priority === "medium" ? "bg-yellow-400" : "bg-green-400"}`} />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-white">{req.title}</p>
                                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{req.date}</p>
                                    </div>
                                    <span className={`badge ${req.status === "resolved" ? "badge-success" :
                                            req.status === "in_progress" ? "badge-warning" : "badge-info"}`}>
                                        {req.status === "in_progress" ? "In Progress" :
                                            req.status === "resolved" ? "Resolved" : "Pending"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
