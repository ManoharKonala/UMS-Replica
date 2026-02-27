"use client";

import { motion } from "framer-motion";
import { BookOpen, Users, Clock, Star } from "lucide-react";
import Sidebar from "@/components/Sidebar";

const courses = [
    { code: "CS101", name: "Data Structures & Algorithms", credits: 4, faculty: "Prof. Sharma", students: 45, schedule: "Mon, Wed 9:00-10:30", grade: "A+" },
    { code: "CS201", name: "Database Management Systems", credits: 4, faculty: "Prof. Sharma", students: 42, schedule: "Tue, Thu 11:00-12:30", grade: "A" },
    { code: "MT101", name: "Linear Algebra", credits: 3, faculty: "Prof. Gupta", students: 55, schedule: "Mon, Fri 14:00-15:00", grade: "B+" },
    { code: "CS301", name: "Operating Systems", credits: 4, faculty: "Prof. Sharma", students: 38, schedule: "Wed 11:00-12:30", grade: "–" },
];

export default function CoursesPage() {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <BookOpen size={28} style={{ color: "var(--primary)" }} /> My Courses
                    </h1>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courses.map((course, i) => (
                        <motion.div key={course.code} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }} className="glass-card p-6 cursor-pointer">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <span className="badge badge-info mb-2">{course.code}</span>
                                    <h3 className="text-white font-semibold text-lg">{course.name}</h3>
                                </div>
                                {course.grade !== "–" && (
                                    <span className="badge badge-success text-lg px-3 py-1">{course.grade}</span>
                                )}
                            </div>
                            <div className="space-y-2 mt-3">
                                <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                                    <Star size={14} style={{ color: "var(--primary)" }} />
                                    <span>{course.faculty}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                                    <Users size={14} style={{ color: "var(--primary)" }} />
                                    <span>{course.students} students · {course.credits} credits</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                                    <Clock size={14} style={{ color: "var(--primary)" }} />
                                    <span>{course.schedule}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
}
