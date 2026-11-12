import { apiClient, LaravelResponse, API_CONFIG } from "./api-client";
import {
  getStoredUsers,
  saveNewUser,
  MockUser,
  markUserEmailVerified,
  findUserByEmailOrId,
} from "./mock-backend/mock-users";
import { verificationService } from "./verification-service";

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
    title?: string | null;
    avatarUrl?: string | null;
    emailVerified?: boolean;
  };
  requiresVerification?: boolean;
}

class AuthService {
  /**
   * Login user with identifier (email or studentId) and password
   */
  async login(credentials: LoginCredentials): Promise<LaravelResponse<AuthSessionData>> {
    // If live Laravel API is configured:
    if (!apiClient.isUsingMock()) {
      return apiClient.post<AuthSessionData>("/login", {
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
      // Trigger new verification code if expired or existing
      await verificationService.createAndSendCode(matchedUser.email, matchedUser.name);

      return apiClient.createErrorResponse<AuthSessionData>(
        "حسابك غير مؤكّد بعد. يرجى إدخال رمز التحقق المرسل لبريدك الإلكتروني لتفعيل الحساب.",
        { requiresVerification: ["يرجى إدخال رمز التحقق لتأكيد البريد."] },
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
        role: (matchedMod ? matchedMod.role : matchedUser.role) as any,
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
  async register(data: RegisterData): Promise<LaravelResponse<AuthSessionData>> {
    // If live Laravel API is configured:
    if (!apiClient.isUsingMock()) {
      return apiClient.post<AuthSessionData>("/register", data);
    }

    // Mock Backend Handler:
    await new Promise((res) => setTimeout(res, 300)); // simulate brief network latency

    const emailClean = data.email.trim().toLowerCase();
    const users = getStoredUsers();

    // Check duplicate email
    const exists = users.some((u) => u.email.toLowerCase() === emailClean);
    if (exists) {
      return apiClient.createErrorResponse<AuthSessionData>(
        "البريد الإلكتروني مسجل مسبقاً في النظام.",
        { email: ["البريد الإلكتروني مستخدم بالفعل، يرجى تسجيل الدخول أو اختيار بريد آخر."] }
      );
    }

    // 1. Create account with emailVerified = false
    const newUser: MockUser = {
      id: `usr-${Date.now()}`,
      name: data.fullName.trim(),
      email: emailClean,
      studentId: data.studentId?.trim() || `2024${Math.floor(1000 + Math.random() * 9000)}`,
      faculty: data.faculty || "كلية الهندسة وتكنولوجيا المعلومات",
      password: data.password,
      role: "student",
      createdAt: new Date().toISOString().split("T")[0],
      emailVerified: false,
    };

    saveNewUser(newUser);

    // 2. Generate and dispatch secure 6-digit verification code via mailService
    await verificationService.createAndSendCode(newUser.email, newUser.name);

    // Notice: Do NOT call this.saveSession! Access to dashboard is locked until verification.
    return apiClient.createSuccessResponse(
      {
        token: "",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          studentId: newUser.studentId,
          faculty: newUser.faculty,
          role: newUser.role,
          emailVerified: false,
        },
        requiresVerification: true,
      },
      "تم إنشاء الحساب بنجاح! تم إرسال رمز التحقق إلى بريدك الإلكتروني لتفعيل الحساب."
    );
  }

  /**
   * Verify email with 6-digit code and automatically log in
   */
  async verifyEmailAndLogin(email: string, code: string): Promise<LaravelResponse<AuthSessionData>> {
    if (!apiClient.isUsingMock()) {
      return apiClient.post<AuthSessionData>("/verify-email", { email, code });
    }
    const cleanEmail = email.toLowerCase().trim();
    const verification = await verificationService.verifyCode(cleanEmail, code);

    if (!verification.success) {
      return apiClient.createErrorResponse<AuthSessionData>(
        verification.error || "رمز التحقق غير صحيح أو منتهي الصلاحية.",
        { code: [verification.error || "رمز التحقق غير صحيح."] }
      );
    }

    // Mark user emailVerified = true in storage
    markUserEmailVerified(cleanEmail);

    const user = findUserByEmailOrId(cleanEmail);
    if (!user) {
      return apiClient.createErrorResponse<AuthSessionData>("لم يتم العثور على الحساب.");
    }

    const sessionData: AuthSessionData = {
      token: `1|laravel_sanctum_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        faculty: user.faculty,
        role: user.role,
        emailVerified: true,
      },
    };

    // Save active session token and user
    await this.saveSession(sessionData);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("unimeta_auth_change"));
    }

    return apiClient.createSuccessResponse(
      sessionData,
      "تم تأكيد بريدك الإلكتروني بنجاح! مرحباً بك في UniMeta."
    );
  }

  /**
   * Resend a verification code with 1-hour rate limiting
   */
  async resendVerificationCode(email: string): Promise<LaravelResponse<{ message: string; expiresInMinutes?: number }>> {
    if (!apiClient.isUsingMock()) {
      return apiClient.post<{ message: string; expiresInMinutes?: number }>("/email/resend-verification", { email });
    }
    const cleanEmail = email.toLowerCase().trim();
    const user = findUserByEmailOrId(cleanEmail);
    const result = await verificationService.createAndSendCode(cleanEmail, user?.name);

    if (!result.success) {
      return apiClient.createErrorResponse<{ message: string }>(
        result.error || "تعذر إعادة إرسال الرمز حالياً.",
        { resend: [result.error || "تعذر إعادة الإرسال."] }
      );
    }

    return apiClient.createSuccessResponse(
      { message: result.message, expiresInMinutes: result.expiresInMinutes },
      result.message
    );
  }

  /**
   * Logout user and clear session
   */
  async logout(): Promise<LaravelResponse<null>> {
    if (!apiClient.isUsingMock()) {
      try {
        await apiClient.post("/logout");
      } catch {
        // ignore
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
