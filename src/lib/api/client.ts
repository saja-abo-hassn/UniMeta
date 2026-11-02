import { API_MODE } from "./config";
import { mockTransport } from "@/src/mocks/transport";
import { realTransport } from "./real-transport";
import type { ApiEnvelope, ApiRequestOptions } from "./types";

const transport = API_MODE === "mock" ? mockTransport : realTransport;

/** Shared request surface for both mock and Laravel transports. */
export function apiRequest<TResponse, TBody = unknown>(
  path: string,
  options?: ApiRequestOptions<TBody>,
): Promise<ApiEnvelope<TResponse>> {
  return transport.request<TResponse, TBody>(path, options);
}

export const api = {
  get<TResponse>(path: string, options?: Omit<ApiRequestOptions, "method" | "body">) {
    return apiRequest<TResponse>(path, { ...options, method: "GET" });
  },
  post<TResponse, TBody = unknown>(path: string, body: TBody, options?: Omit<ApiRequestOptions<TBody>, "method" | "body">) {
    return apiRequest<TResponse, TBody>(path, { ...options, method: "POST", body });
  },
  put<TResponse, TBody = unknown>(path: string, body: TBody, options?: Omit<ApiRequestOptions<TBody>, "method" | "body">) {
    return apiRequest<TResponse, TBody>(path, { ...options, method: "PUT", body });
  },
  patch<TResponse, TBody = unknown>(path: string, body: TBody, options?: Omit<ApiRequestOptions<TBody>, "method" | "body">) {
    return apiRequest<TResponse, TBody>(path, { ...options, method: "PATCH", body });
  },
  delete<TResponse>(path: string, options?: Omit<ApiRequestOptions, "method" | "body">) {
    return apiRequest<TResponse>(path, { ...options, method: "DELETE" });
  },
};

export { API_MODE } from "./config";
export { ApiError } from "./errors";
export type { ApiEnvelope, ApiErrorPayload, ApiIssue, ApiMeta, ApiRequestOptions, ApiStatus } from "./types";
