# LegalEase UI Component Patterns

## 1. Status Badge Component

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      status: {
        SCHEDULED: "bg-blue-100 text-blue-800 border border-blue-300",
        INPROGRESS: "bg-amber-100 text-amber-800 border border-amber-300",
        COMPLETED: "bg-emerald-100 text-emerald-800 border border-emerald-300",
        CANCELED: "bg-slate-100 text-slate-700 border border-slate-300",
        PAID: "bg-green-100 text-green-800 border border-green-300",
        UNPAID: "bg-rose-100 text-rose-800 border border-rose-300",
        REFUNDED: "bg-purple-100 text-purple-800 border border-purple-300",
      },
    },
    defaultVariants: {
      status: "SCHEDULED",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function StatusBadge({ className, status, children, ...props }: StatusBadgeProps) {
  return (
    <div className={cn(badgeVariants({ status }), className)} {...props}>
      <span className="mr-1 h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {children || status}
    </div>
  );
}
```

## 2. Legal Disclaimer Banner (Rule BR-20)

```tsx
import { AlertCircle } from "lucide-react";

export function LegalDisclaimerBanner({ className }: { className?: string }) {
  return (
    <div className={`flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50/70 p-4 text-sm text-amber-900 ${className || ""}`}>
      <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
      <div>
        <p className="font-medium">Preliminary Consultation Notice</p>
        <p className="text-amber-800 mt-0.5">
          This is a preliminary consultation, not formal legal representation.
          (এটি একটি প্রাথমিক পরামর্শ, কোনো আনুষ্ঠানিক আইনি প্রতিনিধিত্ব নয়।)
        </p>
      </div>
    </div>
  );
}
```

## 3. Consultation Card Skeleton

```tsx
import { Skeleton } from "@/components/ui/skeleton";

export function ConsultationCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="flex items-center justify-end gap-3 pt-2">
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>
    </div>
  );
}
```
