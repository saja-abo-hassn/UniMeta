"use client";

import React from "react";
import { EducationalMaterialType } from "./types";
import { ContentStatus } from "@/src/contexts/admin-context";

interface ContentTypeSelectProps {
  type: EducationalMaterialType;
  onTypeChange: (type: EducationalMaterialType) => void;
  status: ContentStatus;
  onStatusChange: (status: ContentStatus) => void;
}

const TYPE_OPTIONS: Array<{ id: EducationalMaterialType; label: string; icon: string }> = [
  { id: "ملخص", label: "ملخص دراسي", icon: "📝" },
  { id: "شرح", label: "شرح / محاضرة", icon: "🎬" },
  { id: "مصدر", label: "مرجع / كتاب", icon: "📚" },
  { id: "امتحان", label: "امتحان / أسئلة سابقة", icon: "📋" },
];

export function ContentTypeSelect({
  type,
  onTypeChange,
  status,
  onStatusChange,
}: ContentTypeSelectProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-start">
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-brand-ink block">
          نوع المحتوى التعليمي <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {TYPE_OPTIONS.map((opt) => {
            const isSelected = type === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onTypeChange(opt.id)}
                className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold transition-all border text-start cursor-pointer ${
                  isSelected
                    ? "bg-brand-primary text-white border-brand-primary shadow-xs"
                    : "bg-white text-brand-ink border-brand-border-soft hover:bg-brand-surface-soft"
                }`}
              >
                <span>{opt.icon}</span>
                <span className="truncate">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="content-status-select" className="text-xs font-bold text-brand-ink block">
          حالة النشر <span className="text-red-500">*</span>
        </label>
        <select
          id="content-status-select"
          value={status}
          onChange={(e) => onStatusChange(e.target.value as ContentStatus)}
          className="w-full px-3 py-2 rounded-xl border border-brand-border-soft bg-white text-xs font-bold text-brand-ink focus:outline-none focus:border-brand-primary"
        >
          <option value="منشور">منشور للطلاب فوراً (يظهر بالخطة والمكتبة)</option>
          <option value="مسودة">مسودة (محجوب مؤقتاً للتعديل)</option>
          <option value="قيد المراجعة">قيد المراجعة والتدقيق الأكاديمي</option>
        </select>
        <p className="text-[10px] text-brand-muted">
          المحتوى المنشور فقط يظهر في مكتبة الطالب وتحديث العدادات الأكاديمية
        </p>
      </div>
    </div>
  );
}

