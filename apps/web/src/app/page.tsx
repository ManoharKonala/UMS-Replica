"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GraduationCap, Eye, EyeOff, LogIn, UserPlus, Mail, Lock, User } from "lucide-react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [enrollmentNo, setEnrollmentNo] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const tokens = await api.login(email, password);
        const profile = await api.getProfile(tokens.access_token);
        login(profile, tokens.access_token, tokens.refresh_token);

        // Redirect based on role
        if (profile.role === "admin") router.push("/dashboard");
        else if (profile.role === "faculty") router.push("/faculty");
        else router.push("/student");
      } else {
        await api.register({ email, password, full_name: fullName, enrollment_no: enrollmentNo || undefined });
        // Auto-login after registration
        const tokens = await api.login(email, password);
        const profile = await api.getProfile(tokens.access_token);
        login(profile, tokens.access_token, tokens.refresh_token);
        router.push("/student");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0a0e1a 0%, #111827 50%, #0f172a 100%)" }}>

      {/* Background Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #2b6cee 0%, transparent 70%)", filter: "blur(80px)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, #a855f7 0%, transparent 70%)", filter: "blur(80px)" }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card p-8 w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: "linear-gradient(135deg, #2b6cee, #a855f7)" }}>
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">UMS Portal</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            University Management System
          </p>
        </div>

        {/* Toggle Tabs */}
        <div className="flex rounded-lg p-1 mb-6" style={{ background: "rgba(255,255,255,0.04)" }}>
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all ${isLogin ? "text-white shadow-lg" : "text-gray-400"
              }`}
            style={isLogin ? { background: "linear-gradient(135deg, #2b6cee, #a855f7)" } : {}}
          >
            <LogIn size={14} className="inline mr-2" />Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all ${!isLogin ? "text-white shadow-lg" : "text-gray-400"
              }`}
            style={!isLogin ? { background: "linear-gradient(135deg, #2b6cee, #a855f7)" } : {}}
          >
            <UserPlus size={14} className="inline mr-2" />Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                <input
                  type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                  className="input-field pl-10" placeholder="John Doe" required={!isLogin}
                />
              </div>
            </motion.div>
          )}

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10" placeholder="you@ums.edu" required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
              <input
                type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10 pr-10" placeholder="Min 8 characters" required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Enrollment No. (Optional)</label>
              <input
                type="text" value={enrollmentNo} onChange={(e) => setEnrollmentNo(e.target.value)}
                className="input-field" placeholder="2024CS001"
              />
            </motion.div>
          )}

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="p-3 rounded-lg text-sm" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
              {error}
            </motion.div>
          )}

          <button type="submit" disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3">
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>{isLogin ? <LogIn size={16} /> : <UserPlus size={16} />}
                {isLogin ? "Sign In" : "Create Account"}</>
            )}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-3 rounded-lg" style={{ background: "rgba(43,108,238,0.06)", border: "1px solid rgba(43,108,238,0.15)" }}>
          <p className="text-xs font-semibold mb-2" style={{ color: "var(--primary)" }}>Demo Credentials</p>
          <div className="space-y-1 text-xs" style={{ color: "var(--text-secondary)" }}>
            <p>Admin: admin@ums.edu / Admin@123</p>
            <p>Faculty: prof.sharma@ums.edu / Faculty@123</p>
            <p>Student: manohar.k@ums.edu / Student@123</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
