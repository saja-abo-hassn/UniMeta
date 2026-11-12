"use client";

import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useStudentUser } from "@/src/hooks/use-student-user";
import { useStudyPlan } from "@/src/contexts/study-plan-context";
import { SidebarBrandHeader } from "./sidebar/sidebar-brand-header";
import { SidebarProfileCard } from "./sidebar/sidebar-profile-card";
import { SidebarStatsRow } from "./sidebar/sidebar-stats-row";
import { SidebarNavList } from "./sidebar/sidebar-nav-list";
import { SidebarFooter } from "./sidebar/sidebar-footer";

export interface StudentSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function StudentSidebar({ isOpen = false, onClose }: StudentSidebarProps) {
  const pathname = usePathname();
  const { user, fullName } = useStudentUser();
  const {
    hasPlanSelected,
    selectedPlan,
    totalCredits,
    completedCredits,
    completionPercentage,
    cumulativeGpa,
    isLoaded,
  } = useStudyPlan();

  const studentInitials = useMemo(() => {
    if (!fullName) return "ط";
    const words = fullName.trim().split(/\s+/);
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`;
    }
    return words[0].slice(0, 2);
  }, [fullName]);

  const studentDisplayName = fullName || "طالب جامعي";
  const studentMajorName = hasPlanSelected
    ? selectedPlan.major
    : (user?.faculty || "لم تُحدد الخطة بعد");

  const content = (
    <div className="flex flex-col h-full bg-white text-[#16324A] border-e border-[#D7EAF7]">
      <SidebarBrandHeader onClose={onClose} />

      <SidebarProfileCard
        studentInitials={studentInitials}
        studentDisplayName={studentDisplayName}
        studentMajorName={studentMajorName}
        onClose={onClose}
      />

      <SidebarStatsRow
        isLoaded={isLoaded}
        hasPlanSelected={hasPlanSelected}
        completedCredits={completedCredits}
        totalCredits={totalCredits}
        completionPercentage={completionPercentage}
        cumulativeGpa={cumulativeGpa}
      />

      <SidebarNavList pathname={pathname} onClose={onClose} />

      <SidebarFooter onClose={onClose} />
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-[296px] shrink-0 sticky top-0 h-screen z-20">
        {content}
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-[#0B192C]/50 backdrop-blur-xs transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />
          <div className="relative w-[280px] max-w-[85vw] h-full shadow-2xl z-10 animate-fade-in-scale">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
