"use client";

import React from "react";

interface AgreementStatsCardsProps {
  counts: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    modification: number;
  };
}

export function AgreementStatsCards({ counts }: AgreementStatsCardsProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="card-hover-effect p-5 rounded-2xl bg-white border border-brand-border-soft shadow-xs flex flex-col justify-between min-h-[135px]">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-brand-muted truncate">إجمالي الاتفاقيات</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-surface-soft text-brand-primary border border-brand-border-soft">
            عقود مسجلة
          </span>
        </div>
        <div className="flex items-baseline gap-2 my-auto">
          <span className="text-2xl sm:text-3xl font-extrabold text-brand-ink">{counts.total}</span>
        </div>
        <div className="mt-2 pt-2 border-t border-brand-border-soft/60 flex items-center gap-1.5 text-[11px] text-brand-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary" />
          <span>استعارة وتبادل وعهد</span>
        </div>
      </div>

      <div className="card-hover-effect p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 shadow-xs flex flex-col justify-between min-h-[135px]">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-amber-800 truncate">بانتظار قرار الإدارة</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
            مراجعة عاجلة
          </span>
        </div>
        <div className="flex items-baseline gap-2 my-auto">
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-800">{counts.pending}</span>
        </div>
        <div className="mt-2 pt-2 border-t border-brand-border-soft/60 flex items-center gap-1.5 text-[11px] text-amber-800">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span>تحتاج تدقيقاً وقراراً</span>
        </div>
      </div>

      <div className="card-hover-effect p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 shadow-xs flex flex-col justify-between min-h-[135px]">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-emerald-800 truncate">الاتفاقيات المعتمدة</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            سارية
          </span>
        </div>
        <div className="flex items-baseline gap-2 my-auto">
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-800">{counts.approved}</span>
        </div>
        <div className="mt-2 pt-2 border-t border-emerald-200/60 flex items-center gap-1.5 text-[11px] text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>معتمدة أو بانتظار التسليم</span>
        </div>
      </div>

      <div className="card-hover-effect p-5 rounded-2xl bg-white border border-brand-border-soft shadow-xs flex flex-col justify-between min-h-[135px]">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-brand-muted truncate">المرفوضة أو قيد التعديل</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
            متابعة
          </span>
        </div>
        <div className="flex items-baseline gap-2 my-auto">
          <span className="text-2xl sm:text-3xl font-extrabold text-red-600">{counts.rejected + counts.modification}</span>
        </div>
        <div className="mt-2 pt-2 border-t border-brand-border-soft/60 flex items-center gap-1.5 text-[11px] text-brand-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
          <span>{counts.rejected} مرفوضة • {counts.modification} تعديل</span>
        </div>
      </div>
    </section>
  );
}

