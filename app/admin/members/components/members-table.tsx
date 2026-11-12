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
    <div className="bg-white rounded-2xl border border-[#D7EAF7] overflow-hidden shadow-xs">
      {filteredMembers.length === 0 ? (
        <div className="p-12 text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#EAF4FD] text-[#0057C8] flex items-center justify-center text-2xl font-bold">
            👥
          </div>
          <h3 className="text-base font-bold text-[#16324A]">
            لا توجد حسابات مطابقة لمعايير البحث
          </h3>
          <p className="text-xs text-[#66788A] max-w-sm mx-auto">
            يرجى التحقق من صحة الرقم الجامعي أو الاسم المدخل، أو تغيير خيارات الفلترة.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#F8FBFE] border-b border-[#D7EAF7] text-[#66788A] font-semibold">
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
            <tbody className="divide-y divide-[#D7EAF7]/60">
              {filteredMembers.map((member) => {
                const statusCfg = STATUS_BADGES[member.status] || STATUS_BADGES["نشط"];

                return (
                  <tr key={member.id} className="hover:bg-[#F8FBFE] transition-colors">
                    <td className="py-3.5 px-3.5 font-mono font-bold text-[#0057C8] text-xs" dir="ltr">
                      {member.studentId}
                    </td>
                    <td className="py-3.5 px-3.5">
                      <div className="font-bold text-[#16324A]">
                        {member.name}
                      </div>
                      <span className="text-[11px] text-[#66788A] font-mono block" dir="ltr">
                        {member.email}
                      </span>
                    </td>
                    <td className="py-3.5 px-3.5">
                      <div className="font-bold text-[#16324A]">
                        {member.major}
                      </div>
                      <span className="text-[11px] text-[#66788A] block">
                        {member.college}
                      </span>
                    </td>
                    <td className="py-3.5 px-3.5">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        member.borrowedItemsCount > 0
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : "bg-slate-50 text-slate-600 border-slate-200"
                      }`}>
                        {member.borrowedItemsCount} عهدة
                      </span>
                    </td>
                    <td className="py-3.5 px-3.5 font-mono text-xs text-[#66788A]">
                      {member.joinedDate}
                    </td>
                    <td className="py-3.5 px-3.5 text-xs text-[#16324A] font-medium">
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
                          className="px-2.5 py-1.5 rounded-lg border border-[#D7EAF7] bg-white text-[#0057C8] hover:bg-[#EAF4FD] text-xs font-bold transition-colors"
                          title="عرض بطاقة الطالب"
                        >
                          عرض
                        </button>

                        <button
                          type="button"
                          onClick={() => onOpenStatusChange(member)}
                          className="px-2.5 py-1.5 rounded-lg border border-[#D7EAF7] bg-[#F8FBFE] text-[#16324A] hover:bg-[#EAF4FD] hover:text-[#0057C8] text-xs font-bold transition-colors"
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

