"use client";

import React from "react";
import { AdminAgreementItem } from "@/src/types/admin";
import { Modal } from "@/components/shared/modal";

interface AdminAgreementDetailsModalProps {
  detailsAgreement: AdminAgreementItem | null;
  onClose: () => void;
  onApprove: (id: string) => void;
  onRejectPrompt: (id: string) => void;
}

export function AdminAgreementDetailsModal({
  detailsAgreement,
  onClose,
  onApprove,
  onRejectPrompt,
}: AdminAgreementDetailsModalProps) {
  if (!detailsAgreement) return null;

  return (
    <Modal isOpen={!!detailsAgreement} onClose={onClose} size="md">
      <Modal.Header
        title={detailsAgreement.title}
        description={`رقم المعاملة: #${detailsAgreement.id}`}
        onClose={onClose}
      />

      <Modal.Body className="p-5 sm:p-6 space-y-4 text-xs">
        <div className="p-4 rounded-2xl bg-[#F8FBFE] border border-[#D7EAF7] space-y-2.5 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-[#D7EAF7]/60">
            <span className="text-[#66788A]">النوع والتصنيف:</span>
            <span className="font-bold text-[#0057C8]">{detailsAgreement.category}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-[#D7EAF7]/60">
            <span className="text-[#66788A]">الطالب المستعير:</span>
            <span className="font-bold text-[#16324A]">{detailsAgreement.requesterName} ({detailsAgreement.requesterMajor})</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-[#D7EAF7]/60">
            <span className="text-[#66788A]">مالك الأداة / العهدة:</span>
            <span className="font-bold text-[#16324A]">{detailsAgreement.ownerName}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-[#D7EAF7]/60">
            <span className="text-[#66788A]">فترة الاتفاقية:</span>
            <span className="font-bold text-[#16324A]">{detailsAgreement.startDate} إلى {detailsAgreement.returnDeadline}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#66788A]">مبلغ التأمين المودع:</span>
            <span className="font-black text-emerald-700">{detailsAgreement.depositAmount} ₪</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#F0F7FD] border border-[#D7EAF7] space-y-1.5">
          <h4 className="font-bold text-[#16324A]">نص التعهد الموقع رسمياً:</h4>
          <p className="text-[11px] text-[#2D78B7] leading-relaxed">
            {detailsAgreement.pledgeText}
          </p>
        </div>
      </Modal.Body>

      <Modal.Footer className="justify-between">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-xl border border-[#D7EAF7] text-xs font-semibold text-[#16324A] hover:bg-[#F8FBFE] cursor-pointer"
        >
          إغلاق
        </button>

        {detailsAgreement.status === "قيد الانتظار" && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onRejectPrompt(detailsAgreement.id)}
              className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold cursor-pointer"
            >
              رفض مع بيان السبب ✕
            </button>
            <button
              type="button"
              onClick={() => {
                onApprove(detailsAgreement.id);
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              اعتماد الاتفاقية رسمياً ✓
            </button>
          </div>
        )}
      </Modal.Footer>
    </Modal>
  );
}
