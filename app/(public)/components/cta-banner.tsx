import React from "react";
import Link from "next/link";

export function CtaBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-14">
      <div className="card-hover-effect relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-primary-hover via-brand-primary to-brand-primary-hover text-white p-8 sm:p-12 lg:p-14 shadow-2xl border border-brand-secondary/30 flex flex-col sm:flex-row items-center justify-between gap-8 text-center sm:text-start">
        <div className="absolute -top-24 -end-24 w-72 h-72 rounded-full bg-brand-secondary/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -start-24 w-72 h-72 rounded-full bg-brand-secondary/20 blur-3xl pointer-events-none" />

        <div className="relative max-w-2xl">
          <span className="text-xs font-semibold text-brand-light bg-white/20 px-3 py-1 rounded-full border border-white/30 inline-block mb-3">
            ابدأ الآن
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
            جاهز تخلي رحلتك الجامعية أسهل؟
          </h2>
          <p className="mt-3 text-brand-light text-xs sm:text-sm sm:leading-relaxed font-normal">
            ابدأ مع UniMeta واكتشف طريقة أفضل لتنظيم دراستك، ومتابعة إنجازاتك، والاستفادة من الخدمات الطلابية في مكان واحد.
          </p>
        </div>

        <div className="relative shrink-0">
          <Link href="/register">
            <button
              type="button"
              className="px-8 py-4 rounded-xl text-sm sm:text-base font-bold bg-white text-brand-primary hover:bg-brand-surface-blue shadow-xl transition-all duration-150 transform hover:scale-105 focus-ring cursor-pointer"
            >
              ابدأ رحلتك الآن
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

