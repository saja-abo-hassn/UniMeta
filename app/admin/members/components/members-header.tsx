"use client";

import React from "react";

export function MembersHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0057C8]" />
          <span className="text-xs font-bold text-[#0057C8] uppercase tracking-wider">
            إدارة المستخدمين
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#16324A] tracking-tight">
          الأعضاء والطلاب النشطين
        </h1>
        <p className="text-xs sm:text-sm text-[#66788A] leading-relaxed max-w-2xl">
          سجل حسابات الطلاب والباحثين المسجلين في منصة UniMeta. متابعة حالة الحسابات، آخر ظهور، وعمليات الإعارة النشطة.
        </p>
      </div>
    </div>
  );
}

