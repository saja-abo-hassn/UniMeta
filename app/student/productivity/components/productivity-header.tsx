import React from "react";

interface ProductivityHeaderProps {
  onOpenSettings: () => void;
}

export function ProductivityHeader({ onOpenSettings }: ProductivityHeaderProps) {
  return (
    <section className="card-entrance p-6 sm:p-7 rounded-3xl bg-white border border-brand-border-soft shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex flex-col mb-1">
          <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
            Productivity & Focus Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-ink mt-0.5">
            مؤقت بومودورو وإحصائيات التركيز
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-brand-muted leading-relaxed max-w-xl">
          تقنية بومودورو المخصصة للمذاكرة الأكاديمية مع ضبط مرن لأوقات الجلسات والاستراحات وتتبع دقيق لمعدل التركيز.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onOpenSettings}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-surface-soft hover:bg-brand-surface-blue text-brand-primary text-xs sm:text-sm font-bold border border-brand-border-soft transition-colors shadow-2xs"
        >
          <svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>تخصيص أوقات البومودورو</span>
        </button>
      </div>
    </section>
  );
}

