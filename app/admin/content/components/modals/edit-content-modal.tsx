"use client";

import React from "react";
import { CourseMaterialItem, ContentStatus } from "@/src/contexts/admin-context";
import { MAIN_CATEGORIES, MainCategoryType, ContentFormData } from "../../types";
import { Modal } from "@/components/shared/modal";

interface EditContentModalProps {
  editingItem: CourseMaterialItem | null;
  onClose: () => void;
  formData: ContentFormData;
  setFormData: React.Dispatch<React.SetStateAction<ContentFormData>>;
  formError: string;
  courseSuggestions: string[];
  onSubmit: (e: React.FormEvent) => void;
}

export function EditContentModal({
  editingItem,
  onClose,
  formData,
  setFormData,
  formError,
  courseSuggestions,
  onSubmit,
}: EditContentModalProps) {
  if (!editingItem) return null;

  return (
    <Modal isOpen={!!editingItem} onClose={onClose} size="lg">
      <form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <Modal.Header
          title="تعديل بيانات المحتوى"
          description={`المعرف الأكاديمي: ${editingItem.id}`}
          onClose={onClose}
        />

        <Modal.Body className="p-6 space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {formError}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#16324A] block">
              اسم المادة الدراسية <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              list="courses-suggestions-edit"
              required
              value={formData.courseName}
              onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#D7EAF7] bg-white text-xs font-bold text-[#16324A] focus:outline-none focus:border-[#0057C8]"
            />
            <datalist id="courses-suggestions-edit">
              {courseSuggestions.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1 sm:col-span-1">
              <label className="text-xs font-bold text-[#16324A] block">
                رمز المادة
              </label>
              <input
                type="text"
                value={formData.courseCode}
                onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#D7EAF7] bg-white text-xs font-medium text-[#16324A] focus:outline-none focus:border-[#0057C8]"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-[#16324A] block">
                عنوان الملف / المصدر <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#D7EAF7] bg-white text-xs font-medium text-[#16324A] focus:outline-none focus:border-[#0057C8]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#16324A] block">
                القسم الرئيسي <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as MainCategoryType })}
                className="w-full px-3 py-2 rounded-xl border border-[#D7EAF7] bg-white text-xs font-bold text-[#16324A]"
              >
                {MAIN_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#16324A] block">
                حالة النشر
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ContentStatus })}
                className="w-full px-3 py-2 rounded-xl border border-[#D7EAF7] bg-white text-xs font-bold text-[#16324A]"
              >
                <option value="منشور">منشور للطلاب</option>
                <option value="مسودة">مسودة</option>
                <option value="قيد المراجعة">قيد المراجعة</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#16324A] block">
              الوصف أو الملاحظات
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#D7EAF7] bg-white text-xs font-medium text-[#16324A] focus:outline-none focus:border-[#0057C8]"
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#D7EAF7] text-xs font-bold text-[#66788A] hover:bg-[#F8FBFE] cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-[#0057C8] hover:bg-[#2D78B7] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            حفظ التعديلات
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
