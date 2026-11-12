"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Destination } from "@/src/types/ui";
import { Logo } from "./logo";

export interface NavbarProps {
  title?: string;
  badge?: string;
  destinations?: Destination[];
  onToggleSidebar?: () => void;
  actions?: React.ReactNode;
}

export function Navbar({
  badge,
  destinations = [],
  onToggleSidebar,
  actions,
}: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-brand-secondary/20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-brand-dark hover:bg-brand-secondary/15 transition-colors focus-ring"
              aria-label="تبديل القائمة الجانبية"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}

          <Logo size="sm" showText={true} href="/" />

          {badge && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
              {badge}
            </span>
          )}
        </div>

        {/* Center Navigation Links (Public / Main destinations) */}
        {destinations.length > 0 && (
          <nav className="hidden md:flex items-center gap-1" aria-label="التنقل الرئيسي">
            {destinations.map((dest) => {
              const isActive = pathname === dest.path;
              return (
                <Link
                  key={dest.id}
                  href={dest.path}
                  aria-current={isActive ? "page" : undefined}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all focus-ring ${
                    isActive
                      ? "bg-brand-primary text-white shadow-xs"
                      : "text-brand-dark/80 hover:text-brand-primary hover:bg-brand-primary/5"
                  }`}
                >
                  {dest.title}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Actions (Login / User / Notifications etc.) */}
        <div className="flex items-center gap-2">{actions}</div>
      </div>
    </header>
  );
}

