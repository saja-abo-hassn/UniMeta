"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";

export function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full bg-white/92 backdrop-blur-md border-b border-brand-border-soft shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        <div className="animate-fade-in">
          <Logo size="md" href="/" subtitle="University Meta" />
        </div>

        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2 animate-fade-in" aria-label="روابط الموقع">
          <Link
            href="#hero"
            className="px-3.5 py-2 rounded-xl text-sm font-medium text-brand-ink hover:text-brand-primary hover:bg-[#EFF6FF] transition-all focus-ring"
          >
            الرئيسية
          </Link>
          <Link
            href="#why-unimeta"
            className="px-3.5 py-2 rounded-xl text-sm font-medium text-brand-ink hover:text-brand-primary hover:bg-[#EFF6FF] transition-all focus-ring"
          >
            لماذا UniMeta؟
          </Link>
          <Link
            href="#features"
            className="px-3.5 py-2 rounded-xl text-sm font-medium text-brand-ink hover:text-brand-primary hover:bg-[#EFF6FF] transition-all focus-ring"
          >
            مميزاتنا
          </Link>
          <Link
            href="#about"
            className="px-3.5 py-2 rounded-xl text-sm font-medium text-brand-ink hover:text-brand-primary hover:bg-[#EFF6FF] transition-all focus-ring"
          >
            من نحن
          </Link>
          <Link
            href="#team"
            className="px-3.5 py-2 rounded-xl text-sm font-medium text-brand-ink hover:text-brand-primary hover:bg-[#EFF6FF] transition-all focus-ring"
          >
            فريق العمل
          </Link>
        </nav>

        <div className="hidden sm:flex items-center gap-2.5 animate-fade-in">
          <Link href="/login">
            <button
              type="button"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-brand-ink hover:text-brand-primary hover:bg-[#EFF6FF] transition-all focus-ring cursor-pointer"
            >
              تسجيل الدخول
            </button>
          </Link>
          <Link href="/register">
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-brand-primary hover:bg-brand-primary-hover text-white shadow-sm hover:shadow-md transition-all focus-ring cursor-pointer"
            >
              ابدأ الآن
            </button>
          </Link>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <Link href="/register">
            <button
              type="button"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-brand-primary text-white shadow-xs"
            >
              ابدأ الآن
            </button>
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-brand-ink hover:bg-[#EFF6FF] hover:text-brand-primary transition-colors focus-ring"
            aria-label="فتح القائمة"
            aria-expanded={mobileMenuOpen}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-brand-border-soft bg-white/98 backdrop-blur-xl px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          <Link
            href="#hero"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-[#EFF6FF] hover:text-brand-primary"
          >
            الرئيسية
          </Link>
          <Link
            href="#why-unimeta"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-[#EFF6FF] hover:text-brand-primary"
          >
            لماذا UniMeta؟
          </Link>
          <Link
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-[#EFF6FF] hover:text-brand-primary"
          >
            مميزاتنا
          </Link>
          <Link
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-[#EFF6FF] hover:text-brand-primary"
          >
            من نحن
          </Link>
          <Link
            href="#team"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-[#EFF6FF] hover:text-brand-primary"
          >
            فريق العمل
          </Link>
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
              <button
                type="button"
                className="w-full py-2.5 rounded-xl text-center text-sm font-medium text-brand-primary bg-[#EFF6FF] hover:bg-[#DBEAFE]"
              >
                تسجيل الدخول
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

