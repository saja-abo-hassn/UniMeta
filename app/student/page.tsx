import React from "react";
import { StudentDashboard } from "@/components/student/student-dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "لوحة الطالب - الرئيسية | UniMeta",
  description: "لوحة المتابعة الشاملة للخدمات الأكاديمية والمهام والتقدم لطلاب UniMeta",
};

export default function StudentOverviewPage() {
  return <StudentDashboard />;
}
