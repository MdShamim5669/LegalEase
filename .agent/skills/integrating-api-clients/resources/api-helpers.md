# API Client Helpers & TanStack Query Setup

## 1. Custom Fetch Client with Automatic Refresh

```ts
// src/lib/api-client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  meta?: { page: number; limit: number; total: number; totalPages: number };
}

export interface IApiError {
  success: false;
  code: string;
  message: string;
  errorSources?: Array<{ path: string; message: string }>;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<IApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const config: RequestInit = {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  };

  let response = await fetch(url, config);

  // Handle Token Expiry
  if (response.status === 401) {
    const errorJson = (await response.clone().json().catch(() => ({}))) as IApiError;
    if (errorJson.code === "TOKEN_EXPIRED") {
      // Try refresh once
      const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: "POST",
        credentials: "include",
      });

      if (refreshRes.ok) {
        // Retry original request
        response = await fetch(url, config);
      } else {
        if (typeof window !== "undefined") {
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        }
      }
    }
  }

  const data = await response.json();
  if (!response.ok) {
    throw data as IApiError;
  }

  return data as IApiResponse<T>;
}
```

## 2. Lawyer Discovery Query Hook

```ts
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useLawyers(filters: Record<string, any>) {
  const queryParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== "") {
      queryParams.append(key, String(val));
    }
  });

  return useQuery({
    queryKey: ["lawyers", filters],
    queryFn: () => apiClient(`/lawyers?${queryParams.toString()}`),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
```
