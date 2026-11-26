import type { LaravelResponse } from "./api-client";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly code?: string,
    public readonly errors?: Record<string, string[]>,
    public readonly retryAfterSeconds?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function requireData<T>(response: LaravelResponse<T>): T {
  if (response.errors || response.data === null || (response.status !== undefined && response.status >= 400)) {
    throw new ApiError(
      Object.values(response.errors ?? {}).flat().join(" ") || response.message,
      response.status,
      response.code,
      response.errors ?? undefined,
      response.retryAfterSeconds,
    );
  }
  return response.data;
}

export function reportApiError(error: unknown): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("unimeta_api_error", {
      detail: error instanceof Error ? error.message : "تعذر حفظ التغييرات. حاول مجدداً.",
    }));
  }
}
