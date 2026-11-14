"use client";

import React from "react";

interface AgreementsKpiCardsProps {
  activeAgreementsCount: number;
  returningCount: number;
  pendingIncomingCount: number;
  pendingOutgoingCount: number;
}

export function AgreementsKpiCards({
  activeAgreementsCount,
  returningCount,
  pendingIncomingCount,
  pendingOutgoingCount,
}: AgreementsKpiCardsProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="card-hover-effect p-5 rounded-2xl bg-white border border-brand-border-soft shadow-xs space-y-1">
        <div className="flex items-center justify-between text-xs font-semibold text-brand-muted">
          <span>اتفاقيات نشطة</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
        </div>
        <div className="text-2xl sm:text-3xl font-black text-brand-primary">
          {activeAgreementsCount}
        </div>
        <span className="text-[11px] text-brand-hover-medium block font-medium">
          ممتلكات قيد الاستخدام المتبادل
        </span>
      </div>

      <div className="card-hover-effect p-5 rounded-2xl bg-white border border-brand-border-soft shadow-xs space-y-1">
        <div className="flex items-center justify-between text-xs font-semibold text-brand-muted">
          <span>بانتظار الإرجاع قريباً</span>
          <span className="w-2 h-2 rounded-full bg-amber-500" />
        </div>
        <div className="text-2xl sm:text-3xl font-black text-brand-ink">
          {returningCount}
        </div>
        <span className="text-[11px] text-brand-muted block">
          خلال أقل من 3 أيام
        </span>
      </div>

      <div className="card-hover-effect p-5 rounded-2xl bg-white border border-brand-border-soft shadow-xs space-y-1">
        <div className="flex items-center justify-between text-xs font-semibold text-brand-muted">
          <span>طلبات واردة جديدة</span>
          {pendingIncomingCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-brand-primary text-white text-[10px] font-bold">
              +{pendingIncomingCount}
            </span>
          )}
        </div>
        <div className="text-2xl sm:text-3xl font-black text-brand-secondary">
          {pendingIncomingCount}
        </div>
        <span className="text-[11px] text-brand-muted block">
          طلاب يرغبون باستعارة أدواتك
        </span>
      </div>

      <div className="card-hover-effect p-5 rounded-2xl bg-white border border-brand-border-soft shadow-xs space-y-1">
        <div className="flex items-center justify-between text-xs font-semibold text-brand-muted">
          <span>طلباتي الصادرة</span>
          <span className="w-2 h-2 rounded-full bg-brand-secondary" />
        </div>
        <div className="text-2xl sm:text-3xl font-black text-brand-ink">
          {pendingOutgoingCount}
        </div>
        <span className="text-[11px] text-brand-muted block">
          قيد مراجعة المالكين
        </span>
      </div>
    </section>
  );
}

