"use client";

import React from "react";
import { StudyPlan } from "@/src/data/study-plans-data";

export interface PlanCardProps {
  plan: StudyPlan;
  isSelected: boolean;
  onSelect: (plan: StudyPlan) => void;
  onViewDetails: (plan: StudyPlan) => void;
}

export function PlanCard({
  plan,
  isSelected,
  onSelect,
  onViewDetails,
}: PlanCardProps) {
  // Render icon based on plan iconName
  const renderIcon = () => {
    switch (plan.iconName) {
      case "computer":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case "database":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
        );
      case "chip":
      case "cpu":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        );
      case "robot":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        );
      case "sparkles":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18C5 19.94 8.13 22 12 22C15.87 22 19 19.94 19 17.18V13.18L12 17.09L5 13.18Z" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`card-hover-effect relative rounded-3xl p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between gap-5 border bg-white h-full ${
        isSelected
          ? "border-[#0057C8] ring-2 ring-[#0057C8]/25 shadow-md"
          : "border-[#D7EAF7] hover:border-[#4DB7F2] shadow-xs"
      }`}
      dir="rtl"
    >
      {/* Top Banner for Selected State */}
      {isSelected && (
        <div className="absolute -top-3 end-6 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#0057C8] text-white text-[11px] font-bold shadow-xs">
          <span>✓ الخطة الحالية المعتمدة</span>
        </div>
      )}

      {/* Main Info */}
      <div className="space-y-4">
        {/* Header with Icon and Degree Badge */}
        <div className="flex items-start justify-between gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
              isSelected
                ? "bg-[#0057C8] text-white shadow-sm"
                : "bg-[#EAF4FD] text-[#0057C8]"
            }`}
          >
            {renderIcon()}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 justify-end">
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                plan.degree === "ماجستير"
                  ? "bg-purple-50 text-purple-700 border-purple-200"
                  : "bg-[#EAF4FD] text-[#0057C8] border-[#D7EAF7]"
              }`}
            >
              {plan.degree}
            </span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F4FAFF] text-[#16324A] border border-[#D7EAF7]">
              سعر الساعة: {plan.hourlyRate} د.أ
            </span>
          </div>
        </div>

        {/* Major Title & College */}
        <div>
          <h3 className="text-lg sm:text-xl font-black text-[#16324A] tracking-tight group-hover:text-[#0057C8] transition-colors line-clamp-2 min-h-[3.25rem]">
            {plan.major}
          </h3>
          <span className="text-xs text-[#66788A] font-medium block mt-1">
            {plan.college}
          </span>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-[#66788A] leading-relaxed line-clamp-2">
          {plan.description}
        </p>

        {/* Metrics Bar matching Al-Azhar portal screenshot */}
        <div className="pt-3 border-t border-[#D7EAF7]/60 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-[#16324A] font-bold">
            <svg className="w-4 h-4 text-[#0057C8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{plan.totalCredits} ساعة دراسية</span>
          </div>

          <div className="flex items-center gap-1.5 text-[#66788A] font-semibold">
            <svg className="w-4 h-4 text-[#2D78B7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{plan.semestersCount} فصول أكاديمية</span>
          </div>
        </div>

        {/* Compulsory vs Elective Hours Breakdown (From user table) */}
        <div className="flex items-center justify-between text-[11px] px-3 py-1.5 rounded-xl bg-[#F4FAFF] border border-[#D7EAF7] text-[#16324A]">
          <span className="font-semibold text-[#16324A]">
            إجباري: <strong className="text-[#0057C8] font-black">{plan.compulsoryCredits} س</strong>
          </span>
          <span className="text-[#D7EAF7]">|</span>
          <span className="font-semibold text-[#16324A]">
            اختياري: <strong className="text-[#2D78B7] font-black">{plan.electiveCredits} س</strong>
            {plan.majorElectiveCredits ? (
              <span className="text-[10px] text-[#66788A] ms-1">({plan.majorElectiveCredits} تخصص)</span>
            ) : null}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-[#D7EAF7]/60 space-y-2">
        <div className="flex items-center gap-2">
          {/* Primary Action: Select Plan */}
          <button
            type="button"
            onClick={() => onSelect(plan)}
            disabled={isSelected}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 ${
              isSelected
                ? "bg-[#EAF4FD] text-[#0057C8] border border-[#0057C8]/30 cursor-default"
                : "bg-[#0057C8] hover:bg-[#2D78B7] text-white hover:shadow-sm"
            }`}
          >
            {isSelected ? (
              <>
                <span>✓</span>
                <span>الخطة الحالية</span>
              </>
            ) : (
              <span>اختيار الخطة</span>
            )}
          </button>

          {/* Secondary Action: View Plan Details */}
          <button
            type="button"
            onClick={() => onViewDetails(plan)}
            className="py-2.5 px-3.5 rounded-xl border border-[#D7EAF7] hover:border-[#4DB7F2] bg-[#F8FBFE] hover:bg-white text-[#16324A] hover:text-[#0057C8] text-xs font-bold transition-colors"
            title="عرض المساقات وتفاصيل الفصول"
          >
            عرض الخطة
          </button>

          {/* PDF Download Button */}
          {plan.pdfUrl && (
            <a
              href={plan.pdfUrl}
              download={plan.pdfFilename || `${plan.major}.pdf`}
              className="p-2.5 rounded-xl border border-[#D7EAF7] hover:border-red-200 bg-white hover:bg-red-50 text-red-600 transition-colors"
              title="تحميل ملف الخطة (PDF)"
              aria-label="تحميل PDF"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

