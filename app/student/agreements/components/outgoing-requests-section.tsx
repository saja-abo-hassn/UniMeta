"use client";

import React from "react";
import Image from "next/image";
import { formatCurrency } from "@/src/lib/currency";
import { OutgoingRequestItem } from "../types";

interface OutgoingRequestsSectionProps {
  outgoingRequests: OutgoingRequestItem[];
  onCancelOutgoing: (id: string, itemName: string) => void;
  onModifyRequest: (req: OutgoingRequestItem) => void;
}

export function OutgoingRequestsSection({
  outgoingRequests,
  onCancelOutgoing,
  onModifyRequest,
}: OutgoingRequestsSectionProps) {
  return (
    <section className="p-6 sm:p-7 rounded-3xl bg-white border border-brand-border-soft shadow-xs space-y-5 animate-fade-in">
      <div className="pb-3 border-b border-brand-border-soft">
        <h2 className="text-base sm:text-lg font-bold text-brand-ink">
          طلبات الاستعارة التي أرسلتها للزملاء
        </h2>
        <p className="text-xs text-brand-muted">
          متابعة موافقة المالكين وحالة التسليم والجاهزية.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {outgoingRequests.map((req) => (
          <div
            key={req.id}
            className="p-5 rounded-2xl bg-brand-surface-muted border border-brand-border-soft hover:border-brand-secondary transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-brand-primary">{req.id}</span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    req.status === "قيد المراجعة"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : req.status === "تمت الموافقة"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : req.status === "طلب تعديل"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {req.status}
                </span>
              </div>

              <h3 className="font-bold text-sm text-brand-ink leading-snug">
                {req.itemName}
              </h3>
              <span className="text-[11px] text-brand-muted block mt-1">
                المالك: {req.ownerName} ({req.ownerMajor})
              </span>
            </div>

            <div className="pt-2 border-t border-brand-border-soft/60 space-y-1.5 text-xs text-brand-ink">
              <div className="flex justify-between">
                <span className="text-brand-muted">المدة المطلوبة:</span>
                <span className="font-bold">{req.requestedDuration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">تاريخ البدء المقترح:</span>
                <span className="font-mono text-brand-primary" dir="ltr">{req.proposedStartDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">مبلغ التأمين:</span>
                <span className="font-bold text-brand-primary">{formatCurrency(req.deposit, "ILS")}</span>
              </div>

              {req.signatureUrl && (
                <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-brand-border-soft mt-1">
                  <span className="text-[10px] font-bold text-brand-primary flex items-center gap-1">
                    <span>✍️</span>
                    <span>تعهد موقع إلكترونياً ({req.pledgeVersion || "v1.4"})</span>
                  </span>
                  <div className="relative h-5 w-[70px] overflow-hidden">
                    <Image
                      src={req.signatureUrl}
                      alt="Signature"
                      width={70}
                      height={20}
                      className="max-h-full max-w-full object-contain"
                      unoptimized
                    />
                  </div>
                </div>
              )}

              {req.modificationNote && (
                <div className="p-2.5 rounded-xl bg-brand-surface-blue border border-brand-border-soft text-[11px] text-brand-ink mt-2">
                  <span className="font-bold block mb-0.5">ملاحظات التعديل المطلوبة من المشرف:</span>
                  {req.modificationNote}
                </div>
              )}

              {req.rejectionReason && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-100 text-[11px] text-red-700 mt-2">
                  <span className="font-bold block mb-0.5">سبب الاعتذار:</span>
                  {req.rejectionReason}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-brand-border-soft/60 flex items-center justify-between gap-2">
              <span className="text-[11px] text-brand-muted">{req.requestDate}</span>
              {req.status === "قيد المراجعة" && (
                <button
                  type="button"
                  onClick={() => onCancelOutgoing(req.id, req.itemName)}
                  className="px-3 py-1 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
                >
                  إلغاء الطلب
                </button>
              )}
              {req.status === "طلب تعديل" && (
                <button
                  type="button"
                  onClick={() => onModifyRequest(req)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-brand-primary hover:bg-[#0046A0] transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <span>تعديل الطلب وإعادة الإرسال</span>
                  <span>✍️</span>
                </button>
              )}
              {req.status === "تمت الموافقة" && (
                <span className="text-xs font-bold text-emerald-700">
                  جاهز للتسليم في الجامعة ✓
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

