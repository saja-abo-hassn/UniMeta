"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export interface AuthLayoutProps {
  children: React.ReactNode;
  
  visualTitle?: string;
 
  visualSubtitle?: string;
}

export function AuthLayout({
  children,
  visualTitle = "أكاديميتك، بصورة أوضح.",
  visualSubtitle = "من التخطيط الأكاديمي إلى فرق المشاريع والاتفاقيات، كل أدواتك في تجربة واحدة متماسكة.",
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-[#F4FAFF] text-[#16324A] flex flex-col lg:grid lg:grid-cols-2" dir="rtl">
      <section className="relative flex flex-col justify-between overflow-hidden auth-panel-gradient text-white p-6 sm:p-10 lg:p-14 min-h-[340px] lg:min-h-screen">
        <div className="absolute inset-0 pointer-events-none opacity-15 mix-blend-overlay z-0">
          <Image
            src="/images/university-bg.jpg"
            alt="University Campus Architecture"
            fill
            priority
            className="object-cover object-center"
          />
        </div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0" aria-hidden="true">
          <div className="auth-orb-1 absolute -top-20 -end-20 w-96 h-96 rounded-full bg-white/20 blur-3xl" />
          <div className="auth-orb-2 absolute top-1/2 -start-20 w-88 h-88 rounded-full bg-[#0284C7]/25 blur-3xl" />
          <div className="auth-orb-3 absolute -bottom-20 end-1/4 w-80 h-80 rounded-full bg-[#BFE8FF]/30 blur-2xl" />

          <div className="auth-particle-1 absolute top-20 start-1/4 w-3 h-3 rounded-full bg-white/45 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
          <div className="auth-particle-2 absolute bottom-28 end-1/3 w-2.5 h-2.5 rounded-full bg-[#BFE8FF]/50 shadow-[0_0_8px_#BFE8FF]" />
          <div className="auth-particle-3 absolute top-1/3 end-1/6 w-3 h-3 rounded-full border border-white/40" />
        </div>

        <div
          className="auth-watermark-float absolute -bottom-14 -start-14 sm:-bottom-16 sm:-start-16 w-80 h-80 sm:w-96 sm:h-96 lg:w-[440px] lg:h-[440px] pointer-events-none select-none z-0"
          aria-hidden="true"
        >
          <div
            className="w-full h-full auth-watermark-logo"
            style={{
              backgroundColor: "white",
              WebkitMaskImage: "url('/images/al-azhar-logo.png')",
              maskImage: "url('/images/al-azhar-logo.png')",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          />
        </div>

        <div className="relative z-10 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-3 group transition-transform duration-200 hover:scale-[1.02]"
            aria-label="العودة للصفحة الرئيسية لـ UniMeta"
          >
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 shrink-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.18)]">
              <Image
                src="/images/unimeta-logo.png"
                alt="UniMeta Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base sm:text-lg tracking-wider text-white auth-panel-text-shadow">
                UniMeta
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#E0F2FE] font-medium -mt-0.5 auth-panel-text-shadow">
                يوني ميتا
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-white hover:text-white bg-white/15 hover:bg-white/25 transition-all px-3 py-1.5 rounded-full backdrop-blur-md border border-white/20 shadow-xs auth-panel-text-shadow"
          >
            <span>الصفحة الرئيسية</span>
            <svg
              className="w-3.5 h-3.5 rtl:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        <div className="relative z-10 my-8 sm:my-12 lg:my-auto max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/30 mb-4 shadow-xs auth-panel-text-shadow">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>مساحتك الجامعية الذكية</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-[1.25] tracking-tight auth-panel-text-shadow">
            {visualTitle}
          </h1>

          <p className="mt-4 text-xs sm:text-sm lg:text-base text-[#F0F9FF] leading-relaxed max-w-md font-medium auth-panel-text-shadow">
            {visualSubtitle}
          </p>

          <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-2 gap-3 max-w-md">
            <div className="flex items-center gap-2 text-xs text-white auth-panel-text-shadow font-medium">
              <svg className="w-4 h-4 text-[#BAE6FD] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <span>خدمات أكاديمية موحدة</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white auth-panel-text-shadow font-medium">
              <svg className="w-4 h-4 text-[#BAE6FD] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <span>مساعد UniMeta الذكي</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-[11px] text-[#E0F2FE] auth-panel-text-shadow">
          <p>نظام العرض محلي ولا يمثل مصادقة إنتاجية أو اتصالاً رسمياً بالجامعة.</p>
          <span className="hidden sm:inline-block font-medium">UniMeta &copy; 2026</span>
        </div>
      </section>

      <section className="relative flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 bg-[#F0F6FA] overflow-hidden min-h-screen">
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="auth-orb-1 absolute -top-16 -end-16 w-80 h-80 rounded-full bg-[#4DB7F2]/25 blur-3xl" />
          <div className="auth-orb-2 absolute top-1/2 -start-20 w-80 h-80 rounded-full bg-[#0057C8]/18 blur-3xl" />
          <div className="auth-orb-3 absolute -bottom-16 end-1/4 w-72 h-72 rounded-full bg-[#D0E8F9]/50 blur-2xl" />

          <div className="auth-particle-1 absolute top-16 start-1/4 w-3 h-3 rounded-full bg-[#4DB7F2]/30" />
          <div className="auth-particle-2 absolute bottom-24 end-1/3 w-2.5 h-2.5 rounded-full bg-[#0057C8]/25" />
          <div className="auth-particle-3 absolute top-1/3 end-1/6 w-3 h-3 rounded-full border border-[#4DB7F2]/30" />
        </div>


        

        <div className="w-full max-w-[480px] relative z-10 bg-white/88 backdrop-blur-xl rounded-3xl border border-white/80 shadow-[0_12px_36px_rgba(0,87,200,0.08)] p-6 sm:p-9 transition-all">
          {children}
        </div>
      </section>
    </div>
  );
}
