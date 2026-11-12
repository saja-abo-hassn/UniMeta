"use client";

import React from "react";

export interface CourseOption {
  id: string;
  code: string;
  name: string;
}

interface CourseSelectProps {
  courses: CourseOption[];
  selectedCourseId: string;
  onChange: (course: CourseOption) => void;
  error?: string;
}

export function CourseSelect({
  courses,
  selectedCourseId,
  onChange,
  error,
}: CourseSelectProps) {
  return (
    <div className="space-y-1.5 text-start">
      <div className="flex items-center justify-between">
        <label htmlFor="course-select-input" className="text-xs font-bold text-[#16324A] block">
          المادة الدراسية <span className="text-red-500">*</span>
        </label>
        <span className="text-[10px] text-[#66788A]">إجباري لربط المحتوى بالخطة</span>
      </div>

      <select
        id="course-select-input"
        required
        value={selectedCourseId}
        onChange={(e) => {
          const found = courses.find((c) => c.id === e.target.value);
          if (found) {
            onChange(found);
          }
        }}
        className={`w-full px-3 py-2 rounded-xl border text-xs sm:text-sm font-semibold text-[#16324A] bg-white transition-colors focus:outline-none ${
          error ? "border-red-400 bg-red-50/30" : "border-[#D7EAF7] focus:border-[#0057C8]"
        }`}
      >
        <option value="">-- اختر المادة الدراسية --</option>
        {courses.map((c) => (
          <option key={c.id} value={c.id}>
            [{c.code}] {c.name}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-[11px] text-red-600 font-medium" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

