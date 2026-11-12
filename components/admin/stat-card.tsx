"use client";

import React from "react";

export interface StatCardProps {
  title: string;
  value: string | number;
  subtext: string;
  badge?: string;
  badgeColor?: string;
  icon?: React.ReactNode;
  variant?: "default" | "primary" | "warning" | "danger" | "success";
}

export function StatCard({
  title,
  value,
  subtext,
  badge,
  badgeColor,
  icon,
  variant = "default",
}: StatCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          card: "bg-[#EAF4FD]/60 border-[#0057C8]/25",
          val: "text-[#0057C8]",
          badge: "bg-[#0057C8] text-white border-transparent",
          dot: "bg-[#0057C8]",
        };
      case "warning":
        return {
          card: "bg-amber-50/70 border-amber-200/80",
          val: "text-amber-800",
          badge: "bg-amber-100 text-amber-800 border-amber-300",
          dot: "bg-amber-500",
        };
      case "danger":
        return {
          card: "bg-red-50/70 border-red-200/80",
          val: "text-red-700",
          badge: "bg-red-100 text-red-800 border-red-200",
          dot: "bg-red-500",
        };
      case "success":
        return {
          card: "bg-emerald-50/70 border-emerald-200/80",
          val: "text-emerald-800",
          badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
          dot: "bg-emerald-500",
        };
      default:
        return {
          card: "bg-white border-[#D7EAF7]",
          val: "text-[#16324A]",
          badge: "bg-[#F0F7FD] text-[#0057C8] border-[#D7EAF7]",
          dot: "bg-[#4DB7F2]",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <article
      className={`card-hover-effect relative p-5 rounded-2xl border shadow-xs flex flex-col justify-between min-h-[135px] transition-all overflow-hidden ${styles.card}`}
      dir="rtl"
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-xs font-semibold text-[#66788A] truncate" title={title}>
          {title}
        </span>
        {badge ? (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
              badgeColor || styles.badge
            }`}
          >
            {badge}
          </span>
        ) : icon ? (
          <div className="w-6 h-6 rounded-lg bg-white/80 border border-[#D7EAF7] flex items-center justify-center text-[#0057C8] shrink-0 text-xs">
            {icon}
          </div>
        ) : null}
      </div>

      {/* Primary Value */}
      <div className="flex items-baseline gap-2 my-auto">
        <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${styles.val}`}>
          {value}
        </span>
      </div>

      {/* Subtext Footer Row */}
      <div className="mt-2 pt-2 border-t border-[#D7EAF7]/60 flex items-center gap-1.5 text-[11px] text-[#66788A]">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${styles.dot}`} />
        <span className="truncate" title={subtext}>{subtext}</span>
      </div>
    </article>
  );
}
