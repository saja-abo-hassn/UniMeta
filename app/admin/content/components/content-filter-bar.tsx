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
    <section className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D7EAF7] shadow-xs space-y-4">
      <div>
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#D7EAF7]">
          <span className="text-xs font-extrabold text-[#16324A]">
            الأقسام الأكاديمية الأربعة:
          </span>
          <span className="text-[11px] text-[#66788A] font-semibold">
            إجمالي الملفات: {totalMaterialsCount}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeCategory === "all"
                ? "bg-[#0057C8] text-white shadow-xs"
                : "bg-[#F8FBFE] text-[#66788A] hover:bg-[#EAF4FD] hover:text-[#0057C8] border border-[#D7EAF7]"
            }`}
          >
            <span>📁</span>
            <span>جميع الأقسام</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeCategory === "all" ? "bg-white/20 text-white" : "bg-[#D7EAF7] text-[#16324A]"}`}>
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
                    ? "bg-[#0057C8] text-white shadow-xs"
                    : "bg-[#F8FBFE] text-[#66788A] hover:bg-[#EAF4FD] hover:text-[#0057C8] border border-[#D7EAF7]"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? "bg-white/20 text-white" : "bg-[#D7EAF7] text-[#16324A]"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
        <div className="sm:col-span-5 relative">
          <span className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-[#66788A]">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم المادة، عنوان الملف، أو الرافع..."
            className="w-full ps-9 pe-3 py-2 rounded-xl border border-[#D7EAF7] bg-[#F8FBFE] text-xs font-medium text-[#16324A] focus:outline-none focus:border-[#0057C8] focus:bg-white"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 end-0 pe-3 text-xs text-[#66788A] hover:text-[#16324A]"
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
            className="w-full px-3 py-2 rounded-xl border border-[#D7EAF7] bg-[#F8FBFE] text-xs font-bold text-[#16324A] focus:outline-none focus:border-[#0057C8]"
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
            className="w-full px-3 py-2 rounded-xl border border-[#D7EAF7] bg-[#F8FBFE] text-xs font-bold text-[#16324A] focus:outline-none focus:border-[#0057C8]"
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

