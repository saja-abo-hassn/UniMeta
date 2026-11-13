"use client";

import React from "react";
import dynamic from "next/dynamic";

const AuthProvider = dynamic(() => import("@/src/contexts/auth-context").then((module) => module.AuthProvider));
const NotificationsProvider = dynamic(() => import("@/src/contexts/notifications-context").then((module) => module.NotificationsProvider));
const AdminProvider = dynamic(() => import("@/src/contexts/admin-context").then((module) => module.AdminProvider));
const StudyPlanProvider = dynamic(() => import("@/src/contexts/study-plan-context").then((module) => module.StudyPlanProvider));

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NotificationsProvider>
        <AdminProvider>
          <StudyPlanProvider>{children}</StudyPlanProvider>
        </AdminProvider>
      </NotificationsProvider>
    </AuthProvider>
  );
}

