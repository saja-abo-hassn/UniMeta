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
 * When the Laravel Backend is ready:
 * Simply configure NEXT_PUBLIC_API_URL and NEXT_PUBLIC_USE_MOCK=false in your environment variables.
 * The entire UI interacts solely with this client and services layer without needing any UI changes.
 */

export interface LaravelResponse<T = any> {
  data: T | null;
  message: string;
  errors: Record<string, string[]> | null;
  status?: number;
}

export const API_CONFIG = {
  useMock: process.env.NEXT_PUBLIC_USE_MOCK !== "false", // defaults to true during local/staging
  baseUrl:
    process.env.NEXT_PUBLIC_USE_MOCK === "false"
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
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...init,
        headers: { ...this.getHeaders(), ...init.headers },
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

