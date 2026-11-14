"use client";
import { apiClient } from "@/src/services/api-client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdmin } from "@/src/contexts/admin-context";
import { NotificationBell } from "./notification-bell";

export interface AdminHeaderProps {
  onMenuToggle?: () => void;
}

function getInitials(name: string): string {
  if (!name) return "UM";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "UM";
}

export function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const pathname = usePathname();
  const { currentUser, switchRole } = useAdmin();
  const [searchQuery, setSearchQuery] = useState("");

  const getPageTitle = () => {
    if (pathname === "/admin") return "لوحة النظرة العامة";
    if (pathname === "/admin/content") return "إدارة المحتوى والمواد";
    if (pathname === "/admin/agreements") return "الاتفاقيات والعهد";
    if (pathname === "/admin/moderation" || pathname === "/admin/reports") return "الإشراف والبلاغات";
    if (pathname === "/admin/members") return "الأعضاء النشطون";
    if (pathname === "/admin/permissions" || pathname === "/admin/moderators") return "الصلاحيات والمشرفون";
    if (pathname === "/admin/notifications") return "مركز الإشعارات الإدارية";
    if (pathname === "/admin/settings") return "إعدادات المنصة";
    return "لوحة التحكم الإدارية";
  };

  const roleLabel = currentUser.role === "super_admin" ? "المسؤول العام" : "مشرف";
  const displayTitle = currentUser.title || roleLabel;

  return (
    <header className="h-[74px] sm:h-[82px] bg-white/95 backdrop-blur-md border-b border-brand-border-soft px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 transition-colors" dir="rtl">
      <div className="flex items-center gap-3.5 min-w-0">
        <button
          type="button"
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-brand-ink hover:bg-brand-surface-soft hover:text-brand-primary border border-brand-border-soft transition-colors focus-ring"
          aria-label="فتح القائمة الجانبية"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">
              إدارة UNIMETA
            </span>
            <span
              className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                currentUser.role === "super_admin"
                  ? "bg-brand-surface-blue text-brand-primary border-brand-border-soft"
                  : "bg-brand-surface-blue text-brand-primary border-brand-border-soft"
              }`}
            >
              {roleLabel}
            </span>
          </div>
          <h1 className="text-base sm:text-lg font-black text-brand-ink truncate leading-tight">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      <div className="hidden md:flex items-center flex-1 max-w-xs mx-4">
        <div className="relative w-full">
          <span className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-brand-muted">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في القسم الحالي..."
            className="w-full h-10 ps-9 pe-3 rounded-xl border border-brand-border-soft bg-brand-surface-muted text-xs font-semibold text-brand-ink placeholder:text-brand-muted focus:outline-none focus:border-brand-secondary focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
<<<<<<< HEAD
        {apiClient.isUsingMock() && <div className="hidden xl:flex items-center p-1 rounded-xl bg-[#F4FAFF] border border-[#D7EAF7] text-xs font-bold">
          <span className="text-[10px] text-[#66788A] px-2">الدور:</span>
=======
        <div className="hidden xl:flex items-center p-1 rounded-xl bg-[#F4FAFF] border border-brand-border-soft text-xs font-bold">
          <span className="text-[10px] text-brand-muted px-2">الدور:</span>
>>>>>>> b079de5bb3c77012965f2ad45ddce455d601b6a9
          <button
            type="button"
            onClick={() => switchRole("super_admin")}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              currentUser.role === "super_admin"
                ? "bg-brand-primary text-white shadow-xs"
                : "text-brand-ink hover:text-brand-primary"
            }`}
          >
            المسؤول العام
          </button>
          <button
            type="button"
            onClick={() => switchRole("moderator")}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              currentUser.role === "moderator"
                ? "bg-brand-primary text-white shadow-xs"
                : "text-brand-ink hover:text-brand-primary"
            }`}
          >
            مشرف
          </button>
        </div>}

        <Link
          href="/student"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-brand-border-soft bg-white hover:bg-brand-surface-soft text-xs font-bold text-brand-primary transition-colors shadow-2xs"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span>بوابة الطالب</span>
        </Link>

        <NotificationBell />

        <Link
          href="/admin/settings#profile"
          className="flex items-center gap-2.5 p-1 pe-2.5 rounded-full border border-brand-border-soft bg-white hover:bg-brand-surface-soft hover:border-brand-primary/40 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-primary/30 group"
          title="الملف الشخصي وإعدادات الحساب"
          aria-label="الملف الشخصي وإعدادات الحساب"
        >
          {currentUser.avatarUrl ? (
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover shadow-xs border border-brand-border-soft"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-105 transition-transform">
              {getInitials(currentUser.name)}
            </div>
          )}
          <div className="hidden sm:flex flex-col text-start">
            <span className="font-bold text-xs text-brand-ink leading-tight group-hover:text-brand-primary transition-colors truncate max-w-[130px]">
              {currentUser.name}
            </span>
            <span className="text-[9px] text-brand-muted leading-tight truncate max-w-[130px]">
              {displayTitle}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
