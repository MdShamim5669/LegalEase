"use client";

import React, { useState } from "react";
import Link from "next/link";
import { KeyRound, Mail, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { apiClient } from "@/lib/api-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient("/auth/forget-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      if (res.success) {
        setSent(true);
      } else {
        setError(res.message || "Failed to process password reset request.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to process password reset request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-sky-400 flex items-center justify-center mx-auto shadow-sm">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Forgot Password</h1>
            <p className="text-xs text-slate-500">
              Enter your email and we&apos;ll send you a 6-digit OTP to reset your password.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {sent ? (
            <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-3 text-center text-xs">
              <CheckCircle2 className="w-7 h-7 mx-auto text-emerald-600" />
              <div>
                <p className="font-bold text-sm">Reset Code Dispatched</p>
                <p className="mt-1 text-slate-600">
                  We have dispatched a 6-digit verification code to <strong>{email}</strong>.
                </p>
              </div>
              <Link
                href={`/reset-password?email=${encodeURIComponent(email)}`}
                className="inline-flex items-center gap-1.5 py-2.5 px-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition"
              >
                Proceed to Reset Password <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSendReset} className="space-y-4">
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                {loading ? "Sending Code..." : "Send Verification Code"}
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Remember your credentials?{" "}
            <Link href="/login" className="font-semibold text-sky-600 hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
