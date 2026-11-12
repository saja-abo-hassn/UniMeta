"use client";

import React from "react";
import { formatCurrency } from "@/src/lib/currency";
import { AgreementItem } from "../types";

interface ActiveAgreementsSectionProps {
  agreements: AgreementItem[];
  filteredAgreements: AgreementItem[];
  activeAgreementsCount: number;
  returningCount: number;
  agreementFilter: "all" | "active" | "returning" | "completed";
  setAgreementFilter: (filter: "all" | "active" | "returning" | "completed") => void;
  onOpenExtension: (agreement: AgreementItem) => void;
  onOpenReturn: (agreement: AgreementItem) => void;
}

export function ActiveAgreementsSection({
  agreements,
  filteredAgreements,
  activeAgreementsCount,
  returningCount,
  agreementFilter,
  setAgreementFilter,
  onOpenExtension,
  onOpenReturn,
}: ActiveAgreementsSectionProps) {
  return (
    <section className="p-6 sm:p-7 rounded-3xl bg-white border border-[#D7EAF7] shadow-xs space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D7EAF7]">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#16324A]">
            سجل العقود والاتفاقيات
          </h2>
          <p className="text-xs text-[#66788A]">
            متابعة حالة الإعارة، تواريخ الإرجاع، واسترداد مبلغ التأمين المالي.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#F4FAFF] p-1 rounded-xl border border-[#D7EAF7] text-xs">
          <button
            type="button"
            onClick={() => setAgreementFilter("all")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              agreementFilter === "all" ? "bg-white text-[#0057C8] shadow-xs" : "text-[#66788A]"
            }`}
          >
            الكل ({agreements.length})
          </button>
          <button
            type="button"
            onClick={() => setAgreementFilter("active")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              agreementFilter === "active" ? "bg-white text-[#0057C8] shadow-xs" : "text-[#66788A]"
            }`}
          >
            نشطة ({activeAgreementsCount})
          </button>
          <button
            type="button"
            onClick={() => setAgreementFilter("returning")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              agreementFilter === "returning" ? "bg-white text-[#0057C8] shadow-xs" : "text-[#66788A]"
            }`}
          >
            بانتظار الإرجاع ({returningCount})
          </button>
          <button
            type="button"
            onClick={() => setAgreementFilter("completed")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              agreementFilter === "completed" ? "bg-white text-[#0057C8] shadow-xs" : "text-[#66788A]"
            }`}
          >
            مكتملة
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-start text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-[#D7EAF7] text-[#66788A] font-semibold">
              <th className="py-3 px-3 text-start">رقم العقد</th>
              <th className="py-3 px-3 text-start">العنصر والتصنيف</th>
              <th className="py-3 px-3 text-start">الطرف الآخر</th>
              <th className="py-3 px-3 text-start">تاريخ الإرجاع</th>
              <th className="py-3 px-3 text-start">التأمين المودع</th>
              <th className="py-3 px-3 text-start">الحالة</th>
              <th className="py-3 px-3 text-start">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D7EAF7]/60">
            {filteredAgreements.map((agreement) => (
              <tr key={agreement.id} className="hover:bg-[#F8FBFE] transition-colors">
                <td className="py-4 px-3 font-mono font-bold text-[#0057C8]" dir="ltr">
                  {agreement.id}
                </td>

                <td className="py-4 px-3 max-w-xs">
                  <span className="font-bold text-[#16324A] block leading-snug">
                    {agreement.itemName}
                  </span>
                  <span className="text-[11px] text-[#2D78B7] font-medium inline-block mt-0.5">
                    {agreement.category}
                  </span>
                </td>

                <td className="py-4 px-3">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-[#16324A] block">
                      {agreement.otherParty.name}
                    </span>
                    <span className="text-[11px] text-[#66788A] block">
                      {agreement.otherParty.major} · ({agreement.otherParty.role})
                    </span>
                  </div>
                </td>

                <td className="py-4 px-3">
                  <div className="space-y-0.5">
                    <span className="font-mono text-xs text-[#16324A]" dir="ltr">
                      {agreement.returnDeadline}
                    </span>
                    {agreement.status !== "مكتملة" && (
                      <span
                        className={`text-[10px] font-bold block ${
                          agreement.daysRemaining <= 2 ? "text-amber-600" : "text-[#2D78B7]"
                        }`}
                      >
                        متبقي {agreement.daysRemaining} أيام
                      </span>
                    )}
                  </div>
                </td>

                <td className="py-4 px-3 font-bold text-[#0057C8]">
                  {formatCurrency(agreement.depositAmount, "ILS")}
                </td>

                <td className="py-4 px-3">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full inline-block ${
                      agreement.status === "نشطة"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : agreement.status === "بانتظار الإرجاع"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {agreement.status}
                  </span>
                </td>

                <td className="py-4 px-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {agreement.status !== "مكتملة" && (
                      <>
                        <button
                          type="button"
                          onClick={() => onOpenExtension(agreement)}
                          className="px-2.5 py-1 rounded-lg bg-[#EAF4FD] hover:bg-[#D7EAF7] text-[#0057C8] text-xs font-bold border border-[#D7EAF7] transition-colors"
                        >
                          تمديد
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenReturn(agreement)}
                          className="px-2.5 py-1 rounded-lg bg-[#0057C8] hover:bg-[#2D78B7] text-white text-xs font-bold transition-colors shadow-xs"
                        >
                          تأكيد الإرجاع
                        </button>
                      </>
                    )}
                    {agreement.status === "مكتملة" && (
                      <span className="text-[11px] text-[#66788A] font-medium">
                        تم استرداد التأمين ✓
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

