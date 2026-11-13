import React from "react";
import Link from "next/link";
import Image from "next/image";

export function LandingHero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 border-b border-brand-border-soft bg-[#F0F6FA]"
    >
      <Image
        src="/images/university-bg.jpg"
        alt=""
        fill
        sizes="100vw"
        priority
        unoptimized
        aria-hidden="true"
        className="object-cover object-left"
      />
      <div className="absolute inset-0 bg-gradient-to-l from-white/95 via-white/75 to-transparent pointer-events-none" />

      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0" aria-hidden="true">
        <div className="hero-orbit-center absolute">
          <div className="hero-orbit-glow absolute size-64 rounded-full border border-brand-secondary/15 bg-brand-secondary/5 blur-2xl" />
          <div className="orbit-cw-28 absolute top-0 left-0 size-[140px] rounded-full border-t border-brand-secondary/30 border-r-transparent border-b-transparent border-l-transparent">
            <span className="absolute top-0 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-secondary shadow-[0_0_8px_var(--brand-secondary)]" />
          </div>
          <div className="orbit-ccw-32 absolute top-0 left-0 hidden size-[170px] rounded-full sm:block">
            <span className="absolute bottom-0 left-1/2 size-1.5 translate-y-1/2 rounded-full bg-brand-secondary/50" />
          </div>
          <div className="orbit-cw-34 absolute top-0 left-0 size-[205px] rounded-full border-t-2 border-r border-brand-secondary/40 border-b-transparent border-l-transparent">
            <span className="absolute top-0 left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-primary shadow-[0_0_10px_var(--brand-secondary)]" />
          </div>
          <div className="orbit-ccw-38 absolute top-0 left-0 hidden size-[240px] rounded-full border-b border-brand-secondary/20 border-t-transparent border-l-transparent border-r-transparent sm:block">
            <span className="absolute top-1/2 right-0 size-2 translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-secondary shadow-[0_0_8px_var(--brand-secondary)]" />
          </div>
          <div className="orbit-cw-42 absolute top-0 left-0 size-[280px] rounded-full border-b border-l border-brand-secondary/30 border-t-transparent border-r-transparent">
            <span className="absolute bottom-0 left-1/2 size-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
          </div>
          <div className="orbit-ccw-48 absolute top-0 left-0 hidden size-[320px] rounded-full sm:block">
            <span className="absolute top-1/2 left-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-secondary/50" />
          </div>
          <div className="orbit-cw-50 absolute top-0 left-0 size-[365px] rounded-full border-t border-l border-brand-secondary/20 border-b-transparent border-r-transparent">
            <span className="absolute top-0 left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-secondary shadow-[0_0_12px_var(--brand-secondary)]" />
          </div>
          <div className="orbit-ccw-55 absolute top-0 left-0 hidden size-[410px] rounded-full sm:block">
            <span className="absolute right-0 top-1/4 size-2 translate-x-1/2 rounded-full bg-brand-primary shadow-[0_0_8px_var(--brand-primary)]" />
          </div>
          <div className="orbit-cw-45 absolute top-0 left-0 size-[460px] rounded-full border border-brand-secondary/15">
            <span className="absolute left-0 top-1/4 size-2 -translate-x-1/2 rounded-full bg-brand-secondary shadow-[0_0_10px_var(--brand-secondary)]" />
          </div>
          <div className="orbit-ccw-60 absolute top-0 left-0 hidden size-[510px] rounded-full sm:block">
            <span className="absolute top-0 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
          </div>
        </div>
      </div>

      <div className="hero-content relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-start">
        <div className="max-w-3xl">
          <div className="hero-enter inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#E6F3FB] text-brand-primary border border-[#BEE3F8] mb-6 shadow-xs backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-brand-primary" />
            <span>منصة الطالب الجامعي المتكاملة</span>
          </div>

          <h1 className="hero-enter hero-enter-delay-1 text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B192C] tracking-tight leading-tight sm:leading-tight lg:leading-tight">
            <span>رحلتك الجامعية...</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-brand-primary via-[#0B5ED7] to-brand-secondary">
              كلها بمكان واحد
            </span>
          </h1>

          <p className="hero-enter hero-enter-delay-2 mt-6 text-base sm:text-lg text-brand-ink leading-relaxed font-normal max-w-2xl">
            من اختيار تخصصك الجامعي إلى متابعة مسارك الأكاديمي وحساب معدلك وتنظيم وقتك، UniMeta تجمع لك الأدوات التي تحتاجها لتجربة جامعية أسهل وأكثر تنظيمًا.
          </p>

          <div className="hero-enter hero-enter-delay-3 mt-8 flex flex-wrap items-center gap-3.5">
            <Link href="/register">
              <button
                type="button"
                className="px-7 py-3.5 rounded-xl text-sm sm:text-base font-semibold bg-brand-primary hover:bg-brand-primary-hover text-white shadow-md hover:shadow-lg transition-all duration-150 flex items-center gap-2 focus-ring cursor-pointer"
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
                className="px-6 py-3.5 rounded-xl text-sm sm:text-base font-medium bg-white/95 hover:bg-white text-brand-primary border border-[#BEE3F8] shadow-xs hover:border-brand-secondary transition-all duration-150 focus-ring cursor-pointer"
              >
                استكشف المميزات
              </button>
            </Link>
          </div>

          <div className="hero-enter hero-enter-delay-4 mt-10 pt-6 border-t border-slate-300/40">
            <span className="text-xs font-semibold text-brand-muted block mb-3">
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/90 backdrop-blur-xs border border-brand-border-soft text-brand-primary hover:bg-[#EFF6FF] hover:border-brand-secondary transition-colors shadow-2xs"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary" />
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

