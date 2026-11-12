import React from "react";
import Link from "next/link";
import Image from "next/image";

export function InterestsQuizCard() {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12">
      <div className="card-hover-effect card-entrance glass-card-blue p-6 sm:p-9 shadow-lg bg-gradient-to-r from-white via-[#F4F9FD] to-[#EBF5FC] flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 border-2 border-[#BEE3F8] rounded-3xl relative overflow-hidden group">
        <div className="absolute -top-16 -end-16 w-52 h-52 rounded-full bg-[#4DB7F2]/15 blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
        <div className="absolute -bottom-16 -start-16 w-52 h-52 rounded-full bg-[#0057C8]/10 blur-3xl pointer-events-none" />

        <div className="flex-1 text-start relative z-10 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#0057C8] bg-[#E6F3FB] px-3.5 py-1 rounded-full border border-[#BEE3F8] inline-flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#0057C8] animate-pulse" />
              مقياس الميول وتوجيه التخصصات
            </span>
            <span className="text-[11px] font-semibold text-[#0284C7] bg-white/80 px-2.5 py-0.5 rounded-full border border-[#D7EAF7]">
              نموذج Holland RIASEC
            </span>
          </div>

          <h2 className="text-xl sm:text-3xl font-extrabold text-[#0B192C] tracking-tight pt-1">
            لسه محتار في اختيار تخصصك الجامعي الأنسب؟
          </h2>

          <p className="text-slate-600 text-xs sm:text-sm max-w-xl leading-relaxed">
            أجب عن 15 سؤالاً عملياً لنحلل سماتك (التقنية، العلمية، الإنسانية، الإدارية، والإبداعية) ونقترح لك الخطة الدراسية الأكثر تطابقاً مع شغفك من بين خطط جامعة الأزهر المعتمدة مع نسب التوافق الدقيقة.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white/90 border border-[#D7EAF7] text-[#0057C8] shadow-2xs hover:-translate-y-0.5 transition-transform">
              <span>💻</span> تقني T
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white/90 border border-sky-200 text-sky-700 shadow-2xs hover:-translate-y-0.5 transition-transform">
              <span>🔬</span> علمي S
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white/90 border border-teal-200 text-teal-700 shadow-2xs hover:-translate-y-0.5 transition-transform">
              <span>🤝</span> إنساني H
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white/90 border border-amber-200 text-amber-700 shadow-2xs hover:-translate-y-0.5 transition-transform">
              <span>📊</span> إداري B
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white/90 border border-purple-200 text-purple-700 shadow-2xs hover:-translate-y-0.5 transition-transform">
              <span>🎨</span> إبداعي C
            </span>
          </div>

          <div className="pt-3">
            <Link href="/student/interests">
              <button
                type="button"
                className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-[#0057C8] hover:bg-[#0045A5] text-white shadow-md hover:shadow-lg transition-all duration-200 focus-ring cursor-pointer flex items-center gap-2 group-hover:gap-3"
              >
                <span>ابدأ اختبار الميول وتحديد التخصص (15 سؤالاً)</span>
                <span className="transition-transform group-hover:-translate-x-1">&larr;</span>
              </button>
            </Link>
          </div>
        </div>

        <div className="relative flex flex-col items-center justify-center p-6 rounded-3xl bg-white/95 backdrop-blur-md border border-[#BEE3F8] shadow-md min-w-[170px] sm:min-w-[190px] shrink-0 text-center relative z-10 group-hover:border-[#0057C8] transition-all">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 -mt-2 mascot-stationary-float select-none">
            <Image
              src="/mascot/think.png"
              alt="UniMeta Thinking Mascot"
              fill
              className="object-contain drop-shadow-md"
              priority
            />
          </div>

          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-4xl sm:text-5xl font-black text-[#0057C8] tracking-tight">
              15
            </span>
            <span className="text-xs font-bold text-[#4DB7F2]">
              سؤالاً
            </span>
          </div>

          <span className="text-[11px] font-bold text-slate-600 mt-0.5">
            توجيه أكاديمي فوري
          </span>

          <div className="mt-2.5 px-2.5 py-0.5 rounded-full bg-[#EAF4FD] text-[10px] font-extrabold text-[#0057C8]">
            حفظ تلقائي للتقدم
          </div>
        </div>
      </div>
    </section>
  );
}

