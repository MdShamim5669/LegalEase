"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  ArrowLeft,
  Video,
  FileText,
  Upload,
  CreditCard,
  Star,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ExternalLink,
  Clock,
  Send,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { formatBDT, formatDhakaTime } from "@/lib/utils";
import { StatusBadge } from "@/components/common/StatusBadge";
import { LegalDisclaimerBanner } from "@/components/common/LegalDisclaimerBanner";

function ConsultationDetailContent() {
  const params = useParams();
  const id = params?.id as string;

  const [activeTab, setActiveTab] = useState<"ROOM" | "DOCS" | "ADVICE" | "PAYMENT" | "REVIEW">(
    "ROOM"
  );
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewStatus, setReviewStatus] = useState<string | null>(null);

  // 1. Fetch consultation details
  const { data: consultationRes, isLoading, refetch } = useQuery({
    queryKey: ["consultation", id],
    queryFn: () => apiClient<any>(`/consultations/${id}`).catch(() => null),
    enabled: !!id,
  });

  // 2. Fetch advice note
  const { data: adviceRes } = useQuery({
    queryKey: ["consultation-advice", id],
    queryFn: () => apiClient<any>(`/consultations/${id}/advice`).catch(() => null),
    enabled: !!id,
  });

  // 3. Fetch documents
  const { data: docsRes } = useQuery({
    queryKey: ["consultation-docs", id],
    queryFn: () => apiClient<any[]>(`/consultations/${id}/documents`).catch(() => ({ data: [] })),
    enabled: !!id,
  });

  // 4. Pay mutation
  const payMutation = useMutation({
    mutationFn: () =>
      apiClient<any>(`/consultations/${id}/pay`, {
        method: "POST",
      }),
    onSuccess: (data) => {
      if (data?.data?.checkoutUrl) {
        window.location.href = data.data.checkoutUrl;
      } else {
        refetch();
      }
    },
  });

  // 5. Review submission mutation
  const reviewMutation = useMutation({
    mutationFn: () =>
      apiClient("/reviews", {
        method: "POST",
        body: JSON.stringify({
          consultationId: id,
          lawyerId: c?.lawyerId,
          rating: reviewRating,
          comment: reviewComment.trim(),
        }),
      }),
    onSuccess: () => {
      setReviewStatus("Review published successfully! Thank you for your feedback.");
      setReviewComment("");
    },
    onError: (err: any) => {
      setReviewStatus(err.message || "Failed to submit review.");
    },
  });

  const c = consultationRes?.data;
  const advice = adviceRes?.data;
  const docs = docsRes?.data || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Link
        href="/dashboard/consultations"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Consultations History
      </Link>

      <LegalDisclaimerBanner />

      {/* Consultation Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs font-mono text-slate-400">ID: {id?.slice(0, 10)}</span>
            <StatusBadge status={c?.status || "SCHEDULED"} />
            {c?.payment && <StatusBadge status={c.payment.status} />}
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {c?.lawyer?.name || c?.lawyer?.user?.name || "Advocate Consultation Session"}
          </h1>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {c?.schedule?.startDateTime || c?.schedule?.startTime
              ? formatDhakaTime(c.schedule.startDateTime || c.schedule.startTime)
              : "30-minute Live Session"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {c?.payment?.status === "UNPAID" && (
            <button
              onClick={() => payMutation.mutate()}
              disabled={payMutation.isPending}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <CreditCard className="w-4 h-4" />
              {payMutation.isPending
                ? "Connecting Gateway..."
                : `Pay Fee ${formatBDT(c?.payment?.amount || 1500)}`}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {[
          { key: "ROOM", label: "Consultation Room", icon: Video },
          { key: "DOCS", label: "Case Documents", icon: Upload },
          { key: "ADVICE", label: "Written Advice Note", icon: FileText },
          { key: "PAYMENT", label: "Payment & Invoice", icon: CreditCard },
          { key: "REVIEW", label: "Advocate Review", icon: Star },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap ${
                activeTab === tab.key
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
        {/* ROOM TAB */}
        {activeTab === "ROOM" && (
          <div className="space-y-6 text-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto shadow-xs">
              <Video className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Encrypted Consultation Channel</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Your 30-minute private consultation session with advocate. Video and audio streams are end-to-end encrypted.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-sm mx-auto">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Video Calling Channel</span>
              <div className="font-mono text-sm font-bold text-slate-800 mt-0.5">
                {c?.videoCallingId || `call-${id?.slice(0, 8)}`}
              </div>
            </div>

            {c?.payment?.status === "UNPAID" ? (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs max-w-md mx-auto flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Please complete payment before joining the live video session.
                </span>
              </div>
            ) : (
              <a
                href={`https://meet.jit.si/LegalEase-${c?.videoCallingId || id}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                Launch Encrypted Room <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        )}

        {/* DOCS TAB */}
        {activeTab === "DOCS" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Confidential Case Documents</h3>
                <p className="text-xs text-slate-500">
                  Upload PDF documents (up to 5MB) for your advocate to examine before consultation.
                </p>
              </div>
              <label className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:bg-slate-800 transition w-fit">
                <Upload className="w-3.5 h-3.5" /> Upload PDF Document
                <input type="file" accept=".pdf,image/*" className="hidden" />
              </label>
            </div>

            {docs.length > 0 ? (
              <div className="space-y-2">
                {docs.map((doc: any) => (
                  <div
                    key={doc.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-sky-600" />
                      <span className="font-semibold text-slate-800">{doc.filename || doc.title}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">PDF Document</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-2">
                <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500">No documents uploaded yet for this case.</p>
                <span className="text-[11px] text-slate-400">PDF, PNG, JPG supported (Max 5MB)</span>
              </div>
            )}
          </div>
        )}

        {/* ADVICE TAB */}
        {activeTab === "ADVICE" && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">Written Legal Advice Note</h3>
            <p className="text-xs text-slate-500">
              Upon conclusion of consultation, the advocate delivers an actionable summary and proposed next steps.
            </p>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3">
              {advice?.content ? (
                <>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs text-slate-500">
                    <span>Delivered by: {c?.lawyer?.name || "Advocate"}</span>
                    <span>Delivered on: {formatDhakaTime(advice.createdAt)}</span>
                  </div>
                  <div className="whitespace-pre-line">{advice.content}</div>
                </>
              ) : (
                <div className="text-slate-400 italic text-center py-6">
                  The advocate has not yet submitted the written advice note. It will be recorded here once the consultation is marked completed.
                </div>
              )}
            </div>
          </div>
        )}

        {/* PAYMENT TAB */}
        {activeTab === "PAYMENT" && (
          <div className="space-y-4 max-w-md">
            <h3 className="text-base font-bold text-slate-900">Payment Summary & Receipt</h3>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Consultation Session (30 min)</span>
                <span className="font-bold text-slate-900">{formatBDT(c?.payment?.amount || 1500)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Status</span>
                <StatusBadge status={c?.payment?.status || "UNPAID"} />
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Gateway Transaction</span>
                <span className="font-mono text-slate-600">{c?.payment?.transactionId || "N/A"}</span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between font-extrabold text-slate-900 text-sm">
                <span>Total Amount</span>
                <span>{formatBDT(c?.payment?.amount || 1500)}</span>
              </div>

              {c?.payment?.status === "UNPAID" && (
                <button
                  onClick={() => payMutation.mutate()}
                  disabled={payMutation.isPending}
                  className="w-full mt-2 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-xl transition"
                >
                  Pay via Online Gateway
                </button>
              )}
            </div>
          </div>
        )}

        {/* REVIEW TAB */}
        {activeTab === "REVIEW" && (
          <div className="space-y-4 max-w-md">
            <h3 className="text-base font-bold text-slate-900">Rate Your Advocate</h3>
            <p className="text-xs text-slate-500">
              Share your feedback to help verified lawyers maintain high service standards across LegalEase.
            </p>

            {reviewStatus && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                {reviewStatus}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Rating (1 to 5 Stars)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setReviewRating(s)}
                    className="p-1 hover:scale-110 transition"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        s <= reviewRating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Feedback Comment
              </label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="How helpful was the preliminary consultation session?"
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <button
              onClick={() => reviewMutation.mutate()}
              disabled={!reviewComment.trim() || reviewMutation.isPending}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Submit Verified Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ConsultationDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-500 font-medium">
          Loading consultation workspace...
        </div>
      }
    >
      <ConsultationDetailContent />
    </Suspense>
  );
}
