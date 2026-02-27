"use client";

import { motion } from "framer-motion";
import { BarChart3, Upload } from "lucide-react";
import Sidebar from "@/components/Sidebar";

const students = [
    { name: "Manohar Konala", enrollNo: "2024CS001", internal: 38, external: 52, total: 90, grade: "A+" },
    { name: "Rahul Mehra", enrollNo: "2024CS002", internal: 32, external: 40, total: 72, grade: "B+" },
    { name: "Priya Singh", enrollNo: "2024MT001", internal: 35, external: 48, total: 83, grade: "A" },
    { name: "Amit Kumar", enrollNo: "2024CS003", internal: 28, external: 35, total: 63, grade: "B" },
    { name: "Sneha Patel", enrollNo: "2024CS004", internal: 40, external: 55, total: 95, grade: "O" },
];

export default function FacultyResultsPage() {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <BarChart3 size={28} style={{ color: "var(--primary)" }} /> Results Management
                        </h1>
                        <button className="btn-primary flex items-center gap-2"><Upload size={16} /> Upload Marks</button>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <select className="input-field w-48">
                            <option>CS101 – DSA</option><option>CS201 – DBMS</option><option>CS301 – OS</option>
                        </select>
                        <select className="input-field w-40"><option>Fall 2025</option><option>Spring 2025</option></select>
                    </div>

                    <table className="data-table">
                        <thead><tr><th>#</th><th>Student</th><th>Enrollment</th><th>Internal (40)</th><th>External (60)</th><th>Total (100)</th><th>Grade</th></tr></thead>
                        <tbody>
                            {students.map((s, i) => (
                                <tr key={s.enrollNo}>
                                    <td>{i + 1}</td>
                                    <td className="text-white font-medium">{s.name}</td>
                                    <td className="font-mono text-sm">{s.enrollNo}</td>
                                    <td>{s.internal}</td>
                                    <td>{s.external}</td>
                                    <td className="text-white font-semibold">{s.total}</td>
                                    <td><span className={`badge ${s.total >= 80 ? "badge-success" : s.total >= 60 ? "badge-warning" : "badge-error"}`}>{s.grade}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            </main>
        </div>
    );
}
