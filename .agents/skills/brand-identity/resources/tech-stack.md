# Preferred Tech Stack & Implementation Rules

When generating code or UI components for **LegalEase**, you **MUST** strictly adhere to the following architecture and technology choices defined in the PRD (v2.0).

## 1. Frontend Architecture (Web App)
* **Framework:** Next.js (App Router, TypeScript strict)
* **Styling Engine:** Tailwind CSS (Mandatory utility classes. Do not use plain CSS or CSS-in-JS unless explicitly asked.)
* **Component Library:** shadcn/ui primitives as the base for all components
* **State & Data Fetching:** TanStack Query (React Query)
* **Form Handling:** react-hook-form with Zod schemas (`@hookform/resolvers/zod`)
* **Icons:** Lucide React
* **Localization & Formatting:** `next-intl` (Bilingual: English and Bangla), `date-fns-tz` (Asia/Dhaka time presentation)

## 2. Backend Architecture (REST API)
* **Runtime:** Node.js (v22 LTS), TypeScript strict (no `any`)
* **Web Framework:** Express 5 (native async error propagation)
* **Database & ORM:** PostgreSQL 16 via Prisma 7 (`@prisma/adapter-pg`, connection pooling)
* **Authentication:** Better Auth (PostgreSQL session persistence) + short-lived JWT + Google OAuth + Email OTP
* **Payments:** Stripe Checkout & signed Webhooks behind `PaymentGateway` interface (BDT taka)
* **File Uploads:** Multer (memory storage) -> Cloudinary (PDF case documents max 5MB, avatar images max 2MB)
* **Scheduled Jobs:** node-cron (unpaid cancellation every 25 min, no-show handling)
* **Email:** Nodemailer SMTP with EJS templates

## 3. Implementation Guidelines

### Tailwind & Design Tokens
* Use utility classes directly in JSX.
* Utilize the color tokens defined in `design-tokens.json` (e.g. `bg-primary text-primary-foreground`, `text-status-consultation-scheduled-text`).
* **Dark Mode:** Support dark mode using Tailwind's `dark:` variant modifier.
* **Responsive:** Mobile-first design; slot picker transforms into a bottom sheet on viewports < 768px.

### Component Patterns
* **Buttons:** Primary actions must use the solid Primary color (`#0F172A`). Secondary actions must use 'Ghost' or 'Outline' variants. Destructive actions require a confirmation dialog with clear consequence text (e.g. refund amounts).
* **Forms:** Form labels must always be placed *above* input fields. Display validation errors inline below fields, mapped from server `errorSources`.
* **Disclaimers:** Any booking flow or lawyer profile must include the mandatory legal disclaimer component.
* **Loading States:** Use skeleton loaders for lists and cards; never use solitary spinners.

### Forbidden Patterns
* Do NOT use jQuery or Bootstrap.
* Do NOT store access tokens in `localStorage` (use `httpOnly` secure cookies with `credentials: 'include'`).
* Do NOT use floating point numbers for currency (use integer BDT taka).
* Do NOT place network or payment gateway calls inside Prisma database transactions (`prisma.$transaction`).
