"use client";

import React from "react";
import { useStudyPlan } from "@/src/contexts/study-plan-context";

export function MetricSummaryCards() {
  const {
    hasPlanSelected,
    cumulativeGpa,
    gpaFormatted,
    gpaRating,
    completedCredits,
    totalCredits,
    remainingCredits,
    completionPercentage,
    isLoaded,
  } = useStudyPlan();

  return (
    <section
      aria-label="ملخص المؤشرات الأكاديمية"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {/* 1. GPA Card (100-point scale) */}
      <div
        className="card-entrance card-hover-effect p-5 rounded-2xl bg-white border border-brand-border-soft shadow-xs relative overflow-hidden"
        style={{ animationDelay: "100ms" }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-brand-muted">
            المعدل التراكمي
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${gpaRating.color}`}>
            {isLoaded ? gpaRating.label : "جاري التحميل..."}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-brand-primary">
            {isLoaded && hasPlanSelected && cumulativeGpa > 0 ? cumulativeGpa.toFixed(2) : "—"}
          </span>
          <span className="text-xs text-brand-muted font-medium" dir="ltr">
            / 100
          </span>
        </div>
        <div className="mt-2 pt-2 border-t border-brand-border-soft/60 flex items-center gap-1.5 text-[11px] text-brand-hover-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary" />
          <span>
            {isLoaded && hasPlanSelected && cumulativeGpa > 0
              ? `${gpaRating.label} · استمر بهذا المستوى`
              : "بانتظار تسجيل علامات المساقات"}
          </span>
        </div>
      </div>

      {/* 2. Completed Hours Card */}
      <div
        className="card-entrance card-hover-effect p-5 rounded-2xl bg-white border border-brand-border-soft shadow-xs relative overflow-hidden"
        style={{ animationDelay: "200ms" }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-brand-muted">
            الساعات المنجزة
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-surface-soft text-brand-muted">
            ساعات معتمدة
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-brand-ink" dir="ltr">
            {isLoaded && hasPlanSelected ? completedCredits : "—"}
          </span>
          <span className="text-xs text-brand-muted font-medium" dir="ltr">
            / {isLoaded && hasPlanSelected ? `${totalCredits} ساعة` : "—"}
          </span>
        </div>
        <div className="mt-2 pt-2 border-t border-brand-border-soft/60 text-[11px] text-brand-muted">
          وفق الخطة الأكاديمية المعتمدة
        </div>
      </div>

      {/* 3. Remaining Hours Card */}
      <div
        className="card-entrance card-hover-effect p-5 rounded-2xl bg-white border border-brand-border-soft shadow-xs relative overflow-hidden"
        style={{ animationDelay: "300ms" }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-brand-muted">
            الساعات المتبقية
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-surface-blue text-brand-primary">
            {isLoaded && hasPlanSelected ? `${completionPercentage}% مكتمل` : "—"}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-brand-ink">
            {isLoaded && hasPlanSelected ? remainingCredits : "—"}
          </span>
          <span className="text-xs text-brand-muted font-medium">ساعة</span>
        </div>
        <div className="mt-2 pt-2 border-t border-brand-border-soft/60 text-[11px] text-brand-muted">
          وفق الخطة الأكاديمية الحالية
        </div>
      </div>

      {/* 4. Active Tasks Card */}
      <div
        className="card-entrance card-hover-effect p-5 rounded-2xl bg-white border border-brand-border-soft shadow-xs relative overflow-hidden"
        style={{ animationDelay: "400ms" }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-brand-muted">
            المهام الدراسية
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-surface-blue text-brand-primary border border-brand-border-soft">
            نشطة
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-brand-ink">
            2
          </span>
          <span className="text-xs text-brand-muted font-medium">مهام متبقية</span>
        </div>
        <div className="mt-2 pt-2 border-t border-brand-border-soft/60 text-[11px] text-brand-muted">
          2 مهام غير مكتملة هذا الأسبوع
        </div>
      </div>
    </section>
  );
}
