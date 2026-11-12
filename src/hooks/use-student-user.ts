"use client";

import { useState, useEffect } from "react";
import { authService, AuthSessionData } from "@/src/services/auth-service";

export interface StudentUserState {
  user: AuthSessionData["user"] | null;
  firstName: string | null;
  fullName: string | null;
  studentId: string | null;
  faculty: string | null;
  greeting: string;
  isLoading: boolean;
}

/**
 * Reactive hook to get the currently logged-in student user from the auth store/session.
 * Reacts immediately to login, register, and profile updates across components without reload.
 */
export function useStudentUser(): StudentUserState {
  const [user, setUser] = useState<AuthSessionData["user"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      try {
        const u = authService.getCurrentUser();
        setUser(u);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();

    // Event listeners for cross-component and cross-tab reactivity
    const handleAuthChange = () => {
      loadUser();
    };

    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("unimeta_auth_change", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("unimeta_auth_change", handleAuthChange);
    };
  }, []);

  const fullName = user?.name?.trim() || null;
  const firstName = fullName ? fullName.split(/\s+/)[0] : null;

  // Requirement: "أهلاً {firstName}". If not available, "أهلاً بك". No hardcoded names.
  const greeting = firstName ? `أهلاً ${firstName}` : "أهلاً بك";

  return {
    user,
    firstName,
    fullName,
    studentId: user?.studentId || null,
    faculty: user?.faculty || null,
    greeting,
    isLoading,
  };
}

