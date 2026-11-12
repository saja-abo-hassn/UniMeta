"use client";

import React from "react";
import Link from "next/link";
import { useStudentUser } from "@/src/hooks/use-student-user";
import { useStudyPlan } from "@/src/contexts/study-plan-context";
import { MetricSummaryCards } from "@/components/student/metric-summary-cards";
import { AcademicProgressCard } from "@/components/student/academic-progress-card";
import { StudentTasksWidget } from "@/components/student/student-tasks-widget";
import { FocusTimerWidget } from "@/components/student/focus-timer-widget";

/**
 * "Choose your plan" prompt card — shown when the student hasn't selected a study plan yet.
 */
function ChoosePlanCard() {
  return (
    <div className="card-entrance flex flex-col items-center justify-center text-center gap-4 p-8 sm:p-10 rounded-3xl bg-white border-2 border-dashed border-[#4DB7F2]/40 shadow-xs">
      <div className="w-14 h-14 rounded-2xl bg-[#EAF4FD] flex items-center justify-center">
        <svg className="w-7 h-7 text-[#0057C8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <div className="space-y-1.5">
        <h3 className="text-lg sm:text-xl font-extrabold text-[#16324A]">
          اختر خطتك الدراسية للبدء
        </h3>
        <p className="text-xs sm:text-sm text-[#66788A] max-w-md leading-relaxed">
          لعرض تخصصك وساعاتك المنجزة ومعدلك التراكمي، يرجى اختيار خطتك الدراسية المعتمدة أولاً.
        </p>
      </div>
      <Link
        href="/student/academic"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0057C8] hover:bg-[#2D78B7] active:scale-95 text-white font-semibold text-sm transition-all shadow-[0_2px_8px_rgba(0,87,200,0.25)]"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <span>اختيار الخطة الدراسية</span>
      </Link>
    </div>
  );
}

/**
 * Plan-dependent section placeholder — shown inside sections that need a plan.
 */
function NeedsPlanPlaceholder({ label }: { label: string }) {
  return (
    <div className="card-entrance card-hover-effect bg-white border border-[#D7EAF7] rounded-3xl p-6 shadow-xs flex flex-col items-center justify-center text-center gap-3 min-h-[200px]">
      <div className="w-10 h-10 rounded-xl bg-[#F0F7FD] flex items-center justify-center">
        <svg className="w-5 h-5 text-[#66788A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <p className="text-xs font-semibold text-[#66788A]">
        {label} — تحتاج اختيار الخطة
      </p>
      <Link
        href="/student/academic"
        className="text-xs font-bold text-[#0057C8] hover:text-[#2D78B7] transition-colors"
      >
        اختيار الخطة الدراسية ←
      </Link>
    </div>
  );
}

/**
 * Loading skeleton for initial data fetch
 */
function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      <div className="h-28 rounded-3xl skeleton-shimmer" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-2xl skeleton-shimmer" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 h-72 rounded-3xl skeleton-shimmer" />
        <div className="lg:col-span-5 h-72 rounded-3xl skeleton-shimmer" />
      </div>
    </div>
  );
}

export function StudentDashboard() {
  const { greeting, isLoading: userLoading } = useStudentUser();
  const { hasPlanSelected, selectedPlan, isLoaded: planLoaded } = useStudyPlan();

  // Show skeleton while loading user or plan data
  if (userLoading || !planLoaded) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      {/* 1. Welcome Header */}
      <section
        aria-label="الترحيب والمتابعة"
        className="card-entrance flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-white border border-[#D7EAF7] shadow-xs relative overflow-hidden"
        style={{ animationDelay: "50ms" }}
      >
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-semibold bg-[#EAF4FD] text-[#0057C8] border border-[#D7EAF7]">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{new Date().toLocaleDateString("ar-PS", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16324A] tracking-tight">
            {greeting}.
          </h2>

          <p className="text-xs sm:text-sm text-[#66788A] leading-relaxed">
            {hasPlanSelected
              ? `تخصصك: ${selectedPlan.major}. لنُكمل رحلتك الأكاديمية بكل كفاءة وسهولة.`
              : "اختر خطتك الدراسية للبدء في متابعة تقدمك الأكاديمي."}
          </p>
        </div>

        {/* Quick Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/student/academic"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0057C8] hover:bg-[#2D78B7] active:scale-95 text-white font-semibold text-xs sm:text-sm transition-all shadow-[0_2px_8px_rgba(0,87,200,0.25)]"
          >
            <span>{hasPlanSelected ? "عرض المسار الأكاديمي" : "اختيار الخطة الدراسية"}</span>
            <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Show plan-dependent content OR prompts */}
      {hasPlanSelected ? (
        <>
          {/* 2. Top 4 Metric Summary Cards (from study plan context) */}
          <MetricSummaryCards />

          {/* 3. Middle Section: Academic Progress + My Tasks (To-Do) */}
          <section
            aria-label="التقدم والمهام الدراسية"
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            <div className="lg:col-span-7 flex flex-col">
              <AcademicProgressCard />
            </div>
            <div className="lg:col-span-5 flex flex-col">
              <StudentTasksWidget />
            </div>
          </section>

          {/* 4. Bottom Section: Productivity & Focus Timer */}
          <section
            aria-label="الإنتاجية ومؤقت التركيز"
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            <div className="lg:col-span-12 flex flex-col">
              <FocusTimerWidget />
            </div>
          </section>
        </>
      ) : (
        <>
          {/* No plan selected: show clear prompt */}
          <ChoosePlanCard />

          {/* Plan-dependent sections in "needs plan" state */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <NeedsPlanPlaceholder label="المعدل التراكمي" />
            <NeedsPlanPlaceholder label="الساعات المنجزة" />
            <NeedsPlanPlaceholder label="الساعات المتبقية" />
            <NeedsPlanPlaceholder label="المواد الدراسية" />
          </div>

          {/* Tasks and Focus Timer are plan-independent, still available */}
          <section
            aria-label="المهام والإنتاجية"
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            <div className="lg:col-span-7 flex flex-col">
              <StudentTasksWidget />
            </div>
            <div className="lg:col-span-5 flex flex-col">
              <FocusTimerWidget />
            </div>
          </section>
        </>
      )}
    </div>
  );
}

