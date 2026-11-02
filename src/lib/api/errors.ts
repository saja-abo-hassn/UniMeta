import type { ApiErrorPayload, ApiMeta, ApiStatus } from "./types";

const statusCopy: Record<ApiStatus, string> = {
  401: "يلزم تسجيل الدخول للمتابعة.",
  403: "ليس لديك صلاحية للوصول إلى هذا المحتوى.",
  404: "لم نعثر على المحتوى المطلوب.",
  409: "تعذّر إتمام العملية بسبب تعارض في البيانات.",
  422: "تحقّق من البيانات المدخلة ثم حاول مجددًا.",
};

export class ApiError extends Error {
  readonly status: number;
  readonly data: ApiErrorPayload["data"];
  readonly meta: ApiMeta | null;
  readonly errors: ApiErrorPayload["errors"];

  constructor(status: number, payload: Partial<ApiErrorPayload> = {}) {
    const knownStatus = statusCopy[status as ApiStatus];
    super(knownStatus ?? "حدث خطأ أثناء الاتصال بالخدمة.");
    this.name = "ApiError";
    this.status = status;
    this.data = payload.data ?? null;
    this.meta = payload.meta ?? null;
    this.errors = payload.errors ?? null;
  }

  get body(): ApiErrorPayload {
    return { data: this.data, meta: this.meta, errors: this.errors };
  }
}

export async function toApiError(response: Response): Promise<ApiError> {
  let payload: Partial<ApiErrorPayload> = {};

  try {
    const body: unknown = await response.json();
    if (body && typeof body === "object") {
      const record = body as Record<string, unknown>;
      payload = {
        data: record.data ?? null,
        meta: (record.meta as ApiMeta | null | undefined) ?? null,
        errors: (record.errors as ApiErrorPayload["errors"] | undefined) ?? null,
      };
    }
  } catch {
    // A non-JSON error response still receives a stable, typed shape.
  }

  return new ApiError(response.status, payload);
}
