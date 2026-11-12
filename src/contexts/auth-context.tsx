"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService, AuthSessionData, LoginCredentials, RegisterData } from "@/src/services/auth-service";
import { LaravelResponse } from "@/src/services/api-client";
import { apiClient } from "@/src/services/api-client";

interface AuthContextValue {
  user: AuthSessionData["user"] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<LaravelResponse<AuthSessionData>>;
  register: (data: RegisterData) => Promise<LaravelResponse<AuthSessionData>>;
  verifyEmailAndLogin: (email: string, code: string) => Promise<LaravelResponse<AuthSessionData>>;
  resendVerificationCode: (email: string) => Promise<LaravelResponse<{ message: string; expiresInMinutes?: number }>>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthSessionData["user"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const finish = (nextUser: AuthSessionData["user"] | null) => {
      if (!active) return;
      authService.cacheCurrentUser(nextUser);
      setUser(nextUser);
      setIsLoading(false);
    };
    if (apiClient.isUsingMock()) {
      const activeUser = authService.getCurrentUser();
      finish(activeUser && authService.isAuthenticated() ? activeUser : null);
    } else {
      void apiClient.get<AuthSessionData["user"] | { user: AuthSessionData["user"] }>("/me")
        .then((response) => {
          const result = response.data;
          finish(result && "user" in result ? result.user : result);
        })
        .catch(() => finish(null));
    }
    const onUnauthorized = () => finish(null);
    window.addEventListener("unimeta_auth_unauthorized", onUnauthorized);
    return () => {
      active = false;
      window.removeEventListener("unimeta_auth_unauthorized", onUnauthorized);
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    if (response.data?.user) {
      authService.cacheCurrentUser(response.data.user);
      setUser(response.data.user);
    }
    return response;
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const response = await authService.register(data);
    if (response.data?.user && !response.data?.requiresVerification) {
      authService.cacheCurrentUser(response.data.user);
      setUser(response.data.user);
    }
    return response;
  }, []);

  const verifyEmailAndLogin = useCallback(async (email: string, code: string) => {
    const response = await authService.verifyEmailAndLogin(email, code);
    if (response.data?.user) {
      authService.cacheCurrentUser(response.data.user);
      setUser(response.data.user);
    }
    return response;
  }, []);

  const resendVerificationCode = useCallback(async (email: string) => {
    return authService.resendVerificationCode(email);
  }, []);

  const logout = useCallback(async () => {
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
        login,
        register,
        verifyEmailAndLogin,
        resendVerificationCode,
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

