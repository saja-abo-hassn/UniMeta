"use client";

import React, { useState } from "react";
import Link from "next/link";
import { StudentShell } from "@/components/layout/student-shell";
import { AcademicHeader } from "@/components/student/academic-header";
import { useStudyPlan } from "@/src/contexts/study-plan-context";

export default function FeeCalculatorPage() {
  const { selectedPlan, hasPlanSelected } = useStudyPlan();

  // Input states from screenshot
  const [creditHours, setCreditHours] = useState<number>(6);
  const [customRate, setCustomRate] = useState<number | null>(null);
  const [prevPlanId, setPrevPlanId] = useState(selectedPlan.id);
  const [additionalFeePercent, setAdditionalFeePercent] = useState<number>(10);

  // Sync rate when selected plan changes during render
  if (prevPlanId !== selectedPlan.id) {
    setPrevPlanId(selectedPlan.id);
    setCustomRate(null);
  }

  const ratePerHour = customRate ?? selectedPlan.hourlyRate;
  const setRatePerHour = (val: number | null) => setCustomRate(val);

  // Safe numerical calculations
  const safeHours = Math.max(0, creditHours || 0);
  const safeRate = Math.max(0, ratePerHour || 0);
  const safePercent = Math.max(0, additionalFeePercent || 0);

  const tuitionCost = safeHours * safeRate;
  const additionalFees = (tuitionCost * safePercent) / 100;
  const totalRequired = tuitionCost + additionalFees;

  if (!hasPlanSelected) {
    return (
      <StudentShell>
        <div className="space-y-6 animate-fade-in" dir="rtl">
          <div className="card-entrance flex flex-col items-center justify-center text-center gap-4 p-10 sm:p-14 rounded-3xl bg-white border border-brand-border-soft shadow-xs my-8">
            <div className="w-16 h-16 rounded-2xl bg-brand-surface-blue flex items-center justify-center">
              <svg className="w-8 h-8 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="space-y-2 max-w-lg">
              <h2 className="text-xl sm:text-2xl font-extrabold text-brand-ink">
                حاسبة الرسوم الدراسية — تحتاج اختيار الخطة
              </h2>
              <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                لحساب الرسوم التقديرية بناءً على سعر الساعة المعتمد لتخصصك في جامعة الأزهر، يرجى اختيار خطتك الدراسية أولاً.
              </p>
            </div>
            <Link
              href="/student/academic"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-hover-medium text-white font-bold text-sm transition-all shadow-md active:scale-95"
            >
              <span>اختيار الخطة الدراسية</span>
              <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </StudentShell>
    );
  }

  return (
    <StudentShell>
      <div className="space-y-6 animate-fade-in" dir="rtl">
        {/* Academic Major, Study Plan Hero Card & Navigation Tabs */}
        <AcademicHeader activeTab="fees" />

        {/* ============================================================ */}
        {/* CARD 1: تفاصيل الفصل الدراسي (Matching user screenshot)      */}
        {/* ============================================================ */}
        <section className="p-6 sm:p-7 rounded-3xl bg-white border border-brand-border-soft shadow-xs space-y-5">
          <div className="pb-3 border-b border-brand-border-soft flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-black text-brand-ink">
                تفاصيل الفصل الدراسي
              </h2>
              <p className="text-xs text-brand-muted mt-0.5">
                أدخل عدد الساعات المسجلة وسعر الساعة المعتمد لتخصصك بالدينار الأردني لحساب التكلفة التقديرية.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4FAFF] text-brand-primary border border-brand-border-soft text-xs font-bold shrink-0 self-start sm:self-auto">
              <span>التخصص:</span>
              <span>{selectedPlan.major}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5 pt-1">
            {/* 1. عدد الساعات المسجلة */}
            <div className="space-y-2">
              <label htmlFor="credit-hours" className="block text-xs font-bold text-brand-ink">
                عدد الساعات المسجلة
              </label>
              <input
                id="credit-hours"
                type="number"
                min="0"
                max="30"
                value={creditHours === 0 ? "" : creditHours}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setCreditHours(isNaN(val) ? 0 : Math.max(0, val));
                }}
                placeholder="مثال: 6"
                className="w-full h-11 px-4 rounded-xl border border-brand-border-soft text-xs sm:text-sm font-bold text-brand-ink focus:outline-none focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20"
              />
            </div>

            {/* 2. سعر الساعة حسب التخصص (د.أ) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="hourly-rate" className="block text-xs font-bold text-brand-ink">
                  سعر الساعة حسب التخصص (د.أ)
                </label>
                {ratePerHour !== selectedPlan.hourlyRate && (
                  <button
                    type="button"
                    onClick={() => setRatePerHour(selectedPlan.hourlyRate)}
                    className="text-[10px] text-brand-primary hover:underline font-bold"
                  >
                    استعادة الافتراضي ({selectedPlan.hourlyRate} د.أ)
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  id="hourly-rate"
                  type="number"
                  min="0"
                  step="0.5"
                  value={ratePerHour === 0 ? "" : ratePerHour}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setRatePerHour(isNaN(val) ? 0 : Math.max(0, val));
                  }}
                className="w-full h-11 px-4 pe-12 rounded-xl border border-brand-border-soft text-xs sm:text-sm font-bold text-brand-primary focus:outline-none focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20"
                />
                <span className="absolute end-3 top-3 text-xs font-bold text-brand-muted pointer-events-none" dir="ltr">
                  د.أ
                </span>
              </div>
            </div>

            {/* 3. نسبة الرسوم الإضافية - تأمين وأنشطة (%) */}
            <div className="space-y-2">
              <label htmlFor="fee-percent" className="block text-xs font-bold text-brand-ink">
                نسبة الرسوم الإضافية - تأمين وأنشطة (%)
              </label>
              <div className="relative">
                <input
                  id="fee-percent"
                  type="number"
                  min="0"
                  max="50"
                  step="1"
                  value={additionalFeePercent === 0 ? "" : additionalFeePercent}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setAdditionalFeePercent(isNaN(val) ? 0 : Math.max(0, val));
                  }}
                  className="w-full h-11 px-4 pe-8 rounded-xl border border-brand-border-soft text-xs sm:text-sm font-bold text-brand-ink focus:outline-none focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20"
                />
                <span className="absolute end-3 top-3 text-xs font-bold text-brand-muted pointer-events-none" dir="ltr">
                  %
                </span>
              </div>
            </div>
          </div>

          {/* Mathematical breakdown formula (Matching screenshot: "168 + 10%") */}
          <div className="p-3.5 rounded-2xl bg-brand-surface-soft border border-brand-border-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-brand-primary font-bold">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-primary shrink-0" />
              <span>معادلة الاحتساب:</span>
              <span className="font-mono text-sm tracking-wide bg-white px-3 py-1 rounded-lg border border-brand-border-soft shadow-2xs" dir="ltr">
                {tuitionCost.toFixed(0)} + {safePercent}%
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-brand-muted">
              <span>العملة المعتمدة:</span>
              <strong className="text-brand-primary font-black">الدينار الأردني (د.أ / JD)</strong>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* CARD 2: تفصيل التكلفة (Matching user screenshot)             */}
        {/* ============================================================ */}
        <section className="p-6 sm:p-7 rounded-3xl bg-white border border-brand-border-soft shadow-xs space-y-5">
          <div className="pb-3 border-b border-brand-border-soft flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-black text-brand-ink">
                تفصيل التكلفة
              </h2>
              <p className="text-xs text-brand-muted mt-0.5">
                النتائج المالية الصافية للفصل الدراسي بحسب المدخلات.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-surface-blue text-brand-primary border border-brand-border-soft">
              العملة: دينار أردني (د.أ)
            </span>
          </div>

          {/* 3 Metric Result Boxes (from user screenshot) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 1. تكلفة الساعات */}
            <div className="card-hover-effect p-5 rounded-2xl bg-brand-surface-muted border border-brand-border-soft text-center space-y-1">
              <span className="text-xs font-semibold text-brand-muted block">
                تكلفة الساعات
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-brand-ink" dir="ltr">
                {tuitionCost.toFixed(0)} <span className="text-base font-bold text-brand-primary">د.أ</span>
              </div>
              <span className="text-[10px] text-brand-muted block">
                {safeHours} ساعات × {safeRate} د.أ
              </span>
            </div>

            {/* 2. الرسوم الإضافية السنوية */}
            <div className="card-hover-effect p-5 rounded-2xl bg-brand-surface-muted border border-brand-border-soft text-center space-y-1">
              <span className="text-xs font-semibold text-brand-muted block">
                الرسوم الإضافية السنوية
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-brand-hover-medium" dir="ltr">
                {additionalFees.toFixed(1)} <span className="text-base font-bold text-brand-hover-medium">د.أ</span>
              </div>
              <span className="text-[10px] text-brand-muted block">
                نسبة {safePercent}% تأمين وأنشطة
              </span>
            </div>

            {/* 3. الإجمالي المطلوب */}
            <div className="card-hover-effect p-5 rounded-2xl bg-brand-surface-blue border border-brand-primary/30 text-center space-y-1 shadow-xs">
              <span className="text-xs font-bold text-brand-primary block">
                الإجمالي المطلوب
              </span>
              <div className="text-2xl sm:text-3xl font-black text-brand-primary" dir="ltr">
                {totalRequired.toFixed(1)} <span className="text-base font-extrabold text-brand-primary">د.أ</span>
              </div>
              <span className="text-[10px] text-brand-hover-medium font-semibold block">
                شامل الساعات والرسوم الإضافية
              </span>
            </div>
          </div>

          {/* Screenshot Note Footer (Exact text from screenshot) */}
          <div className="p-3.5 rounded-2xl bg-brand-surface-soft border border-brand-border-soft text-xs text-brand-muted leading-relaxed">
            التأمين والأنشطة تُحسب كنسبة من تكلفة الساعات - حالياً {safePercent}% أو {additionalFees.toFixed(2)} دينار أردني على المبلغ المطلوب
          </div>
        </section>
      </div>
    </StudentShell>
  );
}
