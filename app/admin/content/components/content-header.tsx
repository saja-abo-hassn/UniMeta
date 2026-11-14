import React from "react";

interface ContentHeaderProps {
  onOpenAdd: () => void;
}

export function ContentHeader({ onOpenAdd }: ContentHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
          <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
            إدارة المحتوى الأكاديمي
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-ink tracking-tight">
          إدارة المواد والملفات الأكاديمية
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted leading-relaxed max-w-2xl">
          إدارة بنك الملفات الأكاديمية مقسمة إلى 4 أقسام رئيسية (الكتب، الملخصات، النماذج السابقة، والفيديوهات)، مع حرية كاملة لإدخال أي مادة دراسية ونشر محتواها.
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={onOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-hover-medium text-white text-xs sm:text-sm font-bold transition-all shadow-xs hover:shadow-md"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>+ رفع مادة أو ملف جديد</span>
        </button>
      </div>
    </div>
  );
}

