"use client";

import { motion } from "framer-motion";
import { FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import Sidebar from "@/components/Sidebar";

const leaveRequests = [
    { id: 1, student: "Manohar Konala", type: "Sick", from: "Feb 10", to: "Feb 12", days: 3, reason: "Fever and cold", status: "pending" },
    { id: 2, student: "Rahul Mehra", type: "Duty", from: "Mar 1", to: "Mar 3", days: 3, reason: "Hackathon participation", status: "pending" },
    { id: 3, student: "Priya Singh", type: "Casual", from: "Jan 25", to: "Jan 25", days: 1, reason: "Family function", status: "approved" },
    { id: 4, student: "Amit Kumar", type: "Sick", from: "Feb 5", to: "Feb 6", days: 2, reason: "Medical appointment", status: "rejected" },
];

export default function FacultyLeavesPage() {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <FileText size={28} style={{ color: "var(--primary)" }} /> Leave Requests
                    </h1>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
                    <table className="data-table">
                        <thead><tr><th>Student</th><th>Type</th><th>Period</th><th>Days</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>
                            {leaveRequests.map((l) => (
                                <tr key={l.id}>
                                    <td className="text-white font-medium">{l.student}</td>
                                    <td><span className="badge badge-info">{l.type}</span></td>
                                    <td>{l.from} – {l.to}</td>
                                    <td>{l.days}</td>
                                    <td>{l.reason}</td>
                                    <td>
                                        <span className={`badge ${l.status === "approved" ? "badge-success" : l.status === "rejected" ? "badge-error" : "badge-warning"}`}>
                                            {l.status}
                                        </span>
                                    </td>
                                    <td>
                                        {l.status === "pending" && (
                                            <div className="flex gap-2">
                                                <button className="px-3 py-1.5 rounded-lg text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                                                    <CheckCircle size={12} className="inline mr-1" />Approve
                                                </button>
                                                <button className="px-3 py-1.5 rounded-lg text-xs bg-red-500/20 text-red-400 border border-red-500/30">
                                                    <XCircle size={12} className="inline mr-1" />Reject
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            </main>
        </div>
    );
}
