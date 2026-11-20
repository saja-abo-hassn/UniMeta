"use client";

import React, { useEffect, useState } from "react";
import { useAdmin, AdminPermission } from "@/src/contexts/admin-context";
import { useAuth } from "@/src/contexts/auth-context";

interface PermissionGuardProps {
  permission?: AdminPermission;
  superAdminOnly?: boolean;
  children: React.ReactNode;
}

export function PermissionGuard({
  permission,
  superAdminOnly = false,
  children,
}: PermissionGuardProps) {
  const { isLoading, adminRole, refreshProfile } = useAuth();
  const { hasPermission } = useAdmin();
  const [serverDenied, setServerDenied] = useState(false);

  useEffect(() => {
    const handleForbidden = () => {
      setServerDenied(true);
      void refreshProfile();
    };
    window.addEventListener("unimeta_api_forbidden", handleForbidden);
    return () => window.removeEventListener("unimeta_api_forbidden", handleForbidden);
  }, [refreshProfile]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-40" dir="rtl" role="status" aria-busy="true">
      <div className="w-7 h-7 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  const allowed = adminRole !== null && !serverDenied && (superAdminOnly
    ? adminRole === "super_admin"
    : !permission || hasPermission(permission));

  if (!allowed) {
    return <div className="p-5 rounded-2xl bg-white border border-brand-border-soft text-sm text-brand-ink" dir="rtl" role="alert">
      <p className="font-bold">لا تملك صلاحية الوصول إلى هذه الصفحة.</p>
      <p className="mt-1 text-brand-muted">إذا تم تحديث صلاحياتك للتو، أعد تحميل الصفحة.</p>
    </div>;
  }

  return <>{children}</>;
}

