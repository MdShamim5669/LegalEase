import React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function LegalDisclaimerBanner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border border-amber-200/80 bg-amber-50/70 p-4 text-xs sm:text-sm text-amber-900",
        className
      )}
    >
      <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
      <div>
        <p className="font-semibold text-amber-950">
          Preliminary Consultation Notice (Rule BR-20)
        </p>
        <p className="text-amber-800 mt-0.5 leading-relaxed">
          This platform facilitates preliminary legal consultations only and does not constitute formal legal representation, power of attorney (vakalatnama), or in-court appearance.
          <span className="block text-[11px] text-amber-700 mt-0.5">
            (এটি কেবল প্রাথমিক আইনি পরামর্শ সেবা, কোনো আদালতীয় প্রতিনিধিত্ব বা ওকালতনামার বিকল্প নয়।)
          </span>
        </p>
      </div>
    </div>
  );
}
