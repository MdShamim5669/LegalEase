---
name: managing-consultation-ui
description: Manages lawyer slot selection, timezone conversions (UTC to Asia/Dhaka), Stripe redirect polling, document uploads, and cancellation countdowns for LegalEase. Use when implementing consultation dashboard and booking views.
---

# Managing Consultation UI Flows

Implement user-facing workflows for lawyer discovery, 30-minute slot selection, Stripe payment polling, document uploads, and consultation lifecycle states.

## When to Use This Skill
- Building lawyer slot pickers (`/lawyers/[id]`).
- Converting backend UTC timestamps to Asia/Dhaka time.
- Handling post-payment redirects and polling `GET /consultations/:id` until `paymentStatus === 'PAID'`.
- Implementing the 30-minute pay-later expiration countdown timer.
- Managing PDF uploads (max 5MB, up to 5 documents per consultation).

## Key Workflow Patterns
1. **Timezone Conversion:** Backend stores UTC ISO strings. Present dates in `Asia/Dhaka` formatted as `h:mm a` alongside weekday and date.
2. **Conflict Handling:** If the booking API returns `409 Conflict`, display toast: *"Someone just booked this slot"*, keep form inputs, and refresh slot availability.
3. **Payment Polling:** On Stripe success return, show *"Confirming payment..."* and poll `GET /consultations/:id` every 2s for up to 30s.
4. **Document Restrictions:** Validate client-side that files are `application/pdf` and <= 5MB before sending multipart upload.

## Code Reference & UI Flows
For timezone conversion helpers, countdown timers, and polling hooks, consult:  
👉 **[`resources/booking-ui-flow.md`](resources/booking-ui-flow.md)**
