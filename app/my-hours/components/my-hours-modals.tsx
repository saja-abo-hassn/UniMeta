"use client";

import React from "react";
import { CourseCategory } from "@/src/data/study-plans-data";
import { EditingCourseState, NewCourseState } from "../types";
import { Modal } from "@/components/shared/modal";

interface MyHoursModalsProps {
  editingCourse: EditingCourseState | null;
  setEditingCourse: (course: EditingCourseState | null) => void;
  handleSaveCourseEdit: (e: React.FormEvent) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  newCourse: NewCourseState;
  setNewCourse: (course: NewCourseState) => void;
  handleSaveNewCourse: (e: React.FormEvent) => void;
}

export function MyHoursModals({
  editingCourse,
  setEditingCourse,
  handleSaveCourseEdit,
  isAddModalOpen,
  setIsAddModalOpen,
  newCourse,
  setNewCourse,
  handleSaveNewCourse,
}: MyHoursModalsProps) {
  return (
    <>
      <Modal
        isOpen={!!editingCourse}
        onClose={() => setEditingCourse(null)}
        size="sm"
      >
        {editingCourse && (
          <form onSubmit={handleSaveCourseEdit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <Modal.Header
              title="تعديل بيانات المساق"
              description={`رمز المساق: ${editingCourse.code}`}
              onClose={() => setEditingCourse(null)}
            />

            <Modal.Body className="p-5 sm:p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-ink">اسم المساق:</label>
                <input
                  type="text"
                  value={editingCourse.name}
                  onChange={(e) => setEditingCourse({ ...editingCourse, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border-soft text-xs sm:text-sm font-bold text-brand-ink bg-brand-surface-muted"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-ink">الساعات المعتمدة:</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={editingCourse.credits}
                    onChange={(e) =>
                      setEditingCourse({
                        ...editingCourse,
                        credits: Math.max(1, parseInt(e.target.value, 10) || 1),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-brand-border-soft text-xs font-bold text-brand-ink bg-brand-surface-muted"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-ink">العلامة (من 100):</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="بدون علامة"
                    value={editingCourse.grade}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditingCourse({
                        ...editingCourse,
                        grade: val === "" ? "" : Math.max(0, Math.min(100, parseFloat(val) || 0)),
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-brand-border-soft text-xs font-bold text-brand-primary bg-brand-surface-muted"
                  />
                </div>
              </div>

              <label className="p-3 rounded-2xl bg-brand-surface-soft border border-brand-border-soft flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-brand-ink block">حالة الإنجاز:</span>
                  <span className="text-[10px] text-brand-muted">تعليم المادة كمنجزة يدخل ساعاتها في المجموع الكلي</span>
                </div>
                <input
                  type="checkbox"
                  checked={editingCourse.isCompleted}
                  onChange={(e) =>
                    setEditingCourse({ ...editingCourse, isCompleted: e.target.checked })
                  }
                  className="w-5 h-5 rounded text-brand-primary border-brand-border-soft cursor-pointer"
                />
              </label>
            </Modal.Body>

            <Modal.Footer>
              <button
                type="button"
                onClick={() => setEditingCourse(null)}
                className="px-4 py-2 rounded-xl border border-brand-border-soft text-xs font-semibold text-brand-ink hover:bg-brand-surface-muted cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-brand-primary hover:bg-brand-hover-medium text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                حفظ التعديلات
              </button>
            </Modal.Footer>
          </form>
        )}
      </Modal>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        size="sm"
      >
        <form onSubmit={handleSaveNewCourse} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <Modal.Header
            title="إضافة مساق جديد للخطة"
            description="أضف مساقاً اختيارياً أو حراً أو تخصصياً لساعاتك"
            onClose={() => setIsAddModalOpen(false)}
          />

          <Modal.Body className="p-5 sm:p-6 space-y-4 text-xs">
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1 col-span-1">
                <label className="text-xs font-bold text-brand-ink">رمز المساق:</label>
                <input
                  type="text"
                  placeholder="MATH101"
                  dir="ltr"
                  value={newCourse.code}
                  onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl border border-brand-border-soft text-xs font-mono font-bold text-brand-ink bg-brand-surface-muted"
                  required
                />
              </div>
              <div className="space-y-1 col-span-2">
                <label className="text-xs font-bold text-brand-ink">اسم المساق:</label>
                <input
                  type="text"
                  placeholder="مثال: تفاضل وتكامل 1"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-brand-border-soft text-xs font-bold text-brand-ink bg-brand-surface-muted"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-ink">الساعات المعتمدة:</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={newCourse.credits}
                  onChange={(e) =>
                    setNewCourse({
                      ...newCourse,
                      credits: Math.max(1, parseInt(e.target.value, 10) || 1),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-brand-border-soft text-xs font-bold text-brand-ink bg-brand-surface-muted"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-ink">رقم الفصل (1-10):</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={newCourse.semester}
                  onChange={(e) =>
                    setNewCourse({
                      ...newCourse,
                      semester: Math.max(1, Math.min(10, parseInt(e.target.value, 10) || 1)),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-brand-border-soft text-xs font-bold text-brand-ink bg-brand-surface-muted"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-ink">تصنيف المساق:</label>
              <select
                value={newCourse.category}
                onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value as CourseCategory })}
                className="w-full px-3 py-2 rounded-xl border border-brand-border-soft text-xs font-semibold text-brand-ink bg-brand-surface-muted"
              >
                <option value="major">إجباري تخصص</option>
                <option value="college">متطلب كلية</option>
                <option value="university">متطلب جامعة</option>
                <option value="elective">اختياري تخصص</option>
                <option value="free">مساق حر</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-ink">العلامة (اختياري):</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="بدون علامة"
                  value={newCourse.grade}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewCourse({
                      ...newCourse,
                      grade: val === "" ? "" : Math.max(0, Math.min(100, parseFloat(val) || 0)),
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-brand-border-soft text-xs font-bold text-brand-primary bg-brand-surface-muted"
                />
              </div>
              <div className="flex flex-col justify-end">
                <label className="p-2.5 rounded-xl bg-brand-surface-soft border border-brand-border-soft flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-bold text-brand-ink">منجزة:</span>
                  <input
                    type="checkbox"
                    checked={newCourse.isCompleted}
                    onChange={(e) => setNewCourse({ ...newCourse, isCompleted: e.target.checked })}
                    className="w-4 h-4 rounded text-brand-primary border-brand-border-soft cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-brand-border-soft text-xs font-semibold text-brand-ink hover:bg-brand-surface-muted cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-primary hover:bg-brand-hover-medium text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              إضافة المساق وحساب الساعات
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}
