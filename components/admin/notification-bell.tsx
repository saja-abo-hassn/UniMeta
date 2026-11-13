"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAdmin } from "@/src/contexts/admin-context";

export function NotificationBell() {
  const {
    currentUser,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    unreadNotificationsCount,
  } = useAdmin();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Filter notifications visible to current role
  const visibleNotifications = notifications.filter((n) => {
    if (n.targetRole === "all") return true;
    return n.targetRole === currentUser.role;
  });

  return (
    <div className="relative" ref={dropdownRef} dir="rtl">
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl border border-brand-border-soft bg-white hover:bg-[#F4FAFF] text-brand-ink hover:text-brand-primary transition-colors focus-ring"
        aria-label="إشعارات الإدارة"
        aria-expanded={isOpen}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {unreadNotificationsCount > 0 && (
          <span className="absolute -top-1 -end-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white animate-pulse">
            {unreadNotificationsCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute start-0 sm:start-auto sm:end-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white border border-brand-border-soft shadow-xl z-50 overflow-hidden animate-scale-up">
          {/* Header */}
          <div className="p-4 border-b border-brand-border-soft bg-brand-surface-muted flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-primary" />
              <h3 className="font-extrabold text-xs sm:text-sm text-brand-ink">
                إشعارات لوحة التحكم
              </h3>
            </div>
            {unreadNotificationsCount > 0 && (
              <button
                type="button"
                onClick={markAllNotificationsAsRead}
                className="text-[11px] font-bold text-brand-primary hover:underline"
              >
                تعليم الكل كمقروء
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-brand-border-soft/50">
            {visibleNotifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-brand-muted">
                لا توجد إشعارات جديدة حالياً.
              </div>
            ) : (
              visibleNotifications.slice(0, 5).map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationAsRead(notif.id)}
                  className={`p-3.5 hover:bg-[#F4FAFF] transition-colors cursor-pointer space-y-1 ${
                    !notif.read ? "bg-brand-surface-soft/70" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-xs text-brand-ink leading-tight">
                      {notif.title}
                    </span>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-brand-primary shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-[11px] text-brand-muted leading-relaxed line-clamp-2">
                    {notif.message}
                  </p>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-brand-muted">
                    <span>{notif.createdAt}</span>
                    {notif.link && (
                      <Link
                        href={notif.link}
                        onClick={() => setIsOpen(false)}
                        className="text-brand-primary font-bold hover:underline"
                      >
                        عرض التفاصيل ←
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Link */}
          <div className="p-3 border-t border-brand-border-soft bg-brand-surface-muted text-center">
            <Link
              href="/admin/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-brand-primary hover:underline"
            >
              عرض كافة الإشعارات الإدارية ({visibleNotifications.length})
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

