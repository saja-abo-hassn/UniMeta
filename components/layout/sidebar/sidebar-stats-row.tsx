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
      <div className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-brand-surface-muted border border-brand-border-soft/80 text-center text-xs">
        <div>
          <div className="text-[10px] text-brand-muted">الساعات</div>
          <div className="font-semibold text-[11px] text-brand-ink" dir="ltr">
            {isLoaded && hasPlanSelected ? `${completedCredits}/${totalCredits}` : "—"}
          </div>
        </div>
        <div className="border-x border-brand-border-soft">
          <div className="text-[10px] text-brand-muted">الإنجاز</div>
          <div className="font-semibold text-[11px] text-brand-primary">
            {isLoaded && hasPlanSelected ? `${completionPercentage}%` : "—"}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-brand-muted">المعدل</div>
          <div className="font-semibold text-[11px] text-brand-ink">
            {isLoaded && hasPlanSelected && cumulativeGpa > 0 ? cumulativeGpa.toFixed(2) : "—"}
          </div>
        </div>
      </div>
    </div>
  );
}

