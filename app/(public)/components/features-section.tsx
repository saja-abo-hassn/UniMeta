import React from "react";
import Link from "next/link";
import { ScrollRevealGrid } from "@/components/shared/scroll-reveal-grid";
import { featureItems } from "../data/landing-data";

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-14 sm:py-20 bg-gradient-to-b from-[#F0F6FA] via-white to-[#F0F6FA] border-y border-brand-border-soft"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center sm:text-start max-w-3xl">
          <span className="text-xs font-bold text-brand-primary bg-[#E6F3FB] px-3.5 py-1 rounded-full border border-[#BEE3F8] inline-block mb-3">
            مميزاتنا
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B192C] tracking-tight">
            كل ما تحتاجه في رحلتك الجامعية
          </h2>
          <p className="mt-3 text-brand-muted text-sm sm:text-base leading-relaxed">
            مجموعة متكاملة من الأدوات والخدمات الأكاديمية المصممة لتجعل حياتك الجامعية أكثر سهولة وتنظيمًا.
          </p>
        </div>

        <ScrollRevealGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
          {featureItems.map((feat) => (
            <div
              key={feat.title}
              className="card-hover-effect bg-white/95 border border-brand-border-soft rounded-2xl p-6 shadow-xs flex flex-col justify-between text-start group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] border border-[#BEE3F8] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200">
                  {feat.icon}
                </div>
                <h3 className="font-bold text-base text-[#0B192C] group-hover:text-brand-primary transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-brand-muted mt-2 leading-relaxed">
                  {feat.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100">
                <Link
                  href={feat.href}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:text-brand-primary-hover transition-colors"
                >
                  <span>ابدأ باستخدام الميزة</span>
                  <span className="rtl:rotate-180">&rarr;</span>
                </Link>
              </div>
            </div>
          ))}
        </ScrollRevealGrid>

        <div className="mt-12 text-center">
          <Link href="/register">
            <button
              type="button"
              className="px-8 py-3.5 rounded-xl text-sm font-semibold bg-brand-primary hover:bg-brand-primary-hover text-white shadow-md hover:shadow-lg transition-all focus-ring cursor-pointer"
            >
              ابدأ باستخدام UniMeta الآن
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

