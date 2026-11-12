"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Destination } from "@/src/types/ui";
import { Logo } from "./logo";

export interface SidebarProps {
  destinations: Destination[];
  isOpen?: boolean;
  onClose?: () => void;
  areaTitle?: string;
  userBadge?: string;
  headerContent?: React.ReactNode;
  footerContent?: React.ReactNode;
}

export function Sidebar({
  destinations,
  isOpen = false,
  onClose,
  areaTitle,
  userBadge,
  headerContent,
  footerContent,
}: SidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex flex-col h-full sidebar-dark">
      {/* Sidebar Header */}
      <div className="h-16 px-5 border-b border-brand-secondary/20 flex items-center justify-between shrink-0">
        {headerContent ? (
          headerContent
        ) : (
          <div className="flex items-center gap-2.5">
            <Logo size="sm" variant="dark" href="/" />
            {areaTitle && (
              <span className="text-[10px] text-brand-secondary font-medium border-s border-white/20 ps-2.5">
                {areaTitle}
              </span>
            )}
          </div>
        )}

        {/* Mobile Close Button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-brand-secondary hover:text-white hover:bg-white/10 transition-colors focus-ring"
            aria-label="إغلاق القائمة الجانبية"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* User / Area Badge banner */}
      {userBadge && (
        <div className="px-5 py-3 border-b border-brand-secondary/15 bg-white/5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-brand-secondary font-medium">الحالة</span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-brand-primary/40 text-brand-light border border-brand-primary/60">
              {userBadge}
            </span>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav
        className="flex-1 overflow-y-auto px-3 py-4 space-y-1 text-start"
        aria-label="القائمة الجانبية"
      >
        {destinations.map((dest) => {
          const isActive = pathname === dest.path;
          return (
            <Link
              key={dest.id}
              href={dest.path}
              onClick={onClose}
              aria-current={isActive ? "page" : undefined}
              className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all focus-ring ${
                isActive
                  ? "bg-brand-primary text-white shadow-sm font-semibold border-e-4 border-brand-secondary"
                  : "text-brand-light/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <span
                  className={`w-2 h-2 rounded-full transition-transform shrink-0 ${
                    isActive
                      ? "bg-brand-light scale-125"
                      : "bg-brand-secondary/40 group-hover:bg-brand-secondary"
                  }`}
                  aria-hidden="true"
                />
                <span className="truncate">{dest.title}</span>
              </div>
              {dest.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-brand-light/90">
                  {dest.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {footerContent ? (
        <div className="p-4 border-t border-brand-secondary/20 shrink-0">
          {footerContent}
        </div>
      ) : (
        <div className="p-4 border-t border-brand-secondary/20 text-[11px] text-brand-secondary/70 text-center shrink-0">
          UniMeta Platform &copy; 2026
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop and Sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-brand-dark/70 backdrop-blur-xs transition-opacity duration-200"
          onClick={onClose}
          aria-hidden="true"
        >
          <div
            className="fixed inset-y-0 start-0 z-50 w-72 max-w-[85vw] shadow-2xl transition-transform duration-300 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

