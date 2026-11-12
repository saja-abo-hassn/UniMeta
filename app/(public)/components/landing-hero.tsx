import React from "react";
import Link from "next/link";
import { useTypewriter } from "@/src/hooks/use-landing-effects";

export function LandingHero() {
  const { displayedText, isComplete: typingComplete } = useTypewriter(
    "رحلتك الجامعية... كلها بمكان واحد",
    40
  );

  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 border-b border-[#D0E8F9] bg-[#F0F6FA]"
      style={{
        backgroundImage: "url('/images/university-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "left center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-l from-white/95 via-white/75 to-transparent pointer-events-none" />

      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0" aria-hidden="true">
        <div className="absolute left-[clamp(155px,15.6vw,240px)] top-[43.4%] w-0 h-0">
          <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-[#4DB7F2]/15 blur-xl pointer-events-none" />

          <div className="orbit-cw-28 absolute top-0 left-0 w-[140px] h-[140px] rounded-full border-t border-[#4DB7F2]/30 border-r-transparent border-b-transparent border-l-transparent">
            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#4DB7F2] shadow-[0_0_8px_#4DB7F2]" />
          </div>

          <div className="orbit-ccw-32 absolute top-0 left-0 w-[170px] h-[170px] rounded-full hidden sm:block">
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#BFE8FF] shadow-[0_0_6px_#BFE8FF]" />
          </div>

          <div className="orbit-cw-34 absolute top-0 left-0 w-[205px] h-[205px] rounded-full border-t-2 border-r border-[#4DB7F2]/40 border-b-transparent border-l-transparent">
            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#0057C8] shadow-[0_0_10px_#4DB7F2]" />
          </div>

          <div className="orbit-ccw-38 absolute top-0 left-0 w-[240px] h-[240px] rounded-full hidden sm:block border-b border-[#38A3DE]/20 border-t-transparent border-l-transparent border-r-transparent">
            <span className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#4DB7F2] shadow-[0_0_8px_#4DB7F2]" />
          </div>

          <div className="orbit-cw-42 absolute top-0 left-0 w-[280px] h-[280px] rounded-full border-b border-l border-[#BFE8FF]/30 border-t-transparent border-r-transparent">
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
          </div>

          <div className="orbit-ccw-48 absolute top-0 left-0 w-[320px] h-[320px] rounded-full hidden sm:block">
            <span className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#D0E8F9] shadow-[0_0_6px_#D0E8F9]" />
          </div>

          <div className="orbit-cw-50 absolute top-0 left-0 w-[365px] h-[365px] rounded-full border-t border-l border-[#4DB7F2]/20 border-b-transparent border-r-transparent">
            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#38A3DE] shadow-[0_0_12px_#4DB7F2]" />
          </div>

          <div className="orbit-ccw-55 absolute top-0 left-0 w-[410px] h-[410px] rounded-full hidden sm:block">
            <span className="absolute bottom-1/4 right-0 translate-x-1/2 w-2 h-2 rounded-full bg-[#0057C8] shadow-[0_0_8px_#0057C8]" />
          </div>

          <div className="orbit-cw-45 absolute top-0 left-0 w-[460px] h-[460px] rounded-full border border-[#4DB7F2]/15">
            <span className="absolute top-1/4 left-0 -translate-x-1/2 w-2 h-2 rounded-full bg-[#4DB7F2] shadow-[0_0_10px_#4DB7F2]" />
          </div>

          <div className="orbit-ccw-60 absolute top-0 left-0 w-[510px] h-[510px] rounded-full hidden sm:block">
            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-start">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#E6F3FB] text-[#0057C8] border border-[#BEE3F8] mb-6 shadow-xs backdrop-blur-xs animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-[#0057C8] animate-pulse" />
            <span>منصة الطالب الجامعي المتكاملة</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B192C] tracking-tight leading-tight sm:leading-tight lg:leading-tight min-h-[3.2em] sm:min-h-[2.4em]">
            {displayedText.includes("كلها بمكان واحد") ? (
              <>
                <span>{displayedText.split("كلها بمكان واحد")[0]}</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#0057C8] via-[#0B5ED7] to-[#4DB7F2]">
                  كلها بمكان واحد
                </span>
              </>
            ) : (
              <span>{displayedText}</span>
            )}
            {!typingComplete && <span className="typing-cursor" aria-hidden="true" />}
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-700 leading-relaxed font-normal max-w-2xl animate-fade-in-up animation-delay-200">
            من اختيار تخصصك الجامعي إلى متابعة مسارك الأكاديمي وحساب معدلك وتنظيم وقتك، UniMeta تجمع لك الأدوات التي تحتاجها لتجربة جامعية أسهل وأكثر تنظيمًا.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3.5 animate-fade-in-up animation-delay-300">
            <Link href="/register">
              <button
                type="button"
                className="px-7 py-3.5 rounded-xl text-sm sm:text-base font-semibold bg-[#0057C8] hover:bg-[#0045A5] text-white shadow-md hover:shadow-lg transition-all duration-150 flex items-center gap-2 focus-ring cursor-pointer"
              >
                <span>ابدأ رحلتك الآن</span>
                <svg className="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </Link>

            <Link href="#features">
              <button
                type="button"
                className="px-6 py-3.5 rounded-xl text-sm sm:text-base font-medium bg-white/95 hover:bg-white text-[#0057C8] border border-[#BEE3F8] shadow-xs hover:border-[#4DB7F2] transition-all duration-150 focus-ring cursor-pointer"
              >
                استكشف المميزات
              </button>
            </Link>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-300/40 animate-fade-in-up animation-delay-400">
            <span className="text-xs font-semibold text-slate-600 block mb-3">
              الأدوات الأكاديمية السريعة:
            </span>
            <div className="flex flex-wrap gap-2.5">
              {[
                { label: "المسار الأكاديمي", path: "/student/academic" },
                { label: "حاسبة المعدل", path: "/student/academic" },
                { label: "المكتبة الرقمية", path: "/student/library" },
                { label: "مؤقت التركيز", path: "/student/productivity" },
                { label: "فرق التخرج", path: "/student/teams" },
              ].map((tag) => (
                <Link
                  key={tag.label}
                  href={tag.path}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/90 backdrop-blur-xs border border-[#D0E8F9] text-[#0057C8] hover:bg-[#EFF6FF] hover:border-[#4DB7F2] transition-colors shadow-2xs"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4DB7F2]" />
                  <span>{tag.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

