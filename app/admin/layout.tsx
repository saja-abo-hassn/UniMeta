import type { ReactNode } from "react";
import { DashboardShell } from "@/components/shared/sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <DashboardShell area="admin">{children}</DashboardShell>;
}
