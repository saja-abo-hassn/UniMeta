"use client";

import React, { useState } from "react";
import { StudyPlan } from "@/src/data/study-plans-data";
import { Modal } from "@/components/shared/modal";

export interface SelectedPlanBannerProps {
  plan: StudyPlan;
  completedCredits: number;
  remainingCredits: number;
  completionPercentage: number;
  cumulativeGpa: number;
  gpaRating: { label: string; color: string };
  onChangePlanRequest: () => void;
  onViewPlanDetails: (plan: StudyPlan) => void;
}

export function SelectedPlanBanner({
  plan,
  completedCredits,
  remainingCredits,
  completionPercentage,
  cumulativeGpa,
  gpaRating,
  onChangePlanRequest,
  onViewPlanDetails,
}: SelectedPlanBannerProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleConfirmChange = () => {
    setShowConfirmModal(false);
    onChangePlanRequest();
  };

  return (
    <section
      className="card-entrance relative overflow-hidden p-6 sm:p-7 rounded-3xl bg-white border border-brand-border-soft shadow-xs space-y-5"
      dir="rtl"
    >
      <div className="absolute top-0 end-0 -mt-8 -me-8 w-64 h-64 bg-gradient-to-br from-brand-secondary/10 to-brand-primary/5 rounded-full blur-2xl pointer-events-none" />

      {/* Top Banner Row */}
      <div className="relative z-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-surface-blue text-brand-primary border border-brand-border-soft">
              <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
              الخطة الدراسية النشطة والمعتمدة
            </span>
            <span className="text-xs text-brand-muted font-semibold">
              {plan.college} · {plan.degree}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary text-white flex items-center justify-center shrink-0 shadow-md">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18C5 19.94 8.13 22 12 22C15.87 22 19 19.94 19 17.18V13.18L12 17.09L5 13.18Z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-brand-ink tracking-tight">
                خطتك الحالية: {plan.major}
              </h2>
              <span className="text-xs sm:text-sm text-brand-muted block mt-0.5">
                {plan.totalCredits} ساعة معتمدة ({plan.compulsoryCredits} إجباري + {plan.electiveCredits} اختياري) • {plan.semestersCount} فصول دراسية • سعر الساعة: {plan.hourlyRate} د.أ
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onViewPlanDetails(plan)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-hover-medium text-white text-xs sm:text-sm font-bold transition-all shadow-xs"
          >
            <svg className="w-4 h-4 text-[#BFE8FF]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            <span>استعراض مساقات الخطة التفصيلية</span>
          </button>

          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-surface-soft hover:bg-brand-surface-blue text-brand-primary text-xs sm:text-sm font-bold border border-brand-border-soft transition-colors"
          >
            <svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <span>تغيير الخطة الدراسية</span>
          </button>
        </div>
      </div>

      {/* 4 Connected KPI Badges (Live Sync with Plan and Marks) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
        <div className="p-3.5 rounded-2xl bg-brand-surface-muted border border-brand-border-soft space-y-1">
          <span className="text-brand-muted block font-medium">الساعات المنجزة:</span>
          <div className="text-xl sm:text-2xl font-black text-brand-ink">
            {completedCredits} <span className="text-xs font-semibold text-brand-muted">/ {plan.totalCredits} س</span>
          </div>
          <span className="text-[10px] text-brand-primary font-bold block">
            نسبة الإنجاز: {completionPercentage}%
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-brand-surface-muted border border-brand-border-soft space-y-1">
          <span className="text-brand-muted block font-medium">الساعات المتبقية:</span>
          <div className="text-xl sm:text-2xl font-black text-brand-hover-medium">
            {remainingCredits} <span className="text-xs font-semibold text-brand-muted">ساعة</span>
          </div>
          <span className="text-[10px] text-brand-muted block">
            حتى استيفاء متطلبات التخرج
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-brand-surface-muted border border-brand-border-soft space-y-1">
          <span className="text-brand-muted block font-medium">المعدل التراكمي الموزون:</span>
          <div className="text-xl sm:text-2xl font-black text-brand-primary">
            {cumulativeGpa > 0 ? `${cumulativeGpa.toFixed(2)}%` : "قيد الاحتساب"}
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border inline-block ${gpaRating.color}`}>
            {gpaRating.label}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-brand-surface-muted border border-brand-border-soft space-y-1">
          <span className="text-brand-muted block font-medium">سعر الساعة المعتمد:</span>
          <div className="text-xl sm:text-2xl font-black text-brand-ink">
            {plan.hourlyRate} <span className="text-xs font-semibold text-brand-primary">د.أ (JD)</span>
          </div>
          <span className="text-[10px] text-brand-muted block">
            للفصل الدراسي المسجل
          </span>
        </div>
      </div>

      {/* Confirmation Modal: تغيير الخطة */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        size="sm"
      >
        <Modal.Header
          title="تأكيد تغيير الخطة الدراسية"
          badge={<span className="text-lg">⚠️</span>}
          onClose={() => setShowConfirmModal(false)}
        />
        <Modal.Body className="p-5 sm:p-6 text-xs sm:text-sm text-brand-muted leading-relaxed">
          أنت حالياً معتمد لخطة <strong className="text-brand-ink">{plan.major}</strong>.
          عند اختيار تخصص آخر، سيتم ربط المساقات والحاسبات الأكاديمية (الساعات والرسوم والمعدل) بالخطة الجديدة. هل ترغب بالاستمرار وتصفح الخطط المتاحة؟
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            onClick={() => setShowConfirmModal(false)}
            className="px-4 py-2 rounded-xl border border-brand-border-soft text-xs font-semibold text-brand-ink hover:bg-brand-surface-muted cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleConfirmChange}
            className="px-5 py-2 rounded-xl bg-brand-primary hover:bg-brand-hover-medium text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            نعم، الانتقال لاختيار خطة
          </button>
        </Modal.Footer>
      </Modal>
    </section>
  );
}

