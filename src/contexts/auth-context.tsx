"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { authService, AuthSessionData, LoginCredentials, RegisterData } from "@/src/services/auth-service";
import { ApiSuccessData, LaravelResponse, apiClient } from "@/src/services/api-client";
import { canAccessAdmin } from "@/src/lib/admin-access";

interface AuthContextValue {
  user: AuthSessionData["user"] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  adminRole: "super_admin" | "moderator" | null;
  permissions: Record<string, boolean> | null;
  isSuperAdmin: boolean;
  isModerator: boolean;
  can: (permission: string) => boolean;
  login: (credentials: LoginCredentials) => Promise<LaravelResponse<AuthSessionData>>;
  register: (data: RegisterData) => Promise<LaravelResponse<unknown>>;
  verifyEmail: (email: string, code: string) => Promise<LaravelResponse<{ message?: string }>>;
  resendVerificationCode: (email: string) => Promise<LaravelResponse<{ message: string; expiresInMinutes?: number }>>;
  refreshProfile: () => Promise<AuthSessionData["user"] | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type GeneratedProfileData = ApiSuccessData<"/users/me/profile", "get">;

function normalizeRole(value: unknown): AuthSessionData["user"]["role"] {
  const role = String(value ?? "").trim().toLowerCase().replace(/[\s-]+/g, "_");
  if (role === "super_admin" || role === "superadmin") return "super_admin";
  if (role === "moderator") return "moderator";
  if (role === "admin") return "admin";
  // Registration creates student accounts; APIs may label regular accounts as "user".
  return "student";
}

function normalizeUser(user: AuthSessionData["user"]): AuthSessionData["user"] {
  const backendUser = user as AuthSessionData["user"] & {
    full_name?: string;
    student_id?: string | null;
    avatar_url?: string | null;
    email_verified?: boolean;
    email_verified_at?: string | null;
    admin_role?: string | null;
    permissions?: Record<string, boolean> | null;
  };
  return {
    ...user,
    id: String(user.id),
    name: backendUser.name || backendUser.full_name || "",
    role: normalizeRole(backendUser.admin_role || user.role),
    studentId: backendUser.studentId || backendUser.student_id || undefined,
    avatarUrl: backendUser.avatarUrl || backendUser.avatar_url || undefined,
    emailVerified: backendUser.emailVerified ?? backendUser.email_verified ?? Boolean(backendUser.email_verified_at),
    adminRole: backendUser.admin_role === "super_admin" || backendUser.admin_role === "moderator"
      ? backendUser.admin_role
      : (apiClient.isUsingMock() && user.role === "admin" ? "super_admin"
        : apiClient.isUsingMock() && (user.role === "super_admin" || user.role === "moderator") ? user.role : null),
    permissions: backendUser.permissions ?? null,
  };
}

function unwrapUser(result: unknown): AuthSessionData["user"] | null {
  if (!result || typeof result !== "object" || Array.isArray(result)) return null;
  const candidate = "user" in result ? result.user : result;
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return null;
  return normalizeUser(candidate as AuthSessionData["user"]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthSessionData["user"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const authEpochRef = useRef(0);

  useEffect(() => {
    let active = true;
    const initialAuthEpoch = authEpochRef.current;
    const finish = (nextUser: AuthSessionData["user"] | null) => {
      // Ignore an initial profile response if login/logout has since changed auth state.
      if (!active || authEpochRef.current !== initialAuthEpoch) return;
      const normalizedUser = nextUser ? normalizeUser(nextUser) : null;
      authService.cacheCurrentUser(normalizedUser);
      setUser(normalizedUser);
      setIsLoading(false);
    };

    if (apiClient.isUsingMock()) {
      const activeUser = authService.getCurrentUser();
      finish(activeUser && authService.isAuthenticated() ? activeUser : null);
    } else {
      void apiClient.get<GeneratedProfileData>("/users/me/profile")
        .then((response) => {
          if (response.status === 401) {
            finish(null);
            return;
          }

          const freshUser = unwrapUser(response.data);
          finish(freshUser);
        })
        .catch(() => finish(null));
    }

    const onUnauthorized = () => {
      if (authEpochRef.current === initialAuthEpoch) finish(null);
    };
    const onProfileChange = () => { if(active)setUser(authService.getCurrentUser()); };
    window.addEventListener("unimeta_auth_change", onProfileChange);
    window.addEventListener("unimeta_auth_unauthorized", onUnauthorized);
    return () => {
      active = false;
      window.removeEventListener("unimeta_auth_unauthorized", onUnauthorized);
      window.removeEventListener("unimeta_auth_change", onProfileChange);
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const authEpoch = ++authEpochRef.current;
    setIsLoading(true);
    const response = await authService.login(credentials);
    if (authEpoch === authEpochRef.current && !response.errors && response.data?.user && response.data.token) {
      if (apiClient.isUsingMock()) {
        const normalizedUser = normalizeUser(response.data.user);
        authService.cacheCurrentUser(normalizedUser);
        setUser(normalizedUser);
        setIsLoading(false);
        return { ...response, data: { ...response.data, user: normalizedUser } };
      }

      const profile = await apiClient.get<GeneratedProfileData>("/users/me/profile");
      const freshUser = unwrapUser(profile.data);
      if (authEpoch !== authEpochRef.current) return response;
      if (profile.errors || !freshUser) {
        authService.cacheCurrentUser(null);
        setUser(null);
        setIsLoading(false);
        return { ...response, data: null, errors: profile.errors ?? { profile: [profile.message] }, message: profile.message };
      }
      authService.cacheCurrentUser(freshUser);
      setUser(freshUser);
      setIsLoading(false);
      return { ...response, data: { ...response.data, user: freshUser } };
    }
    if (authEpoch === authEpochRef.current) setIsLoading(false);
    return response;
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    return authService.register(data);
  }, []);

  const verifyEmail = useCallback(async (email: string, code: string) => {
    return authService.verifyEmail(email, code);
  }, []);

  const resendVerificationCode = useCallback(async (email: string) => {
    return authService.resendVerificationCode(email);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (apiClient.isUsingMock()) return null;
    const response = await apiClient.get<GeneratedProfileData>("/users/me/profile");
    const freshUser = unwrapUser(response.data);
    if (response.errors || !freshUser) {
      if (response.status === 401) {
        authService.cacheCurrentUser(null);
        setUser(null);
      }
      return null;
    }
    authService.cacheCurrentUser(freshUser);
    setUser(freshUser);
    return freshUser;
  }, []);

  const adminRole = user?.adminRole ?? null;
  const permissions = user?.permissions ?? null;
  const isSuperAdmin = adminRole === "super_admin";
  const isModerator = adminRole === "moderator";
  const can = useCallback((permission: string) => canAccessAdmin(adminRole, permissions, permission), [adminRole, permissions]);

  const logout = useCallback(async () => {
    authEpochRef.current += 1;
    await authService.logout();
    authService.cacheCurrentUser(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        adminRole,
        permissions,
        isSuperAdmin,
        isModerator,
        can,
        login,
        register,
        verifyEmail,
        resendVerificationCode,
        refreshProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
