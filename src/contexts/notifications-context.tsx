"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type NotificationType =
  | "rent"
  | "exchange"
  | "agreement"
  | "pomodoro"
  | "project"
  | "library"
  | "general";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: number;
  read: boolean;
  link?: string;
}

interface NotificationsContextValue {
  notifications: NotificationItem[];
  unreadCount: number;
  notify: (item: {
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
    playSound?: boolean;
    browserNotify?: boolean;
  }) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  requestBrowserPermission: () => Promise<boolean>;
}

const STORAGE_KEY = "unimeta_student_notifications_v1";

const BASE_SEED_TIME = 1775700000000;

const initialSeedNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    type: "rent",
    title: "طلب استئجار جديد",
    message: "أرسل الطالب طارق زياد طلباً لاستئجار لوحة Arduino Mega 2560 لمدة 10 أيام.",
    createdAt: BASE_SEED_TIME - 1000 * 60 * 15, // 15 mins ago
    read: false,
    link: "/student/agreements",
  },
  {
    id: "notif-2",
    type: "exchange",
    title: "تمت الموافقة على طلب التبادل",
    message: "وافق ميسرة خليل على تبادل مرجع تراكيب البيانات مقابل كتاب الخوارزميات.",
    createdAt: BASE_SEED_TIME - 1000 * 60 * 60 * 2, // 2 hours ago
    read: false,
    link: "/student/exchange/books",
  },
  {
    id: "notif-3",
    type: "project",
    title: "رد على طلب الانضمام للمشروع",
    message: "قبل فريق 'نظام إدارة النفايات الطبية عبر IoT' انضمامك كمهندسة برمجيات.",
    createdAt: BASE_SEED_TIME - 1000 * 60 * 60 * 5, // 5 hours ago
    read: true,
    link: "/student/projects",
  },
  {
    id: "notif-4",
    type: "agreement",
    title: "تذكير بموعد الإرجاع",
    message: "تبقى 3 أيام على موعد إرجاع كتاب 'Clean Architecture' للاتفاقية AGR-2026-081.",
    createdAt: BASE_SEED_TIME - 1000 * 60 * 60 * 24, // 1 day ago
    read: true,
    link: "/student/agreements",
  },
  {
    id: "notif-5",
    type: "library",
    title: "محتوى تعليمي جديد في المكتبة",
    message: "تم رفع مرجع جديد لمساق هندسة البرمجيات المتقدمة، يمكنك تحميله الآن.",
    createdAt: BASE_SEED_TIME - 1000 * 60 * 60 * 36,
    read: false,
    link: "/student/library",
  },
];

// Play gentle dual-tone chime using Web Audio API (zero external assets needed)
function playNotificationChime() {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Tone 1: E5 (659.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Tone 2: A5 (880 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, now + 0.12);
    gain2.gain.setValueAtTime(0.15, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.55);
  } catch {
    // Audio context may be restricted by browser autoplay policy
  }
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    if (typeof window === "undefined") return initialSeedNotifications;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return initialSeedNotifications;
  });

  // Sync to localStorage on update
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const notify = useCallback(
    ({
      type,
      title,
      message,
      link,
      playSound = true,
      browserNotify = true,
    }: {
      type: NotificationType;
      title: string;
      message: string;
      link?: string;
      playSound?: boolean;
      browserNotify?: boolean;
    }) => {
      let resolvedLink = link;
      if (!resolvedLink) {
        if (type === "rent" || type === "agreement") resolvedLink = "/student/agreements";
        else if (type === "exchange") resolvedLink = "/student/exchange/books";
        else if (type === "project") resolvedLink = "/student/projects";
        else if (type === "library") resolvedLink = "/student/library";
        else if (type === "pomodoro") resolvedLink = "/student/productivity";
        else resolvedLink = "/student";
      }

      const newItem: NotificationItem = {
        id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        type,
        title,
        message,
        createdAt: Date.now(),
        read: false,
        link: resolvedLink,
      };

      setNotifications((prev) => [newItem, ...prev]);

      if (playSound) {
        playNotificationChime();
      }

      if (browserNotify && typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission === "granted") {
          try {
            new Notification(`يوني ميتا: ${title}`, {
              body: message,
              icon: "/images/unimeta-logo.png",
              dir: "rtl",
            });
          } catch {
            // ignore
          }
        }
      }
    },
    []
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const requestBrowserPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return false;
    try {
      const perm = await Notification.requestPermission();
      return perm === "granted";
    } catch {
      return false;
    }
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        notify,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
        requestBrowserPermission,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }
  return ctx;
}
