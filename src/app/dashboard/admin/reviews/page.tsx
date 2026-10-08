"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, ShieldAlert, Check, EyeOff, Eye } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { formatDhakaTime } from "@/lib/utils";

export default function AdminReviewsModerationPage() {
  const queryClient = useQueryClient();
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // 1. Fetch all reviews for moderation
  const { data: reviewsRes, isLoading } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: () => apiClient<any[]>("/reviews").catch(() => ({ data: [] })),
  });

  // 2. Visibility mutation
  const visibilityMutation = useMutation({
    mutationFn: ({ id, isHidden }: { id: string; isHidden: boolean }) =>
      apiClient(`/reviews/${id}/visibility`, {
        method: "PATCH",
        body: JSON.stringify({ isHidden }),
      }),
    onSuccess: (_, vars) => {
      setActionNotice(`Review marked as ${vars.isHidden ? "HIDDEN" : "VISIBLE"}.`);
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
    onError: (err: any) => {
      setActionNotice(err.message || "Failed to update review visibility.");
    },
  });

  const reviews = reviewsRes?.data || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Review Moderation Queue</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Audit client reviews to ensure compliance with Bar Council professional ethics and decency standards.
        </p>
      </div>

      {actionNotice && (
        <div className="p-3 bg-sky-50 border border-sky-200 text-sky-800 text-xs rounded-xl flex items-center justify-between">
          <span>{actionNotice}</span>
          <button onClick={() => setActionNotice(null)} className="text-sky-600 font-bold ml-2">
            ×
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3 animate-pulse">
            <div className="h-16 bg-slate-100 rounded-xl" />
            <div className="h-16 bg-slate-100 rounded-xl" />
          </div>
        ) : reviews.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {reviews.map((r: any) => {
              const lawyerName = r.lawyer?.name || "Advocate";
              const clientName = r.client?.name || "Client";
              const isHidden = r.isHidden;

              return (
                <div key={r.id} className="p-6 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="font-bold text-sm text-slate-900">{lawyerName}</span>
                      <span className="text-xs text-slate-400 block">
                        Reviewed by: {clientName} · {formatDhakaTime(r.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= r.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                            }`}
                          />
                        ))}
                      </div>

                      {isHidden ? (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          Hidden
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Public
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    &ldquo;{r.comment}&rdquo;
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() =>
                        visibilityMutation.mutate({ id: r.id, isHidden: !isHidden })
                      }
                      disabled={visibilityMutation.isPending}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                        isHidden
                          ? "bg-slate-900 text-white hover:bg-slate-800"
                          : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                      }`}
                    >
                      {isHidden ? (
                        <>
                          <Eye className="w-3.5 h-3.5" /> Unhide Review
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" /> Moderate & Hide
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs">
            No reviews require moderation at this time.
          </div>
        )}
      </div>
    </div>
  );
}
