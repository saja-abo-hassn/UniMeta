import React from "react";
import { CATEGORY_LABELS } from "@/src/data/study-plans-data";
import { CategoryStat } from "../types";

interface MyHoursKPIsProps {
  totalCredits: number;
  completedCredits: number;
  remainingCredits: number;
  completionPercentage: number;
  cumulativeGpa: number;
  gpaRating: { label: string; color: string };
  categoryStats: CategoryStat[];
}

export function MyHoursKPIs({
  totalCredits,
  completedCredits,
  remainingCredits,
  completionPercentage,
  cumulativeGpa,
  gpaRating,
  categoryStats,
}: MyHoursKPIsProps) {
  return (
    <>
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="card-hover-effect p-5 rounded-2xl bg-white border border-brand-border-soft shadow-xs space-y-1">
          <span className="text-xs font-semibold text-brand-muted block">إجمالي ساعات الخطة</span>
          <div className="text-2xl sm:text-3xl font-black text-brand-ink">
            {totalCredits} <span className="text-xs font-normal text-brand-muted">ساعة</span>
          </div>
          <span className="text-[11px] text-brand-muted block">الساعات المطلوبة للتخرج</span>
        </div>

        <div className="card-hover-effect p-5 rounded-2xl bg-brand-surface-blue border border-brand-primary/20 shadow-xs space-y-1">
          <span className="text-xs font-bold text-brand-primary block">الساعات المنجزة</span>
          <div className="text-2xl sm:text-3xl font-black text-brand-primary">
            {completedCredits} <span className="text-xs font-normal text-brand-hover-medium">ساعة</span>
          </div>
          <span className="text-[11px] text-brand-hover-medium font-semibold block">
            نسبة الإنجاز: {completionPercentage}%
          </span>
        </div>

        <div className="card-hover-effect p-5 rounded-2xl bg-white border border-brand-border-soft shadow-xs space-y-1">
          <span className="text-xs font-semibold text-brand-muted block">الساعات المتبقية</span>
          <div className="text-2xl sm:text-3xl font-black text-brand-ink">
            {remainingCredits} <span className="text-xs font-normal text-brand-muted">ساعة</span>
          </div>
          <span className="text-[11px] text-brand-muted block">حتى إنهاء متطلبات التخرج</span>
        </div>

        <div className="card-hover-effect p-5 rounded-2xl bg-white border border-brand-border-soft shadow-xs space-y-1">
          <span className="text-xs font-semibold text-brand-muted block">المعدل التراكمي المحسوب</span>
          <div className="text-2xl sm:text-3xl font-black text-brand-primary" dir="ltr">
            {cumulativeGpa > 0 ? `${cumulativeGpa.toFixed(2)}%` : "—"}
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border inline-block ${gpaRating.color}`}>
            {gpaRating.label}
          </span>
        </div>
      </section>

      <section className="p-5 sm:p-6 rounded-3xl bg-white border border-brand-border-soft shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-brand-ink">
              مؤشر إنجاز متطلبات التخرج
            </h2>
            <p className="text-xs text-brand-muted">
              يتم تحديث الساعات المنجزة والمتبقية والمعدل مباشرة عند إضافة مادة أو تعديل ساعاتها وعلامتها.
            </p>
          </div>
          <span className="text-xs font-bold text-brand-primary bg-brand-surface-soft px-3 py-1 rounded-xl border border-brand-border-soft">
            {completedCredits} من أصل {totalCredits} ساعة ({completionPercentage}%)
          </span>
        </div>

        <div className="h-4 w-full bg-brand-surface-blue rounded-full overflow-hidden flex p-0.5 border border-brand-border-soft">
          <div
            style={{ width: `${completionPercentage}%` }}
            className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full transition-all duration-500 shadow-2xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {categoryStats.map((cat) => {
            const pct = cat.required > 0 ? Math.min(100, Math.round((cat.completed / cat.required) * 100)) : 0;
            const badge = CATEGORY_LABELS[cat.id] || CATEGORY_LABELS.major;
            return (
              <div key={cat.id} className="p-3 rounded-2xl bg-brand-surface-muted border border-brand-border-soft space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-brand-ink">{cat.title}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${badge.color}`}>
                    {pct}%
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${pct}%` }}
                    className="h-full bg-brand-primary rounded-full transition-all duration-300"
                  />
                </div>
                <div className="flex justify-between text-[11px] text-brand-muted">
                  <span>المنجز: {cat.completed} س</span>
                  <span>المطلوب: {cat.required} س</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

