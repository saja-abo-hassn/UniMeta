"use client";

import React from "react";
import { Modal } from "@/components/shared/modal";

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  newTitle: string;
  onTitleChange: (v: string) => void;
  newMajor: string;
  onMajorChange: (v: string) => void;
  newSupervisor: string;
  onSupervisorChange: (v: string) => void;
  newSummary: string;
  onSummaryChange: (v: string) => void;
  newNeededRole: string;
  onNeededRoleChange: (v: string) => void;
}

export function NewProjectModal({
  isOpen,
  onClose,
  onSubmit,
  newTitle,
  onTitleChange,
  newMajor,
  onMajorChange,
  newSupervisor,
  onSupervisorChange,
  newSummary,
  onSummaryChange,
  newNeededRole,
  onNeededRoleChange,
}: NewProjectModalProps) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <Modal.Header
          title="تقديم مقترح مشروع تخرج جديد (2025/2026)"
          description="سيتم إرسال المقترح لمجلس القسم الأكاديمي للمراجعة وتعيين المشرف"
          onClose={onClose}
        />

        <Modal.Body className="p-5 sm:p-6 space-y-3.5 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-brand-ink block">عنوان المشروع المقترح:</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="مثال: نظام ذكي للتنبؤ بالأعطال باستخدام تعلم الآلة"
              className="w-full px-3.5 py-2 rounded-xl border border-brand-border-soft font-semibold text-brand-ink bg-brand-surface-muted"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-brand-ink block">التخصص الأكاديمي:</label>
              <select
                value={newMajor}
                onChange={(e) => onMajorChange(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-brand-border-soft font-semibold text-brand-ink bg-brand-surface-muted"
              >
                <option value="هندسة البرمجيات ونظم المعلومات">هندسة البرمجيات ونظم المعلومات</option>
                <option value="علوم الحاسوب">علوم الحاسوب</option>
                <option value="هندسة أنظمة الحاسوب">هندسة أنظمة الحاسوب</option>
                <option value="الوسائط المتعددة">الوسائط المتعددة</option>
                <option value="هندسة الميكاترونكس">هندسة الميكاترونكس</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-ink block">المشرف المقترح:</label>
              <input
                type="text"
                value={newSupervisor}
                onChange={(e) => onSupervisorChange(e.target.value)}
                placeholder="اسم الدكتور أو المدرس المقترح"
                className="w-full px-3.5 py-2 rounded-xl border border-brand-border-soft font-semibold text-brand-ink bg-brand-surface-muted"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-brand-ink block">ملخص الفكرة والأهداف:</label>
            <textarea
              rows={3}
              required
              value={newSummary}
              onChange={(e) => onSummaryChange(e.target.value)}
              placeholder="اشرح المشكلة والحل المقترح والتقنيات المستخدمة..."
              className="w-full px-3.5 py-2 rounded-xl border border-brand-border-soft font-semibold text-brand-ink bg-brand-surface-muted"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-brand-ink block">الدور الشاغر المطلوب انضمامه:</label>
            <input
              type="text"
              value={newNeededRole}
              onChange={(e) => onNeededRoleChange(e.target.value)}
              placeholder="مثال: مطور بايثون أو مهندس روبوتات أو مصمم تجربة مستخدم"
              className="w-full px-3.5 py-2 rounded-xl border border-brand-border-soft font-semibold text-brand-ink bg-brand-surface-muted"
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-brand-border-soft text-brand-ink font-semibold hover:bg-brand-surface-muted cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-brand-primary text-white font-bold shadow-xs hover:bg-brand-hover-medium cursor-pointer"
          >
            إرسال المقترح للاعتماد
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
