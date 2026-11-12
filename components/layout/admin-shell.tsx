"use client";

import React, { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { authService } from "@/src/services/auth-service";
import { useAuth } from "@/src/contexts/auth-context";

export interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const { user, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    if (sessionStorage.getItem("unimeta_logged_out") === "true") return false;
    return authService.isAuthenticated();
  });

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
      if (!["moderator", "super_admin", "admin"].includes(user.role)) {
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

  // Prevent flash of protected admin UI when logged out or returning via browser back
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#F4FAFF] flex items-center justify-center" dir="rtl">
        <div className="flex flex-col items-center gap-3 text-center p-6 animate-fade-in">
          <div className="w-9 h-9 border-3 border-[#0057C8] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-[#16324A]">جاري التحقق وتوجيهك لصفحة تسجيل الدخول...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F4FAFF] text-[#16324A]" dir="rtl">
      {/* Admin Persistent Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Admin Header with Search, Notification Bell, Role Switcher */}
        <AdminHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-5 sm:pt-7 lg:pt-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
