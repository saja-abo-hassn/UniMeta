"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNotifications, NotificationType } from "@/src/contexts/notifications-context";

function formatRelativeTime(timestamp: number, nowMs: number) {
  if (!nowMs || !timestamp) return "الآن";
  const diff = Math.max(0, nowMs - timestamp);
  const mins = Math.floor(diff / (1000 * 60));
  if (mins < 1) return "الآن";
  if (mins < 60) return `منذ ${mins} دقيقة`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;
  const days = Math.floor(hours / 24);
  return `منذ ${days} يوم`;
}

export function NotificationsDropdown() {
  const router = useRouter();
  const [nowMs, setNowMs] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setNowMs(Date.now());
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
    requestBrowserPermission,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [filterType, setFilterType] = useState<"all" | NotificationType>("all");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
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

  const filteredNotifications = notifications.filter((n) => {
    if (filterType === "all") return true;
    return n.type === filterType;
  });

  const handleNotificationClick = (id: string, link?: string, type?: NotificationType) => {
    markAsRead(id);
    setIsOpen(false);
    let target = link;
    if (!target && type) {
      if (type === "rent" || type === "agreement") target = "/student/agreements";
      else if (type === "exchange") target = "/student/exchange/books";
      else if (type === "project") target = "/student/projects";
      else if (type === "library") target = "/student/library";
      else if (type === "pomodoro") target = "/student/productivity";
      else target = "/student";
    }
    if (target) {
      router.push(target);
    }
  };

  const getTypeBadge = (type: NotificationType) => {
    switch (type) {
      case "rent":
        return { label: "استئجار", color: "bg-brand-surface-blue text-brand-primary border-brand-border-soft" };
      case "exchange":
        return { label: "تبادل", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
      case "agreement":
        return { label: "اتفاقية", color: "bg-brand-surface-blue text-brand-primary border-brand-border-soft" };
      case "pomodoro":
        return { label: "بومودورو", color: "bg-brand-surface-blue text-brand-primary border-brand-border-soft" };
      case "project":
        return { label: "مشروع تخرج", color: "bg-brand-surface-blue text-brand-primary border-brand-border-soft" };
      case "library":
        return { label: "المكتبة", color: "bg-cyan-50 text-cyan-700 border-cyan-200" };
      default:
        return { label: "عام", color: "bg-brand-surface-muted text-brand-ink border-brand-border-soft" };
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-2xl border border-brand-border-soft bg-white hover:bg-brand-surface-soft hover:border-brand-secondary text-brand-ink hover:text-brand-primary transition-all focus-ring shadow-2xs"
        aria-label="الإشعارات والتنبيهات"
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

        {/* Unread Counter Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -end-1 flex items-center justify-center min-w-4.5 h-4.5 px-1 rounded-full bg-brand-primary text-white text-[10px] font-bold shadow-xs animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className="absolute start-0 sm:start-auto sm:end-0 mt-2.5 w-[330px] sm:w-[390px] max-w-[92vw] bg-white rounded-3xl border border-brand-border-soft shadow-xl z-50 overflow-hidden animate-fade-in"
          dir="rtl"
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#F4FAFF] to-white border-b border-brand-border-soft flex items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-brand-ink">مركز الإشعارات</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-brand-primary text-white text-[10px] font-bold">
                    {unreadCount} جديد
                  </span>
                )}
              </div>
              <p className="text-[11px] text-brand-muted mt-0.5">
                تنبيهات الاستئجار، التبادل، الاتفاقيات، وبومودورو
              </p>
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="px-2.5 py-1 rounded-xl bg-white hover:bg-brand-surface-blue border border-brand-border-soft text-brand-primary text-[11px] font-bold transition-colors"
                >
                  قراءة الكل
                </button>
              )}
            </div>
          </div>

          {/* Quick Filters */}
          <div className="px-3 py-2 bg-brand-surface-muted border-b border-brand-border-soft/60 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <button
              type="button"
              onClick={() => setFilterType("all")}
              className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                filterType === "all"
                  ? "bg-brand-primary text-white shadow-xs"
                  : "text-brand-muted hover:bg-white hover:text-brand-ink"
              }`}
            >
              الكل ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType("rent")}
              className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                filterType === "rent"
                  ? "bg-brand-primary text-white shadow-xs"
                  : "text-brand-muted hover:bg-white hover:text-brand-ink"
              }`}
            >
              استئجار
            </button>
            <button
              type="button"
              onClick={() => setFilterType("exchange")}
              className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                filterType === "exchange"
                  ? "bg-brand-primary text-white shadow-xs"
                  : "text-brand-muted hover:bg-white hover:text-brand-ink"
              }`}
            >
              تبادل
            </button>
            <button
              type="button"
              onClick={() => setFilterType("agreement")}
              className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                filterType === "agreement"
                  ? "bg-brand-primary text-white shadow-xs"
                  : "text-brand-muted hover:bg-white hover:text-brand-ink"
              }`}
            >
              اتفاقياتي
            </button>
            <button
              type="button"
              onClick={() => setFilterType("pomodoro")}
              className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                filterType === "pomodoro"
                  ? "bg-brand-primary text-white shadow-xs"
                  : "text-brand-muted hover:bg-white hover:text-brand-ink"
              }`}
            >
              بومودورو
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-brand-border-soft/50">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-brand-surface-blue text-brand-primary flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <p className="text-xs font-bold text-brand-ink">لا توجد إشعارات حالياً</p>
                <p className="text-[11px] text-brand-muted">
                  ستصلك تنبيهات فورية عند ورود طلبات استئجار، تبادل، أو انتهاء جلسات التركيز.
                </p>
              </div>
            ) : (
              filteredNotifications.map((n) => {
                const badge = getTypeBadge(n.type);
                return (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n.id, n.link, n.type)}
                    className={`p-3.5 transition-colors cursor-pointer flex gap-3 text-start ${
                      !n.read
                        ? "bg-brand-surface-soft/70 hover:bg-brand-surface-blue"
                        : "bg-white hover:bg-brand-surface-muted"
                    }`}
                  >
                    {/* Unread dot indicator */}
                    <div className="pt-1.5 shrink-0">
                      <span
                        className={`block w-2 h-2 rounded-full ${
                          !n.read ? "bg-brand-primary" : "bg-transparent"
                        }`}
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-xs text-brand-ink truncate">
                          {n.title}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border shrink-0 ${badge.color}`}
                        >
                          {badge.label}
                        </span>
                      </div>

                      <p className="text-[11px] text-brand-muted leading-relaxed line-clamp-2">
                        {n.message}
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-brand-hover-medium">
                          {formatRelativeTime(n.createdAt, nowMs)}
                        </span>
                        {n.link && (
                          <span className="text-[10px] text-brand-primary font-bold hover:underline">
                            عرض التفاصيل &larr;
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-brand-surface-muted border-t border-brand-border-soft flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={requestBrowserPermission}
              className="text-brand-primary hover:underline font-semibold"
            >
              🔔 تفعيل تنبيهات المتصفح
            </button>
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                مسح الكل
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
