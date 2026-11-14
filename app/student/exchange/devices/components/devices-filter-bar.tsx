"use client";

import React from "react";

interface DevicesFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  typeFilter: string;
  setTypeFilter: (type: string) => void;
}

export function DevicesFilterBar({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  typeFilter,
  setTypeFilter,
}: DevicesFilterBarProps) {
  return (
    <section className="p-4 sm:p-5 rounded-3xl bg-white border border-brand-border-soft shadow-xs space-y-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم الجهاز، الموديل (مثل Arduino, Raspberry Pi)، أو المالك..."
            className="w-full ps-11 pe-4 py-2.5 rounded-2xl border border-brand-border-soft focus:border-brand-primary text-xs sm:text-sm font-semibold outline-hidden bg-brand-surface-muted"
          />
          <span className="absolute start-3.5 top-3 text-brand-muted">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-brand-border-soft font-semibold text-brand-ink bg-brand-surface-muted"
          >
            <option value="all">كافة الفئات</option>
            <option value="متحكمات ومستشعرات">متحكمات ومستشعرات</option>
            <option value="حواسيب وشاشات">حواسيب وشاشات</option>
            <option value="أدوات قياس ومعدات">أدوات قياس ومعدات</option>
            <option value="أجهزة شبكات">أجهزة شبكات</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-brand-border-soft font-semibold text-brand-ink bg-brand-surface-muted"
          >
            <option value="all">كافة أنواع الإتاحة</option>
            <option value="إعارة مجانية">إعارة مجانية</option>
            <option value="استئجار رمزي">استئجار رمزي</option>
            <option value="تبادل بأداة أخرى">تبادل بأداة أخرى</option>
          </select>
        </div>
      </div>
    </section>
  );
}

