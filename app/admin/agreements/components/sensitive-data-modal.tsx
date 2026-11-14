"use client";

import React from "react";
import { VerifiedStudentParty } from "@/src/services/student-verification-service";
import { Modal } from "@/components/shared/modal";

interface SensitiveDataModalProps {
  unmaskTarget: {
    agreementId: string;
    student: VerifiedStudentParty;
    partyType: "owner" | "requester";
  } | null;
  actorName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function SensitiveDataModal({
  unmaskTarget,
  actorName,
  onClose,
  onConfirm,
}: SensitiveDataModalProps) {
  if (!unmaskTarget) return null;

  return (
    <Modal isOpen={!!unmaskTarget} onClose={onClose} size="sm">
      <Modal.Header
        title="تأكيد كشف البيانات الشخصية الحساسة"
        onClose={onClose}
      />
      <Modal.Body className="space-y-4 text-xs">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center text-2xl font-bold">
          🔒
        </div>
        <div className="text-center space-y-1">
          <p className="text-xs text-brand-muted leading-relaxed">
            أنت على وشك كشف رقم الهوية الوطنية ورقم الهاتف للطالب{" "}
            <strong className="text-brand-ink">{unmaskTarget.student.name}</strong> ({unmaskTarget.student.studentId}).
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1">
          <span className="font-bold block">إشعار أمني وقانوني:</span>
          <p className="text-[11px] leading-relaxed">
            سيتم تسجيل هذه العملية باسمك (<strong>{actorName}</strong>) مع التوقيت الدقيق في <strong>سجل التدقيق الأمني (Audit Log)</strong> للرقابة الإدارية.
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-xl border border-brand-border-soft text-xs font-bold text-brand-muted hover:bg-brand-surface-muted cursor-pointer"
        >
          إلغاء التراجع
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="px-5 py-2 rounded-xl bg-brand-primary hover:bg-brand-hover-medium text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
        >
          أوافق، اكشف وسجّل
        </button>
      </Modal.Footer>
    </Modal>
  );
}
