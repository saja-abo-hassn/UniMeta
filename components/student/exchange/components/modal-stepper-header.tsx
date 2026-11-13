import React from "react";

interface ModalStepperHeaderProps {
  item: {
    title: string;
    category: "أجهزة" | "كتب ومراجع";
    ownerName: string;
    ownerMajor: string;
    depositAmount: number;
  };
  currentStep: 1 | 2;
  onClose: () => void;
}

export function ModalStepperHeader({ item, currentStep, onClose }: ModalStepperHeaderProps) {
  return (
    <>
      <div className="p-5 sm:p-6 bg-gradient-to-r from-[#F4FAFF] via-white to-brand-surface-blue border-b border-brand-border-soft flex items-center justify-between gap-3 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-brand-primary bg-brand-surface-blue px-2.5 py-0.5 rounded-full border border-[#BEE3F8]">
              توثيق عهدة رسمية
            </span>
            <span className="text-xs font-semibold text-brand-subtle">
              {item.category === "أجهزة" ? "استئجار جهاز" : "استعارة كتاب"}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-brand-ink line-clamp-1">
            {item.title}
          </h2>
          <p className="text-[11px] text-brand-muted">
            المالك: <strong className="text-brand-ink">{item.ownerName}</strong> ({item.ownerMajor}) &bull; التأمين:{" "}
            <strong className="text-brand-primary">{item.depositAmount} ₪</strong>
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white border border-brand-border-soft hover:bg-red-50 hover:text-red-600 text-brand-subtle transition-colors flex items-center justify-center shrink-0"
          aria-label="إغلاق النافذة"
        >
          ✕
        </button>
      </div>

      <div className="px-6 py-3 bg-brand-surface-muted border-b border-[#EAF2F8] flex items-center justify-between text-xs font-bold shrink-0">
        <div className="flex items-center gap-2">
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold transition-colors ${
              currentStep === 1
                ? "bg-brand-primary text-white ring-4 ring-brand-primary/15"
                : "bg-emerald-100 text-emerald-800"
            }`}
          >
            {currentStep > 1 ? "✓" : "1"}
          </span>
          <span className={currentStep === 1 ? "text-brand-primary" : "text-emerald-700 font-semibold"}>
            الخطوة 1: بيانات الطالب والتحقق
          </span>
        </div>

        <span className="text-brand-border-soft">&larr;</span>

        <div className="flex items-center gap-2">
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold transition-colors ${
              currentStep === 2
                ? "bg-brand-primary text-white ring-4 ring-brand-primary/15"
                : "bg-brand-surface-blue text-brand-subtle"
            }`}
          >
            2
          </span>
          <span className={currentStep === 2 ? "text-brand-primary" : "text-brand-subtle"}>
            الخطوة 2: التعهد والتوقيع
          </span>
        </div>
      </div>
    </>
  );
}

