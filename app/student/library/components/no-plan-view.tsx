import React from "react";
import Link from "next/link";

export function NoPlanView() {
  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      <div className="card-entrance flex flex-col items-center justify-center text-center gap-4 p-10 sm:p-14 rounded-3xl bg-white border border-brand-border-soft shadow-xs my-8">
        <div className="w-16 h-16 rounded-2xl bg-brand-surface-blue flex items-center justify-center">
          <svg className="w-8 h-8 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div className="space-y-2 max-w-lg">
          <h2 className="text-xl sm:text-2xl font-extrabold text-brand-ink">
            المكتبة الرقمية والمحتوى — تحتاج اختيار الخطة
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
            لتصفح المراجع والكتب وتلخيصات ونماذج امتحانات المقررات الخاصة بتخصصك فقط، يرجى اختيار خطتك الدراسية المعتمدة أولاً.
          </p>
        </div>
        <Link
          href="/student/academic"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-hover-medium text-white font-bold text-sm transition-all shadow-md active:scale-95"
        >
          <span>اختيار الخطة الدراسية</span>
          <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
