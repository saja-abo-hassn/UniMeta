"use client";

import React from "react";
import { formatCurrency } from "@/src/lib/currency";
import { AgreementItem, IncomingRequestItem } from "../types";
import { Modal } from "@/components/shared/modal";

interface AgreementStudentModalsProps {
  extensionModal: { open: boolean; agreement?: AgreementItem; days: number };
  setExtensionModal: React.Dispatch<
    React.SetStateAction<{ open: boolean; agreement?: AgreementItem; days: number }>
  >;
  onConfirmExtension: () => void;

  returnConfirmModal: { open: boolean; agreement?: AgreementItem };
  setReturnConfirmModal: React.Dispatch<
    React.SetStateAction<{ open: boolean; agreement?: AgreementItem }>
  >;
  onConfirmReturn: () => void;

  rejectModal: { open: boolean; request?: IncomingRequestItem; reason: string };
  setRejectModal: React.Dispatch<
    React.SetStateAction<{ open: boolean; request?: IncomingRequestItem; reason: string }>
  >;
  onConfirmRejectIncoming: () => void;
}

export function AgreementStudentModals({
  extensionModal,
  setExtensionModal,
  onConfirmExtension,
  returnConfirmModal,
  setReturnConfirmModal,
  onConfirmReturn,
  rejectModal,
  setRejectModal,
  onConfirmRejectIncoming,
}: AgreementStudentModalsProps) {
  return (
    <>
      <Modal
        isOpen={extensionModal.open && !!extensionModal.agreement}
        onClose={() => setExtensionModal({ open: false, days: 7 })}
        size="sm"
      >
        {extensionModal.agreement && (
          <>
            <Modal.Header
              title="طلب تمديد مدة الإعارة"
              description={extensionModal.agreement.itemName}
              onClose={() => setExtensionModal({ open: false, days: 7 })}
            />
            <Modal.Body className="space-y-4 text-xs">
              <p className="text-xs text-brand-muted leading-relaxed">
                حدد عدد الأيام الإضافية التي ترغب في طلبها. يحق لمالك الغرض الموافقة أو الرفض.
              </p>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-ink block">
                  مدة التمديد (بالأيام)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[3, 7, 10, 14].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() =>
                        setExtensionModal((prev) => ({ ...prev, days: d }))
                      }
                      className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        extensionModal.days === d
                          ? "bg-brand-primary text-white border-brand-primary shadow-xs"
                          : "bg-brand-surface-muted text-brand-ink border-brand-border-soft hover:border-brand-primary"
                      }`}
                    >
                      +{d} أيام
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-brand-surface-muted rounded-2xl border border-brand-border-soft text-[11px] text-brand-muted">
                تاريخ الإرجاع المتوقع الجديد:{" "}
                <strong className="text-brand-primary">
                  {(() => {
                    const d = new Date(extensionModal.agreement.returnDeadline);
                    d.setDate(d.getDate() + extensionModal.days);
                    return d.toISOString().split("T")[0];
                  })()}
                </strong>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                onClick={() => setExtensionModal({ open: false, days: 7 })}
                className="px-4 py-2 rounded-xl border border-brand-border-soft text-xs font-bold text-brand-muted hover:bg-brand-surface-muted cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={onConfirmExtension}
                className="px-5 py-2 rounded-xl bg-brand-primary hover:bg-[#0046A0] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                إرسال الطلب للمالك
              </button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      <Modal
        isOpen={returnConfirmModal.open && !!returnConfirmModal.agreement}
        onClose={() => setReturnConfirmModal({ open: false })}
        size="sm"
      >
        {returnConfirmModal.agreement && (
          <>
            <Modal.Header
              title="تأكيد تسليم الغرض المستعار"
              onClose={() => setReturnConfirmModal({ open: false })}
            />
            <Modal.Body className="space-y-4 text-xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center text-xl font-bold mx-auto">
                ✓
              </div>
              <div className="text-center space-y-1">
                <h4 className="font-bold text-sm text-brand-ink">
                  هل قمت بتسليم ({returnConfirmModal.agreement.itemName}) لمالكه بالفعل؟
                </h4>
                <p className="text-xs text-brand-muted">
                  بمجرد تأكيدك، سيُطلب من المالك تأكيد استلامه أيضاً ليتم إنهاء الاتفاقية واسترداد مبلغ التأمين (
                  {formatCurrency(returnConfirmModal.agreement.depositAmount, "ILS")}).
                </p>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                onClick={() => setReturnConfirmModal({ open: false })}
                className="px-4 py-2 rounded-xl border border-brand-border-soft text-xs font-bold text-brand-muted hover:bg-brand-surface-muted cursor-pointer"
              >
                تراجع
              </button>
              <button
                type="button"
                onClick={onConfirmReturn}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                نعم، سلّمت الغرض
              </button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      <Modal
        isOpen={rejectModal.open && !!rejectModal.request}
        onClose={() => setRejectModal({ open: false, reason: "" })}
        size="sm"
      >
        {rejectModal.request && (
          <>
            <Modal.Header
              title="رفض طلب الاستعارة"
              description={`الطلب المقدم من: ${rejectModal.request.requesterName}`}
              onClose={() => setRejectModal({ open: false, reason: "" })}
            />
            <Modal.Body className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-ink block">
                  سبب الرفض <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={rejectModal.reason}
                  onChange={(e) =>
                    setRejectModal((prev) => ({ ...prev, reason: e.target.value }))
                  }
                  placeholder="مثال: الغرض محجوز لطالب آخر، أو في صيانة..."
                  className="w-full px-3 py-2 rounded-xl border border-brand-border-soft bg-brand-surface-muted text-xs font-medium text-brand-ink focus:outline-none focus:border-brand-primary"
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                onClick={() => setRejectModal({ open: false, reason: "" })}
                className="px-4 py-2 rounded-xl border border-brand-border-soft text-xs font-bold text-brand-muted hover:bg-brand-surface-muted cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={onConfirmRejectIncoming}
                disabled={!rejectModal.reason.trim()}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                تأكيد الرفض
              </button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </>
  );
}
