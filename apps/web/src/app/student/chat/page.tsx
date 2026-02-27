"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send, Search, Users, Hash, Plus } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useAuthStore } from "@/lib/store";

const chatRooms = [
    { id: 1, name: "General Discussion", type: "group", unread: 3, lastMsg: "Welcome everyone!", time: "2m" },
    { id: 2, name: "CS Department", type: "group", unread: 1, lastMsg: "Lab 4 deadline extended", time: "15m" },
    { id: 3, name: "Prof. Sharma", type: "direct", unread: 0, lastMsg: "Your assignment looks good", time: "1h" },
    { id: 4, name: "Study Group A", type: "group", unread: 5, lastMsg: "Anyone up for revision?", time: "30m" },
];

const messages = [
    { id: 1, sender: "Prof. Sharma", content: "Good morning class! Remember, the DSA assignment is due this Friday.", time: "9:00 AM", isOwn: false },
    { id: 2, sender: "Rahul Mehra", content: "Can we get an extension on the DBMS lab?", time: "9:15 AM", isOwn: false },
    { id: 3, sender: "You", content: "I've completed the assignment. Should I submit via the portal?", time: "9:20 AM", isOwn: true },
    { id: 4, sender: "Prof. Sharma", content: "Yes, please submit through the UMS portal before 11:59 PM on Friday.", time: "9:22 AM", isOwn: false },
    { id: 5, sender: "Priya Singh", content: "Got it, thanks Prof!", time: "9:25 AM", isOwn: false },
];

export default function ChatHub() {
    const [activeRoom, setActiveRoom] = useState(chatRooms[0]);
    const [message, setMessage] = useState("");
    const user = useAuthStore((s) => s.user);

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 flex h-screen">
                {/* Rooms List */}
                <div className="w-80 border-r flex flex-col" style={{ borderColor: "var(--border)", background: "rgba(17,24,39,0.5)" }}>
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <MessageCircle size={20} style={{ color: "var(--primary)" }} />Messages
                            </h2>
                            <button className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(43,108,238,0.15)" }}>
                                <Plus size={16} style={{ color: "var(--primary)" }} />
                            </button>
                        </div>
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                            <input className="input-field pl-9 text-sm" placeholder="Search conversations..." />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto px-2 space-y-1">
                        {chatRooms.map((room) => (
                            <button key={room.id} onClick={() => setActiveRoom(room)}
                                className={`w-full p-3 rounded-lg text-left transition-all ${activeRoom.id === room.id ? "bg-blue-500/10 border border-blue-500/20" : "hover:bg-white/5"}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ background: room.type === "group" ? "rgba(43,108,238,0.15)" : "rgba(168,85,247,0.15)" }}>
                                        {room.type === "group" ? <Hash size={16} style={{ color: "var(--primary)" }} /> :
                                            <span className="text-sm font-bold" style={{ color: "#a855f7" }}>{room.name.charAt(0)}</span>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm font-medium text-white truncate">{room.name}</p>
                                            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{room.time}</span>
                                        </div>
                                        <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{room.lastMsg}</p>
                                    </div>
                                    {room.unread > 0 && (
                                        <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center text-white shrink-0"
                                            style={{ background: "var(--primary)" }}>{room.unread}</span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                    {/* Chat Header */}
                    <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: "var(--border)" }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: "rgba(43,108,238,0.15)" }}>
                            <Hash size={16} style={{ color: "var(--primary)" }} />
                        </div>
                        <div>
                            <p className="font-semibold text-white">{activeRoom.name}</p>
                            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                                <Users size={12} className="inline mr-1" />5 members
                            </p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.map((msg) => (
                            <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-md p-3 rounded-2xl ${msg.isOwn ? "rounded-br-md" : "rounded-bl-md"}`}
                                    style={{ background: msg.isOwn ? "var(--primary)" : "rgba(255,255,255,0.06)" }}>
                                    {!msg.isOwn && <p className="text-xs font-semibold mb-1" style={{ color: "#a855f7" }}>{msg.sender}</p>}
                                    <p className="text-sm text-white">{msg.content}</p>
                                    <p className="text-xs mt-1 text-right" style={{ color: msg.isOwn ? "rgba(255,255,255,0.6)" : "var(--text-muted)" }}>
                                        {msg.time}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t" style={{ borderColor: "var(--border)" }}>
                        <div className="flex gap-3">
                            <input value={message} onChange={(e) => setMessage(e.target.value)}
                                className="input-field flex-1" placeholder="Type a message..."
                                onKeyDown={(e) => e.key === "Enter" && setMessage("")} />
                            <button className="btn-primary px-4 flex items-center gap-2">
                                <Send size={16} /> Send
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
