"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, Scale, Check, AlertCircle } from "lucide-react";
import { apiClient } from "@/lib/api-client";

export default function AdminPracticeAreasPage() {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("scale");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 1. Fetch practice areas
  const { data: areasRes, isLoading } = useQuery({
    queryKey: ["admin-practice-areas"],
    queryFn: () => apiClient<any[]>("/practice-areas"),
  });

  // 2. Create practice area mutation
  const createMutation = useMutation({
    mutationFn: () =>
      apiClient("/practice-areas", {
        method: "POST",
        body: JSON.stringify({ title: title.trim(), icon }),
      }),
    onSuccess: () => {
      setTitle("");
      setShowAddModal(false);
      setErrorMsg(null);
      queryClient.invalidateQueries({ queryKey: ["admin-practice-areas"] });
    },
    onError: (err: any) => {
      setErrorMsg(err.message || "Failed to create practice area.");
    },
  });

  // 3. Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiClient(`/practice-areas/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-practice-areas"] });
    },
  });

  const areas = areasRes?.data || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Practice Areas</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure legal practice disciplines available for advocate enrollment and discovery.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(!showAddModal)}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" /> {showAddModal ? "Close Form" : "Add Practice Area"}
        </button>
      </div>

      {showAddModal && (
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Create New Legal Practice Area</h3>
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Area Title
              </label>
              <input
                type="text"
                placeholder="e.g. Maritime & Admiralty Law"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Icon Identifier
              </label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              >
                <option value="scale">Scale</option>
                <option value="briefcase">Briefcase</option>
                <option value="building">Building</option>
                <option value="book-open">Book Open</option>
                <option value="shield">Shield</option>
                <option value="lock">Lock (Cyber)</option>
              </select>
            </div>
          </div>
          <button
            onClick={() => createMutation.mutate()}
            disabled={!title.trim() || createMutation.isPending}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 disabled:opacity-50 transition"
          >
            {createMutation.isPending ? "Saving..." : "Save Discipline"}
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3 animate-pulse">
            <div className="h-10 bg-slate-100 rounded-xl" />
            <div className="h-10 bg-slate-100 rounded-xl" />
            <div className="h-10 bg-slate-100 rounded-xl" />
          </div>
        ) : areas.length > 0 ? (
          areas.map((a: any) => (
            <div
              key={a.id}
              className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-sky-400 flex items-center justify-center font-bold text-xs">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{a.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-mono">Icon: {a.icon || "scale"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => deleteMutation.mutate(a.id)}
                  title="Archive discipline"
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center text-slate-400 text-xs">
            No practice areas configured yet.
          </div>
        )}
      </div>
    </div>
  );
}
