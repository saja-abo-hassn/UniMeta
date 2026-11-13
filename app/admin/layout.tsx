import React from "react";
import { AdminShell } from "@/components/layout/admin-shell";
import { AppProviders } from "@/components/providers/app-providers";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppProviders><AdminShell>{children}</AdminShell></AppProviders>;
}

