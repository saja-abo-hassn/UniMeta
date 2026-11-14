import React from "react";
import { ContentStatus } from "@/src/contexts/admin-context";
import { MAIN_CATEGORIES, MainCategoryType } from "../types";

interface ContentFilterBarProps {
  totalMaterialsCount: number;
  filteredCount: number;
  activeCategory: "all" | MainCategoryType;
  setActiveCategory: (cat: "all" | MainCategoryType) => void;
  categoryCounts: Record<MainCategoryType, number>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSubjectFilter: string;
  setSelectedSubjectFilter: (subject: string) => void;
  existingSubjects: { name: string; count: number }[];
  activeStatus: "all" | ContentStatus;
  setActiveStatus: (status: "all" | ContentStatus) => void;
}

export function ContentFilterBar({
  totalMaterialsCount,
  filteredCount,
  activeCategory,
  setActiveCategory,
  categoryCounts,
  searchQuery,
  setSearchQuery,
  selectedSubjectFilter,
  setSelectedSubjectFilter,
  existingSubjects,
  activeStatus,
  setActiveStatus,
}: ContentFilterBarProps) {
  return (
    <section className="p-4 sm:p-5 rounded-2xl bg-white border border-brand-border-soft shadow-xs space-y-4">
      <div>
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-brand-border-soft">
          <span className="text-xs font-extrabold text-brand-ink">
            الأقسام الأكاديمية الأربعة:
          </span>
          <span className="text-[11px] text-brand-muted font-semibold">
            إجمالي الملفات: {totalMaterialsCount}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeCategory === "all"
                ? "bg-brand-primary text-white shadow-xs"
                : "bg-brand-surface-muted text-brand-muted hover:bg-brand-surface-blue hover:text-brand-primary border border-brand-border-soft"
            }`}
          >
            <span>📁</span>
            <span>جميع الأقسام</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeCategory === "all" ? "bg-white/20 text-white" : "bg-brand-border-soft text-brand-ink"}`}>
              {filteredCount}
            </span>
          </button>

          {MAIN_CATEGORIES.map((cat) => {
            const count = categoryCounts[cat.id];
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-brand-primary text-white shadow-xs"
                    : "bg-brand-surface-muted text-brand-muted hover:bg-brand-surface-blue hover:text-brand-primary border border-brand-border-soft"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? "bg-white/20 text-white" : "bg-brand-border-soft text-brand-ink"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
        <div className="sm:col-span-5 relative">
          <span className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-brand-muted">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم المادة، عنوان الملف، أو الرافع..."
            className="w-full ps-9 pe-3 py-2 rounded-xl border border-brand-border-soft bg-brand-surface-muted text-xs font-medium text-brand-ink focus:outline-none focus:border-brand-primary focus:bg-white"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 end-0 pe-3 text-xs text-brand-muted hover:text-brand-ink"
            >
              ✕
            </button>
          )}
        </div>

        <div className="sm:col-span-4">
          <select
            value={selectedSubjectFilter}
            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
            aria-label="تصفية حسب المادة الدراسية"
            className="w-full px-3 py-2 rounded-xl border border-brand-border-soft bg-brand-surface-muted text-xs font-bold text-brand-ink focus:outline-none focus:border-brand-primary"
          >
            <option value="all">جميع المواد الدراسية ({existingSubjects.length} مادة)</option>
            {existingSubjects.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name} ({s.count} ملف)
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={activeStatus}
            onChange={(e) => setActiveStatus(e.target.value as "all" | ContentStatus)}
            aria-label="حالة النشر"
            className="w-full px-3 py-2 rounded-xl border border-brand-border-soft bg-brand-surface-muted text-xs font-bold text-brand-ink focus:outline-none focus:border-brand-primary"
          >
            <option value="all">جميع الحالات</option>
            <option value="منشور">منشور للطلاب</option>
            <option value="مسودة">مسودة غير معلنة</option>
            <option value="قيد المراجعة">قيد المراجعة والتدقيق</option>
            <option value="مرفوض">مرفوض</option>
          </select>
        </div>
      </div>
    </section>
  );
}

