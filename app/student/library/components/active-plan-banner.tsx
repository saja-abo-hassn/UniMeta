import React from "react";
import Link from "next/link";
import { StudyPlan } from "@/src/data/study-plans-data";

interface ActivePlanBannerProps {
  selectedPlan: StudyPlan;
  totalCoursesCount: number;
}

export function ActivePlanBanner({ selectedPlan, totalCoursesCount }: ActivePlanBannerProps) {
  return (
    <section className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-brand-primary/10 via-brand-surface-blue to-white border border-brand-primary/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-brand-primary text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
          🎓
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-brand-muted font-medium">الخطة الدراسية النشطة:</span>
            <strong className="text-sm sm:text-base font-black text-brand-ink">
              {selectedPlan.major}
            </strong>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-brand-primary text-white">
              {selectedPlan.degree}
            </span>
            <span className="text-[10px] font-semibold text-brand-primary bg-white px-2 py-0.5 rounded-full border border-brand-border-soft">
              {totalCoursesCount} مواد متاحة
            </span>
          </div>
          <p className="text-xs text-brand-muted mt-0.5">
            تُعرض المواد والملفات المعتمدة المرتبطة بخطتك الأكاديمية المختارة. عند تغيير التخصص، يتم تحديث المقررات وملفاتها تلقائيًا.
          </p>
        </div>
      </div>

      <Link
        href="/student/academic"
        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-brand-surface-soft text-brand-primary border border-brand-primary text-xs font-bold transition-all shrink-0 shadow-2xs group"
      >
        <span>تغيير الخطة الأكاديمية</span>
        <span className="group-hover:rotate-180 transition-transform duration-300">🔄</span>
      </Link>
    </section>
  );
}
