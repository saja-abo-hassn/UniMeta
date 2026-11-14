/**
 * UniMeta Unified API Client
 *
 * Implements standard Laravel API Response formatting:
 * {
 *   data: T | null,
 *   message: string,
 *   errors: Record<string, string[]> | null
 * }
 *
 * Live requests go through the same-origin Next.js BFF. Configure its server-only
 * BACKEND_API_URL with /api/v1. Demo mode is explicitly opt-in.
 */

export interface LaravelResponse<T = any> {
  data: T | null;
  message: string;
  errors: Record<string, string[]> | null;
  status?: number;
  meta?: { current_page?: number; last_page?: number; [key: string]: unknown };
  code?: string;
}

export const API_CONFIG = {
  maxUploadMb: Math.max(1, Math.min(20, Number(process.env.NEXT_PUBLIC_LIBRARY_MAX_MB) || 20)),
  useMock: process.env.NEXT_PUBLIC_USE_MOCK === "true",
  baseUrl:
    process.env.NEXT_PUBLIC_USE_MOCK !== "true"
      ? "/api/backend"
      : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  storageKeys: {
    token: "unimeta_auth_token_v1",
    user: "unimeta_auth_user_v1",
    registeredUsers: "unimeta_registered_users_v1",
    studyPlans: "unimeta_study_plans_v1",
    materials: "unimeta_materials_v1",
    notifications: "unimeta_notifications_v1",
  },
};

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
  }

  public getToken(): string | null {
    return null;
  }

  public removeToken(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(API_CONFIG.storageKeys.token);
      localStorage.removeItem(API_CONFIG.storageKeys.user);
    } catch {
      // ignore
    }
  }

  public isUsingMock(): boolean {
    return API_CONFIG.useMock;
  }

  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  private async request<T>(endpoint: string, init: RequestInit): Promise<LaravelResponse<T>> {
    try {
      const headers = new Headers({ ...this.getHeaders(), ...init.headers });
      if (init.body instanceof FormData) headers.delete("Content-Type");
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...init,
        headers,
        credentials: "same-origin",
      });
      let payload: Partial<LaravelResponse<T>> = {};
      try {
        payload = await response.json();
      } catch {
        payload = {};
      }
      if (response.ok) {
        return {
          data: payload.data ?? null,
          message: payload.message || "تمت العملية بنجاح.",
          errors: payload.errors ?? null,
          status: response.status,
          meta: payload.meta,
        };
      }

      const messages: Record<number, string> = {
        401: "انتهت الجلسة أو يلزم تسجيل الدخول.",
        403: "ليس لديك إذن لتنفيذ هذا الإجراء.",
        422: "يرجى مراجعة البيانات المدخلة.",
        429: "طلبات كثيرة خلال وقت قصير. حاول مجدداً بعد قليل.",
      };
      if (response.status === 401 && typeof window !== "undefined") {
        this.removeToken();
        window.dispatchEvent(new Event("unimeta_auth_unauthorized"));
      }
      return {
        data: payload.data ?? null,
        message: payload.message || messages[response.status] || "تعذر إتمام الطلب.",
        errors: payload.errors ?? { http: [String(response.status)] },
        status: response.status,
        code: payload.code,
      };
    } catch {
      return {
        data: null,
        message: "تعذر الاتصال بالخادم. تحقق من الاتصال وحاول مجدداً.",
        errors: { network: ["تعذر الاتصال بخادم الـ API"] },
      };
    }
  }

  /**
   * Standard GET request
   */
  public async get<T = any>(endpoint: string): Promise<LaravelResponse<T>> {
    if (this.isUsingMock()) {
      throw new Error(`Mock handler not implemented for GET ${endpoint}`);
    }

    return this.request<T>(endpoint, { method: "GET" });
  }

  /**
   * Standard POST request
   */
  public async post<T = any>(endpoint: string, body?: any): Promise<LaravelResponse<T>> {
    if (this.isUsingMock()) {
      throw new Error(`Mock handler not implemented for POST ${endpoint}`);
    }

    return this.request<T>(endpoint, { method: "POST", body: body ? JSON.stringify(body) : undefined });
  }

  public async patch<T = any>(endpoint: string, body?: any): Promise<LaravelResponse<T>> {
    if (this.isUsingMock()) {
      throw new Error(`Mock handler not implemented for PATCH ${endpoint}`);
    }

    return this.request<T>(endpoint, { method: "PATCH", body: body ? JSON.stringify(body) : undefined });
  }

  public async put<T = any>(endpoint: string, body?: unknown): Promise<LaravelResponse<T>> {
    return this.request<T>(endpoint, { method: "PUT", body: JSON.stringify(body) });
  }

  public async upload<T = unknown>(endpoint: string, body: FormData): Promise<LaravelResponse<T>> {
    for (const value of body.values()) {
      if (typeof value !== "string" && value.size > API_CONFIG.maxUploadMb * 1024 * 1024) {
        const message = `حجم الملف يتجاوز الحد المتاح (${API_CONFIG.maxUploadMb} MB).`;
        return { data: null, errors: { file: [message] }, message, status: 413 };
      }
    }
    return this.request<T>(endpoint, { method: "POST", body,
      headers: { "Content-Type": "" } });
  }

  public async all<T>(endpoint: string): Promise<LaravelResponse<T[]>> {
    const items: T[] = [];
    for (let page = 1; ; page++) {
      const response = await this.get<T[]>(`${endpoint}${endpoint.includes("?") ? "&" : "?"}page=${page}${/[?&]per_page=/.test(endpoint)?"":"&per_page=100"}`);
      if (response.errors || !Array.isArray(response.data)) return { ...response, data: null };
      items.push(...response.data);
      if (page >= (response.meta?.last_page ?? 1)) return { ...response, data: items };
    }
  }

  public async delete<T = any>(endpoint: string): Promise<LaravelResponse<T>> {
    if (this.isUsingMock()) {
      throw new Error(`Mock handler not implemented for DELETE ${endpoint}`);
    }

    return this.request<T>(endpoint, { method: "DELETE" });
  }

  /**
   * Helper to format mock responses matching Laravel standard
   */
  public createSuccessResponse<T>(data: T, message: string = "تمت العملية بنجاح"): LaravelResponse<T> {
    return {
      data,
      message,
      errors: null,
    };
  }

  public createErrorResponse<T = null>(
    message: string = "حدث خطأ أثناء معالجة الطلب",
    errors: Record<string, string[]> | null = null,
    data: T | null = null
  ): LaravelResponse<T> {
    return {
      data,
      message,
      errors,
    };
  }
}

export const apiClient = new ApiClient();

