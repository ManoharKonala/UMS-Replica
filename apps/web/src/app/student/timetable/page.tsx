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

export default function TimetablePage() {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <CalendarDays size={28} style={{ color: "var(--primary)" }} /> Weekly Timetable
                    </h1>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6">
                    <div className="space-y-6">
                        {timetable.map((day) => (
                            <div key={day.day}>
                                <h3 className="text-sm font-bold mb-3 uppercase tracking-wide" style={{ color: "var(--primary)" }}>
                                    {day.day}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {day.slots.map((slot, i) => (
                                        <div key={i} className="p-4 rounded-lg border"
                                            style={{
                                                background: "rgba(255,255,255,0.03)",
                                                borderColor: slot.type === "Lab" ? "rgba(168,85,247,0.2)" : "rgba(43,108,238,0.15)"
                                            }}>
                                            <p className="text-sm font-semibold text-white">{slot.course}</p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                                                    <Clock size={10} />{slot.time}
                                                </span>
                                                <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                                                    <MapPin size={10} />{slot.room}
                                                </span>
                                            </div>
                                            <span className={`badge mt-2 ${slot.type === "Lab" ? "" : "badge-success"}`}
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
