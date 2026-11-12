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
    <div className="p-4 rounded-2xl bg-white border border-[#D7EAF7] space-y-3 relative shadow-2xs">
      <div className="flex items-center justify-between pb-2 border-b border-[#D7EAF7]">
        <span
          className={`text-[10px] font-black uppercase tracking-wider ${
            isOwner ? "text-purple-700" : "text-[#0057C8]"
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
        <div className="font-black text-sm text-[#16324A]">{student.name}</div>
        <div className="flex items-center gap-2 text-[11px] text-[#66788A]">
          <span>الرقم الجامعي:</span>
          <span className="font-mono font-bold text-[#16324A]" dir="ltr">
            {student.studentId}
          </span>
        </div>
        <div className="text-[11px] text-[#66788A]">
          {student.major} • {student.academicYear}
        </div>
      </div>

      <div className="p-2.5 rounded-xl bg-[#F8FBFE] border border-[#D7EAF7] space-y-1 text-[11px]">
        <div className="flex items-center justify-between">
          <span className="text-[#66788A]">رقم الجوال:</span>
          <span className="font-mono font-bold text-[#16324A]" dir="ltr">
            {isUnmasked ? student.phone : student.maskedPhone}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#66788A]">رقم الهوية:</span>
          <span className="font-mono font-bold text-[#16324A]" dir="ltr">
            {isUnmasked ? student.nationalId : student.maskedNationalId}
          </span>
        </div>
      </div>

      <div className="text-[10px] text-[#2D78B7] font-semibold bg-[#EAF4FD]/60 p-2 rounded-lg">
        {student.borrowingEligibility}
      </div>

      {!isUnmasked && (
        <button
          type="button"
          onClick={onOpenUnmask}
          className="w-full py-1.5 rounded-lg border border-[#D7EAF7] text-[11px] font-bold text-[#0057C8] hover:bg-[#F0F7FD] transition-colors"
        >
          👁️ عرض الجوال والهوية الكاملين (يتطلب تصريح)
        </button>
      )}
    </div>
  );
}

