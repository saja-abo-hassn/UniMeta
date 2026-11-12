"use client";

import React from "react";
import { Modal } from "@/components/shared/modal";

interface AdminRejectionModalProps {
  rejectingId: string | null;
  rejectionReasonInput: string;
  onReasonChange: (v: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AdminRejectionModal({
  rejectingId,
  rejectionReasonInput,
  onReasonChange,
  onClose,
  onSubmit,
}: AdminRejectionModalProps) {
  if (!rejectingId) return null;

  return (
    <Modal isOpen={!!rejectingId} onClose={onClose} size="sm">
      <form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <Modal.Header
          title={`رفض الاتفاقية #${rejectingId}`}
          onClose={onClose}
        />

        <Modal.Body className="p-5 sm:p-6 space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-[#16324A] block">
              سبب الرفض (سيظهر لأطراف الاتفاقية مباشرة): <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={rejectionReasonInput}
              onChange={(e) => onReasonChange(e.target.value)}
              placeholder="وضح سبب الرفض بالتفصيل (مثل: الغرض غير مطابق للشروط، أو البيانات ناقصة...)"
              className="w-full px-3.5 py-2 rounded-xl border border-[#D7EAF7] font-semibold text-[#16324A] bg-[#F8FBFE] focus:outline-none focus:border-red-500"
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#D7EAF7] text-xs font-semibold text-[#16324A] hover:bg-[#F8FBFE] cursor-pointer"
          >
            تراجع
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            تأكيد الرفض والإشعار
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
