"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, Check, X, Search, UserPlus, AlertCircle, Building2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { formatBDT } from "@/lib/utils";

export default function AdminLawyersPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // 1. Fetch lawyers roster
  const { data: lawyersRes, isLoading } = useQuery({
    queryKey: ["admin-lawyers", searchTerm],
    queryFn: () => {
      const q = searchTerm ? `?searchTerm=${encodeURIComponent(searchTerm)}` : "";
      return apiClient<any[]>(`/lawyers${q}`);
    },
  });

  // 2. Verification mutation
  const verifyMutation = useMutation({
    mutationFn: ({ id, isVerified }: { id: string; isVerified: boolean }) =>
      apiClient(`/lawyers/${id}/verify`, {
        method: "PATCH",
        body: JSON.stringify({
          isVerified,
          verificationNote: isVerified
            ? "Bar Council Roll authenticated via administrative portal."
            : "Credentials flagged for review.",
        }),
      }),
    onSuccess: (_, vars) => {
      setActionMessage(`Advocate status updated to ${vars.isVerified ? "VERIFIED" : "UNVERIFIED"}.`);
      queryClient.invalidateQueries({ queryKey: ["admin-lawyers"] });
    },
    onError: (err: any) => {
      setActionMessage(err.message || "Action failed.");
    },
  });

  const lawyers = lawyersRes?.data || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Advocate Verification & Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit Bar Council enrollment credentials and approve advocates to accept consultations.
          </p>
        </div>

        <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition flex items-center gap-1.5 shadow-xs">
          <UserPlus className="w-3.5 h-3.5" /> Invite Advocate
        </button>
      </div>

      {actionMessage && (
        <div className="p-3 bg-sky-50 border border-sky-200 text-sky-800 text-xs rounded-xl flex items-center justify-between">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-sky-600 font-bold ml-2">
            ×
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or chamber..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Total: {lawyers.length} advocates
          </span>
        </div>

        {isLoading ? (
          <div className="p-8 space-y-4 animate-pulse">
            <div className="h-10 bg-slate-100 rounded-xl" />
            <div className="h-10 bg-slate-100 rounded-xl" />
            <div className="h-10 bg-slate-100 rounded-xl" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Advocate</th>
                  <th className="py-3 px-4">Bar Council No</th>
                  <th className="py-3 px-4">Chamber</th>
                  <th className="py-3 px-4">Fee (30m)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {lawyers.map((l: any) => {
                  const name = l.name || l.user?.name || "Advocate";
                  const barNo = l.barCouncilNo || "Enrolled";
                  const chamber = l.chamberAddress || "Supreme Court of Bangladesh";
                  const fee = l.consultationFee || 1000;
                  const isVerified = l.isVerified;

                  return (
                    <tr key={l.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {name}
                        <div className="text-[10px] text-slate-400 font-normal">
                          {l.email || "lawyer@legalease.com"}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">{barNo}</td>
                      <td className="py-3.5 px-4 max-w-xs truncate text-slate-500">{chamber}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{formatBDT(fee)}</td>
                      <td className="py-3.5 px-4">
                        {isVerified ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            Pending Audit
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() =>
                            verifyMutation.mutate({ id: l.id, isVerified: !isVerified })
                          }
                          disabled={verifyMutation.isPending}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition inline-flex items-center gap-1 ${
                            isVerified
                              ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                              : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
                          }`}
                        >
                          {isVerified ? (
                            <>
                              <X className="w-3 h-3" /> Revoke
                            </>
                          ) : (
                            <>
                              <Check className="w-3 h-3" /> Approve
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
