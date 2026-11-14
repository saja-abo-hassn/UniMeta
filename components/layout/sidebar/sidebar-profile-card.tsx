import React from "react";
import Link from "next/link";

interface SidebarProfileCardProps {
  studentInitials: string;
  studentDisplayName: string;
  studentMajorName: string;
  onClose?: () => void;
}

export function SidebarProfileCard({
  studentInitials,
  studentDisplayName,
  studentMajorName,
  onClose,
}: SidebarProfileCardProps) {
  return (
    <div className="px-4 pt-4 pb-2">
      <Link
        href="/student/settings"
        onClick={onClose}
        className="block p-3 rounded-2xl bg-brand-surface-soft border border-brand-border-soft hover:border-brand-secondary transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            {studentInitials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-xs sm:text-sm text-brand-ink truncate">
              {studentDisplayName}
            </div>
            <div className="text-[10px] text-brand-muted truncate">
              {studentMajorName}
            </div>
          </div>
          <svg
            className="w-4 h-4 text-brand-muted group-hover:text-brand-primary rtl:rotate-180 transition-colors shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>
    </div>
  );
}

