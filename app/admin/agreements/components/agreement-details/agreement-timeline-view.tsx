"use client";

import React from "react";
import { AdminAgreementItem } from "@/src/types/admin";

interface AgreementTimelineViewProps {
  timeline?: AdminAgreementItem["timeline"];
  createdAt: string;
}

export function AgreementTimelineView({ timeline, createdAt }: AgreementTimelineViewProps) {
  const steps = timeline || [
    { title: "تقديم الطلب", date: createdAt, description: "تم رفع طلب الاتفاقية عبر بوابة الطلاب.", status: "completed" },
    { title: "تدقيق الهويات والضمان", date: createdAt, description: "فحص أهلية الحسابات وإيداع مبلغ التأمين.", status: "completed" },
    { title: "المراجعة والقرار الإداري", date: "الآن", description: "بانتظار قرار المشرف لاعتماد أو رفض الاتفاقية.", status: "current" },
  ];

  return (
    <div className="p-4 rounded-2xl bg-brand-surface-muted border border-brand-border-soft space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black text-brand-ink">
          سجل الحالة والأحداث الرسمية للاتفاقية (Timeline)
        </span>
        <span className="text-[10px] text-brand-muted">
          موثق في سجل النظام
        </span>
      </div>

      <div className="space-y-3 relative ps-4 border-s-2 border-brand-border-soft ms-2">
        {steps.map((step, idx) => (
          <div key={idx} className="relative space-y-0.5">
            <span
              className={`absolute -start-[23px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                step.status === "completed"
                  ? "bg-emerald-600"
                  : step.status === "current"
                  ? "bg-brand-primary animate-pulse"
                  : "bg-slate-300"
              }`}
            />
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-brand-ink">{step.title}</span>
              <span className="text-[10px] text-brand-muted font-mono">{step.date}</span>
            </div>
            <p className="text-[11px] text-brand-muted leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

