"use client";

import React from "react";
import { PlanGrid } from "@/components/student/plans/plan-grid";
import { OrientationResultBanner } from "@/components/student/plans/orientation-result-banner";

export default function AcademicPlanPage() {
  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
          <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
            المسار الأكاديمي
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-ink tracking-tight">
          الخطط الدراسية المعتمدة
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted leading-relaxed max-w-2xl">
          اختر خطتك الدراسية المعتمدة لجامعة الأزهر بغزة. عند اختيار تخصصك، ستنتقل مباشرة لمتابعة ساعاتك المعتمدة وإنجازك الأكاديمي.
        </p>
      </div>

      {/* Orientation Assessment Result / Recommendation Banner */}
      <OrientationResultBanner />

      <PlanGrid />
    </div>
  );
}
