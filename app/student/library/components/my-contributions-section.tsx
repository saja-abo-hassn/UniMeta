import React, { useState } from "react";
import { CourseMaterialItem } from "@/src/contexts/admin-context";

interface MyContributionsSectionProps {
  contributions: CourseMaterialItem[];
}

export function MyContributionsSection({ contributions }: MyContributionsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (contributions.length === 0) return null;

  return (
    <section className="bg-white rounded-3xl border border-brand-border-soft p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-surface-blue text-brand-primary flex items-center justify-center font-bold text-lg shadow-2xs">
            📤
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-brand-ink">
                مساهماتي المرفوعة للمكتبة
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-surface-blue text-brand-primary border border-brand-border-soft">
                {contributions.length} ملفات
              </span>
            </div>
            <p className="text-xs text-brand-muted mt-0.5">
              متابعة حالة الملفات التعليمية التي ساهمت بها وتدقيقها من المشرف الأكاديمي.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-bold text-brand-primary hover:underline cursor-pointer"
        >
          {isExpanded ? "طي القائمة ▲" : "عرض الملفات ▼"}
        </button>
      </div>

      {isExpanded && (
        <div className="divide-y divide-brand-border-soft/60 pt-1">
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
                    <h3 className="text-sm font-bold text-brand-ink">
                      {item.title}
                    </h3>
                    <span className="font-mono text-xs font-bold text-brand-primary bg-brand-surface-soft px-2 py-0.5 rounded-md border border-brand-border-soft">
                      {item.courseCode}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-brand-muted">
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
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-surface-blue text-brand-primary border border-brand-border-soft">
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

