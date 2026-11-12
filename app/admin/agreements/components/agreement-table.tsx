"use client";

import React from "react";
import { AdminAgreementItem } from "@/src/types/admin";
import { STATUS_CONFIG } from "../types";

interface AgreementTableProps {
  agreements: AdminAgreementItem[];
  onSelectDetails: (agr: AdminAgreementItem) => void;
}

export function AgreementTable({ agreements, onSelectDetails }: AgreementTableProps) {
  if (agreements.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#D7EAF7] p-12 text-center space-y-3 shadow-xs">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#EAF4FD] text-[#0057C8] flex items-center justify-center text-2xl font-bold">
          📑
        </div>
        <h3 className="text-base font-bold text-[#16324A]">
          لا توجد اتفاقيات مطابقة لمعايير البحث
        </h3>
        <p className="text-xs text-[#66788A] max-w-sm mx-auto">
          لم يتم العثور على أي اتفاقيات في هذا التبويب أو بالكلمات المدخلة.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#D7EAF7] overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-start text-xs sm:text-sm">
          <thead>
            <tr className="bg-[#F8FBFE] border-b border-[#D7EAF7] text-[#66788A] font-semibold">
              <th className="py-3 px-3.5 text-start">رقم الاتفاقية</th>
              <th className="py-3 px-3.5 text-start">العنصر / الغرض</th>
              <th className="py-3 px-3.5 text-start">النوع</th>
              <th className="py-3 px-3.5 text-start">الأطراف (مستعير ↔ مالك)</th>
              <th className="py-3 px-3.5 text-start">التأمين والرسوم</th>
              <th className="py-3 px-3.5 text-start">الموعد النهائي</th>
              <th className="py-3 px-3.5 text-start">الحالة</th>
              <th className="py-3 px-3.5 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D7EAF7]/60">
            {agreements.map((agr) => {
              const statusCfg = STATUS_CONFIG[agr.status] || STATUS_CONFIG["قيد الانتظار"];
              const isPending = agr.status === "قيد الانتظار";

              return (
                <tr key={agr.id} className="hover:bg-[#F8FBFE] transition-colors">
                  <td className="py-3.5 px-3.5 font-mono font-bold text-[#0057C8] text-xs" dir="ltr">
                    {agr.id}
                  </td>
                  <td className="py-3.5 px-3.5">
                    <div className="font-bold text-[#16324A] max-w-xs line-clamp-1">
                      {agr.title}
                    </div>
                    <span className="text-[11px] text-[#66788A] block">
                      تاريخ الإنشاء: {agr.createdAt}
                    </span>
                  </td>
                  <td className="py-3.5 px-3.5">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                        agr.category === "أجهزة"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      {agr.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-3.5">
                    <div className="flex flex-col text-xs">
                      <span className="text-[#16324A] font-bold">
                        المستعير: {agr.requesterName} <span className="text-[10px] text-[#66788A]">({agr.requesterMajor})</span>
                      </span>
                      <span className="text-[#66788A] text-[11px]">
                        المالك: {agr.ownerName} <span className="text-[10px] text-[#66788A]">({agr.ownerMajor})</span>
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3.5">
                    <div className="flex flex-col text-xs">
                      <span className="font-bold text-[#16324A]">{agr.depositAmount} د.أ تأمين</span>
                      {agr.dailyRate ? (
                        <span className="text-[10px] text-[#66788A]">+{agr.dailyRate} د.أ / يوم</span>
                      ) : (
                        <span className="text-[10px] text-emerald-700 font-semibold">استعارة مجانية</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-3.5 font-mono text-xs text-[#16324A] font-medium">
                    {agr.returnDeadline}
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
                        onClick={() => onSelectDetails(agr)}
                        className="px-3 py-1.5 rounded-xl border border-[#D7EAF7] bg-white text-[#0057C8] hover:bg-[#EAF4FD] text-xs font-bold transition-all shadow-2xs hover:shadow-xs"
                        title="معاينة التفاصيل الكاملة وتدقيق الأطراف"
                      >
                        عرض التفاصيل 🔍
                      </button>

                      {isPending && (
                        <button
                          type="button"
                          onClick={() => onSelectDetails(agr)}
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-2xs"
                          title="مراجعة واعتماد الاتفاقية"
                        >
                          مراجعة وقرار ⚡
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

