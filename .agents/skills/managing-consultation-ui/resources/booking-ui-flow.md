# Consultation UI Helpers & Polling Hooks

## 1. Timezone Formatter (UTC -> Asia/Dhaka)

```ts
import { formatInTimeZone } from "date-fns-tz";

const DHAKA_TIMEZONE = "Asia/Dhaka";

export function formatDhakaSlotTime(isoString: string): string {
  // Format: "Tue 7 Oct, 10:00 AM"
  return formatInTimeZone(new Date(isoString), DHAKA_TIMEZONE, "EEE d MMM, h:mm a");
}

export function formatDhakaTimeOnly(isoString: string): string {
  // Format: "10:00 AM"
  return formatInTimeZone(new Date(isoString), DHAKA_TIMEZONE, "h:mm a");
}
```

## 2. Payment Confirmation Polling Hook

```tsx
"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";

export function usePaymentConfirmation(consultationId: string, initialStatus: string) {
  const [paymentStatus, setPaymentStatus] = useState(initialStatus);
  const [isConfirming, setIsConfirming] = useState(initialStatus === "UNPAID");

  useEffect(() => {
    if (paymentStatus === "PAID" || !isConfirming) return;

    let attempts = 0;
    const maxAttempts = 15; // 30 seconds total (15 * 2s)

    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await apiClient<{ paymentStatus: string }>(`/consultations/${consultationId}`);
        if (res.data.paymentStatus === "PAID") {
          setPaymentStatus("PAID");
          setIsConfirming(false);
          clearInterval(interval);
        }
      } catch (e) {
        // Continue polling
      }

      if (attempts >= maxAttempts) {
        setIsConfirming(false);
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [consultationId, paymentStatus, isConfirming]);

  return { paymentStatus, isConfirming };
}
```

## 3. Pay-Later Expiration Countdown

```tsx
"use client";

import React, { useEffect, useState } from "react";

export function ExpirationCountdown({ createdAt }: { createdAt: string }) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const expiresAt = new Date(createdAt).getTime() + 30 * 60 * 1000;

    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setTimeLeft(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [createdAt]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (timeLeft <= 0) {
    return <span className="font-semibold text-rose-600">Booking expired</span>;
  }

  return (
    <span className="font-medium text-amber-700">
      Pay within {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </span>
  );
}
```
