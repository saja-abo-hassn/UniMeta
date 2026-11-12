import React from "react";
import Link from "next/link";
import Image from "next/image";
import { coreTeamMembers } from "@/src/data/team";
import { useScrollReveal } from "@/src/hooks/use-landing-effects";

export function TeamSection() {
  const { elementRef, isVisible } = useScrollReveal<HTMLDivElement>(0.05);

  return (
    <section
      id="team"
      ref={elementRef}
      className="py-14 sm:py-20 bg-gradient-to-b from-[#F0F6FA] via-[#E8F4FC]/50 to-[#F0F6FA] border-t border-[#D0E8F9]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#0057C8] bg-white px-3.5 py-1 rounded-full border border-[#BEE3F8] inline-block mb-3 shadow-2xs">
            فريق العمل
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B192C] tracking-tight">
            فريق العمل والمساهمون في المشروع
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            الكوادر الطلابية والهندسية وراء بناء وتطوير منصة UniMeta الجامعية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {coreTeamMembers.map((member, idx) => (
            <div
              key={member.name}
              style={{
                animationDelay: isVisible ? `${idx * 250}ms` : "0ms",
              }}
              className={`card-hover-effect h-full flex flex-col justify-between items-center text-center p-7 bg-white/95 rounded-2xl border border-[#D0E8F9] hover:border-[#4DB7F2] shadow-xs group ${
                isVisible ? "card-entrance opacity-100" : "opacity-0"
              }`}
            >
              <div className="flex flex-col items-center w-full">
                <div className="relative mb-4">
                  {member.image ? (
                    <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-xs ring-2 ring-[#4DB7F2]/40 bg-slate-100">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={80}
                        height={80}
                        priority
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#0057C8] to-[#4DB7F2] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-300">
                      <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}

                  {member.isLead && (
                    <div className="absolute -bottom-1 -end-1 w-6 h-6 rounded-full bg-[#0057C8] text-white flex items-center justify-center shadow-xs">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                <h3 className="font-bold text-lg sm:text-xl text-[#0B192C]">
                  {member.name}
                </h3>

                <div className="flex flex-col items-center mt-2 mb-3">
                  <span className="font-bold text-xs sm:text-sm text-[#0057C8] tracking-wide">
                    {member.roleEn}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {member.roleAr}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xs mt-1">
                  {member.desc}
                </p>

                {member.socials && (
                  <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-[#D0E8F9]/70 w-full">
                    {member.socials.linkedin && (
                      <a
                        href={member.socials.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#0057C8] hover:bg-[#0057C8] hover:text-white transition-all flex items-center justify-center shadow-xs"
                        aria-label={`LinkedIn - ${member.name}`}
                        title="LinkedIn"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                        </svg>
                      </a>
                    )}
                    {member.socials.whatsapp && (
                      <a
                        href={member.socials.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#0057C8] hover:bg-[#0057C8] hover:text-white transition-all flex items-center justify-center shadow-xs"
                        aria-label={`WhatsApp - ${member.name}`}
                        title="WhatsApp"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.24-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3z"/>
                        </svg>
                      </a>
                    )}
                    {member.socials.instagram && (
                      <a
                        href={member.socials.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#0057C8] hover:bg-[#0057C8] hover:text-white transition-all flex items-center justify-center shadow-xs"
                        aria-label={`Instagram - ${member.name}`}
                        title="Instagram"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                )}
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
              أنشئ حسابك الآن &larr;
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

