"use client";

import React from "react";
import { AdminAgreementItem } from "@/src/types/admin";
import { Modal } from "@/components/shared/modal";

interface ActionModalsProps {
  rejectingItem: AdminAgreementItem | null;
  rejectionReason: string;
  setRejectionReason: (val: string) => void;
  onCloseReject: () => void;
  onSubmitReject: (e: React.FormEvent) => void;

  modifyingItem: AdminAgreementItem | null;
  modificationNote: string;
  setModificationNote: (val: string) => void;
  onCloseModify: () => void;
  onSubmitModify: (e: React.FormEvent) => void;
}

export function AgreementActionModals({
  rejectingItem,
  rejectionReason,
  setRejectionReason,
  onCloseReject,
  onSubmitReject,
  modifyingItem,
  modificationNote,
  setModificationNote,
  onCloseModify,
  onSubmitModify,
}: ActionModalsProps) {
  return (
    <>
      <Modal isOpen={!!rejectingItem} onClose={onCloseReject} size="sm">
        {rejectingItem && (
          <form onSubmit={onSubmitReject} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <Modal.Header
              title={`رفض الاتفاقية رقم (${rejectingItem.id})`}
              description="سيتم إرسال هذا السبب مباشرة في إشعار رسمي للطرفين"
              onClose={onCloseReject}
            />
            <Modal.Body className="space-y-3 text-xs">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#16324A] block">
                  سبب الرفض <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="مثال: تعارض مواعيد الاستعارة مع امتحانات المعامل، أو عدم كفاية مبلغ التأمين..."
                  className="w-full p-3 rounded-xl border border-[#D7EAF7] bg-[#F8FBFE] text-xs font-medium text-[#16324A] focus:outline-none focus:border-red-500"
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                onClick={onCloseReject}
                className="px-4 py-2 rounded-xl border border-[#D7EAF7] text-xs font-bold text-[#66788A] hover:bg-[#F8FBFE] cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                تأكيد الرفض والإشعار
              </button>
            </Modal.Footer>
          </form>
        )}
      </Modal>

      <Modal isOpen={!!modifyingItem} onClose={onCloseModify} size="sm">
        {modifyingItem && (
          <form onSubmit={onSubmitModify} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <Modal.Header
              title={`طلب تعديل الاتفاقية (${modifyingItem.id})`}
              description="حدد البنود المطلوب تعديلها من أحد الطرفين أو كليهما"
              onClose={onCloseModify}
            />
            <Modal.Body className="space-y-3 text-xs">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#16324A] block">
                  تفاصيل التعديل المطلوب <span className="text-blue-600">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={modificationNote}
                  onChange={(e) => setModificationNote(e.target.value)}
                  placeholder="مثال: يرجى تمديد مدة الإرجاع لـ 20 يوماً أو تعديل قيمة التأمين لتصبح 100 شيكل..."
                  className="w-full p-3 rounded-xl border border-[#D7EAF7] bg-[#F8FBFE] text-xs font-medium text-[#16324A] focus:outline-none focus:border-[#0057C8]"
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                onClick={onCloseModify}
                className="px-4 py-2 rounded-xl border border-[#D7EAF7] text-xs font-bold text-[#66788A] hover:bg-[#F8FBFE] cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#0057C8] hover:bg-[#2D78B7] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                إرسال طلب التعديل
              </button>
            </Modal.Footer>
          </form>
        )}
      </Modal>
    </>
  );
}
