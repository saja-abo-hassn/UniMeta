"use client";

import React from "react";
<<<<<<< HEAD
import { NotificationsProvider } from "@/src/contexts/notifications-context";
import { StudyPlanProvider } from "@/src/contexts/study-plan-context";
import { AdminProvider } from "@/src/contexts/admin-context";
import { AuthProvider } from "@/src/contexts/auth-context";
import { ApiErrorNotice } from "./api-error-notice";
=======
import dynamic from "next/dynamic";

const AuthProvider = dynamic(() => import("@/src/contexts/auth-context").then((module) => module.AuthProvider));
const NotificationsProvider = dynamic(() => import("@/src/contexts/notifications-context").then((module) => module.NotificationsProvider));
const AdminProvider = dynamic(() => import("@/src/contexts/admin-context").then((module) => module.AdminProvider));
const StudyPlanProvider = dynamic(() => import("@/src/contexts/study-plan-context").then((module) => module.StudyPlanProvider));
>>>>>>> b079de5bb3c77012965f2ad45ddce455d601b6a9

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

