"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAdmin, AdminPermission } from "@/src/contexts/admin-context";
import { authService } from "@/src/services/auth-service";
import { Modal } from "@/components/shared/modal";

export interface AdminNavItem {
  id: string;
  title: string;
  path: string;
  icon: string;
  badge?: string;
  badgeColor?: string;
  requiredPermission?: AdminPermission;
  superAdminOnly?: boolean;
}

export const adminNavItems: AdminNavItem[] = [
  {
    id: "overview",
    title: "لوحة النظرة العامة",
    path: "/admin",
    icon: "home",
  },
  {
    id: "content",
    title: "إدارة المحتوى والمواد",
    path: "/admin/content",
    icon: "content",
  },
  {
    id: "agreements",
    title: "الاتفاقيات والعهد",
    path: "/admin/agreements",
    icon: "agreements",
  },
  {
    id: "moderation",
    title: "الإشراف والبلاغات",
    path: "/admin/moderation",
    icon: "reports",
  },
  {
    id: "members",
    title: "الأعضاء النشطون",
    path: "/admin/members",
    icon: "users",
  },
  {
    id: "permissions",
    title: "الصلاحيات والمشرفون",
    path: "/admin/permissions",
    icon: "shield",
  },
  {
    id: "settings",
    title: "إعدادات المنصة",
    path: "/admin/settings",
    icon: "settings",
  },
];

export interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

function getInitials(name: string): string {
  if (!name) return "UM";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "UM";
}

export function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { currentUser, agreements, reports } = useAdmin();

  const pendingAgreements = agreements.filter((a) => a.status === "قيد الانتظار").length;
  const pendingReports = reports.filter((r) => r.status === "مفتوح").length;

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "home":
        return (
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case "content":
        return (
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case "agreements":
        return (
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case "calendar":
        return (
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case "finance":
        return (
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "reports":
        return (
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case "users":
        return (
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case "shield":
        return (
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case "settings":
        return (
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        );
    }
  };

  // All 7 admin navigation sections are permanently visible and accessible
  const visibleNavItems = adminNavItems;

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    try {
      await authService.logout();
    } catch {
      // ignore
    }
    if (typeof window !== "undefined") {
      sessionStorage.setItem("unimeta_logged_out", "true");
      window.location.replace("/login");
    }
  };

  const content = (
    <div className="flex flex-col h-full bg-white text-[#16324A] border-e border-[#D7EAF7]">
      {/* 1. Header & Brand Logo */}
      <div className="p-5 border-b border-[#D7EAF7] flex items-center justify-between shrink-0">
        <Link
          href="/admin"
          className="flex items-center gap-3 group transition-transform duration-200 hover:scale-[1.02]"
          aria-label="لوحة تحكم يوني ميتا"
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
            <span className="font-bold text-base tracking-wider text-[#0057C8]">
              UniMeta Admin
            </span>
            <span className="text-[10px] text-[#2D78B7] font-medium -mt-0.5">
              لوحة الإدارة والمتابعة
            </span>
          </div>
        </Link>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-[#66788A] hover:text-[#16324A] hover:bg-[#F0F7FD] transition-colors"
            aria-label="إغلاق القائمة"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* 2. Admin Badge Mini-Banner */}
      <div className="px-4 pt-4 pb-2">
        <Link
          href="/admin/settings#profile"
          onClick={onClose}
          className="p-3 rounded-2xl bg-[#F0F7FD] hover:bg-[#E4F1FD] border border-[#D7EAF7] hover:border-[#0057C8]/40 flex items-center gap-3 transition-all cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#0057C8]/30"
          title="الملف الشخصي وإعدادات الحساب"
          aria-label="الملف الشخصي وإعدادات الحساب"
        >
          {currentUser.avatarUrl ? (
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-9 h-9 rounded-xl object-cover shrink-0 shadow-xs border border-[#D7EAF7]"
            />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-[#0057C8] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              {getInitials(currentUser.name)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="font-bold text-xs text-[#16324A] group-hover:text-[#0057C8] transition-colors truncate">
              {currentUser.name}
            </div>
            <div className="text-[10px] text-[#0057C8] font-semibold truncate">
              {currentUser.title || (currentUser.role === "super_admin" ? "المسؤول العام" : "مشرف")}
            </div>
          </div>
        </Link>
      </div>

      {/* Section Eyebrow */}
      <div className="px-5 pt-2 pb-1">
        <span className="text-[10px] font-bold text-[#66788A] uppercase tracking-wider block">
          أقسام الإدارة
        </span>
      </div>

      {/* 3. Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-1 space-y-1" aria-label="تنقل الإدارة">
        {visibleNavItems.map((item) => {
          const isActive = pathname === item.path;
          let badge = item.badge;
          if (item.id === "agreements") {
            badge = pendingAgreements > 0 ? `${pendingAgreements} جديد` : undefined;
          } else if (item.id === "moderation") {
            badge = pendingReports > 0 ? `${pendingReports}` : undefined;
          }

          return (
            <Link
              key={item.id}
              href={item.path}
              onClick={onClose}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#EAF4FD] text-[#0057C8] font-bold border-s-4 border-[#0057C8] shadow-xs"
                  : "text-[#16324A] hover:bg-[#F0F7FD] hover:text-[#0057C8]"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={isActive ? "text-[#0057C8]" : "text-[#66788A]"}>
                  {renderIcon(item.icon)}
                </span>
                <span className="truncate">{item.title}</span>
              </div>
              {badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.badgeColor || (isActive ? "bg-[#0057C8] text-white" : "bg-[#F0F7FD] text-[#0057C8] border border-[#D7EAF7]")
                  }`}
                >
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* 4. Bottom Footer Link to Student Portal & Logout */}
      <div className="p-4 border-t border-[#D7EAF7] bg-[#F8FBFE] flex flex-col gap-2">
        <Link
          href="/student"
          className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-[#D7EAF7] hover:border-[#4DB7F2] bg-white text-xs font-semibold text-[#0057C8] hover:bg-[#F0F7FD] transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span>الانتقال لبوابة الطالب</span>
        </Link>
        <button
          type="button"
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-[#D7EAF7] hover:border-red-300 bg-white text-xs font-semibold text-[#66788A] hover:text-red-600 hover:bg-red-50/60 transition-colors w-full cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>تسجيل الخروج</span>
        </button>
        <div className="text-[10px] text-[#66788A] text-center">
          UniMeta Admin Console v2.0 &copy; 2026
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar (w-[280px]) */}
      <aside className="hidden lg:block w-[280px] shrink-0 sticky top-0 h-screen z-20">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-[#0B192C]/50 backdrop-blur-xs transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />
          <div className="relative w-[280px] max-w-[85vw] h-full shadow-2xl z-10 animate-fade-in-scale">
            {content}
          </div>
        </div>
      )}
      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        size="sm"
      >
        <Modal.Header
          title="تسجيل الخروج من لوحة الإدارة"
          onClose={() => setShowLogoutConfirm(false)}
        />
        <Modal.Body className="text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-100">
            <svg className="w-6 h-6 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <p className="text-xs text-[#66788A] leading-relaxed">
            هل تريد تسجيل الخروج؟ سيتعين عليك إدخال بياناتك مجدداً لتسجيل الدخول.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(false)}
            className="flex-1 py-2 rounded-xl border border-[#D7EAF7] text-xs font-semibold text-[#16324A] hover:bg-[#F8FBFE] transition-colors cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            تأكيد الخروج
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

