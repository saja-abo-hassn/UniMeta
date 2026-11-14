import React from "react";
import { CourseMaterialItem } from "@/src/contexts/admin-context";
import { normalizeCategory, CATEGORY_MAP } from "../types";

interface PendingContributionsProps {
  materials: CourseMaterialItem[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function PendingContributions({
  materials,
  onApprove,
  onReject,
}: PendingContributionsProps) {
  if (materials.length === 0) return null;

  return (
    <section className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-white rounded-3xl border border-brand-border-soft/80 p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-xs">
            ⏳
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-brand-ink">
                مساهمات الطلاب بانتظار المراجعة
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500 text-white">
                {materials.length} بانتظار القرار
              </span>
            </div>
            <p className="text-xs text-brand-muted mt-0.5">
              ملفات قام الطلاب برفعها للمكتبة الرقمية، يرجى مراجعتها والموافقة عليها لتظهر للجميع أو رفضها.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {materials.map((item) => {
          const normCat = normalizeCategory(item.category);
          const catMeta = CATEGORY_MAP[normCat];
          const student = item.studentName || item.author || "طالب مستخدم";

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-brand-border-soft p-4 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between gap-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-7 h-7 rounded-xl bg-brand-surface-blue text-brand-primary flex items-center justify-center text-xs font-bold shrink-0">
                      👤
                    </span>
                    <span className="text-xs font-bold text-brand-ink truncate">
                      {student}
                    </span>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border inline-flex items-center gap-1 shrink-0 ${catMeta.badge}`}>
                    <span>{catMeta.icon}</span>
                    <span>{catMeta.label}</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-black text-brand-ink line-clamp-1">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-brand-muted mt-0.5">
                    <span className="font-bold text-brand-primary">{item.courseName}</span>
                    <span>({item.courseCode})</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-brand-muted bg-brand-surface-muted p-2 rounded-xl border border-brand-border-soft">
                  <span>📄 {item.fileName || `${item.title}.${item.fileType.toLowerCase()}`}</span>
                  <span>•</span>
                  <span className="font-mono">{item.fileType}</span>
                  <span>•</span>
                  <span>{item.fileSize}</span>
                  <span>•</span>
                  <span>{item.date}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-brand-border-soft">
                <button
                  type="button"
                  onClick={() => onReject(item.id)}
                  className="px-3.5 py-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-all cursor-pointer"
                >
                  رفض ✕
                </button>
                <button
                  type="button"
                  onClick={() => onApprove(item.id)}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  موافقة ونشر ✓
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

