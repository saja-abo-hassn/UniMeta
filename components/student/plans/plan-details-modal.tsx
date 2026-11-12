"use client";

import React, { useState } from "react";
import { StudyPlan, CATEGORY_LABELS } from "@/src/data/study-plans-data";
import { Modal } from "@/components/shared/modal";

export interface PlanDetailsModalProps {
  plan: StudyPlan | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (plan: StudyPlan) => void;
  isCurrentlySelected: boolean;
}

export function PlanDetailsModal({
  plan,
  isOpen,
  onClose,
  onSelectPlan,
  isCurrentlySelected,
}: PlanDetailsModalProps) {
  const [activeSemester, setActiveSemester] = useState<number>(1);

  if (!isOpen || !plan) return null;

  const semesterCourses = plan.courses.filter((c) => c.semester === activeSemester);
  const semesterCredits = semesterCourses.reduce((sum, c) => sum + c.credits, 0);
  const semesters = Array.from({ length: plan.semestersCount }, (_, i) => i + 1);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <Modal.Header
        title={`الخطة الأكاديمية: ${plan.major}`}
        description={`${plan.degree} • ${plan.college} • ${plan.totalCredits} ساعة معتمدة (${plan.semestersCount} فصول)`}
        onClose={onClose}
      />

      <Modal.Body className="p-5 sm:p-6 space-y-5 text-xs">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#16324A]">اختر الفصل الدراسي لعرض مواده:</span>
            <span className="text-[11px] text-[#0057C8] font-bold">
              الفصل {activeSemester} ({semesterCredits} ساعات معتمدة)
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {semesters.map((sem) => (
              <button
                key={sem}
                type="button"
                onClick={() => setActiveSemester(sem)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  activeSemester === sem
                    ? "bg-[#0057C8] text-white shadow-xs"
                    : "bg-[#F8FBFE] text-[#16324A] border border-[#D7EAF7] hover:border-[#0057C8]"
                }`}
              >
                الفصل {sem}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {semesterCourses.length === 0 ? (
            <div className="p-8 text-center text-[#66788A] bg-[#F8FBFE] rounded-2xl border border-dashed border-[#D7EAF7]">
              لا توجد مساقات مسجلة في هذا الفصل
            </div>
          ) : (
            <div className="border border-[#D7EAF7] rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-start text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8FBFE] border-b border-[#D7EAF7] text-[#66788A] font-bold">
                    <th className="p-3 text-start">الرمز</th>
                    <th className="p-3 text-start">اسم المساق</th>
                    <th className="p-3 text-start">الساعات</th>
                    <th className="p-3 text-start">التصنيف</th>
                    <th className="p-3 text-start">المتطلب السابق</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D7EAF7]">
                  {semesterCourses.map((course) => (
                    <tr key={course.code} className="hover:bg-[#F0F7FD]/50 transition-colors">
                      <td className="p-3 font-mono font-bold text-[#0057C8]">{course.code}</td>
                      <td className="p-3 font-bold text-[#16324A]">{course.name}</td>
                      <td className="p-3 font-bold text-[#16324A]">{course.credits}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF4FD] text-[#0057C8]">
                          {CATEGORY_LABELS[course.category]?.label || course.category}
                        </span>
                      </td>
                      <td className="p-3">
                        {course.prerequisites && course.prerequisites.length > 0 ? (
                          <span className="font-mono text-[11px] text-[#2D78B7]">
                            {course.prerequisites.join(", ")}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Modal.Body>

      <Modal.Footer className="flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-xs text-[#66788A] text-center sm:text-start">
          {isCurrentlySelected
            ? "هذه هي خطتك الدراسية الحالية المعتمدة."
            : "يمكنك اعتماد هذه الخطة لربطها التلقائي بحاسبة المعدل وحاسبة الساعات."}
        </span>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-[#D7EAF7] text-xs font-semibold text-[#16324A] hover:bg-[#F8FBFE] transition-colors cursor-pointer"
          >
            إغلاق
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectPlan(plan);
              onClose();
            }}
            disabled={isCurrentlySelected}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer ${
              isCurrentlySelected
                ? "bg-[#EAF4FD] text-[#0057C8] border border-[#0057C8]/30 cursor-default"
                : "bg-[#0057C8] hover:bg-[#2D78B7] text-white hover:shadow-sm"
            }`}
          >
            {isCurrentlySelected ? "الخطة الحالية المعتمدة ✓" : "اعتماد هذه الخطة كخطتي الدراسية"}
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
