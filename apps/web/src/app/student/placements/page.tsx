"use client";

import { motion } from "framer-motion";
import { Briefcase, MapPin, Calendar, ExternalLink, Star, Building } from "lucide-react";
import Sidebar from "@/components/Sidebar";

const placements = [
    { company: "Google", role: "SDE Intern", ctc: "₹45 LPA", location: "Bangalore", deadline: "Mar 1", status: "open", logo: "🔵" },
    { company: "Microsoft", role: "Software Engineer", ctc: "₹38 LPA", location: "Hyderabad", deadline: "Mar 5", status: "open", logo: "🟦" },
    { company: "Amazon", role: "Backend Developer", ctc: "₹32 LPA", location: "Bangalore", deadline: "Feb 28", status: "applied", logo: "🟠" },
    { company: "Flipkart", role: "Full Stack Dev", ctc: "₹28 LPA", location: "Bangalore", deadline: "Mar 10", status: "open", logo: "🟡" },
    { company: "Adobe", role: "ML Engineer", ctc: "₹35 LPA", location: "Noida", deadline: "Feb 25", status: "shortlisted", logo: "🔴" },
];

const stats = [
    { label: "Companies Visited", value: "24" },
    { label: "Offers Made", value: "156" },
    { label: "Highest CTC", value: "₹52 LPA" },
    { label: "Placement Rate", value: "89%" },
];

export default function PlacementsPage() {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Briefcase size={28} style={{ color: "var(--primary)" }} /> Placement & Internship Portal
                    </h1>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {stats.map((s, i) => (
                        <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }} className="stat-card text-center">
                            <p className="text-2xl font-bold text-white">{s.value}</p>
                            <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{s.label}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }} className="glass-card p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Active Opportunities</h2>
                    <div className="space-y-4">
                        {placements.map((p) => (
                            <div key={p.company} className="p-4 rounded-lg flex items-center gap-4"
                                style={{ background: "rgba(255,255,255,0.03)" }}>
                                <div className="text-3xl">{p.logo}</div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-white font-semibold">{p.company}</p>
                                        <span className={`badge ${p.status === "shortlisted" ? "badge-success" :
                                                p.status === "applied" ? "badge-warning" : "badge-info"}`}>
                                            {p.status}
                                        </span>
                                    </div>
                                    <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>{p.role}</p>
                                    <div className="flex items-center gap-4 mt-1">
                                        <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                                            <MapPin size={10} />{p.location}
                                        </span>
                                        <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                                            <Calendar size={10} />Deadline: {p.deadline}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold" style={{ color: "var(--primary)" }}>{p.ctc}</p>
                                    <button className="btn-secondary text-xs py-1.5 px-3 mt-2">
                                        Apply <ExternalLink size={10} className="inline ml-1" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
