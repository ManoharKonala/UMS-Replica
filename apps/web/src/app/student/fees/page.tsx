"use client";

import { motion } from "framer-motion";
import { CreditCard, Download, CheckCircle, Clock, AlertCircle } from "lucide-react";
import Sidebar from "@/components/Sidebar";

const feeBreakdown = [
    { item: "Tuition Fee", amount: 75000, status: "paid" },
    { item: "Laboratory Fee", amount: 12000, status: "paid" },
    { item: "Library Fee", amount: 5000, status: "paid" },
    { item: "Hostel Fee", amount: 45000, status: "pending" },
    { item: "Exam Fee", amount: 3000, status: "pending" },
];

const scholarships = [
    { name: "Merit Scholarship", amount: 25000, status: "active", validity: "2025-26" },
    { name: "Govt. Minority Scholarship", amount: 15000, status: "applied", validity: "2025-26" },
];

const transactions = [
    { id: "TXN-001", date: "Feb 1, 2026", amount: 92000, method: "UPI", status: "success" },
    { id: "TXN-002", date: "Jan 15, 2026", amount: 45000, method: "NEFT", status: "success" },
    { id: "TXN-003", date: "Aug 1, 2025", amount: 87000, method: "Card", status: "success" },
];

export default function FeesPage() {
    const totalFees = feeBreakdown.reduce((a, f) => a + f.amount, 0);
    const paidFees = feeBreakdown.filter(f => f.status === "paid").reduce((a, f) => a + f.amount, 0);
    const pendingFees = totalFees - paidFees;

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <CreditCard size={28} style={{ color: "var(--primary)" }} /> Financial Aid & Fees
                    </h1>
                </motion.div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="stat-card">
                        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Total Fees</p>
                        <p className="text-2xl font-bold text-white mt-1">₹{totalFees.toLocaleString()}</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat-card">
                        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Paid</p>
                        <p className="text-2xl font-bold text-green-400 mt-1">₹{paidFees.toLocaleString()}</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="stat-card">
                        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Pending</p>
                        <p className="text-2xl font-bold text-yellow-400 mt-1">₹{pendingFees.toLocaleString()}</p>
                        <button className="btn-primary text-sm py-2 mt-3 w-full">Pay Now</button>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Fee Breakdown */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Fee Breakdown</h2>
                        <div className="space-y-3">
                            {feeBreakdown.map((fee) => (
                                <div key={fee.item} className="flex items-center justify-between p-3 rounded-lg"
                                    style={{ background: "rgba(255,255,255,0.03)" }}>
                                    <span className="text-sm text-white">{fee.item}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-medium text-white">₹{fee.amount.toLocaleString()}</span>
                                        {fee.status === "paid" ? <CheckCircle size={16} className="text-green-400" />
                                            : <Clock size={16} className="text-yellow-400" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Scholarships */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Scholarships & Aid</h2>
                        <div className="space-y-3">
                            {scholarships.map((s) => (
                                <div key={s.name} className="p-4 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-medium text-white">{s.name}</p>
                                            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Valid: {s.validity}</p>
                                        </div>
                                        <span className={`badge ${s.status === "active" ? "badge-success" : "badge-warning"}`}>
                                            {s.status}
                                        </span>
                                    </div>
                                    <p className="text-lg font-bold mt-2" style={{ color: "var(--primary)" }}>₹{s.amount.toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Transaction History */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }} className="glass-card p-6 mt-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Transaction History</h2>
                    <table className="data-table">
                        <thead><tr><th>ID</th><th>Date</th><th>Amount</th><th>Method</th><th>Status</th><th></th></tr></thead>
                        <tbody>
                            {transactions.map((t) => (
                                <tr key={t.id}>
                                    <td className="text-white font-mono text-sm">{t.id}</td>
                                    <td>{t.date}</td>
                                    <td className="text-white font-medium">₹{t.amount.toLocaleString()}</td>
                                    <td>{t.method}</td>
                                    <td><span className="badge badge-success">{t.status}</span></td>
                                    <td><button className="text-xs" style={{ color: "var(--primary)" }}><Download size={14} /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            </main>
        </div>
    );
}
