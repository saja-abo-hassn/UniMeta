import { apiClient, LaravelResponse, API_CONFIG } from "./api-client";
import { getStoredUsers } from "./mock-backend/mock-users";

export interface LoginCredentials {
  identifier: string; // University email or Student ID
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  studentId?: string;
  faculty?: string;
  agreedToTerms?: boolean;
}

export interface AuthSessionData {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    studentId?: string;
    faculty?: string;
    role: "student" | "admin" | "super_admin" | "moderator";
    adminRole?: "super_admin" | "moderator" | null;
    title?: string | null;
    avatarUrl?: string | null;
    emailVerified?: boolean;
    permissions?: Record<string, boolean> | null;
  };
  requiresVerification?: boolean;
}

export interface PasswordResetData {
  email: string;
  token: string;
  password: string;
}

class AuthService {
  /**
   * Login user with identifier (email or studentId) and password
   */
  async login(credentials: LoginCredentials): Promise<LaravelResponse<AuthSessionData>> {
    // If live Laravel API is configured:
    if (!apiClient.isUsingMock()) {
      return apiClient.post<AuthSessionData>("/auth/login", {
        identifier: credentials.identifier,
        password: credentials.password,
      });
    }

    // Mock Backend Handler:
    await new Promise((res) => setTimeout(res, 250)); // simulate brief network latency

    const idClean = credentials.identifier.trim().toLowerCase();
    const users = getStoredUsers();

    const matchedUser = users.find(
      (u) =>
        u.email.toLowerCase() === idClean ||
        (u.studentId && u.studentId.trim().toLowerCase() === idClean)
    );

    if (!matchedUser) {
      return apiClient.createErrorResponse<AuthSessionData>(
        "البريد الإلكتروني أو الرقم الجامعي غير مسجل.",
        { identifier: ["لم يتم العثور على حساب مطابق للبيانات المدخلة."] }
      );
    }

    // Verify password (matches user.password or standard demo123 fallback)
    const expectedPassword = matchedUser.password || "password123";
    if (credentials.password !== expectedPassword && credentials.password !== "demo123") {
      return apiClient.createErrorResponse<AuthSessionData>(
        "كلمة المرور غير صحيحة.",
        { password: ["كلمة المرور المدخلة غير صحيحة، يرجى المحاولة مجدداً."] }
      );
    }

    // Rule 1 & 7: Check if email is verified
    if (matchedUser.emailVerified === false) {
      return apiClient.createErrorResponse<AuthSessionData>(
        "هذا الحساب غير مؤكّد. استخدم إعادة إرسال الرمز من صفحة تأكيد البريد بعد تشغيل خدمة البريد.",
        { requiresVerification: ["يلزم تأكيد البريد الإلكتروني قبل تسجيل الدخول."] },
        {
          token: "",
          user: {
            id: matchedUser.id,
            name: matchedUser.name,
            email: matchedUser.email,
            studentId: matchedUser.studentId,
            faculty: matchedUser.faculty,
            role: matchedUser.role,
            emailVerified: false,
          },
          requiresVerification: true,
        }
      );
    }

    let moderatorsList: Array<{
      email: string;
      role: "super_admin" | "moderator";
      status: string;
      title?: string;
      permissions?: Record<string, boolean>;
      assignedDepartment?: string;
    }> = [];
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("unimeta_admin_moderators_v1");
        if (raw) moderatorsList = JSON.parse(raw);
      } catch {
        // ignore
      }
    }
    const matchedMod = moderatorsList.find((m) => m.email.toLowerCase() === idClean);
    if (matchedMod) {
      if (matchedMod.status === "دعوة معلّقة") {
        return apiClient.createErrorResponse<AuthSessionData>(
          "حساب المشرف غير مفعّل بعد. يرجى تفعيل حسابك من رابط الدعوة أولاً.",
          { status: ["الحساب بانتظار قبول الدعوة."] }
        );
      }
      if (matchedMod.status === "معطل") {
        return apiClient.createErrorResponse<AuthSessionData>(
          "تم تعطيل حساب المشرف من قِبل الإدارة. يرجى التواصل مع المسؤول العام.",
          { status: ["الحساب معطل."] }
        );
      }
    }

    const sessionData: AuthSessionData = {
      token: `1|laravel_sanctum_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      user: {
        id: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
        studentId: matchedUser.studentId,
        faculty: matchedMod?.assignedDepartment || matchedUser.faculty,
        role: matchedMod ? matchedMod.role : matchedUser.role,
        title: matchedMod?.title || null,
        emailVerified: true,
      },
    };

    if (matchedMod && typeof window !== "undefined") {
      try {
        localStorage.setItem("unimeta_admin_role_v1", matchedMod.role);
      } catch {
        // ignore
      }
    }

    // Save session in local storage
    await this.saveSession(sessionData);

    return apiClient.createSuccessResponse(sessionData, "تم تسجيل الدخول بنجاح! مرحباً بك في UniMeta.");
  }

  /**
   * Register a new student account (emailVerified starts as false)
   */
  async register(data: RegisterData): Promise<LaravelResponse<unknown>> {
    // If live Laravel API is configured:
    if (!apiClient.isUsingMock()) {
      return apiClient.post<unknown>("/auth/register", {
        full_name: data.fullName.trim(),
        email: data.email.trim(),
        password: data.password,
        student_id: data.studentId?.trim() || null,
        faculty: data.faculty || null,
      });
    }

    return {
      ...apiClient.createErrorResponse<unknown>(
        "التسجيل يتطلب خادمًا فعليًا لإرسال رمز التحقق. أوقف وضع العرض التجريبي واضبط خدمة الـ API والبريد.",
        { configuration: ["التسجيل بالبريد غير متاح في وضع العرض التجريبي."] }
      ),
      status: 503,
    };
  }

  /**
   * Verify email with 6-digit code and automatically log in
   */
  async verifyEmail(email: string, code: string): Promise<LaravelResponse<{ message?: string }>> {
    if (!apiClient.isUsingMock()) {
      return apiClient.post<{ message?: string }>("/auth/verify-email", { email, code });
    }
    return {
      ...apiClient.createErrorResponse<{ message?: string }>(
        "لا يمكن تأكيد البريد في وضع العرض التجريبي. شغّل خادم الـ API وخدمة البريد أولاً.",
        { configuration: ["تأكيد البريد غير متاح في وضع العرض التجريبي."] }
      ),
      status: 503,
    };
  }

  /**
   * Resend a verification code with 1-hour rate limiting
   */
  async resendVerificationCode(email: string): Promise<LaravelResponse<{ message: string; expiresInMinutes?: number }>> {
    if (!apiClient.isUsingMock()) {
      return apiClient.post<{ message: string; expiresInMinutes?: number }>("/auth/email/resend-verification", { email });
    }
    return {
      ...apiClient.createErrorResponse<{ message: string }>(
        "إعادة إرسال الرمز تتطلب خادمًا فعليًا لخدمة البريد.",
        { configuration: ["خدمة البريد غير متاحة في وضع العرض التجريبي."] }
      ),
      status: 503,
    };
  }

  async requestPasswordReset(email: string): Promise<LaravelResponse<{ message: string }>> {
    if (!apiClient.isUsingMock()) {
      return apiClient.post<{ message: string }>("/auth/forgot-password", { email });
    }
    return {
      ...apiClient.createErrorResponse<{ message: string }>(
        "استعادة كلمة المرور تتطلب خادمًا فعليًا وخدمة بريد مهيأة.",
        { configuration: ["استعادة كلمة المرور غير متاحة في وضع العرض التجريبي."] }
      ),
      status: 503,
    };
  }

  async resetPassword(data: PasswordResetData): Promise<LaravelResponse<{ message: string }>> {
    if (!apiClient.isUsingMock()) {
      return apiClient.post<{ message: string }>("/auth/reset-password", data);
    }
    return {
      ...apiClient.createErrorResponse<{ message: string }>(
        "تغيير كلمة المرور يتطلب خادمًا فعليًا للتحقق من رابط الاستعادة.",
        { configuration: ["استعادة كلمة المرور غير متاحة في وضع العرض التجريبي."] }
      ),
      status: 503,
    };
  }

  /**
   * Logout user and clear session
   */
  async logout(): Promise<LaravelResponse<null>> {
    if (!apiClient.isUsingMock()) {
      const response = await apiClient.post("/auth/logout");
      if (response.errors || (response.status !== undefined && response.status >= 400)) {
        throw new Error(response.message);
      }
    }

    if (apiClient.isUsingMock() && typeof window !== "undefined") {
      try {
        await fetch("/api/mock-session", { method: "DELETE" });
        sessionStorage.removeItem("unimeta_mock_authenticated");
      } catch {
        // ignore
      }
    }

    apiClient.removeToken();
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(API_CONFIG.storageKeys.user);
        localStorage.removeItem(API_CONFIG.storageKeys.token);
        sessionStorage.setItem("unimeta_logged_out", "true");
        document.cookie = "unimeta_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
        window.dispatchEvent(new Event("unimeta_auth_change"));
      } catch {
        // ignore
      }
    }
    return apiClient.createSuccessResponse(null, "تم تسجيل الخروج بنجاح.");
  }

  /**
   * Save session to storage
   */
  public async saveSession(session: AuthSessionData): Promise<void> {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(API_CONFIG.storageKeys.user, JSON.stringify(session.user));
      sessionStorage.removeItem("unimeta_logged_out");
      if (apiClient.isUsingMock()) {
        const response = await fetch("/api/mock-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: session.token }),
        });
        if (response.ok) sessionStorage.setItem("unimeta_mock_authenticated", "true");
      }
    } catch {
      // ignore
    }
  }

  /**
   * Get current session user
   */
  public getCurrentUser(): AuthSessionData["user"] | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(API_CONFIG.storageKeys.user);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return null;
  }

  public updateCurrentUser(updates: Partial<AuthSessionData["user"]>): AuthSessionData["user"] | null {
    if (typeof window === "undefined") return null;
    try {
      const current = this.getCurrentUser();
      const updated = {
        id: current?.id || "admin-1",
        name: updates.name || current?.name || "مسؤول النظام",
        email: updates.email || current?.email || "admin@unimeta.edu.ps",
        role: updates.role || current?.role || "admin",
        title: updates.title !== undefined ? updates.title : current?.title,
        avatarUrl: updates.avatarUrl !== undefined ? updates.avatarUrl : current?.avatarUrl,
        ...current,
        ...updates,
      };
      localStorage.setItem(API_CONFIG.storageKeys.user, JSON.stringify(updated));
      window.dispatchEvent(new Event("unimeta_auth_change"));
      window.dispatchEvent(new Event("storage"));
      return updated;
    } catch {
      return null;
    }
  }

  public cacheCurrentUser(user: AuthSessionData["user"] | null): void {
    if (typeof window === "undefined") return;
    try {
      if (user) localStorage.setItem(API_CONFIG.storageKeys.user, JSON.stringify(user));
      else localStorage.removeItem(API_CONFIG.storageKeys.user);
    } catch {
      // ignore
    }
  }

  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    if (!this.getCurrentUser()) return false;
    return !apiClient.isUsingMock() || (
      typeof window !== "undefined" && sessionStorage.getItem("unimeta_mock_authenticated") === "true"
    );
  }
}

export const authService = new AuthService();
