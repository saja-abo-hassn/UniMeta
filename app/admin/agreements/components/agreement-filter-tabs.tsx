"use client";

import React from "react";
import { AdminAgreementStatus } from "@/src/types/admin";

interface AgreementFilterTabsProps {
  activeTab: "all" | AdminAgreementStatus;
  setActiveTab: (tab: "all" | AdminAgreementStatus) => void;
  categoryFilter: "all" | "أجهزة" | "كتب ومراجع";
  setCategoryFilter: (cat: "all" | "أجهزة" | "كتب ومراجع") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  counts: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    modification: number;
  };
}

export function AgreementFilterTabs({
  activeTab,
  setActiveTab,
  categoryFilter,
  setCategoryFilter,
  searchQuery,
  setSearchQuery,
  counts,
}: AgreementFilterTabsProps) {
  return (
    <section className="p-4 sm:p-5 rounded-2xl bg-white border border-brand-border-soft shadow-xs space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-brand-surface-muted border border-brand-border-soft text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "all" ? "bg-white text-brand-primary shadow-xs" : "text-brand-muted hover:text-brand-ink"
            }`}
          >
            جميع الحالات ({counts.total})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("قيد الانتظار")}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "قيد الانتظار" ? "bg-white text-amber-700 shadow-xs font-bold" : "text-brand-muted hover:text-brand-ink"
            }`}
          >
            <span>بانتظار القرار</span>
            {counts.pending > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800">
                {counts.pending}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("موافق عليها")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "موافق عليها" ? "bg-white text-emerald-700 shadow-xs" : "text-brand-muted hover:text-brand-ink"
            }`}
          >
            المعتمدة ({counts.approved})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("طلب تعديل")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "طلب تعديل" ? "bg-white text-brand-primary shadow-xs" : "text-brand-muted hover:text-brand-ink"
            }`}
          >
            طلب تعديل ({counts.modification})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("مرفوضة")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "مرفوضة" ? "bg-white text-red-600 shadow-xs" : "text-brand-muted hover:text-brand-ink"
            }`}
          >
            المرفوضة ({counts.rejected})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-brand-muted font-semibold">نوع العهدة:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as "all" | "أجهزة" | "كتب ومراجع")}
            className="px-3 py-1.5 rounded-xl border border-brand-border-soft bg-brand-surface-muted text-xs font-bold text-brand-ink focus:outline-none focus:border-brand-primary"
          >
            <option value="all">الكل (أجهزة وكتب)</option>
            <option value="أجهزة">أجهزة وأدوات</option>
            <option value="كتب ومراجع">كتب ومراجع ورقية</option>
          </select>
        </div>
      </div>

      <div className="relative">
        <span className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-brand-muted">
          🔍
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث برقم الاتفاقية (مثال UM-2817)، اسم العنصر، الطالب المستعير أو المالك..."
          className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-brand-border-soft bg-brand-surface-muted text-xs sm:text-sm font-semibold text-brand-ink focus:outline-none focus:border-brand-primary focus:bg-white"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 end-0 pe-3.5 text-xs text-brand-muted hover:text-brand-ink"
          >
            مسح ✕
          </button>
        )}
      </div>
    </section>
  );
}

