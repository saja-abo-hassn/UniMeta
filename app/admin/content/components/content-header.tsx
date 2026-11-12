import React from "react";

interface ContentHeaderProps {
  onOpenAdd: () => void;
}

export function ContentHeader({ onOpenAdd }: ContentHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0057C8]" />
          <span className="text-xs font-bold text-[#0057C8] uppercase tracking-wider">
            إدارة المحتوى الأكاديمي
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#16324A] tracking-tight">
          إدارة المواد والملفات الأكاديمية
        </h1>
        <p className="text-xs sm:text-sm text-[#66788A] leading-relaxed max-w-2xl">
          إدارة بنك الملفات الأكاديمية مقسمة إلى 4 أقسام رئيسية (الكتب، الملخصات، النماذج السابقة، والفيديوهات)، مع حرية كاملة لإدخال أي مادة دراسية ونشر محتواها.
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={onOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0057C8] hover:bg-[#2D78B7] text-white text-xs sm:text-sm font-bold transition-all shadow-xs hover:shadow-md"
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

