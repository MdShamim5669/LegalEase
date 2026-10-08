# LegalEase Frontend: Project Memory

Next.js web application for the LegalEase online lawyer-consultation platform. Full specification: `docs/PRD.md`.

## Tech Stack
* Next.js (App Router), TypeScript (strict mode)
* Tailwind CSS, shadcn/ui primitives, Lucide React
* TanStack Query (React Query)
* react-hook-form + Zod v4 schemas
* date-fns-tz (Asia/Dhaka timezone formatting)
* next-intl (Bilingual: English & Bangla)

## Commands
* `pnpm dev` - Start Next.js development server
* `pnpm build` - Build production bundle
* `pnpm start` - Run production server
* `pnpm lint` - Run ESLint checks
* `pnpm test` - Run component and unit tests

## Non-Negotiable Rules
1. Never store access or refresh tokens in `localStorage`; rely strictly on `httpOnly` cookies via `credentials: 'include'`.
2. All lawyer consultation slots stored as UTC from the API must be converted to `Asia/Dhaka` for display.
3. Every booking screen and lawyer profile must display the mandatory BR-20 disclaimer: *"This is a preliminary consultation, not formal legal representation."*
4. All client-side validation schemas must mirror backend Zod validation shapes.
5. All buttons and mutation triggers must disable during requests to prevent double-submits.
6. Use skeleton loaders for loading states; never solitary spinners.
