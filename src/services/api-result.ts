import type { LaravelResponse } from "./api-client";

export function requireData<T>(response: LaravelResponse<T>): T {
  if (response.errors || response.data === null || (response.status !== undefined && response.status >= 400)) {
    throw new Error(Object.values(response.errors ?? {}).flat().join(" ") || response.message);
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
