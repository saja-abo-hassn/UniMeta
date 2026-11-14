"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStudyPlan } from "@/src/contexts/study-plan-context";
import { StudyPlan } from "@/src/data/study-plans-data";
import { Modal } from "@/components/shared/modal";

export interface AcademicMajor {
  id: string;
  name: string;
  degree: string;
  totalHours: number;
  hourlyRate: number; // in JD (Jordanian Dinar)
  pdfFilename: string;
  pdfPath: string;
  description: string;
}

export interface AcademicHeaderProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  title?: string;
  subtitle?: string;
  currentMajor?: AcademicMajor;
  onMajorChange?: (major: AcademicMajor) => void;
}

export function AcademicHeader({
  title = "مساري الأكاديمي",
  subtitle = "خطتك الدراسية وأدوات حساب الساعات، الرسوم، والمعدل - بحسب تخصصك المختار",
}: AcademicHeaderProps) {
  const { plans, selectedPlan, selectPlan } = useStudyPlan();
  const [isChangingMajor, setIsChangingMajor] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);

  const handleSelectPlan = (plan: StudyPlan) => {
    selectPlan(plan.id);
    setIsChangingMajor(false);
  };

  return (
    <div className="space-y-4" dir="rtl">
      {/* ============================================================ */}
      {/* 1. Header Title & Description (Matching User Screenshot)     */}
      {/* ============================================================ */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-ink tracking-tight">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* ============================================================ */}
      {/* 2. Major Card (Matching User Screenshot Layout)              */}
      {/* ============================================================ */}
      <section className="card-entrance relative overflow-hidden p-5 sm:p-6 rounded-3xl bg-white border border-brand-border-soft shadow-xs">
        <div className="absolute top-0 end-0 -mt-8 -me-8 w-64 h-64 bg-gradient-to-br from-brand-secondary/10 to-brand-primary/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Major Title & Degree */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary text-white flex items-center justify-center shrink-0 shadow-md">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18C5 19.94 8.13 22 12 22C15.87 22 19 19.94 19 17.18V13.18L12 17.09L5 13.18Z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-brand-ink">
                  {selectedPlan.major}
                </h2>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-surface-blue text-brand-primary border border-brand-border-soft">
                  سعر الساعة: {selectedPlan.hourlyRate} د.أ
                </span>
              </div>
              <span className="text-xs sm:text-sm text-brand-muted font-medium block mt-0.5">
                {selectedPlan.college} • {selectedPlan.degree} - {selectedPlan.totalCredits} ساعة دراسية ({selectedPlan.semestersCount} فصول)
              </span>
            </div>
          </div>

          {/* Action Buttons: View PDF & Change Major */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowPdfModal(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-hover-medium text-white text-xs sm:text-sm font-bold transition-all shadow-xs group"
            >
              <svg className="w-4 h-4 text-[#BFE8FF] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              <span>عرض خطة التخصص [PDF]</span>
            </button>

            <button
              type="button"
              onClick={() => setIsChangingMajor(!isChangingMajor)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-surface-soft hover:bg-brand-surface-blue text-brand-primary text-xs sm:text-sm font-bold border border-brand-border-soft transition-colors"
            >
              <svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span>{isChangingMajor ? "إلغاء التغيير" : "تغيير التخصص"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. Major Selector Grid Dropdown (When requested)             */}
      {/* ============================================================ */}
      {isChangingMajor && (
        <section className="p-5 sm:p-6 rounded-3xl bg-white border border-brand-secondary shadow-md animate-fade-in space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-border-soft">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
              <h3 className="text-sm font-bold text-brand-ink">
                اختر خطة التخصص الأكاديمي المعتمدة لجامعة الأزهر:
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsChangingMajor(false)}
              className="text-xs text-brand-muted hover:text-brand-ink px-2 py-1 rounded-lg hover:bg-brand-surface-soft transition-colors"
            >
              إلغاء ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[380px] overflow-y-auto p-1">
            {plans.map((p) => {
              const isSelected = selectedPlan.id === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPlan(p)}
                  className={`p-4 rounded-2xl border text-start transition-all duration-150 flex flex-col justify-between gap-3 ${
                    isSelected
                      ? "bg-brand-surface-blue border-brand-primary ring-2 ring-brand-primary/20 shadow-sm"
                      : "bg-brand-surface-muted border-brand-border-soft hover:border-brand-secondary hover:bg-white text-brand-ink"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-brand-ink">{p.major}</span>
                      {isSelected ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-primary text-white">
                          الخطة الحالية
                        </span>
                      ) : (
                        <span className="text-[10px] text-brand-muted">{p.degree}</span>
                      )}
                    </div>
                    <span className="text-[11px] text-brand-muted block">
                      {p.totalCredits} ساعة • {p.semestersCount} فصول
                    </span>
                  </div>

                  <div className="pt-2 border-t border-brand-border-soft/60 flex items-center justify-between text-[11px]">
                    <span className="text-brand-muted">سعر الساعة:</span>
                    <span className="font-bold text-brand-primary">{p.hourlyRate} د.أ (JD)</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* PDF Modal (Preview & Direct Download)                        */}
      {/* ============================================================ */}
      <Modal
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        size="md"
      >
        <Modal.Header
          title={`خطة تخصص ${selectedPlan.major}`}
          description={`${selectedPlan.college} • ${selectedPlan.degree} - ${selectedPlan.totalCredits} ساعة معتمدة`}
          badge={<span className="p-2 rounded-xl bg-red-50 text-red-600 font-bold text-xs">PDF</span>}
          onClose={() => setShowPdfModal(false)}
        />
        <Modal.Body className="p-5 sm:p-6 space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-brand-surface-muted border border-brand-border-soft space-y-2.5 text-xs text-brand-ink">
            <div className="flex justify-between items-center pb-2 border-b border-brand-border-soft/60">
              <span className="text-brand-muted">اسم الملف في النظام:</span>
              <span className="font-mono font-bold text-brand-primary">{selectedPlan.pdfFilename || `${selectedPlan.major}.pdf`}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-brand-border-soft/60">
              <span className="text-brand-muted">مسار حفظ الملف:</span>
              <span className="font-mono text-[11px] text-brand-hover-medium">public{selectedPlan.pdfUrl}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-brand-muted">سعر الساعة المعتمد:</span>
              <span className="font-bold text-brand-ink">{selectedPlan.hourlyRate} د.أ (دينار أردني)</span>
            </div>
            <p className="text-[11px] text-brand-muted pt-2 border-t border-brand-border-soft/60 leading-relaxed">
              {selectedPlan.description}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex-wrap justify-end gap-2.5">
          <button
            type="button"
            onClick={() => setShowPdfModal(false)}
            className="px-4 py-2 rounded-xl border border-brand-border-soft text-xs font-semibold text-brand-ink hover:bg-brand-surface-soft transition-colors cursor-pointer"
          >
            إلغاء
          </button>
          {selectedPlan.pdfUrl && (
            <>
              <a
                href={selectedPlan.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-white hover:bg-brand-surface-blue border border-brand-primary text-brand-primary text-xs font-bold transition-colors inline-flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span>فتح في تبويب جديد</span>
              </a>

              <a
                href={selectedPlan.pdfUrl}
                download={selectedPlan.pdfFilename || `${selectedPlan.major}.pdf`}
                className="px-5 py-2 rounded-xl bg-brand-primary hover:bg-brand-hover-medium text-white text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5 text-[#BFE8FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>تحميل الخطة (PDF)</span>
              </a>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}
