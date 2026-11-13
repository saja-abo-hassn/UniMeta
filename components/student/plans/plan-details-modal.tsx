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
            <span className="font-bold text-brand-ink">اختر الفصل الدراسي لعرض مواده:</span>
            <span className="text-[11px] text-brand-primary font-bold">
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
                    ? "bg-brand-primary text-white shadow-xs"
                    : "bg-brand-surface-muted text-brand-ink border border-brand-border-soft hover:border-brand-primary"
                }`}
              >
                الفصل {sem}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {semesterCourses.length === 0 ? (
            <div className="p-8 text-center text-brand-muted bg-brand-surface-muted rounded-2xl border border-dashed border-brand-border-soft">
              لا توجد مساقات مسجلة في هذا الفصل
            </div>
          ) : (
            <div className="border border-brand-border-soft rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-start text-xs border-collapse">
                <thead>
                  <tr className="bg-brand-surface-muted border-b border-brand-border-soft text-brand-muted font-bold">
                    <th className="p-3 text-start">الرمز</th>
                    <th className="p-3 text-start">اسم المساق</th>
                    <th className="p-3 text-start">الساعات</th>
                    <th className="p-3 text-start">التصنيف</th>
                    <th className="p-3 text-start">المتطلب السابق</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border-soft">
                  {semesterCourses.map((course) => (
                    <tr key={course.code} className="hover:bg-brand-surface-soft/50 transition-colors">
                      <td className="p-3 font-mono font-bold text-brand-primary">{course.code}</td>
                      <td className="p-3 font-bold text-brand-ink">{course.name}</td>
                      <td className="p-3 font-bold text-brand-ink">{course.credits}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-surface-blue text-brand-primary">
                          {CATEGORY_LABELS[course.category]?.label || course.category}
                        </span>
                      </td>
                      <td className="p-3">
                        {course.prerequisites && course.prerequisites.length > 0 ? (
                          <span className="font-mono text-[11px] text-brand-hover-medium">
                            {course.prerequisites.join(", ")}
                          </span>
                        ) : (
                          <span className="text-brand-subtle">-</span>
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
        <span className="text-xs text-brand-muted text-center sm:text-start">
          {isCurrentlySelected
            ? "هذه هي خطتك الدراسية الحالية المعتمدة."
            : "يمكنك اعتماد هذه الخطة لربطها التلقائي بحاسبة المعدل وحاسبة الساعات."}
        </span>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-brand-border-soft text-xs font-semibold text-brand-ink hover:bg-brand-surface-muted transition-colors cursor-pointer"
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
                ? "bg-brand-surface-blue text-brand-primary border border-brand-primary/30 cursor-default"
                : "bg-brand-primary hover:bg-brand-hover-medium text-white hover:shadow-sm"
            }`}
          >
            {isCurrentlySelected ? "الخطة الحالية المعتمدة ✓" : "اعتماد هذه الخطة كخطتي الدراسية"}
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
