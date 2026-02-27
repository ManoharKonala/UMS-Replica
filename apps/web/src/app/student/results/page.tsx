"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Award } from "lucide-react";
import Sidebar from "@/components/Sidebar";

const results = [
    { course: "CS101 – DSA", internal: 38, external: 52, total: 90, grade: "A+", gpa: 10.0, semester: "Fall 2025" },
    { course: "CS201 – DBMS", internal: 35, external: 45, total: 80, grade: "A", gpa: 9.0, semester: "Fall 2025" },
    { course: "MT101 – Linear Algebra", internal: 30, external: 40, total: 70, grade: "B+", gpa: 8.0, semester: "Fall 2025" },
    { course: "CS102 – Programming", internal: 40, external: 55, total: 95, grade: "O", gpa: 10.0, semester: "Spring 2025" },
    { course: "PH101 – Physics", internal: 32, external: 43, total: 75, grade: "A", gpa: 9.0, semester: "Spring 2025" },
];

const semesterGPA = [
    { sem: "Sem 1", gpa: 8.2 },
    { sem: "Sem 2", gpa: 8.6 },
    { sem: "Sem 3", gpa: 8.4 },
    { sem: "Sem 4", gpa: 8.8 },
];

export default function ResultsPage() {
    const cgpa = (semesterGPA.reduce((a, s) => a + s.gpa, 0) / semesterGPA.length).toFixed(1);

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <BarChart3 size={28} style={{ color: "var(--primary)" }} /> Results & Analytics
                    </h1>
                </motion.div>

                {/* GPA Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="stat-card">
                        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Current CGPA</p>
                        <p className="text-3xl font-bold text-white mt-1">{cgpa}</p>
                        <div className="flex items-center gap-1 mt-1">
                            <TrendingUp size={12} className="text-green-400" />
                            <span className="text-xs text-green-400">+0.2 from last sem</span>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat-card">
                        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Last Sem GPA</p>
                        <p className="text-3xl font-bold text-white mt-1">8.8</p>
                        <span className="badge badge-success mt-2">Dean&apos;s List</span>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="stat-card">
                        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Total Credits</p>
                        <p className="text-3xl font-bold text-white mt-1">72</p>
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>of 160 required</span>
                    </motion.div>
                </div>

                {/* Semester GPA Trend */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }} className="glass-card p-6 mb-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Semester GPA Trend</h2>
                    <div className="flex items-end gap-6 h-40">
                        {semesterGPA.map((s) => (
                            <div key={s.sem} className="flex flex-col items-center flex-1">
                                <span className="text-sm font-bold text-white mb-2">{s.gpa}</span>
                                <div className="w-full rounded-t-lg transition-all"
                                    style={{
                                        height: `${(s.gpa / 10) * 100}%`,
                                        background: `linear-gradient(180deg, var(--gradient-start), var(--gradient-end))`,
                                        opacity: 0.8,
                                    }} />
                                <span className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>{s.sem}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Detailed Results */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }} className="glass-card p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Detailed Results</h2>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Course</th>
                                <th>Internal</th>
                                <th>External</th>
                                <th>Total</th>
                                <th>Grade</th>
                                <th>GPA</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((r, i) => (
                                <tr key={i}>
                                    <td className="text-white font-medium">{r.course}</td>
                                    <td>{r.internal}/40</td>
                                    <td>{r.external}/60</td>
                                    <td className="text-white font-semibold">{r.total}/100</td>
                                    <td><span className="badge badge-success">{r.grade}</span></td>
                                    <td className="text-white">{r.gpa}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            </main>
        </div>
    );
}
