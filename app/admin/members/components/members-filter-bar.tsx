"use client";

import React from "react";
import { StatusFilter } from "../types";

interface MembersFilterBarProps {
  counts: {
    total: number;
    active: number;
    suspended: number;
    banned: number;
  };
  statusFilter: StatusFilter;
  setStatusFilter: (filter: StatusFilter) => void;
  collegeFilter: string;
  setCollegeFilter: (college: string) => void;
  collegesList: string[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function MembersFilterBar({
  counts,
  statusFilter,
  setStatusFilter,
  collegeFilter,
  setCollegeFilter,
  collegesList,
  searchQuery,
  setSearchQuery,
}: MembersFilterBarProps) {
  return (
    <section className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D7EAF7] shadow-xs space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#F8FBFE] border border-[#D7EAF7] text-xs font-bold">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              statusFilter === "all" ? "bg-white text-[#0057C8] shadow-xs" : "text-[#66788A] hover:text-[#16324A]"
            }`}
          >
            جميع الحسابات ({counts.total})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("نشط")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              statusFilter === "نشط" ? "bg-white text-emerald-700 shadow-xs" : "text-[#66788A] hover:text-[#16324A]"
            }`}
          >
            النشطة ({counts.active})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("معلق")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              statusFilter === "معلق" ? "bg-white text-amber-700 shadow-xs" : "text-[#66788A] hover:text-[#16324A]"
            }`}
          >
            المعلقة ({counts.suspended})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("محظور")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              statusFilter === "محظور" ? "bg-white text-red-600 shadow-xs" : "text-[#66788A] hover:text-[#16324A]"
            }`}
          >
            المحظورة ({counts.banned})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#66788A] font-semibold">الكلية:</span>
          <select
            value={collegeFilter}
            onChange={(e) => setCollegeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-[#D7EAF7] bg-[#F8FBFE] text-xs font-bold text-[#16324A] focus:outline-none focus:border-[#0057C8]"
          >
            <option value="all">جميع الكليات</option>
            {collegesList.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="relative">
        <span className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-[#66788A]">
          🔍
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث بالاسم، الرقم الجامعي (2022...)، البريد الجامعي أو التخصص..."
          className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-[#D7EAF7] bg-[#F8FBFE] text-xs sm:text-sm font-semibold text-[#16324A] focus:outline-none focus:border-[#0057C8] focus:bg-white"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 end-0 pe-3.5 text-xs text-[#66788A] hover:text-[#16324A]"
          >
            مسح ✕
          </button>
        )}
      </div>
    </section>
  );
}

