import React from "react";
import Link from "next/link";

export function AboutSection() {
  return (
    <section id="about" className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="card-hover-effect bg-white/95 rounded-3xl p-8 sm:p-12 border border-brand-border-soft shadow-sm text-start flex flex-col md:flex-row items-center gap-8 justify-between">
        <div className="max-w-2xl space-y-4">
          <span className="text-xs font-bold text-brand-primary bg-[#EFF6FF] px-3.5 py-1 rounded-full border border-brand-border-soft inline-block">
            عن المنصة
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B192C] tracking-tight">
            رؤية المنصة وهدفها
          </h2>
          <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
            تطوير منصة طلابية تجمع التخطيط الأكاديمي وتنظيم الوقت والوصول إلى الموارد والتعاون بين الطلاب في تجربة رقمية موحدة وعصرية.
          </p>
        </div>
        <div className="shrink-0">
          <Link href="/register">
            <button
              type="button"
              className="px-6 py-3 rounded-xl text-sm font-semibold bg-brand-primary hover:bg-brand-primary-hover text-white shadow-sm hover:shadow transition-all focus-ring"
            >
              انضم إلى المنصة
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

