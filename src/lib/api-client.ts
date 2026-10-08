// src/lib/api-client.ts
// Axios-based API client for LegalEase connecting to Render Backend with TanStack Query support

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

export const SERVER_BASE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "https://legalease-server-llvx.onrender.com";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || `${SERVER_BASE_URL}/api/v1`;

export const AUTH_BASE_URL =
  process.env.NEXT_PUBLIC_AUTH_URL || `${SERVER_BASE_URL}/api/auth`;

export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IApiError {
  success: false;
  code?: string;
  message: string;
  errorSources?: Array<{ path: string; message: string }>;
}

// 1. Create configured Axios instance
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Request Interceptor: Attach JWT Bearer Token from localStorage if present
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Response Interceptor: Handle automatic token refreshing & centralized errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    // Handle 401 Unauthorized / Token Expiry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        if (refreshResponse.data?.data?.accessToken) {
          const newToken = refreshResponse.data.data.accessToken;
          if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", newToken);
          }
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return axiosInstance(originalRequest);
        }
      } catch (refreshErr) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
        }
      }
    }

    const errorPayload = error.response?.data || {
      success: false,
      message: error.message || "An unexpected network error occurred",
    };

    return Promise.reject(errorPayload);
  }
);

// 4. Flexible wrapper matching TanStack Query usage across LegalEase
export async function apiClient<T = any>(
  endpoint: string,
  options: {
    method?: string;
    body?: any;
    params?: any;
    headers?: Record<string, string>;
  } = {}
): Promise<IApiResponse<T>> {
  const method = (options.method || "GET").toUpperCase();

  let requestData = options.body;
  if (typeof requestData === "string") {
    try {
      requestData = JSON.parse(requestData);
    } catch {
      // keep raw string if not JSON
    }
  }

  const response = await axiosInstance.request<IApiResponse<T>>({
    url: endpoint,
    method,
    data: requestData,
    params: options.params,
    headers: options.headers,
  });

  return response.data;
}

export default axiosInstance;
