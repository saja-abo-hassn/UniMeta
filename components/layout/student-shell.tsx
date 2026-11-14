"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { StudentSidebar } from "./student-sidebar";
import { StudentTopbar } from "./student-topbar";
import { OnboardingTour } from "@/components/student/onboarding-tour";
import { NotificationsProvider } from "@/src/contexts/notifications-context";
import { StudyPlanProvider } from "@/src/contexts/study-plan-context";
import { authService } from "@/src/services/auth-service";
import { useAuth } from "@/src/contexts/auth-context";

const StudentShellContext = createContext<boolean>(false);

export interface StudentShellProps {
  children: React.ReactNode;
}

export function StudentShell({ children }: StudentShellProps) {
  const isNested = useContext(StudentShellContext);
  const { user, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    if (sessionStorage.getItem("unimeta_logged_out") === "true") return false;
    return authService.isAuthenticated();
  });

  useEffect(() => {
    const handleSetSidebar = (e: Event) => {
      const custom = e as CustomEvent<boolean>;
      setSidebarOpen(Boolean(custom.detail));
    };
    window.addEventListener("unimeta_set_sidebar_open", handleSetSidebar);
    return () => {
      window.removeEventListener("unimeta_set_sidebar_open", handleSetSidebar);
    };
  }, []);

  // Strict route protection guard against back navigation after logout
  useEffect(() => {
    const verifyAccess = () => {
      if (typeof window === "undefined") return;
      if (isLoading) return;
      if (!user) {
        setIsAuthorized(false);
        window.location.replace("/login");
        return false;
      }
      if (user.role !== "student") {
        setIsAuthorized(false);
        window.location.replace("/403");
        return false;
      }

      setIsAuthorized(true);
      return true;
    };

    verifyAccess();

    // Catch Back/Forward cache (bfcache) restoration
    const handlePageShow = () => {
      verifyAccess();
    };

    // Catch history popstate back/forward triggers
    const handlePopState = () => {
      verifyAccess();
    };

    const handleAuthChange = () => {
      verifyAccess();
    };

    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("unimeta_auth_change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("unimeta_auth_change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, [isLoading, user]);

  // If already inside an outer StudentShell (e.g. app/student/layout.tsx), just render children
  if (isNested) {
    return <>{children}</>;
  }

  // Prevent flash of protected student UI when logged out or returning via browser back
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#F4FAFF] flex items-center justify-center" dir="rtl">
        <div className="flex flex-col items-center gap-3 text-center p-6 animate-fade-in">
          <div className="w-9 h-9 border-3 border-brand-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-brand-ink">جاري التحقق وتوجيهك لصفحة تسجيل الدخول...</p>
        </div>
      </div>
    );
  }

  return (
    <StudentShellContext.Provider value={true}>
      <div className="min-h-screen flex bg-[#F4FAFF] text-brand-ink" dir="rtl">
        {/* Student Sidebar (Desktop sticky + Mobile drawer) */}
        <StudentSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Column */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          {/* Sticky Topbar */}
          <StudentTopbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

          {/* Page Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
            {children}
          </main>
        </div>

        {/* Student Onboarding Tour */}
        <OnboardingTour />
      </div>
    </StudentShellContext.Provider>
  );
}
