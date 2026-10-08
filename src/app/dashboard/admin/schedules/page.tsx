"use client";

import React, { useState } from "react";
import { Clock, Plus, Trash2, X, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface IScheduleSlot {
  id: string;
  startDateTime: string;
  endDateTime: string;
}

export default function AdminSchedulesPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("10:30");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    data: schedulesData,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["adminSchedules"],
    queryFn: async () => {
      try {
        const res = await apiClient<IScheduleSlot[]>("/schedules");
        return res?.data || [];
      } catch {
        return [];
      }
    },
  });

  const createScheduleMutation = useMutation({
    mutationFn: async (payload: { slots: Array<{ startDateTime: string; endDateTime: string }> }) => {
      return await apiClient("/schedules", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      setSuccessMsg("Schedule slot defined successfully.");
      setErrorMsg(null);
      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["adminSchedules"] });
    },
    onError: (err: any) => {
      setErrorMsg(err?.message || "Failed to create schedule slot.");
    },
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiClient(`/schedules/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSchedules"] });
    },
  });

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const startDateTime = new Date(`${date}T${startTime}:00Z`).toISOString();
    const endDateTime = new Date(`${date}T${endTime}:00Z`).toISOString();

    createScheduleMutation.mutate({
      slots: [{ startDateTime, endDateTime }],
    });
  };

  const defaultSlots: IScheduleSlot[] = [
    { id: "1", startDateTime: "2026-10-08T10:00:00Z", endDateTime: "2026-10-08T10:30:00Z" },
    { id: "2", startDateTime: "2026-10-08T10:30:00Z", endDateTime: "2026-10-08T11:00:00Z" },
    { id: "3", startDateTime: "2026-10-08T11:00:00Z", endDateTime: "2026-10-08T11:30:00Z" },
    { id: "4", startDateTime: "2026-10-08T11:30:00Z", endDateTime: "2026-10-08T12:00:00Z" },
    { id: "5", startDateTime: "2026-10-08T16:00:00Z", endDateTime: "2026-10-08T16:30:00Z" },
    { id: "6", startDateTime: "2026-10-08T16:30:00Z", endDateTime: "2026-10-08T17:00:00Z" },
  ];

  const slots = schedulesData && schedulesData.length > 0 ? schedulesData : defaultSlots;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Platform Schedule Slots
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Standardized 30-minute consultation time windows (Asia/Dhaka) available for lawyer scheduling.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} /> Refresh
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Define Time Slot
          </button>
        </div>
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

      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading schedule windows...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {slots.map((s) => {
            const start = new Date(s.startDateTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            const end = new Date(s.endDateTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={s.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3 group hover:border-slate-300 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-sky-400 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900">
                      {start} - {end}
                    </div>
                    <div className="text-[11px] text-slate-400">30 min window</div>
                  </div>
                </div>

                <button
                  onClick={() => deleteScheduleMutation.mutate(s.id)}
                  title="Remove slot"
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for defining slot */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Define Schedule Window</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSlot} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
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
                  disabled={createScheduleMutation.isPending}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold"
                >
                  {createScheduleMutation.isPending ? "Creating..." : "Save Window"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
