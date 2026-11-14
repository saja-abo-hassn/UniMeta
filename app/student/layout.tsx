import React, { Suspense } from "react";
import { StudentShell } from "@/components/layout/student-shell";
import { AppProviders } from "@/components/providers/app-providers";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProviders>
      <Suspense fallback={null}>
        <StudentShell>{children}</StudentShell>
      </Suspense>
    </AppProviders>
  );
}
