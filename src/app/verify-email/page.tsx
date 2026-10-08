"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { apiClient } from "@/lib/api-client";

function VerifyEmailInner() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please provide your email address.");
      return;
    }
    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit OTP code.");
      return;
    }

    setLoading(true);
    setError(null);
    setInfo(null);

    try {
      const res = await apiClient("/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
      });

      if (res.success) {
        setVerified(true);
      } else {
        setError(res.message || "Invalid or expired verification code.");
      }
    } catch (err: any) {
      setError(err?.message || "Invalid or expired verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Please specify the email to resend OTP.");
      return;
    }

    setResending(true);
    setError(null);
    setInfo(null);

    try {
      const res = await apiClient("/auth/resend-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      if (res.success) {
        setInfo("A new verification code has been dispatched to your email.");
      } else {
        setError(res.message || "Failed to resend code.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to resend code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-center">
      <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mx-auto shadow-xs">
        <Mail className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-slate-900">Verify Your Email</h1>
        <p className="text-xs text-slate-500">
          Enter the 6-digit verification code sent to your registered email address.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 text-left">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {info && (
        <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-xs flex items-center gap-2 text-left">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{info}</span>
        </div>
      )}

      {verified ? (
        <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-3">
          <CheckCircle2 className="w-7 h-7 mx-auto text-emerald-600" />
          <div>
            <p className="text-sm font-bold">Email Verified Successfully!</p>
            <p className="text-xs text-emerald-700 mt-0.5">Your LegalEase client profile is now activated.</p>
          </div>
          <Link
            href="/login"
            className="inline-block py-2.5 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            Sign in to Account
          </Link>
        </div>
      ) : (
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="text-left">
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="text-left">
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">6-Digit Code</label>
            <input
              type="text"
              required
              maxLength={6}
              placeholder="••••••"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full text-center tracking-widest text-lg font-mono py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            {loading ? "Verifying..." : "Confirm & Verify Email"}
          </button>

          <div className="pt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Didn&apos;t receive OTP?</span>
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-sky-600 font-semibold hover:underline flex items-center gap-1 disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${resending ? "animate-spin" : ""}`} />
              {resending ? "Sending..." : "Resend Code"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <Suspense fallback={<div className="text-xs text-slate-400">Loading verification...</div>}>
          <VerifyEmailInner />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
