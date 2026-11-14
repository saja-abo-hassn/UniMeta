"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { studentDestinations } from "@/src/lib/navigation/student";
import { useStudentUser } from "@/src/hooks/use-student-user";
import { useStudyPlan } from "@/src/contexts/study-plan-context";
import { NotificationsDropdown } from "./notifications-dropdown";

export interface StudentTopbarProps {
  onMenuToggle: () => void;
}

export function StudentTopbar({ onMenuToggle }: StudentTopbarProps) {
  const pathname = usePathname();
  const { fullName, faculty } = useStudentUser();
  const { selectedPlan, hasPlanSelected } = useStudyPlan();

  // Compute initials dynamically
  const initials = fullName
    ? fullName
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
    : "ط";

  // Determine current page title from top destinations or subItems
  let pageTitle = "لوحة الطالب";
  for (const dest of studentDestinations) {
    if (dest.path === pathname) {
      pageTitle = dest.title;
      break;
    }
    if (dest.subItems) {
      const sub = dest.subItems.find(
        (s) => s.path === pathname || `/student${s.path}` === pathname
      );
      if (sub) {
        pageTitle = sub.title;
        break;
      }
    }
  }

  return (
    <header className="h-[74px] sm:h-[82px] bg-white/95 backdrop-blur-md border-b border-brand-border-soft px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-10 transition-colors">
      {/* Right Side (in RTL): Hamburger on Mobile + Breadcrumb/Title */}
      <div className="flex items-center gap-3.5">
        <button
          type="button"
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-brand-ink hover:bg-brand-surface-soft hover:text-brand-primary border border-brand-border-soft transition-colors focus-ring"
          aria-label="فتح القائمة الجانبية"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Figma Page Header (node 1:1173) */}
        <div className="flex flex-col">
          <span className="text-[10px] text-brand-muted font-medium leading-none mb-1">
            مساحة الطالب
          </span>
          <h1 className="text-base sm:text-lg font-bold text-brand-ink leading-tight">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Left Side (in RTL): Notifications & Profile Pill (Figma node 1:1181) */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Academic status pill */}
        <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-surface-blue text-brand-primary border border-brand-border-soft">
          <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
          <span>الفصل الثاني 2025/2026</span>
        </div>

        {/* Notifications Dropdown (Bell Icon + Badge) */}
        <NotificationsDropdown />

        {/* Profile Pill */}
        <Link
          href="/student/settings"
          className="flex items-center gap-2.5 p-1.5 pe-3 rounded-full sm:rounded-2xl border border-brand-border-soft bg-white hover:bg-brand-surface-soft hover:border-brand-secondary transition-all group"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 shadow-xs">
            {initials}
          </div>
          <div className="hidden sm:flex flex-col text-start">
            <span className="font-bold text-xs text-brand-ink group-hover:text-brand-primary transition-colors leading-tight">
              {fullName || "حساب الطالب"}
            </span>
            <span className="text-[9px] text-brand-muted leading-tight">
              {hasPlanSelected ? selectedPlan.major : (faculty || "لم يتم اختيار الخطة")}
            </span>
          </div>
          <svg
            className="w-3.5 h-3.5 text-brand-muted group-hover:text-brand-primary rtl:rotate-180 transition-colors hidden sm:block"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </header>
  );
}

