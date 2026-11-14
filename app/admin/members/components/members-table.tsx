"use client";

import React from "react";
import { AdminMemberItem } from "@/src/contexts/admin-context";
import { STATUS_BADGES } from "../types";

interface MembersTableProps {
  filteredMembers: AdminMemberItem[];
  onSelectMember: (member: AdminMemberItem) => void;
  onOpenStatusChange: (member: AdminMemberItem) => void;
}

export function MembersTable({
  filteredMembers,
  onSelectMember,
  onOpenStatusChange,
}: MembersTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-brand-border-soft overflow-hidden shadow-xs">
      {filteredMembers.length === 0 ? (
        <div className="p-12 text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-surface-blue text-brand-primary flex items-center justify-center text-2xl font-bold">
            👥
          </div>
          <h3 className="text-base font-bold text-brand-ink">
            لا توجد حسابات مطابقة لمعايير البحث
          </h3>
          <p className="text-xs text-brand-muted max-w-sm mx-auto">
            يرجى التحقق من صحة الرقم الجامعي أو الاسم المدخل، أو تغيير خيارات الفلترة.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs sm:text-sm">
            <thead>
              <tr className="bg-brand-surface-muted border-b border-brand-border-soft text-brand-muted font-semibold">
                <th className="py-3 px-3.5 text-start">الرقم الجامعي</th>
                <th className="py-3 px-3.5 text-start">اسم الطالب والبريد</th>
                <th className="py-3 px-3.5 text-start">التخصص والكلية</th>
                <th className="py-3 px-3.5 text-start">العهد المستعارة</th>
                <th className="py-3 px-3.5 text-start">تاريخ التسجيل</th>
                <th className="py-3 px-3.5 text-start">آخر نشاط</th>
                <th className="py-3 px-3.5 text-start">الحالة</th>
                <th className="py-3 px-3.5 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border-soft/60">
              {filteredMembers.map((member) => {
                const statusCfg = STATUS_BADGES[member.status] || STATUS_BADGES["نشط"];

                return (
                  <tr key={member.id} className="hover:bg-brand-surface-muted transition-colors">
                    <td className="py-3.5 px-3.5 font-mono font-bold text-brand-primary text-xs" dir="ltr">
                      {member.studentId}
                    </td>
                    <td className="py-3.5 px-3.5">
                      <div className="font-bold text-brand-ink">
                        {member.name}
                      </div>
                      <span className="text-[11px] text-brand-muted font-mono block" dir="ltr">
                        {member.email}
                      </span>
                    </td>
                    <td className="py-3.5 px-3.5">
                      <div className="font-bold text-brand-ink">
                        {member.major}
                      </div>
                      <span className="text-[11px] text-brand-muted block">
                        {member.college}
                      </span>
                    </td>
                    <td className="py-3.5 px-3.5">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        member.borrowedItemsCount > 0
                          ? "bg-brand-surface-blue text-brand-primary border-brand-border-soft"
                          : "bg-brand-surface-muted text-brand-muted border-brand-border-soft"
                      }`}>
                        {member.borrowedItemsCount} عهدة
                      </span>
                    </td>
                    <td className="py-3.5 px-3.5 font-mono text-xs text-brand-muted">
                      {member.joinedDate}
                    </td>
                    <td className="py-3.5 px-3.5 text-xs text-brand-ink font-medium">
                      {member.lastActive}
                    </td>
                    <td className="py-3.5 px-3.5">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border inline-flex items-center gap-1.5 ${statusCfg.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                        <span>{statusCfg.label}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSelectMember(member)}
                          className="px-2.5 py-1.5 rounded-lg border border-brand-border-soft bg-white text-brand-primary hover:bg-brand-surface-blue text-xs font-bold transition-colors"
                          title="عرض بطاقة الطالب"
                        >
                          عرض
                        </button>

                        <button
                          type="button"
                          onClick={() => onOpenStatusChange(member)}
                          className="px-2.5 py-1.5 rounded-lg border border-brand-border-soft bg-brand-surface-muted text-brand-ink hover:bg-brand-surface-blue hover:text-brand-primary text-xs font-bold transition-colors"
                          title="تغيير حالة الحساب"
                        >
                          الحالة ⚙️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

