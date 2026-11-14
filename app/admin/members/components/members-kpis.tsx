"use client";

import React from "react";

interface MembersKPIsProps {
  counts: {
    total: number;
    active: number;
    suspended: number;
    banned: number;
  };
}

export function MembersKPIs({ counts }: MembersKPIsProps) {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div className="p-5 rounded-2xl bg-white border border-brand-border-soft shadow-xs space-y-1">
        <span className="text-xs font-semibold text-brand-muted block">إجمالي الأعضاء</span>
        <div className="text-2xl sm:text-3xl font-black text-brand-ink">
          {counts.total}
        </div>
        <span className="text-[11px] text-brand-muted block">طالب وباحث مسجل</span>
      </div>

      <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-xs space-y-1">
        <span className="text-xs font-bold text-emerald-800 block">الحسابات النشطة</span>
        <div className="text-2xl sm:text-3xl font-black text-emerald-800">
          {counts.active}
        </div>
        <span className="text-[11px] text-emerald-700 block">تفاعل دوري وسليم</span>
      </div>

      <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-xs space-y-1">
        <span className="text-xs font-bold text-amber-800 block">حسابات معلقة مؤقتاً</span>
        <div className="text-2xl sm:text-3xl font-black text-amber-800">
          {counts.suspended}
        </div>
        <span className="text-[11px] text-amber-700 block">بانتظار استكمال متطلبات</span>
      </div>

      <div className="p-5 rounded-2xl bg-white border border-brand-border-soft shadow-xs space-y-1">
        <span className="text-xs font-semibold text-brand-muted block">حسابات محظورة</span>
        <div className="text-2xl sm:text-3xl font-black text-red-600">
          {counts.banned}
        </div>
        <span className="text-[11px] text-brand-muted block">بموجب قرارات إدارية</span>
      </div>
    </section>
  );
}

