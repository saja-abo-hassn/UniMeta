import React from "react";
import Link from "next/link";
import { StudyPlan } from "@/src/data/study-plans-data";

interface MyHoursHeroProps {
  selectedPlan: StudyPlan;
  totalCredits: number;
}

export function MyHoursHero({ selectedPlan, totalCredits }: MyHoursHeroProps) {
  return (
    <section className="relative overflow-hidden p-6 sm:p-7 rounded-3xl bg-white border border-[#D7EAF7] shadow-xs">
      <div className="absolute top-0 end-0 -mt-10 -me-10 w-72 h-72 bg-gradient-to-br from-[#4DB7F2]/10 to-[#0057C8]/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-1 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-[#0057C8] text-white flex items-center justify-center shrink-0 shadow-md">
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18C5 19.94 8.13 22 12 22C15.87 22 19 19.94 19 17.18V13.18L12 17.09L5 13.18Z" />
            </svg>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#16324A]">
                {selectedPlan.major}
              </h1>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#EAF4FD] text-[#0057C8] border border-[#D7EAF7]">
                {selectedPlan.degree}
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-[#16324A] border border-slate-200">
                سعر الساعة: {selectedPlan.hourlyRate} د.أ
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#66788A]">
              {selectedPlan.college} • إجمالي ساعات التخرج {totalCredits} ساعة ({selectedPlan.semestersCount} فصول دراسية)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {selectedPlan.pdfUrl && (
            <a
              href={selectedPlan.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#F8FBFE] text-[#0057C8] border border-[#D7EAF7] hover:border-[#4DB7F2] text-xs sm:text-sm font-bold transition-all shadow-2xs"
            >
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              <span>عرض الخطة [PDF]</span>
            </a>
          )}

          <Link
            href="/student/academic"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0057C8] hover:bg-[#2D78B7] text-white text-xs sm:text-sm font-bold transition-all shadow-xs group"
          >
            <svg className="w-4 h-4 text-[#BFE8FF] group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <span>تغيير التخصص</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

