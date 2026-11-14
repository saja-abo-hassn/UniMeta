"use client";

import React from "react";
import { CourseMaterialItem } from "@/src/contexts/admin-context";
import { Modal } from "@/components/shared/modal";

interface DeleteContentModalProps {
  deleteCandidate: CourseMaterialItem | null;
  onClose: () => void;
  onConfirmDelete: (id: string) => void;
}

export function DeleteContentModal({
  deleteCandidate,
  onClose,
  onConfirmDelete,
}: DeleteContentModalProps) {
  if (!deleteCandidate) return null;

  return (
    <Modal isOpen={!!deleteCandidate} onClose={onClose} size="sm">
      <Modal.Header
        title="تأكيد حذف الملف الأكاديمي"
        onClose={onClose}
      />
      <Modal.Body className="text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center text-2xl font-bold">
          ⚠️
        </div>
        <div className="space-y-1">
          <p className="text-xs text-brand-muted leading-relaxed">
            هل أنت متأكد من حذف <strong className="text-brand-ink">{deleteCandidate.title}</strong> للمادة ({deleteCandidate.courseName})؟ لن يتمكن الطلاب من الوصول إليه بعد الحذف.
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-xl border border-brand-border-soft text-xs font-bold text-brand-muted hover:bg-brand-surface-muted cursor-pointer"
        >
          تراجع
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirmDelete(deleteCandidate.id);
            onClose();
          }}
          className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
        >
          نعم، احذف الملف
        </button>
      </Modal.Footer>
    </Modal>
  );
}
