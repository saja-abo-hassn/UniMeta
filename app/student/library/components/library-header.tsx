import React from "react";

interface LibraryHeaderProps {
  onOpenUpload: () => void;
}

export function LibraryHeader({ onOpenUpload }: LibraryHeaderProps) {
  return (
    <section className="card-entrance p-6 sm:p-7 rounded-3xl bg-white border border-brand-border-soft shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex flex-col mb-1">
          <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
            Digital Academic Library
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-ink mt-0.5">
            المكتبة الأكاديمية الرقمية
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-brand-muted leading-relaxed max-w-2xl">
          المستودع الموحد للمقررات الدراسية: كتب معتمدة، تلخيصات نموذجية، بنوك امتحانات، وسلايدات المحاضرات المنظمة لكل مساق.
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={onOpenUpload}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-brand-primary hover:bg-brand-hover-medium text-white text-xs sm:text-sm font-bold transition-all shadow-xs"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>مساهمة برفع محتوى</span>
        </button>
      </div>
    </section>
  );
}
