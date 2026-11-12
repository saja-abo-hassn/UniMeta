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
        <div className="p-4 rounded-2xl bg-[#F0F7FD] border border-[#D7EAF7] flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#0057C8] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
            {member.name.slice(0, 2)}
          </div>
          <div>
            <h4 className="text-sm font-black text-[#16324A]">{member.name}</h4>
            <span className="text-[#66788A] block font-mono" dir="ltr">{member.email}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FBFE] border border-[#D7EAF7]">
            <span className="text-[#66788A]">الكلية:</span>
            <span className="font-bold text-[#16324A]">{member.college}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FBFE] border border-[#D7EAF7]">
            <span className="text-[#66788A]">التخصص الأكاديمي:</span>
            <span className="font-bold text-[#16324A]">{member.major}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FBFE] border border-[#D7EAF7]">
            <span className="text-[#66788A]">حالة الحساب:</span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${STATUS_BADGES[member.status].badge}`}>
              {STATUS_BADGES[member.status].label}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FBFE] border border-[#D7EAF7]">
            <span className="text-[#66788A]">العهد والأجهزة المستعارة حالياً:</span>
            <span className="font-bold text-[#0057C8]">{member.borrowedItemsCount} عهدة</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FBFE] border border-[#D7EAF7]">
            <span className="text-[#66788A]">تاريخ الانضمام:</span>
            <span className="font-mono text-[#16324A]">{member.joinedDate}</span>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2 rounded-xl bg-[#0057C8] hover:bg-[#2D78B7] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
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
          <div className="p-3 rounded-xl bg-[#F8FBFE] border border-[#D7EAF7] text-xs">
            <span className="text-[#66788A] block">الطالب:</span>
            <strong className="text-[#16324A]">{member.name}</strong> ({member.studentId})
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#16324A] block">
              الحالة الجديدة للحساب
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as MemberStatus)}
              className="w-full px-3 py-2 rounded-xl border border-[#D7EAF7] bg-white text-xs font-bold text-[#16324A] focus:outline-none focus:border-[#0057C8]"
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
            className="px-4 py-2 rounded-xl border border-[#D7EAF7] text-xs font-bold text-[#66788A] hover:bg-[#F8FBFE] cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-[#0057C8] hover:bg-[#2D78B7] text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            حفظ وتطبيق
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
