import React, { useState } from "react";
import { CourseMaterialItem } from "@/src/contexts/admin-context";

interface MyContributionsSectionProps {
  contributions: CourseMaterialItem[];
}

export function MyContributionsSection({ contributions }: MyContributionsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (contributions.length === 0) return null;

  return (
    <section className="bg-white rounded-3xl border border-[#D7EAF7] p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#EAF4FD] text-[#0057C8] flex items-center justify-center font-bold text-lg shadow-2xs">
            📤
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-[#16324A]">
                مساهماتي المرفوعة للمكتبة
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EAF4FD] text-[#0057C8] border border-[#D7EAF7]">
                {contributions.length} ملفات
              </span>
            </div>
            <p className="text-xs text-[#66788A] mt-0.5">
              متابعة حالة الملفات التعليمية التي ساهمت بها وتدقيقها من المشرف الأكاديمي.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-bold text-[#0057C8] hover:underline cursor-pointer"
        >
          {isExpanded ? "طي القائمة ▲" : "عرض الملفات ▼"}
        </button>
      </div>

      {isExpanded && (
        <div className="divide-y divide-[#D7EAF7]/60 pt-1">
          {contributions.map((item) => {
            const isPending = item.status === "قيد المراجعة";
            const isApproved = item.status === "منشور";
            const isRejected = item.status === "مرفوض";

            return (
              <div
                key={item.id}
                className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-[#16324A]">
                      {item.title}
                    </h3>
                    <span className="font-mono text-xs font-bold text-[#0057C8] bg-[#F0F7FD] px-2 py-0.5 rounded-md border border-[#D7EAF7]">
                      {item.courseCode}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#66788A]">
                    <span>{item.courseName}</span>
                    <span>•</span>
                    <span className="font-mono">{item.fileType}</span>
                    <span>•</span>
                    <span>{item.fileSize}</span>
                    <span>•</span>
                    <span>{item.date}</span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {isPending && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <span>⏳</span>
                      <span>قيد المراجعة</span>
                    </span>
                  )}

                  {isApproved && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span>✅</span>
                      <span>معتمد ومنشور</span>
                    </span>
                  )}

                  {isRejected && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                      <span>❌</span>
                      <span>مرفوض</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

