"use client";

import React from "react";
import { IncomingRequestItem } from "../types";

interface IncomingRequestsSectionProps {
  incomingRequests: IncomingRequestItem[];
  onAcceptIncoming: (req: IncomingRequestItem) => void;
  onOpenRejectModal: (req: IncomingRequestItem) => void;
}

export function IncomingRequestsSection({
  incomingRequests,
  onAcceptIncoming,
  onOpenRejectModal,
}: IncomingRequestsSectionProps) {
  return (
    <section className="p-6 sm:p-7 rounded-3xl bg-white border border-brand-border-soft shadow-xs space-y-5 animate-fade-in">
      <div className="pb-3 border-b border-brand-border-soft">
        <h2 className="text-base sm:text-lg font-bold text-brand-ink">
          طلبات الإعارة الواردة من الطلاب
        </h2>
        <p className="text-xs text-brand-muted">
          راجع طلبات الزملاء لاستعارة مقتنياتك الأكاديمية ووافق عليها لتوثيق الاتفاقية مباشرة.
        </p>
      </div>

      {incomingRequests.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-brand-surface-muted border border-brand-border-soft space-y-2">
          <span className="text-3xl">🎉</span>
          <h3 className="font-bold text-brand-ink text-sm">لا توجد طلبات معلقة حالياً</h3>
          <p className="text-xs text-brand-muted">
            جميع طلبات الإعارة الواردة تمت معالجتها وتوثيقها في الاتفاقيات السارية.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {incomingRequests.map((req) => (
            <div
              key={req.id}
              className="p-5 sm:p-6 rounded-2xl bg-brand-surface-muted border border-brand-border-soft hover:border-brand-secondary transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-brand-primary">{req.id}</span>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-surface-blue text-brand-primary border border-brand-border-soft">
                    {req.category}
                  </span>
                  <span className="text-xs text-brand-muted">{req.requestDate}</span>
                </div>

                <h3 className="font-bold text-base text-brand-ink">
                  طلب استعارة: {req.itemName}
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-brand-ink">
                  <div>
                    <span className="text-brand-muted">الطالب: </span>
                    <span className="font-bold">{req.requesterName}</span>
                  </div>
                  <div>
                    <span className="text-brand-muted">التخصص: </span>
                    <span className="font-semibold">{req.requesterMajor}</span>
                  </div>
                  {req.requesterGpaRange && (
                    <div className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                      {req.requesterGpaRange}
                    </div>
                  )}
                </div>

                {req.message && (
                  <p className="text-xs text-brand-muted bg-white p-3 rounded-xl border border-brand-border-soft leading-relaxed">
                    &quot;{req.message}&quot;
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs pt-1">
                  <div>
                    <span className="text-brand-muted">المدة المقترحة: </span>
                    <span className="font-bold text-brand-primary">{req.requestedDuration}</span>
                  </div>
                  <div>
                    <span className="text-brand-muted">تاريخ الاستلام: </span>
                    <span className="font-mono font-bold" dir="ltr">{req.proposedStartDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => onAcceptIncoming(req)}
                  className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-hover-medium text-white text-xs sm:text-sm font-bold transition-all shadow-xs"
                >
                  قبول الطلب وتفعيل العقد
                </button>

                <button
                  type="button"
                  onClick={() => onOpenRejectModal(req)}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-red-50 text-red-600 text-xs sm:text-sm font-semibold border border-red-200 transition-colors"
                >
                  اعتذار
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

