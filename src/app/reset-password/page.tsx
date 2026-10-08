"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Lock, Mail, KeyRound, AlertCircle, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { apiClient } from "@/lib/api-client";

function ResetPasswordInner() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetDone, setResetDone] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email address is required.");
      return;
    }
    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP code.");
      return;
    }
    if (password.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await apiClient("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          email,
          otp,
          newPassword: password,
        }),
      });

      if (res.success) {
        setResetDone(true);
      } else {
        setError(res.message || "Failed to reset password. Please check your code.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to reset password. Please check your code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-extrabold text-slate-900">Set New Password</h1>
        <p className="text-xs text-slate-500">Create a secure new password for your account</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {resetDone ? (
        <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-3 text-center text-xs">
          <CheckCircle2 className="w-7 h-7 mx-auto text-emerald-600" />
          <div>
            <p className="font-bold text-sm">Password Reset Successfully</p>
            <p className="mt-1 text-slate-600">You can now sign in using your updated credentials.</p>
          </div>
          <Link
            href="/login"
            className="inline-block py-2.5 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            Proceed to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">6-Digit Code (OTP)</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                maxLength={6}
                placeholder="••••••"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs tracking-widest font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            {loading ? "Updating Password..." : "Update Password"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <Suspense fallback={<div className="text-xs text-slate-400">Loading form...</div>}>
          <ResetPasswordInner />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
