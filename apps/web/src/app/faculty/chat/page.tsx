"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send, Search, Hash, Plus, Users } from "lucide-react";
import Sidebar from "@/components/Sidebar";

const rooms = [
    { id: 1, name: "CS Department", type: "group", unread: 2, lastMsg: "Lab 4 deadline extended", time: "15m" },
    { id: 2, name: "Faculty Lounge", type: "group", unread: 0, lastMsg: "Meeting tomorrow at 3 PM", time: "1h" },
    { id: 3, name: "Manohar Konala", type: "direct", unread: 1, lastMsg: "Sir, about the project…", time: "30m" },
];

const messages = [
    { id: 1, sender: "You", content: "Lab 4 deadline is extended to next Friday.", time: "10:00 AM", isOwn: true },
    { id: 2, sender: "Manohar Konala", content: "Thank you sir! That helps a lot.", time: "10:05 AM", isOwn: false },
    { id: 3, sender: "Rahul Mehra", content: "Can we also get extra time for the project?", time: "10:10 AM", isOwn: false },
];

export default function FacultyChatPage() {
    const [activeRoom, setActiveRoom] = useState(rooms[0]);
    const [message, setMessage] = useState("");

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 flex h-screen">
                {/* Rooms */}
                <div className="w-80 border-r flex flex-col" style={{ borderColor: "var(--border)", background: "rgba(17,24,39,0.5)" }}>
                    <div className="p-4">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                            <MessageCircle size={20} style={{ color: "var(--primary)" }} />Messages
                        </h2>
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                            <input className="input-field pl-9 text-sm" placeholder="Search..." />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto px-2 space-y-1">
                        {rooms.map((room) => (
                            <button key={room.id} onClick={() => setActiveRoom(room)}
                                className={`w-full p-3 rounded-lg text-left transition-all ${activeRoom.id === room.id ? "bg-blue-500/10 border border-blue-500/20" : "hover:bg-white/5"}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ background: "rgba(43,108,238,0.15)" }}>
                                        <Hash size={16} style={{ color: "var(--primary)" }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">{room.name}</p>
                                        <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{room.lastMsg}</p>
                                    </div>
                                    {room.unread > 0 && (
                                        <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center text-white"
                                            style={{ background: "var(--primary)" }}>{room.unread}</span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 flex flex-col">
                    <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
                        <p className="font-semibold text-white">{activeRoom.name}</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.map((msg) => (
                            <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-md p-3 rounded-2xl ${msg.isOwn ? "rounded-br-md" : "rounded-bl-md"}`}
                                    style={{ background: msg.isOwn ? "var(--primary)" : "rgba(255,255,255,0.06)" }}>
                                    {!msg.isOwn && <p className="text-xs font-semibold mb-1" style={{ color: "#a855f7" }}>{msg.sender}</p>}
                                    <p className="text-sm text-white">{msg.content}</p>
                                    <p className="text-xs mt-1 text-right" style={{ color: msg.isOwn ? "rgba(255,255,255,0.6)" : "var(--text-muted)" }}>{msg.time}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="p-4 border-t" style={{ borderColor: "var(--border)" }}>
                        <div className="flex gap-3">
                            <input value={message} onChange={(e) => setMessage(e.target.value)}
                                className="input-field flex-1" placeholder="Type a message..." />
                            <button className="btn-primary px-4"><Send size={16} /></button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
