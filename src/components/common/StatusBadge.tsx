import React from "react";
import { cn } from "@/lib/utils";

export type BadgeStatus =
  | "SCHEDULED"
  | "INPROGRESS"
  | "COMPLETED"
  | "CANCELED"
  | "PAID"
  | "UNPAID"
  | "REFUNDED"
  | "FAILED";

const badgeStyles: Record<BadgeStatus, { bg: string; text: string; border: string; dot: string }> = {
  SCHEDULED: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  INPROGRESS: {
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  COMPLETED: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  CANCELED: {
    bg: "bg-slate-100",
    text: "text-slate-600",
    border: "border-slate-300",
    dot: "bg-slate-400",
  },
  PAID: {
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-300",
    dot: "bg-emerald-600",
  },
  UNPAID: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    dot: "bg-rose-500",
  },
  REFUNDED: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    dot: "bg-purple-500",
  },
  FAILED: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
  },
};

export function StatusBadge({
  status,
  className,
}: {
  status: BadgeStatus;
  className?: string;
}) {
  const style = badgeStyles[status] || badgeStyles.SCHEDULED;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        style.bg,
        style.text,
        style.border,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", style.dot)} />
      {status}
    </span>
  );
}
