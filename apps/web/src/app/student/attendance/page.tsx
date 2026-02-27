"use client";

import { motion } from "framer-motion";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import Sidebar from "@/components/Sidebar";

const timetable = [
    {
        day: "Monday", slots: [
            { course: "CS101 – DSA", time: "9:00 - 10:30", room: "A-101", type: "Lecture" },
            { course: "MT101 – Linear Algebra", time: "14:00 - 15:00", room: "C-301", type: "Lecture" },
        ]
    },
    {
        day: "Tuesday", slots: [
            { course: "CS201 – DBMS", time: "11:00 - 12:30", room: "B-204", type: "Lecture" },
            { course: "CS101 – DSA Lab", time: "14:00 - 16:00", room: "Lab-1", type: "Lab" },
        ]
    },
    {
        day: "Wednesday", slots: [
            { course: "CS101 – DSA", time: "9:00 - 10:30", room: "A-101", type: "Lecture" },
            { course: "CS301 – OS", time: "11:00 - 12:30", room: "D-102", type: "Lecture" },
        ]
    },
    {
        day: "Thursday", slots: [
            { course: "CS201 – DBMS", time: "11:00 - 12:30", room: "B-204", type: "Lecture" },
            { course: "CS201 – DBMS Lab", time: "14:00 - 16:00", room: "Lab-2", type: "Lab" },
        ]
    },
    {
        day: "Friday", slots: [
            { course: "MT101 – Linear Algebra", time: "14:00 - 15:00", room: "C-301", type: "Lecture" },
            { course: "CS301 – OS Lab", time: "15:00 - 17:00", room: "Lab-3", type: "Lab" },
        ]
    },
];

const attendance = [
    { course: "CS101 – DSA", present: 22, total: 24, pct: 92 },
    { course: "CS201 – DBMS", present: 17, total: 20, pct: 85 },
    { course: "MT101 – Linear Algebra", present: 14, total: 18, pct: 78 },
    { course: "CS301 – OS", present: 11, total: 12, pct: 92 },
];

export default function AttendancePage() {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <CalendarDays size={28} style={{ color: "var(--primary)" }} /> Attendance & Timetable
                    </h1>
                </motion.div>

                {/* Attendance Summary */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 mb-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Attendance Summary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {attendance.map((item) => (
                            <div key={item.course} className="p-4 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                                <p className="text-sm font-medium text-white mb-2">{item.course}</p>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                                        {item.present}/{item.total} classes
                                    </span>
                                    <span className={`badge ${item.pct >= 85 ? "badge-success" : item.pct >= 75 ? "badge-warning" : "badge-error"}`}>
                                        {item.pct}%
                                    </span>
                                </div>
                                <div className="progress-bar mt-2">
                                    <div className="progress-fill" style={{
                                        width: `${item.pct}%`,
                                        background: item.pct >= 85 ? "#22c55e" : item.pct >= 75 ? "#eab308" : "#ef4444"
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Weekly Timetable */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }} className="glass-card p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Weekly Schedule</h2>
                    <div className="space-y-4">
                        {timetable.map((day) => (
                            <div key={day.day}>
                                <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--primary)" }}>{day.day}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {day.slots.map((slot, i) => (
                                        <div key={i} className="p-3 rounded-lg flex items-center gap-3"
                                            style={{ background: "rgba(255,255,255,0.03)" }}>
                                            <div className="w-1 h-full rounded-full" style={{
                                                background: slot.type === "Lab" ? "#a855f7" : "var(--primary)",
                                                minHeight: "40px"
                                            }} />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-white">{slot.course}</p>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                                                        <Clock size={10} />{slot.time}
                                                    </span>
                                                    <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                                                        <MapPin size={10} />{slot.room}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className={`badge ${slot.type === "Lab" ? "badge-info" : "badge-success"}`}
                                                style={slot.type === "Lab" ? { background: "rgba(168,85,247,0.15)", color: "#a855f7" } : {}}>
                                                {slot.type}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
