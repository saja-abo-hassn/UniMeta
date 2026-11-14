import React from "react";
import Link from "next/link";
import { ScrollRevealGrid } from "@/components/shared/scroll-reveal-grid";
import { whyUnimetaItems } from "../data/landing-data";

export function WhyUnimetaSection() {
  return (
    <section id="why-unimeta" className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center sm:text-start max-w-3xl">
        <span className="text-xs font-bold text-brand-primary bg-[#E6F3FB] px-3.5 py-1 rounded-full border border-[#BEE3F8] inline-block mb-3">
          لماذا UniMeta؟
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B192C] tracking-tight">
          مشاكل جامعية كثيرة... حلّ واحد يجمعها
        </h2>
        <p className="mt-3 text-brand-muted text-sm sm:text-base leading-relaxed">
          نعرف التحديات التي تواجهك خلال رحلتك الجامعية، لذلك صممنا UniMeta لتوفر عليك الوقت والجهد وتساعدك على التركيز على نجاحك.
        </p>
      </div>

      <ScrollRevealGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
        {whyUnimetaItems.map((item) => (
          <div
            key={item.title}
            className="card-hover-effect bg-white/95 rounded-2xl p-5 border border-brand-border-soft flex flex-col justify-between text-start group cursor-default"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold text-brand-primary bg-[#EFF6FF] px-2.5 py-0.5 rounded-md border border-brand-border-soft">
                  {item.category}
                </span>
                <div className="p-2 rounded-xl bg-[#EFF6FF] text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors duration-200">
                  {item.icon}
                </div>
              </div>

              <h3 className="font-bold text-sm sm:text-base text-[#0B192C] group-hover:text-brand-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-brand-muted mt-1.5 leading-relaxed">
                {item.desc}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-brand-border-soft flex items-center justify-between text-xs text-brand-primary font-semibold">
              <Link href={item.href} className="hover:underline flex items-center gap-1">
                <span>استكشف الحل</span>
                <span className="rtl:rotate-180">&rarr;</span>
              </Link>
            </div>
          </div>
        ))}
      </ScrollRevealGrid>
    </section>
  );
}

