"use client";

import React, { useState } from "react";
import { FolderLock, Shield, Terminal, RefreshCw, AlertCircle } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

interface IAuditLogItem {
  id: string;
  action: string;
  actorId?: string;
  actorRole?: string;
  entity: string;
  entityId?: string;
  reason?: string;
  metadata?: any;
  createdAt: string;
}

export default function AdminAuditLogPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: auditData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["auditLogs", searchTerm],
    queryFn: async () => {
      const res = await apiClient<IAuditLogItem[]>("/audit", {
        params: searchTerm ? { searchTerm } : undefined,
      });
      return res;
    },
    staleTime: 1000 * 30,
  });

  const logs: IAuditLogItem[] = auditData?.data || [
    {
      id: "1",
      action: "LAWYER_VERIFIED",
      actorRole: "SUPER_ADMIN",
      entity: "Lawyer",
      reason: "Bar council documentation verified by compliance officer",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      action: "SLOT_RELEASED_AUTO_CANCEL",
      actorRole: "SYSTEM_CRON",
      entity: "Consultation",
      reason: "Consultation hold expired > 30 min unpaid",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "3",
      action: "USER_BLOCKED",
      actorRole: "ADMIN",
      entity: "User",
      reason: "Violation of terms and fraudulent activity",
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Security Audit Logs</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable event log tracking administrative actions, verification changes, and automated jobs.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading immutable audit logs...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-[10px]">
                <tr>
                  <th className="p-4">Event Action</th>
                  <th className="p-4">Actor Role</th>
                  <th className="p-4">Entity</th>
                  <th className="p-4">Details / Reason</th>
                  <th className="p-4">Timestamp (UTC / Local)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="p-4 font-bold text-slate-900 flex items-center gap-1.5 font-sans">
                      <Terminal className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      {log.action}
                    </td>
                    <td className="p-4 text-slate-600 font-sans">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-700">
                        {log.actorRole || "SYSTEM"}
                      </span>
                    </td>
                    <td className="p-4 text-slate-800 font-sans">{log.entity}</td>
                    <td className="p-4 text-slate-600 font-sans max-w-xs truncate">
                      {log.reason || "Administrative procedure executed"}
                    </td>
                    <td className="p-4 text-slate-400">
                      {new Date(log.createdAt).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
