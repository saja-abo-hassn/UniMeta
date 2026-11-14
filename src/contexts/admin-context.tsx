"use client";
import { apiClient } from "@/src/services/api-client";

import React, { createContext, useContext, useEffect, useMemo } from "react";
import { AdminContextValue } from "@/src/types/admin";
import { useAdminAuthState } from "./admin/use-admin-auth-state";
import { useAdminContentManagement } from "./admin/use-admin-content-management";
import { useAdminOperations } from "./admin/use-admin-operations";

export * from "@/src/types/admin";

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const {
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
  } = useAdminAuthState();

  const {
    courses,
    materials,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    toggleMaterialStatus,
    exams,
    addExam,
    updateExam,
    deleteExam,
  } = useAdminContentManagement();

  const {
    agreements,
    approveAgreement,
    rejectAgreement,
    requestAgreementModification,
    reports,
    updateReportStatus,
    deleteReport,
    payments,
    addPayment,
    members,
    updateMemberStatus,
    settings,
    updateSettings,
  } = useAdminOperations();

  useEffect(() => {
    if (!apiClient.isUsingMock()) return;
    try {
      localStorage.setItem("unimeta_admin_role_v1", currentUserRole);
      localStorage.setItem("unimeta_admin_moderators_v1", JSON.stringify(moderators));
      localStorage.setItem("unimeta_admin_materials_v1", JSON.stringify(materials));
      localStorage.setItem("unimeta_admin_agreements_v1", JSON.stringify(agreements));
      localStorage.setItem("unimeta_admin_exams_v1", JSON.stringify(exams));
      localStorage.setItem("unimeta_admin_notifications_v1", JSON.stringify(notifications));
      localStorage.setItem("unimeta_admin_reports_v1", JSON.stringify(reports));
      localStorage.setItem("unimeta_admin_payments_v1", JSON.stringify(payments));
      localStorage.setItem("unimeta_admin_members_v1", JSON.stringify(members));
      localStorage.setItem("unimeta_admin_settings_v1", JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [
    currentUserRole,
    moderators,
    materials,
    agreements,
    exams,
    notifications,
    reports,
    payments,
    members,
    settings,
  ]);

  const value = useMemo<AdminContextValue>(
    () => ({
      currentUser,
      switchRole,
      updateAdminProfile,
      hasPermission,
      moderators,
      addModerator,
      updateModeratorPermissions,
      toggleModeratorStatus,
      deleteModerator,
      courses,
      materials,
      addMaterial,
      updateMaterial,
      deleteMaterial,
      toggleMaterialStatus,
      agreements,
      approveAgreement,
      rejectAgreement,
      requestAgreementModification,
      exams,
      addExam,
      updateExam,
      deleteExam,
      reports,
      updateReportStatus,
      deleteReport,
      payments,
      addPayment,
      members,
      updateMemberStatus,
      settings,
      updateSettings,
      notifications,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      unreadNotificationsCount,
    }),
    [
      currentUser,
      switchRole,
      updateAdminProfile,
      hasPermission,
      moderators,
      addModerator,
      updateModeratorPermissions,
      toggleModeratorStatus,
      deleteModerator,
      courses,
      materials,
      addMaterial,
      updateMaterial,
      deleteMaterial,
      toggleMaterialStatus,
      agreements,
      approveAgreement,
      rejectAgreement,
      requestAgreementModification,
      exams,
      addExam,
      updateExam,
      deleteExam,
      reports,
      updateReportStatus,
      deleteReport,
      payments,
      addPayment,
      members,
      updateMemberStatus,
      settings,
      updateSettings,
      notifications,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      unreadNotificationsCount,
    ]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
