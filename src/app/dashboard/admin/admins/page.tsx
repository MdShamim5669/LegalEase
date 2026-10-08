"use client";

import React, { useState } from "react";
import { UserPlus, Shield, Trash2, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface IAdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  contactNumber?: string;
}

export default function SuperAdminOfficersPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [admins, setAdmins] = useState<IAdminUser[]>([
    { id: "1", name: "Chief Moderator", email: "moderator@legalease.com.bd", role: "ADMIN" },
    { id: "2", name: "Legal Compliance Officer", email: "compliance@legalease.com.bd", role: "ADMIN" },
  ]);

  const createAdminMutation = useMutation({
    mutationFn: async (payload: { name: string; email: string; contactNumber?: string }) => {
      return await apiClient("/users/create-admin", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    onSuccess: (res) => {
      setSuccessMsg("Administrator officer provisioned successfully. Temporary credentials dispatched.");
      setErrorMsg(null);
      setModalOpen(false);
      setName("");
      setEmail("");
      setContactNumber("");
      if (res?.data) {
        setAdmins((prev) => [...prev, res.data]);
      }
    },
    onError: (err: any) => {
      setErrorMsg(err?.message || "Failed to provision administrator.");
    },
  });

  const handleProvision = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    createAdminMutation.mutate({
      name,
      email,
      contactNumber: contactNumber || undefined,
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Administrator Accounts (Super Admin)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage admin officers empowered to verify advocates and moderate platform content.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition flex items-center gap-1.5 shadow-xs"
        >
          <UserPlus className="w-3.5 h-3.5" /> Provision Admin
        </button>
      </div>

      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {admins.map((admin) => (
          <div key={admin.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-sky-400 font-bold flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">{admin.name}</h3>
                <p className="text-xs text-slate-400">{admin.email}</p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-lg uppercase">
              {admin.role}
            </span>
          </div>
        ))}
      </div>

      {/* Provision Admin Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Provision Admin Account</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleProvision} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Officer Name"
                  className="w-full p-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer@legalease.com.bd"
                  className="w-full p-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="+8801700000000"
                  className="w-full p-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createAdminMutation.isPending}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold"
                >
                  {createAdminMutation.isPending ? "Provisioning..." : "Provision Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
