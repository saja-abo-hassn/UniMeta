"use client";

import React from "react";
import { AdminMemberItem } from "@/src/contexts/admin-context";
import { MemberStatus, STATUS_BADGES } from "../types";
import { Modal } from "@/components/shared/modal";

interface MemberDetailsModalProps {
  member: AdminMemberItem | null;
  onClose: () => void;
}

export function MemberDetailsModal({ member, onClose }: MemberDetailsModalProps) {
  if (!member) return null;

  return (
    <Modal
      isOpen={!!member}
      onClose={onClose}
      size="sm"
    >
      <Modal.Header
        title="بطاقة الطالب الأكاديمية"
        description={`الرقم الجامعي: ${member.studentId}`}
        onClose={onClose}
      />
      <Modal.Body className="space-y-4 text-xs">
        <div className="p-4 rounded-2xl bg-brand-surface-soft border border-brand-border-soft flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-brand-primary text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
            {member.name.slice(0, 2)}
          </div>
          <div>
            <h4 className="text-sm font-black text-brand-ink">{member.name}</h4>
            <span className="text-brand-muted block font-mono" dir="ltr">{member.email}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-xl bg-brand-surface-muted border border-brand-border-soft">
            <span className="text-brand-muted">الكلية:</span>
            <span className="font-bold text-brand-ink">{member.college}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-brand-surface-muted border border-brand-border-soft">
            <span className="text-brand-muted">التخصص الأكاديمي:</span>
            <span className="font-bold text-brand-ink">{member.major}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-brand-surface-muted border border-brand-border-soft">
            <span className="text-brand-muted">حالة الحساب:</span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${STATUS_BADGES[member.status].badge}`}>
              {STATUS_BADGES[member.status].label}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-brand-surface-muted border border-brand-border-soft">
            <span className="text-brand-muted">العهد والأجهزة المستعارة حالياً:</span>
            <span className="font-bold text-brand-primary">{member.borrowedItemsCount} عهدة</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-brand-surface-muted border border-brand-border-soft">
            <span className="text-brand-muted">تاريخ الانضمام:</span>
            <span className="font-mono text-brand-ink">{member.joinedDate}</span>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2 rounded-xl bg-brand-primary hover:bg-brand-hover-medium text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          إغلاق
        </button>
      </Modal.Footer>
    </Modal>
  );
}

interface MemberStatusModalProps {
  member: AdminMemberItem | null;
  newStatus: MemberStatus;
  setNewStatus: (status: MemberStatus) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function MemberStatusModal({
  member,
  newStatus,
  setNewStatus,
  onClose,
  onSubmit,
}: MemberStatusModalProps) {
  if (!member) return null;

  return (
    <Modal
      isOpen={!!member}
      onClose={onClose}
      size="sm"
    >
      <form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <Modal.Header
          title="تغيير حالة حساب الطالب"
          description={`الرقم الجامعي: ${member.studentId}`}
          onClose={onClose}
        />
        <Modal.Body className="space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-brand-surface-muted border border-brand-border-soft text-xs">
            <span className="text-brand-muted block">الطالب:</span>
            <strong className="text-brand-ink">{member.name}</strong> ({member.studentId})
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-brand-ink block">
              الحالة الجديدة للحساب
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as MemberStatus)}
              className="w-full px-3 py-2 rounded-xl border border-brand-border-soft bg-white text-xs font-bold text-brand-ink focus:outline-none focus:border-brand-primary"
            >
              <option value="نشط">حساب نشط (كامل الصلاحيات)</option>
              <option value="معلق">حساب معلق مؤقتاً</option>
              <option value="محظور">حساب محظور</option>
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-brand-border-soft text-xs font-bold text-brand-muted hover:bg-brand-surface-muted cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-brand-primary hover:bg-brand-hover-medium text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            حفظ وتطبيق
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
