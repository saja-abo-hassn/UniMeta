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
    <section className="p-6 sm:p-7 rounded-3xl bg-white border border-brand-border-soft shadow-xs space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-border-soft">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-brand-ink">
            سجل العقود والاتفاقيات
          </h2>
          <p className="text-xs text-brand-muted">
            متابعة حالة الإعارة، تواريخ الإرجاع، واسترداد مبلغ التأمين المالي.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#F4FAFF] p-1 rounded-xl border border-brand-border-soft text-xs">
          <button
            type="button"
            onClick={() => setAgreementFilter("all")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              agreementFilter === "all" ? "bg-white text-brand-primary shadow-xs" : "text-brand-muted"
            }`}
          >
            الكل ({agreements.length})
          </button>
          <button
            type="button"
            onClick={() => setAgreementFilter("active")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              agreementFilter === "active" ? "bg-white text-brand-primary shadow-xs" : "text-brand-muted"
            }`}
          >
            نشطة ({activeAgreementsCount})
          </button>
          <button
            type="button"
            onClick={() => setAgreementFilter("returning")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              agreementFilter === "returning" ? "bg-white text-brand-primary shadow-xs" : "text-brand-muted"
            }`}
          >
            بانتظار الإرجاع ({returningCount})
          </button>
          <button
            type="button"
            onClick={() => setAgreementFilter("completed")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              agreementFilter === "completed" ? "bg-white text-brand-primary shadow-xs" : "text-brand-muted"
            }`}
          >
            مكتملة
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-start text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-brand-border-soft text-brand-muted font-semibold">
              <th className="py-3 px-3 text-start">رقم العقد</th>
              <th className="py-3 px-3 text-start">العنصر والتصنيف</th>
              <th className="py-3 px-3 text-start">الطرف الآخر</th>
              <th className="py-3 px-3 text-start">تاريخ الإرجاع</th>
              <th className="py-3 px-3 text-start">التأمين المودع</th>
              <th className="py-3 px-3 text-start">الحالة</th>
              <th className="py-3 px-3 text-start">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border-soft/60">
            {filteredAgreements.map((agreement) => (
              <tr key={agreement.id} className="hover:bg-brand-surface-muted transition-colors">
                <td className="py-4 px-3 font-mono font-bold text-brand-primary" dir="ltr">
                  {agreement.id}
                </td>

                <td className="py-4 px-3 max-w-xs">
                  <span className="font-bold text-brand-ink block leading-snug">
                    {agreement.itemName}
                  </span>
                  <span className="text-[11px] text-brand-hover-medium font-medium inline-block mt-0.5">
                    {agreement.category}
                  </span>
                </td>

                <td className="py-4 px-3">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-brand-ink block">
                      {agreement.otherParty.name}
                    </span>
                    <span className="text-[11px] text-brand-muted block">
                      {agreement.otherParty.major} · ({agreement.otherParty.role})
                    </span>
                  </div>
                </td>

                <td className="py-4 px-3">
                  <div className="space-y-0.5">
                    <span className="font-mono text-xs text-brand-ink" dir="ltr">
                      {agreement.returnDeadline}
                    </span>
                    {agreement.status !== "مكتملة" && (
                      <span
                        className={`text-[10px] font-bold block ${
                          agreement.daysRemaining <= 2 ? "text-amber-600" : "text-brand-hover-medium"
                        }`}
                      >
                        متبقي {agreement.daysRemaining} أيام
                      </span>
                    )}
                  </div>
                </td>

                <td className="py-4 px-3 font-bold text-brand-primary">
                  {formatCurrency(agreement.depositAmount, "ILS")}
                </td>

                <td className="py-4 px-3">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full inline-block ${
                      agreement.status === "نشطة"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : agreement.status === "بانتظار الإرجاع"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-slate-100 text-brand-muted border border-brand-border-soft"
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
                          className="px-2.5 py-1 rounded-lg bg-brand-surface-blue hover:bg-brand-border-soft text-brand-primary text-xs font-bold border border-brand-border-soft transition-colors"
                        >
                          تمديد
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenReturn(agreement)}
                          className="px-2.5 py-1 rounded-lg bg-brand-primary hover:bg-brand-hover-medium text-white text-xs font-bold transition-colors shadow-xs"
                        >
                          تأكيد الإرجاع
                        </button>
                      </>
                    )}
                    {agreement.status === "مكتملة" && (
                      <span className="text-[11px] text-brand-muted font-medium">
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

