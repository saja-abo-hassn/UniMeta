"use client";

import React from "react";
import { AdminReportItem } from "@/src/contexts/admin-context";
import { TARGET_TYPE_BADGES, STATUS_CONFIG } from "../types";
import { Modal } from "@/components/shared/modal";

interface ModerationModalsProps {
  selectedReport: AdminReportItem | null;
  onCloseDetails: () => void;
  onOpenActionFromDetails: (report: AdminReportItem) => void;

  actionModalReport: AdminReportItem | null;
  actionType: "resolve" | "warning" | "delete_content";
  onActionTypeChange: (type: "resolve" | "warning" | "delete_content") => void;
  actionNote: string;
  onActionNoteChange: (note: string) => void;
  onCloseAction: () => void;
  onSubmitAction: (e: React.FormEvent) => void;

  deleteCandidate: AdminReportItem | null;
  onCloseDelete: () => void;
  onConfirmDelete: (id: string) => void;
}

export function ModerationModals({
  selectedReport,
  onCloseDetails,
  onOpenActionFromDetails,
  actionModalReport,
  actionType,
  onActionTypeChange,
  actionNote,
  onActionNoteChange,
  onCloseAction,
  onSubmitAction,
  deleteCandidate,
  onCloseDelete,
  onConfirmDelete,
}: ModerationModalsProps) {
  return (
    <>
      <Modal isOpen={!!selectedReport} onClose={onCloseDetails} size="md">
        {selectedReport && (
          <>
            <Modal.Header
              title={`تفاصيل البلاغ (${selectedReport.id})`}
              description={`تاريخ التسجيل: ${selectedReport.createdAt}`}
              onClose={onCloseDetails}
            />

            <Modal.Body className="p-5 sm:p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F8FBFE] border border-[#D7EAF7]">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-[#66788A] block">النوع والهدف</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${TARGET_TYPE_BADGES[selectedReport.targetType].badge}`}>
                      {TARGET_TYPE_BADGES[selectedReport.targetType].label}
                    </span>
                    <strong className="text-xs text-[#16324A]">{selectedReport.targetTitle}</strong>
                  </div>
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${STATUS_CONFIG[selectedReport.status].badge}`}>
                  {STATUS_CONFIG[selectedReport.status].label}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 space-y-1.5">
                <span className="font-bold block text-xs">سبب وتفاصيل البلاغ:</span>
                <p className="text-xs leading-relaxed">{selectedReport.reason}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#F8FBFE] border border-[#D7EAF7]">
                  <span className="text-[#66788A] block text-[10px]">مقدم البلاغ:</span>
                  <span className="font-bold text-[#16324A]">{selectedReport.reportedBy}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F8FBFE] border border-[#D7EAF7]">
                  <span className="text-[#66788A] block text-[10px]">المبلغ عنه:</span>
                  <span className="font-bold text-[#16324A]">{selectedReport.reportedUser || "غير محدد"}</span>
                </div>
              </div>

              {selectedReport.actionTaken && (
                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs space-y-1">
                  <span className="font-bold block">قرار المشرف المسجل:</span>
                  <p>{selectedReport.actionTaken}</p>
                </div>
              )}
            </Modal.Body>

            <Modal.Footer>
              <button
                type="button"
                onClick={onCloseDetails}
                className="px-4 py-2 rounded-xl border border-[#D7EAF7] text-xs font-bold text-[#66788A] hover:bg-[#F8FBFE] cursor-pointer"
              >
                إغلاق
              </button>
              {selectedReport.status === "مفتوح" && (
                <button
                  type="button"
                  onClick={() => onOpenActionFromDetails(selectedReport)}
                  className="px-5 py-2 rounded-xl bg-[#0057C8] hover:bg-[#2D78B7] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  معالجة واتخاذ قرار ⚖️
                </button>
              )}
            </Modal.Footer>
          </>
        )}
      </Modal>

      <Modal isOpen={!!actionModalReport} onClose={onCloseAction} size="md">
        {actionModalReport && (
          <form onSubmit={onSubmitAction} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <Modal.Header
              title={`اتخاذ إجراء بشأن البلاغ (${actionModalReport.id})`}
              description={`الهدف: ${actionModalReport.targetTitle}`}
              onClose={onCloseAction}
            />

            <Modal.Body className="p-5 sm:p-6 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#16324A] block">الإجراء المتخذ:</label>
                <div className="space-y-2">
                  <label className="p-3 rounded-2xl border border-[#D7EAF7] bg-[#F8FBFE] flex items-center justify-between cursor-pointer hover:bg-white">
                    <div>
                      <span className="text-xs font-bold text-[#16324A] block">حل البلاغ وإغلاقه</span>
                      <span className="text-[10px] text-[#66788A]">المحتوى سليم أو تم تسوية الخلاف</span>
                    </div>
                    <input
                      type="radio"
                      name="actionType"
                      checked={actionType === "resolve"}
                      onChange={() => onActionTypeChange("resolve")}
                      className="w-4 h-4 text-[#0057C8]"
                    />
                  </label>

                  <label className="p-3 rounded-2xl border border-[#D7EAF7] bg-[#F8FBFE] flex items-center justify-between cursor-pointer hover:bg-white">
                    <div>
                      <span className="text-xs font-bold text-amber-700 block">إرسال تنذير للطالب المبلغ عنه</span>
                      <span className="text-[10px] text-[#66788A]">تنبيه حول مخالفة سياسات التبادل</span>
                    </div>
                    <input
                      type="radio"
                      name="actionType"
                      checked={actionType === "warning"}
                      onChange={() => onActionTypeChange("warning")}
                      className="w-4 h-4 text-[#0057C8]"
                    />
                  </label>

                  <label className="p-3 rounded-2xl border border-red-200 bg-red-50/50 flex items-center justify-between cursor-pointer hover:bg-red-50">
                    <div>
                      <span className="text-xs font-bold text-red-700 block">حذف المحتوى المخالف فوراً</span>
                      <span className="text-[10px] text-red-600">إزالة المنشور وحجبه من التداول</span>
                    </div>
                    <input
                      type="radio"
                      name="actionType"
                      checked={actionType === "delete_content"}
                      onChange={() => onActionTypeChange("delete_content")}
                      className="w-4 h-4 text-red-600"
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#16324A] block">
                  ملاحظات وتوجيهات المشرف <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={actionNote}
                  onChange={(e) => onActionNoteChange(e.target.value)}
                  placeholder="اكتب التوضيح الذي سيتم توثيقه في السجل وإرساله كإشعار رسمي..."
                  className="w-full px-3 py-2 rounded-xl border border-[#D7EAF7] bg-white text-xs font-medium text-[#16324A] focus:outline-none focus:border-[#0057C8]"
                />
              </div>
            </Modal.Body>

            <Modal.Footer>
              <button
                type="button"
                onClick={onCloseAction}
                className="px-4 py-2 rounded-xl border border-[#D7EAF7] text-xs font-bold text-[#66788A] hover:bg-[#F8FBFE] cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#0057C8] hover:bg-[#2D78B7] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                تنفيذ القرار وتوثيقه
              </button>
            </Modal.Footer>
          </form>
        )}
      </Modal>

      <Modal isOpen={!!deleteCandidate} onClose={onCloseDelete} size="sm">
        {deleteCandidate && (
          <>
            <Modal.Header title="تأكيد حذف البلاغ" onClose={onCloseDelete} />
            <Modal.Body className="text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center text-2xl font-bold">
                ⚠️
              </div>
              <p className="text-xs text-[#66788A] leading-relaxed">
                هل أنت متأكد من حذف البلاغ رقم ({deleteCandidate.id}) نهائياً من النظام؟
              </p>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                onClick={onCloseDelete}
                className="px-4 py-2 rounded-xl border border-[#D7EAF7] text-xs font-bold text-[#66788A] hover:bg-[#F8FBFE] cursor-pointer"
              >
                تراجع
              </button>
              <button
                type="button"
                onClick={() => onConfirmDelete(deleteCandidate.id)}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                نعم، احذف البلاغ
              </button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </>
  );
}
