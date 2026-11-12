"use client";

import React from "react";
import { ModalHeaderProps } from "./types";

export function ModalHeader({
  title,
  description,
  onClose,
  className = "",
  badge,
}: ModalHeaderProps) {
  return (
    <div
      className={`px-6 py-4 border-b border-[#D7EAF7] bg-white flex items-start justify-between gap-3 shrink-0 select-none ${className}`}
    >
      <div className="flex flex-col gap-1 text-start min-w-0 flex-1">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h3 className="text-base sm:text-lg font-black text-[#16324A] leading-tight break-words">
            {title}
          </h3>
          {badge}
        </div>
        {description && (
          <p className="text-xs text-[#66788A] leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full border border-[#D7EAF7] bg-white hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-[#66788A] active:scale-95 transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#0057C8]/30 shrink-0 cursor-pointer mt-0.5"
          aria-label="إغلاق النافذة"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
