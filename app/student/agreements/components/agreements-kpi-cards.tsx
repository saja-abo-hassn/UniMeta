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
      <div className="card-hover-effect p-5 rounded-2xl bg-white border border-[#D7EAF7] shadow-xs space-y-1">
        <div className="flex items-center justify-between text-xs font-semibold text-[#66788A]">
          <span>اتفاقيات نشطة</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
        </div>
        <div className="text-2xl sm:text-3xl font-black text-[#0057C8]">
          {activeAgreementsCount}
        </div>
        <span className="text-[11px] text-[#2D78B7] block font-medium">
          ممتلكات قيد الاستخدام المتبادل
        </span>
      </div>

      <div className="card-hover-effect p-5 rounded-2xl bg-white border border-[#D7EAF7] shadow-xs space-y-1">
        <div className="flex items-center justify-between text-xs font-semibold text-[#66788A]">
          <span>بانتظار الإرجاع قريباً</span>
          <span className="w-2 h-2 rounded-full bg-amber-500" />
        </div>
        <div className="text-2xl sm:text-3xl font-black text-[#16324A]">
          {returningCount}
        </div>
        <span className="text-[11px] text-[#66788A] block">
          خلال أقل من 3 أيام
        </span>
      </div>

      <div className="card-hover-effect p-5 rounded-2xl bg-white border border-[#D7EAF7] shadow-xs space-y-1">
        <div className="flex items-center justify-between text-xs font-semibold text-[#66788A]">
          <span>طلبات واردة جديدة</span>
          {pendingIncomingCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-[#0057C8] text-white text-[10px] font-bold">
              +{pendingIncomingCount}
            </span>
          )}
        </div>
        <div className="text-2xl sm:text-3xl font-black text-[#4DB7F2]">
          {pendingIncomingCount}
        </div>
        <span className="text-[11px] text-[#66788A] block">
          طلاب يرغبون باستعارة أدواتك
        </span>
      </div>

      <div className="card-hover-effect p-5 rounded-2xl bg-white border border-[#D7EAF7] shadow-xs space-y-1">
        <div className="flex items-center justify-between text-xs font-semibold text-[#66788A]">
          <span>طلباتي الصادرة</span>
          <span className="w-2 h-2 rounded-full bg-[#4DB7F2]" />
        </div>
        <div className="text-2xl sm:text-3xl font-black text-[#16324A]">
          {pendingOutgoingCount}
        </div>
        <span className="text-[11px] text-[#66788A] block">
          قيد مراجعة المالكين
        </span>
      </div>
    </section>
  );
}

