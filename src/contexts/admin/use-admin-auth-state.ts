"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { AdminRole, AdminPermission, ModeratorUser, AdminNotification } from "@/src/types/admin";
import { initialModerators, initialNotificationsList } from "@/src/data/mock-admin-data";
import { authService } from "@/src/services/auth-service";

export function useAdminAuthState() {
  const [currentUserRole, setCurrentUserRole] = useState<AdminRole>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("unimeta_admin_role_v1");
        if (stored === "super_admin" || stored === "moderator") return stored;
      } catch {
        // ignore
      }
    }
    return "super_admin";
  });

  const [authProfileTick, setAuthProfileTick] = useState(0);

  useEffect(() => {
    const handleAuthChange = () => {
      setAuthProfileTick((t) => t + 1);
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("unimeta_admin_role_v1");
        if (stored === "super_admin" || stored === "moderator") {
          setCurrentUserRole(stored);
        }
      }
    };

    window.addEventListener("unimeta_auth_change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("unimeta_auth_change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  const [moderators, setModerators] = useState<ModeratorUser[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("unimeta_admin_moderators_v1");
        if (stored) return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return initialModerators;
  });

  const [notifications, setNotifications] = useState<AdminNotification[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("unimeta_admin_notifications_v1");
        if (stored) return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return initialNotificationsList;
  });

  const currentUser = useMemo<ModeratorUser>(() => {
    void authProfileTick;
    const authUser = authService.getCurrentUser();
    const effectiveRole: AdminRole =
      authUser?.role === "moderator"
        ? "moderator"
        : authUser?.role === "admin" || authUser?.role === "super_admin"
        ? "super_admin"
        : currentUserRole;

    const baseName =
      authUser?.name ||
      (effectiveRole === "super_admin" ? "المسؤول العام" : "مشرف النظام");

    const baseTitle =
      authUser?.title ||
      (effectiveRole === "super_admin" ? "المسؤول العام" : "مشرف");

    return {
      id: authUser?.id || "adm-current",
      name: baseName,
      email: authUser?.email || "admin@unimeta.edu.ps",
      role: effectiveRole,
      title: baseTitle,
      avatarUrl: authUser?.avatarUrl || null,
      avatar: authUser?.avatarUrl || undefined,
      assignedDepartment:
        authUser?.faculty ||
        (effectiveRole === "super_admin" ? "إدارة النظام والعمليات" : "الإشراف الأكاديمي والمحتوى"),
      status: "نشط",
      createdAt: "2026-01-01",
      permissions: {
        manage_content: true,
        manage_agreements: true,
        manage_exams: true,
        manage_finances: effectiveRole === "super_admin",
        manage_reports: true,
        manage_members: true,
        manage_moderators: effectiveRole === "super_admin",
        manage_settings: effectiveRole === "super_admin",
      },
    };
  }, [authProfileTick, currentUserRole]);

  const updateAdminProfile = useCallback(
    (updates: { name?: string; title?: string | null; avatarUrl?: string | null }) => {
      authService.updateCurrentUser({
        name: updates.name,
        title: updates.title,
        avatarUrl: updates.avatarUrl,
      });
      setAuthProfileTick((t) => t + 1);
    },
    []
  );

  const hasPermission = useCallback(
    (_permission: AdminPermission): boolean => {
      return true;
    },
    []
  );

  const switchRole = useCallback((role: AdminRole) => {
    setCurrentUserRole(role);
    if (typeof window !== "undefined") {
      localStorage.setItem("unimeta_admin_role_v1", role);
    }
    authService.updateCurrentUser({
      role: role === "super_admin" ? "admin" : "moderator",
      title: role === "super_admin" ? "المسؤول العام" : "مشرف",
    });
    setAuthProfileTick((t) => t + 1);
  }, []);

  const addModerator = useCallback((mod: Omit<ModeratorUser, "id" | "createdAt">) => {
    const newMod: ModeratorUser = {
      ...mod,
      id: `mod-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setModerators((prev) => [newMod, ...prev]);
  }, []);

  const updateModeratorPermissions = useCallback(
    (modId: string, perms: Record<AdminPermission, boolean>) => {
      setModerators((prev) =>
        prev.map((m) => (m.id === modId ? { ...m, permissions: perms } : m))
      );
    },
    []
  );

  const toggleModeratorStatus = useCallback((modId: string) => {
    setModerators((prev) =>
      prev.map((m) =>
        m.id === modId ? { ...m, status: m.status === "نشط" ? "معطل" : "نشط" } : m
      )
    );
  }, []);

  const deleteModerator = useCallback((modId: string) => {
    setModerators((prev) => prev.filter((m) => m.id !== modId));
  }, []);

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => {
      if (n.read) return false;
      if (n.targetRole === "all") return true;
      return n.targetRole === currentUser.role;
    }).length;
  }, [notifications, currentUser.role]);

  return {
    currentUserRole,
    currentUser,
    switchRole,
    updateAdminProfile,
    hasPermission,
    moderators,
    addModerator,
    updateModeratorPermissions,
    toggleModeratorStatus,
    deleteModerator,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    unreadNotificationsCount,
  };
}
