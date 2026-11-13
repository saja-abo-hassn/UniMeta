"use client";

import React from "react";
import { AdminAgreementItem } from "@/src/types/admin";
import { STATUS_CONFIG } from "../types";
import { VerifiedStudentParty } from "@/src/services/student-verification-service";
import { PartiesComparisonCard } from "./agreement-details/parties-comparison-card";
import { AgreementPledgeView } from "./agreement-details/agreement-pledge-view";
import { AgreementTimelineView } from "./agreement-details/agreement-timeline-view";
import { Modal } from "@/components/shared/modal";

interface AgreementDetailsModalProps {
  selectedDetails: AdminAgreementItem;
  partiesData: {
    requester: VerifiedStudentParty;
    owner: VerifiedStudentParty;
    isRequesterVerified: boolean;
    isOwnerVerified: boolean;
    isBothVerified: boolean;
  };
  unmaskedStudentIds: Record<string, boolean>;
  onClose: () => void;
  onOpenUnmask: (target: {
    agreementId: string;
    student: VerifiedStudentParty;
    partyType: "owner" | "requester";
  }) => void;
  onOpenReject: (item: AdminAgreementItem) => void;
  onOpenModify: (item: AdminAgreementItem) => void;
  onApprove: (id: string) => void;
}

export function AgreementDetailsModal({
  selectedDetails,
  partiesData,
  unmaskedStudentIds,
  onClose,
  onOpenUnmask,
  onOpenReject,
  onOpenModify,
  onApprove,
}: AgreementDetailsModalProps) {
  const statusCfg = STATUS_CONFIG[selectedDetails.status] || STATUS_CONFIG["قيد الانتظار"];

  return (
    <Modal isOpen={!!selectedDetails} onClose={onClose} size="xl">
      <Modal.Header
        title={`مراجعة اتفاقية العهدة (${selectedDetails.id})`}
        description={`${selectedDetails.title} • ${selectedDetails.category} • إيداع: ${selectedDetails.depositAmount} ₪`}
        badge={
          <span
            className={`text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 rounded-full border ${statusCfg.badge}`}
          >
            {statusCfg.label}
          </span>
        }
        onClose={onClose}
      />

      <Modal.Body className="p-4 sm:p-6 space-y-5 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <PartiesComparisonCard
            student={partiesData.owner}
            partyType="owner"
            isUnmasked={!!unmaskedStudentIds[partiesData.owner.studentId]}
            onOpenUnmask={() =>
              onOpenUnmask({
                agreementId: selectedDetails.id,
                student: partiesData.owner,
                partyType: "owner",
              })
            }
          />
          <PartiesComparisonCard
            student={partiesData.requester}
            partyType="requester"
            isUnmasked={!!unmaskedStudentIds[partiesData.requester.studentId]}
            onOpenUnmask={() =>
              onOpenUnmask({
                agreementId: selectedDetails.id,
                student: partiesData.requester,
                partyType: "requester",
              })
            }
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AgreementTimelineView
            timeline={selectedDetails.timeline}
            createdAt={selectedDetails.createdAt}
          />
          <AgreementPledgeView
            pledgeVersion={selectedDetails.pledgeVersion}
            pledgeText={selectedDetails.pledgeText}
            signatureUrl={selectedDetails.signatureUrl}
            requesterName={selectedDetails.requesterName}
          />
        </div>

        {selectedDetails.notes && (
          <div className="p-3.5 rounded-xl bg-brand-surface-muted border border-brand-border-soft text-brand-muted">
            <strong className="text-brand-ink block mb-1">ملاحظات العقد:</strong>
            {selectedDetails.notes}
          </div>
        )}

        {selectedDetails.rejectionReason && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 space-y-1">
            <span className="font-bold block">سبب الرفض المسجل:</span>
            <p>{selectedDetails.rejectionReason}</p>
          </div>
        )}

        {selectedDetails.modificationNote && (
          <div className="p-3.5 rounded-xl bg-brand-surface-blue border border-brand-border-soft text-brand-ink space-y-1">
            <span className="font-bold block">ملاحظات طلب التعديل:</span>
            <p>{selectedDetails.modificationNote}</p>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-xl border border-brand-border-soft text-xs font-bold text-brand-muted hover:bg-brand-surface-muted cursor-pointer"
        >
          إغلاق النافذة
        </button>

        {selectedDetails.status === "قيد الانتظار" && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenModify(selectedDetails)}
              className="px-3.5 py-2 rounded-xl border border-brand-border-soft bg-brand-surface-blue text-brand-primary hover:bg-brand-surface-blue text-xs font-bold transition-colors cursor-pointer"
            >
              طلب تعديل 📝
            </button>

            <button
              type="button"
              onClick={() => onOpenReject(selectedDetails)}
              className="px-3.5 py-2 rounded-xl border border-red-200 bg-white text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer"
            >
              رفض مع سبب ✕
            </button>

            <button
              type="button"
              disabled={!partiesData.isBothVerified}
              onClick={() => onApprove(selectedDetails.id)}
              className={`px-5 py-2 rounded-xl text-white text-xs font-black shadow-xs transition-all ${
                partiesData.isBothVerified
                  ? "bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
                  : "bg-slate-300 cursor-not-allowed opacity-60"
              }`}
              title={
                !partiesData.isBothVerified
                  ? "ممنوع الاعتماد: أحد الطرفين غير متحقق من بطاقته وهويته"
                  : "اعتماد الاتفاقية رسمياً"
              }
            >
              {partiesData.isBothVerified ? "اعتماد وموافقة ✓" : "موافقة معطلة (طرف غير متحقق)"}
            </button>
          </div>
        )}
      </Modal.Footer>
    </Modal>
  );
}
