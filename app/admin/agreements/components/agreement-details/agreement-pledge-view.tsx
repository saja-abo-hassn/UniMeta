"use client";

import React from "react";
import Image from "next/image";

interface AgreementPledgeViewProps {
  pledgeVersion?: string;
  pledgeText?: string;
  signatureUrl?: string;
  requesterName: string;
}

export function AgreementPledgeView({
  pledgeVersion,
  pledgeText,
  signatureUrl,
  requesterName,
}: AgreementPledgeViewProps) {
  if (!signatureUrl && !pledgeVersion) return null;

  return (
    <div className="p-4 rounded-2xl bg-[#F0F7FD] border border-[#BEE3F8] space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black text-[#16324A] flex items-center gap-1.5">
          <span>✍️</span>
          <span>التعهد الخطي والتوقيع الرقمي المعتمد</span>
        </span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white text-[#0057C8] border border-[#BEE3F8]">
          {pledgeVersion || "إصدار رسمي v1.4"}
        </span>
      </div>

      <div className="p-3 rounded-xl bg-white border border-[#D7EAF7] text-[11px] text-[#48627A] leading-relaxed max-h-24 overflow-y-auto whitespace-pre-line">
        {pledgeText ||
          "التزم الطالب المستعير بالمحافظة التامة على الغرض وصيانته وإرجاعه في الموعد المحدد دون تأخير وتحمل كامل المسؤولية المدنية والأكاديمية والمالية عن أي تلف أو فقدان."}
      </div>

      {signatureUrl && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#D7EAF7]">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-[#16324A] block">
              توقيع المستعير: {requesterName}
            </span>
            <span className="text-[10px] text-[#8297A8]">
              تم التوقيع إلكترونياً وتوثيقه بسجلات المنصة المشفرة
            </span>
          </div>
          <div className="relative p-1.5 bg-[#F8FBFE] rounded-lg border border-[#D7EAF7] h-14 w-[160px] flex items-center justify-center overflow-hidden">
            <Image
              src={signatureUrl}
              alt="Digital Signature"
              width={160}
              height={50}
              className="max-h-full max-w-full object-contain"
              unoptimized
            />
          </div>
        </div>
      )}
    </div>
  );
}

