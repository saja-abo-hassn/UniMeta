export type ApiMeta = {
  currentPage?: number;
  lastPage?: number;
  perPage?: number;
  total?: number;
  [key: string]: unknown;
};

export type ApiEnvelope<TData> = {
  data: TData;
  meta: ApiMeta | null;
  errors: null;
};

export type ApiIssue = {
  code?: string;
  message: string;
  field?: string;
};

export type ApiErrorPayload = {
  data: unknown | null;
  meta: ApiMeta | null;
  errors: Record<string, string[]> | ApiIssue[] | null;
};

export type ApiRequestOptions<TBody = unknown> = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: TBody;
  headers?: HeadersInit;
  signal?: AbortSignal;
};

export type ApiTransport = {
  request<TData, TBody = unknown>(
    path: string,
    options?: ApiRequestOptions<TBody>,
  ): Promise<ApiEnvelope<TData>>;
};

export type ApiStatus = 401 | 403 | 404 | 409 | 422;
