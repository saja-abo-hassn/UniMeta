import React from "react";

interface SidebarStatsRowProps {
  isLoaded: boolean;
  hasPlanSelected: boolean;
  completedCredits: number;
  totalCredits: number;
  completionPercentage: number;
  cumulativeGpa: number;
}

export function SidebarStatsRow({
  isLoaded,
  hasPlanSelected,
  completedCredits,
  totalCredits,
  completionPercentage,
  cumulativeGpa,
}: SidebarStatsRowProps) {
  return (
    <div className="px-4 pb-3">
      <div className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-[#F8FBFE] border border-[#D7EAF7]/80 text-center text-xs">
        <div>
          <div className="text-[10px] text-[#66788A]">الساعات</div>
          <div className="font-semibold text-[11px] text-[#16324A]" dir="ltr">
            {isLoaded && hasPlanSelected ? `${completedCredits}/${totalCredits}` : "—"}
          </div>
        </div>
        <div className="border-x border-[#D7EAF7]">
          <div className="text-[10px] text-[#66788A]">الإنجاز</div>
          <div className="font-semibold text-[11px] text-[#0057C8]">
            {isLoaded && hasPlanSelected ? `${completionPercentage}%` : "—"}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-[#66788A]">المعدل</div>
          <div className="font-semibold text-[11px] text-[#16324A]">
            {isLoaded && hasPlanSelected && cumulativeGpa > 0 ? cumulativeGpa.toFixed(2) : "—"}
          </div>
        </div>
      </div>
    </div>
  );
}

