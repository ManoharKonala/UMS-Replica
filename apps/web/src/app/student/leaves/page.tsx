"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Plus, CheckCircle, Clock, XCircle } from "lucide-react";
import Sidebar from "@/components/Sidebar";

const leaveHistory = [
    { id: 1, type: "Sick", from: "Feb 10", to: "Feb 12", days: 3, reason: "Fever and cold", status: "approved", reviewer: "Prof. Sharma" },
    { id: 2, type: "Casual", from: "Jan 25", to: "Jan 25", days: 1, reason: "Family function", status: "approved", reviewer: "Prof. Gupta" },
    { id: 3, type: "Duty", from: "Mar 1", to: "Mar 3", days: 3, reason: "Hackathon participation", status: "pending", reviewer: "–" },
    { id: 4, type: "Casual", from: "Dec 20", to: "Dec 22", days: 3, reason: "Personal work", status: "rejected", reviewer: "Prof. Sharma" },
];

const leaveBalance = [
    { type: "Sick Leave", used: 3, total: 10 },
    { type: "Casual Leave", used: 4, total: 8 },
    { type: "Duty Leave", used: 0, total: 5 },
];

export default function LeavesPage() {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <FileText size={28} style={{ color: "var(--primary)" }} /> Leave Management
                        </h1>
                        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
                            <Plus size={16} /> Apply Leave
                        </button>
                    </div>
                </motion.div>

                {/* Leave Balance */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {leaveBalance.map((lb, i) => (
                        <motion.div key={lb.type} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }} className="stat-card">
                            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{lb.type}</p>
                            <div className="flex items-end gap-1 mt-1">
                                <p className="text-2xl font-bold text-white">{lb.total - lb.used}</p>
                                <p className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>/ {lb.total} remaining</p>
                            </div>
                            <div className="progress-bar mt-2">
                                <div className="progress-fill" style={{ width: `${(lb.used / lb.total) * 100}%` }} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Apply Leave Form */}
                {showForm && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                        className="glass-card p-6 mb-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Apply for Leave</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Leave Type</label>
                                <select className="input-field">
                                    <option>Sick Leave</option><option>Casual Leave</option><option>Duty Leave</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-secondary)" }}>From Date</label>
                                <input type="date" className="input-field" />
                            </div>
                            <div>
                                <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-secondary)" }}>To Date</label>
                                <input type="date" className="input-field" />
                            </div>
                            <div>
                                <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Reason</label>
                                <input className="input-field" placeholder="Reason for leave..." />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-4">
                            <button className="btn-primary">Submit</button>
                            <button onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                        </div>
                    </motion.div>
                )}

                {/* Leave History */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }} className="glass-card p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Leave History</h2>
                    <table className="data-table">
                        <thead><tr><th>Type</th><th>Period</th><th>Days</th><th>Reason</th><th>Status</th><th>Reviewer</th></tr></thead>
                        <tbody>
                            {leaveHistory.map((l) => (
                                <tr key={l.id}>
                                    <td className="text-white font-medium">{l.type}</td>
                                    <td>{l.from} – {l.to}</td>
                                    <td>{l.days}</td>
                                    <td>{l.reason}</td>
                                    <td>
                                        <span className={`badge ${l.status === "approved" ? "badge-success" :
                                                l.status === "rejected" ? "badge-error" : "badge-warning"}`}>
                                            {l.status === "approved" && <CheckCircle size={10} className="inline mr-1" />}
                                            {l.status === "rejected" && <XCircle size={10} className="inline mr-1" />}
                                            {l.status === "pending" && <Clock size={10} className="inline mr-1" />}
                                            {l.status}
                                        </span>
                                    </td>
                                    <td>{l.reviewer}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            </main>
        </div>
    );
}
