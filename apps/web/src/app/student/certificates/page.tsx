"use client";

import { motion } from "framer-motion";
import { Award, Download, Shield, FileCheck, ExternalLink } from "lucide-react";
import Sidebar from "@/components/Sidebar";

const certificates = [
    { name: "Semester 3 Marksheet", type: "Academic", issued: "Jan 2026", status: "verified", hash: "0x3f8a...bc12" },
    { name: "Course Completion: CS101", type: "Course", issued: "Dec 2025", status: "verified", hash: "0x7d2e...a9f1" },
    { name: "Hackathon Winner – TechFest 2025", type: "Achievement", issued: "Nov 2025", status: "verified", hash: "0x1b5c...d8e3" },
    { name: "Internship Completion – TCS", type: "Professional", issued: "Aug 2025", status: "pending", hash: "–" },
    { name: "Sports Day Certificate", type: "Extra-curricular", issued: "Oct 2025", status: "verified", hash: "0x9a4f...12bc" },
];

export default function CertificatesPage() {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Award size={28} style={{ color: "var(--primary)" }} /> Digital Certificate Wallet
                    </h1>
                    <p className="mt-1" style={{ color: "var(--text-secondary)" }}>
                        Blockchain-verified digital credentials
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="stat-card text-center">
                        <p className="text-2xl font-bold text-white">{certificates.length}</p>
                        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Total Certificates</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat-card text-center">
                        <p className="text-2xl font-bold text-green-400">{certificates.filter(c => c.status === "verified").length}</p>
                        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Verified</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="stat-card text-center">
                        <p className="text-2xl font-bold text-yellow-400">{certificates.filter(c => c.status === "pending").length}</p>
                        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Pending</p>
                    </motion.div>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }} className="glass-card p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">My Certificates</h2>
                    <div className="space-y-4">
                        {certificates.map((cert, i) => (
                            <div key={i} className="p-4 rounded-lg flex items-center gap-4"
                                style={{ background: "rgba(255,255,255,0.03)" }}>
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                                    style={{ background: cert.status === "verified" ? "rgba(34,197,94,0.1)" : "rgba(234,179,8,0.1)" }}>
                                    {cert.status === "verified" ? <Shield size={20} className="text-green-400" />
                                        : <FileCheck size={20} className="text-yellow-400" />}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-white">{cert.name}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="badge badge-info">{cert.type}</span>
                                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>Issued: {cert.issued}</span>
                                    </div>
                                    {cert.hash !== "–" && (
                                        <p className="text-xs font-mono mt-1" style={{ color: "var(--text-muted)" }}>
                                            Hash: {cert.hash}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`badge ${cert.status === "verified" ? "badge-success" : "badge-warning"}`}>
                                        {cert.status}
                                    </span>
                                    {cert.status === "verified" && (
                                        <button className="btn-secondary text-xs py-1.5 px-3">
                                            <Download size={12} className="inline mr-1" />Download
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
