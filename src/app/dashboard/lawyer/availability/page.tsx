"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Clock,
  Plus,
  CheckCircle2,
  Trash2,
  Calendar,
  AlertCircle,
  X,
  Video,
  PhoneCall,
  Building2,
  Check,
  CalendarPlus,
  Layers,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { formatDhakaTime } from "@/lib/utils";

export default function LawyerAvailabilityPage() {
  const queryClient = useQueryClient();
  const [notice, setNotice] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"pick" | "create">("pick");

  // Selection states for picking slots
  const [selectedScheduleIds, setSelectedScheduleIds] = useState<string[]>([]);

  // Creation states for custom time window
  const [customDate, setCustomDate] = useState(() => {
    const tomorrow = new Date(Date.now() + 86400000);
    return tomorrow.toISOString().split("T")[0];
  });
  const [customStartTime, setCustomStartTime] = useState("10:00");
  const [customEndTime, setCustomEndTime] = useState("10:30");

  // 1. Fetch lawyer's own assigned slots
  const { data: mySlotsRes, isLoading: isMySlotsLoading } = useQuery({
    queryKey: ["lawyer-my-slots"],
    queryFn: () => apiClient<any[]>("/lawyer-schedules/my").catch(() => ({ data: [] })),
  });

  // 2. Fetch platform master schedules to pick from
  const { data: allSchedulesRes, isLoading: isAllSchedulesLoading } = useQuery({
    queryKey: ["all-schedules"],
    queryFn: () => apiClient<any[]>("/schedules?limit=50").catch(() => ({ data: [] })),
    enabled: modalOpen,
  });

  const mySlots = mySlotsRes?.data || [];
  const allSchedules = allSchedulesRes?.data || [];

  // Filter out schedules already picked by the lawyer
  const myAssignedScheduleIds = new Set(
    mySlots.map((s: any) => s.scheduleId || s.id)
  );

  const availablePlatformSchedules = allSchedules.filter((sched: any) => {
    // Only future or today's schedules
    const isFuture = new Date(sched.startDateTime) > new Date();
    return isFuture && !myAssignedScheduleIds.has(sched.id);
  });

  // 3. Mutation: Pick existing schedules
  const pickSlotsMutation = useMutation({
    mutationFn: (scheduleIds: string[]) =>
      apiClient("/lawyer-schedules", {
        method: "POST",
        body: JSON.stringify({ scheduleIds }),
      }),
    onSuccess: (res: any) => {
      setNotice({
        text: `Successfully opened ${selectedScheduleIds.length} slot(s) for client booking!`,
        type: "success",
      });
      setSelectedScheduleIds([]);
      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["lawyer-my-slots"] });
    },
    onError: (err: any) => {
      setNotice({
        text: err.message || "Failed to assign slots.",
        type: "error",
      });
    },
  });

  // 4. Mutation: Create new custom schedule and assign to lawyer
  const createAndAssignMutation = useMutation({
    mutationFn: async () => {
      const startDateTime = new Date(`${customDate}T${customStartTime}:00+06:00`).toISOString();
      const endDateTime = new Date(`${customDate}T${customEndTime}:00+06:00`).toISOString();

      if (new Date(startDateTime) <= new Date()) {
        throw new Error("Start time must be in the future.");
      }
      if (new Date(endDateTime) <= new Date(startDateTime)) {
        throw new Error("End time must be after start time.");
      }

      // Step A: Create schedule in master table
      const createdRes = await apiClient<any>("/schedules", {
        method: "POST",
        body: JSON.stringify({
          slots: [{ startDateTime, endDateTime }],
        }),
      });

      const newScheduleId = createdRes.data?.[0]?.id;
      if (!newScheduleId) throw new Error("Failed to initialize schedule slot.");

      // Step B: Assign to lawyer's calendar
      return await apiClient("/lawyer-schedules", {
        method: "POST",
        body: JSON.stringify({ scheduleIds: [newScheduleId] }),
      });
    },
    onSuccess: () => {
      setNotice({
        text: "Custom consultation window created and opened for booking!",
        type: "success",
      });
      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["lawyer-my-slots"] });
      queryClient.invalidateQueries({ queryKey: ["all-schedules"] });
    },
    onError: (err: any) => {
      setNotice({
        text: err.message || "Failed to create slot.",
        type: "error",
      });
    },
  });

  // 5. Delete unbooked slot mutation
  const removeMutation = useMutation({
    mutationFn: (scheduleId: string) =>
      apiClient(`/lawyer-schedules/${scheduleId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      setNotice({ text: "Availability slot removed successfully.", type: "success" });
      queryClient.invalidateQueries({ queryKey: ["lawyer-my-slots"] });
    },
    onError: (err: any) => {
      setNotice({
        text: err.message || "Failed to remove slot. Booked slots cannot be removed.",
        type: "error",
      });
    },
  });

  const toggleSelectSchedule = (id: string) => {
    setSelectedScheduleIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllAvailable = () => {
    if (selectedScheduleIds.length === availablePlatformSchedules.length) {
      setSelectedScheduleIds([]);
    } else {
      setSelectedScheduleIds(availablePlatformSchedules.map((s: any) => s.id));
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Consultation Slot Availability
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Set your available time windows (Asia/Dhaka). Clients can book these windows via Video Call, Phone, or Chamber.
          </p>
        </div>

        <button
          onClick={() => {
            setModalOpen(true);
            setNotice(null);
          }}
          className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Open New Consultation Slots
        </button>
      </div>

      {/* Mode Advisory Banner */}
      <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-sky-900">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-600 shrink-0" />
          <span>
            <strong>How Slots Work:</strong> Each slot you open is an available 30-minute consultation window. The client chooses their preferred mode (Video Call, Phone, or Chamber) at checkout.
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 text-[11px] font-semibold text-sky-700 bg-white px-2.5 py-1 rounded-lg border border-sky-200">
          <Video className="w-3.5 h-3.5 text-sky-600" />
          <PhoneCall className="w-3.5 h-3.5 text-sky-600" />
          <Building2 className="w-3.5 h-3.5 text-sky-600" />
          <span>Supported Modes</span>
        </div>
      </div>

      {/* Notifications */}
      {notice && (
        <div
          className={`p-3.5 text-xs rounded-xl flex items-center justify-between border ${
            notice.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {notice.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{notice.text}</span>
          </div>
          <button
            onClick={() => setNotice(null)}
            className="text-slate-400 hover:text-slate-700 font-bold ml-2"
          >
            ×
          </button>
        </div>
      )}

      {/* Active Slots List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Your Active Booking Windows</h2>
          <span className="text-xs text-slate-400 font-medium">Total: {mySlots.length} windows</span>
        </div>

        {isMySlotsLoading ? (
          <div className="p-6 space-y-3 animate-pulse">
            <div className="h-12 bg-slate-100 rounded-xl" />
            <div className="h-12 bg-slate-100 rounded-xl" />
          </div>
        ) : mySlots.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {mySlots.map((slot: any) => {
              const dt = slot.startDateTime || slot.schedule?.startDateTime;
              const formattedTime = dt ? formatDhakaTime(dt) : "30-min Window";

              return (
                <div
                  key={slot.id}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        slot.isBooked
                          ? "bg-blue-50 text-blue-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900">{formattedTime}</div>
                      <div className="text-[11px] text-slate-400">Asia/Dhaka Standard Time</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {slot.isBooked ? (
                      <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                        Booked by Client
                      </span>
                    ) : (
                      <>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                          Open for Booking
                        </span>
                        <button
                          onClick={() =>
                            removeMutation.mutate(slot.scheduleId || slot.id)
                          }
                          disabled={removeMutation.isPending}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                          title="Remove open slot"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <Clock className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500 font-medium">
              No active availability slots published yet.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Open Your First Slot
            </button>
          </div>
        )}
      </div>

      {/* Modal: Pick or Create Slots */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Open Consultation Slots
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Make your time windows available for client booking
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="p-2 border-b border-slate-100 bg-slate-50 flex gap-2">
              <button
                onClick={() => setActiveTab("pick")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === "pick"
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Select Standard Windows</span>
              </button>
              <button
                onClick={() => setActiveTab("create")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === "create"
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                <span>Custom Date & Time</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              {activeTab === "pick" ? (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-slate-500">
                      Available system slots ({availablePlatformSchedules.length})
                    </span>
                    {availablePlatformSchedules.length > 0 && (
                      <button
                        onClick={selectAllAvailable}
                        className="text-xs font-bold text-sky-600 hover:text-sky-700"
                      >
                        {selectedScheduleIds.length === availablePlatformSchedules.length
                          ? "Deselect All"
                          : "Select All"}
                      </button>
                    )}
                  </div>

                  {isAllSchedulesLoading ? (
                    <div className="space-y-2 animate-pulse">
                      <div className="h-10 bg-slate-100 rounded-xl" />
                      <div className="h-10 bg-slate-100 rounded-xl" />
                    </div>
                  ) : availablePlatformSchedules.length > 0 ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {availablePlatformSchedules.map((sched: any) => {
                        const isSelected = selectedScheduleIds.includes(sched.id);
                        return (
                          <div
                            key={sched.id}
                            onClick={() => toggleSelectSchedule(sched.id)}
                            className={`p-3 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition ${
                              isSelected
                                ? "bg-sky-50 border-sky-400 text-sky-900"
                                : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                                  isSelected
                                    ? "bg-sky-600 border-sky-600 text-white"
                                    : "border-slate-300 bg-white"
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3" />}
                              </div>
                              <span className="font-semibold">
                                {formatDhakaTime(sched.startDateTime)}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400">30 min</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
                      No standard platform windows available right now. Switch to the <strong>"Custom Date & Time"</strong> tab to create your own!
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Date</label>
                    <input
                      type="date"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Start Time</label>
                      <input
                        type="time"
                        value={customStartTime}
                        onChange={(e) => setCustomStartTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">End Time</label>
                      <input
                        type="time"
                        value={customEndTime}
                        onChange={(e) => setCustomEndTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Standard consultation slots are typically 30 minutes in length (Asia/Dhaka time).
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>

              {activeTab === "pick" ? (
                <button
                  onClick={() => pickSlotsMutation.mutate(selectedScheduleIds)}
                  disabled={
                    selectedScheduleIds.length === 0 || pickSlotsMutation.isPending
                  }
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 disabled:opacity-50 transition"
                >
                  {pickSlotsMutation.isPending
                    ? "Opening Slots..."
                    : `Open ${selectedScheduleIds.length} Selected Slot(s)`}
                </button>
              ) : (
                <button
                  onClick={() => createAndAssignMutation.mutate()}
                  disabled={createAndAssignMutation.isPending}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 disabled:opacity-50 transition"
                >
                  {createAndAssignMutation.isPending ? "Creating..." : "Create & Open Slot"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
