---
name: integrating-api-clients
description: Integrates TanStack Query, typed fetch wrappers, cookie-based session management, and server error mapping with the LegalEase backend REST API. Use when connecting frontend components to backend endpoints.
---

# Integrating API Clients & Data Fetching

Connect Next.js client components and server actions to the LegalEase backend REST API (`/api/v1`) using TanStack Query, typed fetch clients, and automatic token refresh flows.

## When to Use This Skill
- Setting up TanStack Query hooks (`useQuery`, `useMutation`).
- Calling backend REST endpoints from client or server components.
- Parsing backend error responses into frontend form errors or toasts.
- Handling session cookies, refresh token rotation, and 401 unauthenticated redirects.

## Client Communication Protocol (PRD Section 2.9)
1. **Cookies:** All requests must include `credentials: 'include'`. Never store tokens in `localStorage`.
2. **Token Refresh (401 `TOKEN_EXPIRED`):** Invoke `POST /auth/refresh-token` once, retry the initial request once. If refresh fails, clear state and redirect to `/login?redirect=<path>`.
3. **Double Submission:** Disable submit buttons while mutations are `isPending`.
4. **Error Mapping:** Map server `errorSources[].path` directly into React Hook Form fields.

## Workflow & Code Reference
For custom fetch clients, TanStack Query setup, and interceptor patterns, consult:  
👉 **[`resources/api-helpers.md`](resources/api-helpers.md)**
