import React, { Suspense } from "react";
import { StudentShell } from "@/components/layout/student-shell";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <StudentShell>{children}</StudentShell>
    </Suspense>
  );
}
