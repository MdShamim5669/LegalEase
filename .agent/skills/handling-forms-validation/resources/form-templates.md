# Form Templates & Server Error Mapping

## 1. Booking Form with Server Error Integration

```tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { IApiError } from "@/lib/api-client";

const bookingSchema = z.object({
  topic: z
    .string()
    .max(300, "Topic cannot exceed 300 characters")
    .optional(),
  type: z.enum(["VIDEO", "PHONE", "CHAMBER"]),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export function BookingForm({ onSubmitBooking }: { onSubmitBooking: (values: BookingFormValues) => Promise<void> }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultVariants: { type: "VIDEO" },
  });

  const onSubmit = async (values: BookingFormValues) => {
    try {
      await onSubmitBooking(values);
    } catch (err: any) {
      const apiError = err as IApiError;
      if (apiError.errorSources) {
        apiError.errorSources.forEach((source) => {
          setError(source.path as any, { type: "server", message: source.message });
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Consultation Type
        </label>
        <select {...register("type")} className="w-full rounded-md border border-slate-300 p-2 text-sm">
          <option value="VIDEO">Video Consultation</option>
          <option value="PHONE">Phone Consultation</option>
          <option value="CHAMBER">Chamber Visit</option>
        </select>
        {errors.type && <p className="mt-1 text-xs text-red-600">{errors.type.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Brief Topic / Issue Description (Optional, max 300 chars)
        </label>
        <textarea
          {...register("topic")}
          rows={3}
          placeholder="Describe your legal matter briefly..."
          className="w-full rounded-md border border-slate-300 p-2 text-sm"
        />
        {errors.topic && <p className="mt-1 text-xs text-red-600">{errors.topic.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {isSubmitting ? "Locking slot..." : "Confirm & Pay"}
      </button>
    </form>
  );
}
```
