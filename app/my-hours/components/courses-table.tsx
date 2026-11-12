import React from "react";
import { Course, CourseCategory, CATEGORY_LABELS } from "@/src/data/study-plans-data";
import { CourseOverride } from "@/src/contexts/academic-stats-context";
import { EditingCourseState } from "../types";

interface CoursesTableProps {
  courses: Course[];
  courseGrades: Record<string, number>;
  courseOverrides: Record<string, CourseOverride>;
  customCourses: Course[];
  toggleCourseCompletion: (code: string, isCompleted?: boolean) => void;
  removeCustomCourse: (code: string) => void;
  setEditingCourse: (course: EditingCourseState) => void;
}

export function CoursesTable({
  courses,
  courseGrades,
  courseOverrides,
  customCourses,
  toggleCourseCompletion,
  removeCustomCourse,
  setEditingCourse,
}: CoursesTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[#D7EAF7]">
      <table className="w-full text-start text-xs sm:text-sm">
        <thead>
          <tr className="bg-[#F8FBFE] border-b border-[#D7EAF7] text-[#66788A] font-semibold">
            <th className="py-3 px-3.5 text-start w-14">إنجاز</th>
            <th className="py-3 px-3.5 text-start">رمز المادة</th>
            <th className="py-3 px-3.5 text-start">اسم المادة</th>
            <th className="py-3 px-3.5 text-start">الساعات</th>
            <th className="py-3 px-3.5 text-start">العلامة</th>
            <th className="py-3 px-3.5 text-start">التصنيف</th>
            <th className="py-3 px-3.5 text-start">المتطلب السابق</th>
            <th className="py-3 px-3.5 text-start">الحالة</th>
            <th className="py-3 px-3.5 text-center">إجراءات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#D7EAF7]/60">
          {courses.map((course) => {
            const grade = courseGrades[course.code];
            const isCompleted =
              courseOverrides[course.code]?.isCompleted !== undefined
                ? courseOverrides[course.code].isCompleted
                : grade !== undefined && grade >= 60;
            const isCustom = customCourses.some((c) => c.code === course.code);
            const isOverridden = !!courseOverrides[course.code];
            const catBadge = CATEGORY_LABELS[course.category] || CATEGORY_LABELS.major;

            return (
              <tr
                key={course.code}
                className={`transition-colors ${
                  isCompleted ? "bg-[#F0F7FD]/60 hover:bg-[#EAF4FD]" : "hover:bg-[#F8FBFE]"
                }`}
              >
                <td className="py-3 px-3.5">
                  <input
                    type="checkbox"
                    checked={Boolean(isCompleted)}
                    onChange={() => toggleCourseCompletion(course.code)}
                    className="w-4 h-4 rounded text-[#0057C8] border-[#D7EAF7] focus:ring-[#0057C8] cursor-pointer"
                    aria-label={`تحديد ${course.name} كمنجزة`}
                  />
                </td>

                <td className="py-3 px-3.5 font-mono font-bold text-[#0057C8]" dir="ltr">
                  <span>{course.code}</span>
                  {isCustom && (
                    <span className="ms-1.5 text-[9px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 font-bold">
                      مضافة
                    </span>
                  )}
                </td>

                <td className="py-3 px-3.5 font-bold text-[#16324A]">
                  {course.name}
                </td>

                <td className="py-3 px-3.5 font-bold text-[#16324A]">
                  <span className="inline-flex items-center gap-1 font-mono">
                    {course.credits} س
                    {isOverridden && courseOverrides[course.code]?.credits !== undefined && (
                      <span className="text-[10px] text-amber-600 font-bold" title="تم تعديل الساعات">
                        ★
                      </span>
                    )}
                  </span>
                </td>

                <td className="py-3 px-3.5 font-mono">
                  {typeof grade === "number" && !isNaN(grade) ? (
                    <span className="font-bold text-[#0057C8] bg-white px-2 py-0.5 rounded-lg border border-[#D7EAF7]">
                      {grade}%
                    </span>
                  ) : (
                    <span className="text-[#8B9DAE] text-xs">—</span>
                  )}
                </td>

                <td className="py-3 px-3.5">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${catBadge.color}`}>
                    {catBadge.label}
                  </span>
                </td>

                <td className="py-3 px-3.5 text-xs text-[#66788A]">
                  {course.prerequisites && course.prerequisites.length > 0 ? (
                    <span className="font-mono text-[11px] text-[#2D78B7]">
                      {course.prerequisites.join(", ")}
                    </span>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </td>

                <td className="py-3 px-3.5">
                  {isCompleted ? (
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                      <span>✓</span>
                      <span>منجزة</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-[#66788A] border border-slate-200">
                      متبقية
                    </span>
                  )}
                </td>

                <td className="py-3 px-3.5 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setEditingCourse({
                          code: course.code,
                          name: course.name,
                          credits: course.credits,
                          grade: typeof grade === "number" ? grade : "",
                          isCompleted: Boolean(isCompleted),
                          category: course.category as CourseCategory,
                        })
                      }
                      title="تعديل علامة المادة أو ساعاتها أو حالتها"
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold text-[#0057C8] bg-white hover:bg-[#EAF4FD] border border-[#D7EAF7] transition-all flex items-center gap-1"
                    >
                      <span>تعديل</span>
                      <span className="text-[10px]">✏️</span>
                    </button>
                    {isCustom && (
                      <button
                        type="button"
                        onClick={() => removeCustomCourse(course.code)}
                        title="حذف المساق المضاف"
                        className="p-1 rounded-lg text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all text-xs"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

