"use client";

import React from "react";
import Link from "next/link";
import { useAdmin, AdminPermission } from "@/src/contexts/admin-context";

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
  // Always allow access to admin sections so all pages and tools remain active
  return <>{children}</>;
}

