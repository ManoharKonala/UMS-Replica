"use client";

import { motion } from "framer-motion";
import { BookOpen, Users, BarChart3, Clock } from "lucide-react";
import Sidebar from "@/components/Sidebar";

const courses = [
    { code: "CS101", name: "Data Structures & Algorithms", students: 45, avgAttendance: 88, avgGrade: "A" },
    { code: "CS201", name: "Database Management Systems", students: 42, avgAttendance: 82, avgGrade: "B+" },
    { code: "CS301", name: "Operating Systems", students: 38, avgAttendance: 79, avgGrade: "B+" },
];

export default function FacultyCoursesPage() {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <BookOpen size={28} style={{ color: "var(--primary)" }} /> My Courses
                    </h1>
                    <p className="mt-1" style={{ color: "var(--text-secondary)" }}>Manage your courses, view enrolled students, and track performance.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {courses.map((course, i) => (
                        <motion.div key={course.code} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }} className="glass-card p-6 cursor-pointer">
                            <span className="badge badge-info mb-3">{course.code}</span>
                            <h3 className="text-white font-semibold text-lg">{course.name}</h3>
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
                                        <Users size={14} /> Enrolled
                                    </span>
                                    <span className="text-white font-medium">{course.students}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
                                        <BarChart3 size={14} /> Avg Attendance
                                    </span>
                                    <span className={`badge ${course.avgAttendance >= 85 ? "badge-success" : "badge-warning"}`}>
                                        {course.avgAttendance}%
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
                                        <Clock size={14} /> Avg Grade
                                    </span>
                                    <span className="text-white font-medium">{course.avgGrade}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
}
