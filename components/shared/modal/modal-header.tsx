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
      className={`px-6 py-4 border-b border-brand-border-soft bg-white flex items-start justify-between gap-3 shrink-0 select-none ${className}`}
    >
      <div className="flex flex-col gap-1 text-start min-w-0 flex-1">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h3 className="text-base sm:text-lg font-black text-brand-ink leading-tight break-words">
            {title}
          </h3>
          {badge}
        </div>
        {description && (
          <p className="text-xs text-brand-muted leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full border border-brand-border-soft bg-white hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-brand-muted active:scale-95 transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-brand-primary/30 shrink-0 cursor-pointer mt-0.5"
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
