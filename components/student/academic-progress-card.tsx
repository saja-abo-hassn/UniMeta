"use client";

import React from "react";
import Link from "next/link";
import { useStudyPlan } from "@/src/contexts/study-plan-context";

export function AcademicProgressCard() {
  const {
    allCourses,
    selectedPlan,
    completedCredits,
    remainingCredits,
    totalCredits,
    completionPercentage,
  } = useStudyPlan();

  // Current semester hours (credits currently being studied)
  const currentSemesterHours = React.useMemo(() => {
    const sem2Courses = allCourses.filter((c) => c.semester === 2);
    const sem2Hours = sem2Courses.reduce((sum, c) => sum + c.credits, 0);
    return Math.min(sem2Hours || 15, remainingCredits);
  }, [allCourses, remainingCredits]);

  return (
    <div
      className="card-entrance card-hover-effect bg-white border border-brand-border-soft rounded-3xl p-6 shadow-xs flex flex-col justify-between"
      style={{ animationDelay: "250ms" }}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between pb-4 border-b border-brand-border-soft/80">
        <div>
          <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block mb-1">
            {selectedPlan.major}
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-brand-ink">
            تقدمك الأكاديمي
          </h2>
        </div>
        <Link
          href="/student/academic"
          className="text-xs font-semibold text-brand-primary hover:text-brand-hover-medium bg-brand-surface-blue hover:bg-brand-border-soft px-3 py-1.5 rounded-full transition-colors inline-flex items-center gap-1"
        >
          <span>عرض التفاصيل</span>
          <span className="text-[10px]">&larr;</span>
        </Link>
      </div>

      {/* Main Progress Body: Circular Visual + Hour Breakdown Bars */}
      <div className="py-6 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
        {/* Circular Progress Badge */}
        <div className="sm:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-brand-surface-soft border border-brand-border-soft">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-brand-border-soft"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-brand-primary"
                strokeDasharray={`${completionPercentage}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-xl font-extrabold text-brand-primary">
                {completionPercentage}%
              </span>
              <span className="text-[9px] text-brand-muted font-medium">
                مكتمل
              </span>
            </div>
          </div>
        </div>

        {/* Hour Breakdown List */}
        <div className="sm:col-span-8 space-y-3">
          {/* Completed Hours */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-brand-ink">منجزة</span>
              <span className="text-brand-primary font-bold">{completedCredits} ساعة</span>
            </div>
            <div className="w-full h-2 rounded-full bg-brand-surface-blue overflow-hidden">
              <div
                className="h-full bg-brand-primary rounded-full transition-all duration-500"
                style={{ width: `${totalCredits > 0 ? (completedCredits / totalCredits) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Current Semester */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-brand-ink">قيد الدراسة (الفصل الحالي)</span>
              <span className="text-brand-secondary font-bold">{currentSemesterHours} ساعة</span>
            </div>
            <div className="w-full h-2 rounded-full bg-brand-surface-blue overflow-hidden">
              <div
                className="h-full bg-brand-secondary rounded-full transition-all duration-500"
                style={{ width: `${totalCredits > 0 ? (currentSemesterHours / totalCredits) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Remaining */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-brand-ink">متبقية للتخرج</span>
              <span className="text-brand-muted font-bold">{remainingCredits} ساعة</span>
            </div>
            <div className="w-full h-2 rounded-full bg-brand-surface-blue overflow-hidden">
              <div
                className="h-full bg-[#B2D5F0] rounded-full transition-all duration-500"
                style={{ width: `${totalCredits > 0 ? (remainingCredits / totalCredits) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Advisory Tip Box */}
      <div className="p-3.5 rounded-2xl bg-brand-surface-soft border border-brand-border-soft flex items-start gap-2.5 text-xs text-brand-ink leading-relaxed">
        <svg
          className="w-4 h-4 text-brand-primary shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-brand-ink">
          {completedCredits > 0
            ? `أنت على المسار الصحيح. أكملت ${completedCredits} ساعة من أصل ${totalCredits} ساعة في خطة ${selectedPlan.major}.`
            : `ابدأ بتسجيل علاماتك في صفحة الساعات المعتمدة لمتابعة تقدمك في خطة ${selectedPlan.major}.`}
        </p>
      </div>
    </div>
  );
}
