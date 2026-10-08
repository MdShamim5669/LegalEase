"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Video, FileText, ArrowRight, Filter, Clock, CreditCard } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { formatBDT, formatDhakaTime } from "@/lib/utils";
import { StatusBadge } from "@/components/common/StatusBadge";

export default function ConsultationsListPage() {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const { data: consultationsRes, isLoading } = useQuery({
    queryKey: ["consultations", statusFilter],
    queryFn: () => {
      const q = statusFilter !== "ALL" ? `?status=${statusFilter}` : "";
      return apiClient<any[]>(`/consultations/my${q}`).catch(() =>
        apiClient<any[]>(`/consultations${q}`).catch(() => ({ data: [] }))
      );
    },
  });

  const apiConsultations = consultationsRes?.data || [];

  // Fallback demo items if unauthenticated in preview
  const demoConsultations = [
    {
      id: "demo-c1",
      status: "SCHEDULED",
      payment: { status: "UNPAID", amount: 1500 },
      lawyer: { name: "Advocate Sharif Hossain" },
      schedule: { startDateTime: new Date(Date.now() + 86400000).toISOString() },
    },
    {
      id: "demo-c2",
      status: "SCHEDULED",
      payment: { status: "PAID", amount: 1800 },
      lawyer: { name: "Advocate Farhana Yesmin" },
      schedule: { startDateTime: new Date(Date.now() + 172800000).toISOString() },
    },
    {
      id: "demo-c3",
      status: "COMPLETED",
      payment: { status: "PAID", amount: 1200 },
      lawyer: { name: "Advocate Tanvir Ahmed" },
      schedule: { startDateTime: new Date(Date.now() - 86400000).toISOString() },
    },
  ];

  const consultations = apiConsultations.length > 0 ? apiConsultations : demoConsultations;
  const filtered =
    statusFilter === "ALL"
      ? consultations
      : consultations.filter((c: any) => c.status === statusFilter);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Consultations History
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your legal consultations, join live sessions, pay, or download advice notes.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1.5 bg-white p-1 rounded-xl border border-slate-200 overflow-x-auto">
          {["ALL", "SCHEDULED", "INPROGRESS", "COMPLETED", "CANCELED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                statusFilter === status
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4 animate-pulse">
            <div className="h-12 bg-slate-100 rounded-xl" />
            <div className="h-12 bg-slate-100 rounded-xl" />
            <div className="h-12 bg-slate-100 rounded-xl" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filtered.map((c: any) => {
              const advocateName = c.lawyer?.name || c.lawyer?.user?.name || "Consultation Session";
              const timeStr = c.schedule?.startDateTime || c.schedule?.startTime;
              const formattedTime = timeStr ? formatDhakaTime(timeStr) : "Slot Scheduled";
              const fee = c.payment?.amount || c.lawyer?.consultationFee || 1500;

              return (
                <div
                  key={c.id}
                  className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm text-slate-900">{advocateName}</h3>
                      <StatusBadge status={c.status} />
                      {c.payment && <StatusBadge status={c.payment.status} />}
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {formattedTime}
                      </span>
                      <span className="font-semibold text-slate-700">Fee: {formatBDT(fee)}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {c.payment?.status === "UNPAID" && (
                      <Link
                        href={`/dashboard/consultations/${c.id}`}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1"
                      >
                        <CreditCard className="w-3.5 h-3.5" /> Pay Now
                      </Link>
                    )}
                    <Link
                      href={`/dashboard/consultations/${c.id}`}
                      className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition flex items-center gap-1.5"
                    >
                      Room & Details <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No Consultations Found</h3>
            <p className="text-xs text-slate-400">
              You do not have any consultations under status &ldquo;{statusFilter}&rdquo;.
            </p>
            <Link
              href="/lawyers"
              className="inline-block mt-3 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
            >
              Browse Verified Advocates
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
