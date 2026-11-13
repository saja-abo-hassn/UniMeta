import React from "react";
import Link from "next/link";
import { StudyPlan } from "@/src/data/study-plans-data";

interface GpaHeaderBannerProps {
  selectedPlan: StudyPlan;
  onImportPlanCourses: () => void;
}

export function GpaHeaderBanner({ selectedPlan, onImportPlanCourses }: GpaHeaderBannerProps) {
  return (
    <section className="p-6 sm:p-7 rounded-3xl bg-white border border-brand-border-soft shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
          <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
            المسار الأكاديمي
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-brand-ink">
          حاسبة المعدل التراكمي (موزعة بالسنوات والفصول)
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted max-w-2xl">
          حساب دقيق للمعدل الفصلي، معدل كل سنة دراسية، والمعدل التراكمي الكلي لجامعة الأزهر بناءً على خطة تخصصك.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={onImportPlanCourses}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-hover-medium text-white text-xs sm:text-sm font-bold transition-all shadow-xs"
        >
          <svg className="w-4 h-4 text-[#BFE8FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>استيراد مواد الخطة ({selectedPlan.major})</span>
        </button>

        <Link
          href="/student/academic"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-surface-soft hover:bg-brand-surface-blue text-brand-primary border border-brand-border-soft text-xs sm:text-sm font-bold transition-colors"
        >
          <span>تغيير الخطة</span>
          <span>←</span>
        </Link>
      </div>
    </section>
  );
}

