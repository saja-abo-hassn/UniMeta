"use client";

import React from "react";
import { VerifiedStudentParty } from "@/src/services/student-verification-service";

interface PartiesComparisonCardProps {
  student: VerifiedStudentParty;
  partyType: "owner" | "requester";
  isUnmasked: boolean;
  onOpenUnmask: () => void;
}

export function PartiesComparisonCard({
  student,
  partyType,
  isUnmasked,
  onOpenUnmask,
}: PartiesComparisonCardProps) {
  const isOwner = partyType === "owner";

  return (
    <div className="p-4 rounded-2xl bg-white border border-brand-border-soft space-y-3 relative shadow-2xs">
      <div className="flex items-center justify-between pb-2 border-b border-brand-border-soft">
        <span
          className={`text-[10px] font-black uppercase tracking-wider ${
            isOwner ? "text-brand-primary" : "text-brand-primary"
          }`}
        >
          {isOwner ? "الطرف المالك (المعير)" : "الطرف المستعير (المستأجر)"}
        </span>
        {student.verificationStatus.overallVerified ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span>✓</span>
            <span>حساب متحقق</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
            <span>✕</span>
            <span>غير متحقق</span>
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="font-black text-sm text-brand-ink">{student.name}</div>
        <div className="flex items-center gap-2 text-[11px] text-brand-muted">
          <span>الرقم الجامعي:</span>
          <span className="font-mono font-bold text-brand-ink" dir="ltr">
            {student.studentId}
          </span>
        </div>
        <div className="text-[11px] text-brand-muted">
          {student.major} • {student.academicYear}
        </div>
      </div>

      <div className="p-2.5 rounded-xl bg-brand-surface-muted border border-brand-border-soft space-y-1 text-[11px]">
        <div className="flex items-center justify-between">
          <span className="text-brand-muted">رقم الجوال:</span>
          <span className="font-mono font-bold text-brand-ink" dir="ltr">
            {isUnmasked ? student.phone : student.maskedPhone}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-brand-muted">رقم الهوية:</span>
          <span className="font-mono font-bold text-brand-ink" dir="ltr">
            {isUnmasked ? student.nationalId : student.maskedNationalId}
          </span>
        </div>
      </div>

      <div className="text-[10px] text-brand-hover-medium font-semibold bg-brand-surface-blue/60 p-2 rounded-lg">
        {student.borrowingEligibility}
      </div>

      {!isUnmasked && (
        <button
          type="button"
          onClick={onOpenUnmask}
          className="w-full py-1.5 rounded-lg border border-brand-border-soft text-[11px] font-bold text-brand-primary hover:bg-brand-surface-soft transition-colors"
        >
          👁️ عرض الجوال والهوية الكاملين (يتطلب تصريح)
        </button>
      )}
    </div>
  );
}

