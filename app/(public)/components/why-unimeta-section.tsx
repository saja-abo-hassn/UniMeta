import React from "react";
import Link from "next/link";
import { useScrollReveal } from "@/src/hooks/use-landing-effects";
import { whyUnimetaItems } from "../data/landing-data";

export function WhyUnimetaSection() {
  const { elementRef, isVisible } = useScrollReveal<HTMLDivElement>(0.05);

  return (
    <section id="why-unimeta" ref={elementRef} className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center sm:text-start max-w-3xl">
        <span className="text-xs font-bold text-[#0057C8] bg-[#E6F3FB] px-3.5 py-1 rounded-full border border-[#BEE3F8] inline-block mb-3">
          لماذا UniMeta؟
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B192C] tracking-tight">
          مشاكل جامعية كثيرة... حلّ واحد يجمعها
        </h2>
        <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          نعرف التحديات التي تواجهك خلال رحلتك الجامعية، لذلك صممنا UniMeta لتوفر عليك الوقت والجهد وتساعدك على التركيز على نجاحك.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
        {whyUnimetaItems.map((item, idx) => (
          <div
            key={item.title}
            style={{
              animationDelay: isVisible ? `${idx * 240}ms` : "0ms",
            }}
            className={`card-hover-effect bg-white/95 rounded-2xl p-5 border border-[#D0E8F9] flex flex-col justify-between text-start group cursor-default ${
              isVisible ? "card-entrance opacity-100" : "opacity-0"
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold text-[#0057C8] bg-[#EFF6FF] px-2.5 py-0.5 rounded-md border border-[#D0E8F9]">
                  {item.category}
                </span>
                <div className="p-2 rounded-xl bg-[#EFF6FF] text-[#0057C8] group-hover:bg-[#0057C8] group-hover:text-white transition-colors duration-200">
                  {item.icon}
                </div>
              </div>

              <h3 className="font-bold text-sm sm:text-base text-[#0B192C] group-hover:text-[#0057C8] transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {item.desc}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#D0E8F9] flex items-center justify-between text-xs text-[#0057C8] font-semibold">
              <Link href={item.href} className="hover:underline flex items-center gap-1">
                <span>استكشف الحل</span>
                <span className="rtl:rotate-180">&rarr;</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

