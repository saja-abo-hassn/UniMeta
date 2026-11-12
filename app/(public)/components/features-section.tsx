import React from "react";
import Link from "next/link";
import { useScrollReveal } from "@/src/hooks/use-landing-effects";
import { featureItems } from "../data/landing-data";

export function FeaturesSection() {
  const { elementRef, isVisible } = useScrollReveal<HTMLDivElement>(0.05);

  return (
    <section
      id="features"
      ref={elementRef}
      className="py-14 sm:py-20 bg-gradient-to-b from-[#F0F6FA] via-white to-[#F0F6FA] border-y border-[#D0E8F9]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center sm:text-start max-w-3xl">
          <span className="text-xs font-bold text-[#0057C8] bg-[#E6F3FB] px-3.5 py-1 rounded-full border border-[#BEE3F8] inline-block mb-3">
            مميزاتنا
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B192C] tracking-tight">
            كل ما تحتاجه في رحلتك الجامعية
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            مجموعة متكاملة من الأدوات والخدمات الأكاديمية المصممة لتجعل حياتك الجامعية أكثر سهولة وتنظيمًا.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
          {featureItems.map((feat, idx) => (
            <div
              key={feat.title}
              style={{
                animationDelay: isVisible ? `${idx * 240}ms` : "0ms",
              }}
              className={`card-hover-effect bg-white/95 border border-[#D0E8F9] rounded-2xl p-6 shadow-xs flex flex-col justify-between text-start group ${
                isVisible ? "card-entrance opacity-100" : "opacity-0"
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] border border-[#BEE3F8] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200">
                  {feat.icon}
                </div>
                <h3 className="font-bold text-base text-[#0B192C] group-hover:text-[#0057C8] transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  {feat.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100">
                <Link
                  href={feat.href}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0057C8] hover:text-[#0045A5] transition-colors"
                >
                  <span>ابدأ باستخدام الميزة</span>
                  <span className="rtl:rotate-180">&rarr;</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/register">
            <button
              type="button"
              className="px-8 py-3.5 rounded-xl text-sm font-semibold bg-[#0057C8] hover:bg-[#0045A5] text-white shadow-md hover:shadow-lg transition-all focus-ring cursor-pointer"
            >
              ابدأ باستخدام UniMeta الآن
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

