"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User, Shield, Ban, CheckCircle2, Search } from "lucide-react";
import { apiClient } from "@/lib/api-client";

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  // 1. Fetch users from API (fallback to clients list)
  const { data: usersRes, isLoading } = useQuery({
    queryKey: ["admin-users", searchTerm],
    queryFn: () => apiClient<any[]>("/clients").catch(() => ({ data: [] })),
  });

  // 2. Status update mutation
  const blockMutation = useMutation({
    mutationFn: ({ id, isBlocked }: { id: string; isBlocked: boolean }) =>
      apiClient(`/users/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ isBlocked }),
      }),
    onSuccess: (_, vars) => {
      setNotice(`User status updated to ${vars.isBlocked ? "BLOCKED" : "ACTIVE"}.`);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (err: any) => {
      setNotice(err.message || "Failed to update user status.");
    },
  });

  const users = usersRes?.data || [
    { id: "1", name: "Rahim Ahmed", email: "rahim@example.com", role: "CLIENT", isBlocked: false },
    { id: "2", name: "Advocate Sharif Hossain", email: "sharif@legalease.com", role: "LAWYER", isBlocked: false },
    { id: "3", name: "Super Admin Officer", email: "admin@legalease.com", role: "ADMIN", isBlocked: false },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">User Account Governance</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          View platform clients, advocates, and administrative accounts with block/unblock controls.
        </p>
      </div>

      {notice && (
        <div className="p-3 bg-sky-50 border border-sky-200 text-sky-800 text-xs rounded-xl flex items-center justify-between">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-sky-600 font-bold ml-2">
            ×
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-[10px]">
            <tr>
              <th className="p-4">Account Holder</th>
              <th className="p-4">Assigned Role</th>
              <th className="p-4">Account State</th>
              <th className="p-4 text-right">Access Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u: any) => {
              const name = u.name || u.user?.name || "Account User";
              const email = u.email || u.user?.email || "user@legalease.com";
              const role = u.role || u.user?.role || "CLIENT";
              const isBlocked = u.isBlocked ?? false;

              return (
                <tr key={u.id} className="hover:bg-slate-50 transition">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{email}</div>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {role}
                    </span>
                  </td>
                  <td className="p-4">
                    {!isBlocked ? (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 inline-flex items-center gap-1">
                        <Ban className="w-3 h-3 text-rose-600" /> Suspended
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() =>
                        blockMutation.mutate({ id: u.userId || u.id, isBlocked: !isBlocked })
                      }
                      disabled={blockMutation.isPending}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        !isBlocked
                          ? "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                          : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
                      }`}
                    >
                      {!isBlocked ? "Suspend Access" : "Reinstate Access"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
