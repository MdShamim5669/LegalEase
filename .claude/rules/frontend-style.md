---
description: Frontend style, Next.js, Tailwind, and component conventions
globs: ["src/**/*.{ts,tsx}"]
---

# Frontend Style Conventions

- Framework: Next.js App Router with TypeScript (strict).
- Styling: Tailwind CSS utilities only. Use design tokens from `brand-identity`.
- Components: Built on top of shadcn/ui primitives.
- Formatting: UTC timestamps from API converted to Asia/Dhaka using `date-fns-tz`.
- Currency: Formatted as integer taka (৳1,000).
- Forms: react-hook-form + Zod schemas matching backend shapes. Labels always above inputs.
- Disclaimer: Mandatory BR-20 disclaimer visible on booking and lawyer profile pages.
