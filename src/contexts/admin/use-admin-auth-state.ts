"use client";
import { apiClient } from "@/src/services/api-client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { AdminRole, AdminPermission, ModeratorUser, AdminNotification } from "@/src/types/admin";
import { initialModerators, initialNotificationsList } from "@/src/data/mock-admin-data";
import { authService } from "@/src/services/auth-service";
import { moderatorsService } from "@/src/services/moderators";
import { requireData, reportApiError } from "@/src/services/api-result";
import { useAuth } from "../auth-context";

export function useAdminAuthState() {
  const { user: sessionUser } = useAuth();
  const [currentUserRole, setCurrentUserRole] = useState<AdminRole>(() => {
    if (apiClient.isUsingMock() && typeof window !== "undefined") {
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
      if (apiClient.isUsingMock() && typeof window !== "undefined") {
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
    if (apiClient.isUsingMock() && typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("unimeta_admin_moderators_v1");
        if (stored) return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return apiClient.isUsingMock() ? initialModerators : [];
  });

  const [notifications, setNotifications] = useState<AdminNotification[]>(() => {
    if (apiClient.isUsingMock() && typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("unimeta_admin_notifications_v1");
        if (stored) return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return apiClient.isUsingMock() ? initialNotificationsList : [];
  });

  useEffect(() => {
    if (apiClient.isUsingMock()) return;
    setModerators([]);
    if (sessionUser?.role !== "admin" && sessionUser?.role !== "super_admin") return;
    let active = true;
    moderatorsService.list().then(requireData).then(items => {
      if (active) setModerators(items);
    }).catch(reportApiError);
    return () => { active = false; };
  }, [authProfileTick, sessionUser?.id, sessionUser?.role]);

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
      if (!apiClient.isUsingMock()) {
        const user=authService.getCurrentUser();
        return user?.role==="super_admin" || user?.role==="admin" || (user?.role==="moderator" && user.permissions?.[_permission]===true);
      }
      return true;
    },
    []
  );

  const switchRole = useCallback((role: AdminRole) => {
    if (!apiClient.isUsingMock()) return;
    setCurrentUserRole(role);
    if (apiClient.isUsingMock() && typeof window !== "undefined") {
      localStorage.setItem("unimeta_admin_role_v1", role);
    }
    authService.updateCurrentUser({
      role: role === "super_admin" ? "admin" : "moderator",
      title: role === "super_admin" ? "المسؤول العام" : "مشرف",
    });
    setAuthProfileTick((t) => t + 1);
  }, []);

  const addModerator = useCallback((mod: Omit<ModeratorUser, "id" | "createdAt"> & Partial<Pick<ModeratorUser, "id" | "createdAt">>) => {
    const newMod: ModeratorUser = {
      ...mod,
      id: mod.id ?? `mod-${Date.now()}`,
      createdAt: mod.createdAt ?? new Date().toISOString().split("T")[0],
    };
    setModerators((prev) => [newMod, ...prev]);
  }, []);

  const updateModeratorPermissions = useCallback(
    (modId: string, perms: Record<AdminPermission, boolean>) => {
      if (!apiClient.isUsingMock()) {
        void moderatorsService.updatePermissions(modId, perms).then(requireData).then(saved => {
          setModerators(prev => prev.map(m => m.id === modId ? saved : m));
        }).catch(reportApiError);
        return;
      }
      setModerators((prev) =>
        prev.map((m) => (m.id === modId ? { ...m, permissions: perms } : m))
      );
    },
    []
  );

  const toggleModeratorStatus = useCallback((modId: string) => {
    if (!apiClient.isUsingMock()) {
      const mod = moderators.find(m => m.id === modId);
      if (!mod) return;
      void moderatorsService.setStatus(modId, mod.status === "نشط" ? "معطل" : "نشط")
        .then(requireData).then(saved => setModerators(prev => prev.map(m => m.id === modId ? saved : m))).catch(reportApiError);
      return;
    }
    setModerators((prev) =>
      prev.map((m) =>
        m.id === modId ? { ...m, status: m.status === "نشط" ? "معطل" : "نشط" } : m
      )
    );
  }, [moderators]);

  const deleteModerator = useCallback((modId: string) => {
    if (!apiClient.isUsingMock()) {
      void moderatorsService.delete(modId).then(response => {
        if (response.errors) throw new Error(response.message);
        setModerators(prev => prev.filter(m => m.id !== modId));
      }).catch(reportApiError);
      return;
    }
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
