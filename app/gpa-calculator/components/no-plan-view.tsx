import React from "react";
import Link from "next/link";

export function NoPlanView() {
  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      <div className="card-entrance flex flex-col items-center justify-center text-center gap-4 p-10 sm:p-14 rounded-3xl bg-white border border-[#D7EAF7] shadow-xs my-8">
        <div className="w-16 h-16 rounded-2xl bg-[#EAF4FD] flex items-center justify-center">
          <svg className="w-8 h-8 text-[#0057C8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="space-y-2 max-w-lg">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#16324A]">
            حاسبة المعدل التراكمي — تحتاج اختيار الخطة
          </h2>
          <p className="text-xs sm:text-sm text-[#66788A] leading-relaxed">
            لحساب معدلك التراكمي والفصلي ومطابقته بدقة مع مواد وساعات تخصصك، يرجى اختيار خطتك الدراسية المعتمدة أولاً.
          </p>
        </div>
        <Link
          href="/student/academic"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0057C8] hover:bg-[#2D78B7] text-white font-bold text-sm transition-all shadow-md active:scale-95"
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

