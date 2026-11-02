import { ApiError } from "@/src/lib/api/errors";
import type { ApiEnvelope, ApiRequestOptions, ApiTransport } from "@/src/lib/api/types";
import { mockStudent } from "./data";

type MockHandler = (options: ApiRequestOptions) => unknown | Promise<unknown>;

const handlers: Record<string, MockHandler> = {
  "GET /students/me": () => mockStudent,
};

export const mockTransport: ApiTransport = {
  async request<TData, TBody = unknown>(
    path: string,
    options: ApiRequestOptions<TBody> = {},
  ): Promise<ApiEnvelope<TData>> {
    if (options.signal?.aborted) throw new DOMException("The request was aborted.", "AbortError");

    const method = options.method ?? "GET";
    const normalizedPath = path.replace(/^\/api(?=\/|$)/, "").replace(/^\/+/, "");
    const handler = handlers[`${method} ${normalizedPath}`];

    if (!handler) {
      throw new ApiError(404, {
        data: null,
        meta: null,
        errors: [{ code: "MOCK_ROUTE_NOT_FOUND", message: `No mock is registered for ${method} /${normalizedPath}.` }],
      });
    }

    return {
      data: (await handler(options)) as TData,
      meta: null,
      errors: null,
    };
  },
};
