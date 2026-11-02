import { API_BASE_URL } from "./config";
import { toApiError } from "./errors";
import type { ApiEnvelope, ApiRequestOptions, ApiTransport } from "./types";

export const realTransport: ApiTransport = {
  async request<TData, TBody = unknown>(
    path: string,
    options: ApiRequestOptions<TBody> = {},
  ): Promise<ApiEnvelope<TData>> {
    const { method = "GET", body, headers, signal } = options;
    const response = await fetch(`${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`, {
      method,
      credentials: "include",
      headers: {
        Accept: "application/json",
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });

    if (!response.ok) throw await toApiError(response);

    const payload = (await response.json()) as Partial<ApiEnvelope<TData>>;
    return {
      data: payload.data as TData,
      meta: payload.meta ?? null,
      errors: null,
    };
  },
};
