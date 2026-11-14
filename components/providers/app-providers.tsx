"use client";

import React from "react";
import { NotificationsProvider } from "@/src/contexts/notifications-context";
import { StudyPlanProvider } from "@/src/contexts/study-plan-context";
import { AdminProvider } from "@/src/contexts/admin-context";
import { AuthProvider } from "@/src/contexts/auth-context";
import { ApiErrorNotice } from "./api-error-notice";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ApiErrorNotice />
      <NotificationsProvider>
        <AdminProvider>
          <StudyPlanProvider>{children}</StudyPlanProvider>
        </AdminProvider>
      </NotificationsProvider>
    </AuthProvider>
  );
}

