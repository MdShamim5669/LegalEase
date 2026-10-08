"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  Clock,
  Video,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Users,
  DollarSign,
  TrendingUp,
  Star,
  Building2,
  CreditCard,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { formatBDT, formatDhakaTime } from "@/lib/utils";
import { StatusBadge } from "@/components/common/StatusBadge";
import { LegalDisclaimerBanner } from "@/components/common/LegalDisclaimerBanner";

export default function DashboardOverviewPage() {
  const [roleView, setRoleView] = useState<"CLIENT" | "LAWYER" | "ADMIN">("CLIENT");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.role === "LAWYER") setRoleView("LAWYER");
          else if (parsed.role === "ADMIN" || parsed.role === "SUPER_ADMIN") setRoleView("ADMIN");
          else setRoleView("CLIENT");
        } catch {}
      }
    }
  }, []);

  // Client Dashboard Data
  const { data: clientRes, isLoading: isClientLoading } = useQuery({
    queryKey: ["dashboard-client"],
    queryFn: () => apiClient<any>("/dashboard/client").catch(() => null),
    enabled: roleView === "CLIENT",
  });

  // Lawyer Dashboard Data
  const { data: lawyerRes, isLoading: isLawyerLoading } = useQuery({
    queryKey: ["dashboard-lawyer"],
    queryFn: () => apiClient<any>("/dashboard/lawyer").catch(() => null),
    enabled: roleView === "LAWYER",
  });

  // Admin Dashboard Data
  const { data: adminRes, isLoading: isAdminLoading } = useQuery({
    queryKey: ["dashboard-admin"],
    queryFn: () => apiClient<any>("/dashboard/admin").catch(() => null),
    enabled: roleView === "ADMIN",
  });

  // Fallback demo queries
  const { data: consultationsRes } = useQuery({
    queryKey: ["recent-consultations"],
    queryFn: () => apiClient<any[]>("/consultations/my").catch(() => ({ data: [] })),
  });

  const clientData = clientRes?.data;
  const lawyerData = lawyerRes?.data;
  const adminData = adminRes?.data;
  const consultations = consultationsRes?.data || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <LegalDisclaimerBanner />

      {/* Welcome & Role Switcher Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-900 text-sky-400">
              {roleView} PORTAL
            </span>
            <span className="text-xs text-slate-400">Role-Based Dashboard</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Consultation Management Hub
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time status of legal appointments, revenue, and active consultations.
          </p>
        </div>

        {/* Quick Role View Switcher */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
          {(["CLIENT", "LAWYER", "ADMIN"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleView(r)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                roleView === r
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {r === "CLIENT" ? "Client View" : r === "LAWYER" ? "Lawyer View" : "Admin View"}
            </button>
          ))}
        </div>
      </div>

      {/* CLIENT DASHBOARD TILES (PRD Wireframe 2.4) */}
      {roleView === "CLIENT" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Upcoming Sessions</span>
              <div className="text-2xl font-black text-slate-900 mt-2">
                {clientData?.upcomingConsultations?.length || 2}
              </div>
              <span className="text-[11px] text-blue-600 font-medium mt-1 block">Scheduled slots</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Unpaid Sessions</span>
              <div className="text-2xl font-black text-amber-600 mt-2">1</div>
              <span className="text-[11px] text-amber-700 font-medium mt-1 block">Pay within 30 min</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Completed Sessions</span>
              <div className="text-2xl font-black text-emerald-600 mt-2">
                {clientData?.pastConsultations?.length || 5}
              </div>
              <span className="text-[11px] text-emerald-700 font-medium mt-1 block">Advice notes ready</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Total Consultations</span>
              <div className="text-2xl font-black text-slate-900 mt-2">
                {clientData?.totalBooked || 8}
              </div>
              <span className="text-[11px] text-slate-400 font-medium mt-1 block">Platform lifetime</span>
            </div>
          </div>

          {/* Upcoming Consultations Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Upcoming Consultations</h2>
              <Link href="/dashboard/consultations" className="text-xs font-semibold text-sky-600 hover:underline">
                View all history
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900">Advocate Sharif Hossain</h3>
                    <StatusBadge status="SCHEDULED" />
                    <StatusBadge status="UNPAID" />
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> Tomorrow, 10:30 AM (Asia/Dhaka)
                    </span>
                    <span className="flex items-center gap-1">
                      <Video className="w-3.5 h-3.5 text-slate-400" /> Video Call
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href="/dashboard/consultations"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
                  >
                    Pay Now (৳1,500)
                  </Link>
                  <button className="px-3 py-2 text-slate-600 hover:text-rose-600 text-xs font-semibold">
                    Cancel
                  </button>
                </div>
              </div>

              <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900">Advocate Farhana Yesmin</h3>
                    <StatusBadge status="SCHEDULED" />
                    <StatusBadge status="PAID" />
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> Thursday, 04:00 PM (Asia/Dhaka)
                    </span>
                    <span className="flex items-center gap-1">
                      <Video className="w-3.5 h-3.5 text-slate-400" /> Video Call
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href="/dashboard/consultations"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-xs"
                  >
                    Join Room & Docs
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LAWYER DASHBOARD TILES */}
      {roleView === "LAWYER" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Today&apos;s Appointments</span>
              <div className="text-2xl font-black text-slate-900 mt-2">
                {lawyerData?.upcomingConsultations?.length || 3}
              </div>
              <span className="text-[11px] text-blue-600 font-medium mt-1 block">Scheduled clients</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Completed Sessions</span>
              <div className="text-2xl font-black text-emerald-600 mt-2">
                {lawyerData?.totalCompleted || 42}
              </div>
              <span className="text-[11px] text-emerald-700 font-medium mt-1 block">Cases resolved</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Total Consultation Earnings</span>
              <div className="text-2xl font-black text-slate-900 mt-2">
                {formatBDT(lawyerData?.totalEarned || 58000)}
              </div>
              <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Directly via Stripe</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Client Rating</span>
              <div className="text-2xl font-black text-amber-600 mt-2 flex items-center gap-1">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                {lawyerData?.lawyerProfile?.rating || 4.9}
              </div>
              <span className="text-[11px] text-slate-400 font-medium mt-1 block">
                {lawyerData?.lawyerProfile?.reviewCount || 38} reviews
              </span>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Manage Weekly Availability Slots</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Set and open available consultation windows for clients to book.
              </p>
            </div>
            <Link
              href="/dashboard/lawyer/availability"
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
            >
              Open Slot Manager
            </Link>
          </div>
        </div>
      )}

      {/* ADMIN DASHBOARD TILES */}
      {roleView === "ADMIN" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Total Enrolled Users</span>
              <div className="text-2xl font-black text-slate-900 mt-2">
                {adminData?.totalUsers || 100}
              </div>
              <span className="text-[11px] text-sky-600 font-medium mt-1 block">Clients & Advocates</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Verified Advocates</span>
              <div className="text-2xl font-black text-emerald-600 mt-2">
                {adminData?.totalVerifiedLawyers || 30}
              </div>
              <span className="text-[11px] text-emerald-700 font-medium mt-1 block">Active on roster</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Total Consultations</span>
              <div className="text-2xl font-black text-slate-900 mt-2">
                {adminData?.totalConsultations || 75}
              </div>
              <span className="text-[11px] text-slate-400 font-medium mt-1 block">Platform volume</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Platform Volume (BDT)</span>
              <div className="text-2xl font-black text-slate-900 mt-2">
                {formatBDT(adminData?.totalPlatformRevenue || 112500)}
              </div>
              <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Processed via gateways</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/dashboard/admin/lawyers"
              className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-sky-300 transition flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-sm text-slate-900">Lawyer Verifications</h4>
                <p className="text-xs text-slate-500 mt-0.5">Review Bar Council roll credentials</p>
              </div>
              <ShieldCheck className="w-5 h-5 text-sky-600" />
            </Link>

            <Link
              href="/dashboard/admin/reviews"
              className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-sky-300 transition flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-sm text-slate-900">Review Moderation</h4>
                <p className="text-xs text-slate-500 mt-0.5">Moderate flagged client feedback</p>
              </div>
              <Star className="w-5 h-5 text-amber-500" />
            </Link>

            <Link
              href="/dashboard/admin/users"
              className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-sky-300 transition flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-sm text-slate-900">User Access Management</h4>
                <p className="text-xs text-slate-500 mt-0.5">Block / unblock accounts</p>
              </div>
              <Users className="w-5 h-5 text-indigo-600" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
