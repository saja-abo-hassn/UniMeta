import React from "react";
import Link from "next/link";
import Image from "next/image";

interface SidebarBrandHeaderProps {
  onClose?: () => void;
}

export function SidebarBrandHeader({ onClose }: SidebarBrandHeaderProps) {
  return (
    <div className="p-5 border-b border-brand-border-soft flex items-center justify-between shrink-0">
      <Link
        href="/"
        className="flex items-center gap-3 group transition-transform duration-200 hover:scale-[1.02]"
        aria-label="الرئيسية يوني ميتا"
      >
        <div className="relative w-9 h-9 shrink-0 drop-shadow-xs">
          <Image
            src="/images/unimeta-logo.png"
            alt="UniMeta Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-base tracking-wider text-brand-primary">
            UniMeta
          </span>
          <span className="text-[10px] text-brand-hover-medium font-medium -mt-0.5">
            يوني ميتا
          </span>
        </div>
      </Link>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-brand-muted hover:text-brand-ink hover:bg-brand-surface-soft transition-colors"
          aria-label="إغلاق القائمة"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

