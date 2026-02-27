"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, CheckCircle, XCircle, Clock } from "lucide-react";
import Sidebar from "@/components/Sidebar";

const students = [
    { id: 1, name: "Manohar Konala", enrollNo: "2024CS001", status: null },
    { id: 2, name: "Rahul Mehra", enrollNo: "2024CS002", status: null },
    { id: 3, name: "Priya Singh", enrollNo: "2024MT001", status: null },
    { id: 4, name: "Amit Kumar", enrollNo: "2024CS003", status: null },
    { id: 5, name: "Sneha Patel", enrollNo: "2024CS004", status: null },
];

export default function FacultyAttendancePage() {
    const [attendance, setAttendance] = useState<Record<number, "present" | "absent">>(
        Object.fromEntries(students.map(s => [s.id, "present" as const]))
    );
    const [selectedCourse, setSelectedCourse] = useState("CS101");

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <CalendarDays size={28} style={{ color: "var(--primary)" }} /> Mark Attendance
                    </h1>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 mb-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div>
                            <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Course</label>
                            <select className="input-field" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                                <option value="CS101">CS101 – DSA</option>
                                <option value="CS201">CS201 – DBMS</option>
                                <option value="CS301">CS301 – OS</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Date</label>
                            <input type="date" className="input-field" defaultValue={new Date().toISOString().split("T")[0]} />
                        </div>
                        <div className="ml-auto flex items-center gap-2 mt-5">
                            <span className="badge badge-success">{Object.values(attendance).filter(v => v === "present").length} Present</span>
                            <span className="badge badge-error">{Object.values(attendance).filter(v => v === "absent").length} Absent</span>
                        </div>
                    </div>

                    <table className="data-table">
                        <thead><tr><th>#</th><th>Student</th><th>Enrollment</th><th>Action</th></tr></thead>
                        <tbody>
                            {students.map((s, i) => (
                                <tr key={s.id}>
                                    <td>{i + 1}</td>
                                    <td className="text-white font-medium">{s.name}</td>
                                    <td className="font-mono text-sm">{s.enrollNo}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button onClick={() => setAttendance(prev => ({ ...prev, [s.id]: "present" }))}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${attendance[s.id] === "present"
                                                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                                        : "bg-white/5 text-gray-400 border border-gray-700"}`}>
                                                <CheckCircle size={12} className="inline mr-1" /> Present
                                            </button>
                                            <button onClick={() => setAttendance(prev => ({ ...prev, [s.id]: "absent" }))}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${attendance[s.id] === "absent"
                                                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                                        : "bg-white/5 text-gray-400 border border-gray-700"}`}>
                                                <XCircle size={12} className="inline mr-1" /> Absent
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex gap-3 mt-6">
                        <button className="btn-primary">Submit Attendance</button>
                        <button className="btn-secondary">Mark All Present</button>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
