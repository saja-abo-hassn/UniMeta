"use client";

import React, { useState, useEffect } from "react";
import { useNotifications } from "@/src/contexts/notifications-context";

export function FocusTimerWidget() {
  const [studyMinutes, setStudyMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const { notify } = useNotifications();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("unimeta_pomodoro_settings");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.studyMinutes) {
          setStudyMinutes(parsed.studyMinutes);
          setSecondsLeft(parsed.studyMinutes * 60);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            setIsActive(false);
            notify({
              type: "pomodoro",
              title: `انتهت جلسة التركيز (${studyMinutes} دقيقة)! 🎯`,
              message: "عمل رائع! خذ استراحة لتجديد طاقتك.",
              link: "/student/productivity",
              playSound: true,
              browserNotify: true,
            });
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft, studyMinutes, notify]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(studyMinutes * 60);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  return (
    <div
      className="card-entrance card-hover-effect rounded-3xl p-6 shadow-md relative overflow-hidden bg-gradient-to-br from-brand-primary via-brand-hover-medium to-brand-ink text-white flex flex-col justify-between"
      style={{ animationDelay: "400ms" }}
    >
      {/* Decorative background glow */}
      <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-brand-secondary/20 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-brand-primary/40 blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/15">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-white/15 text-[#BFE8FF] border border-white/20">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary animate-pulse" />
          <span>إنتاجية الدراسة</span>
        </div>
        <span className="text-[11px] text-brand-light/80">تقنية بومودورو</span>
      </div>

      {/* Timer Display & Content (Figma node 1:1411) */}
      <div className="relative z-10 py-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
            جاهز لجلسة تركيز؟
          </h2>
          <p className="text-xs text-brand-light/90 mt-1 max-w-xs leading-relaxed">
            ابدأ {studyMinutes} دقيقة من التركيز العميق بدون مقاطعة لإنهاء مهامك الدراسية.
          </p>
        </div>

        {/* Circular Clock Dial */}
        <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-white/10 backdrop-blur-md border border-white/25 flex flex-col items-center justify-center shrink-0 shadow-inner">
          <span className="text-lg sm:text-xl font-black font-mono tracking-tight" dir="ltr">
            {formattedTime}
          </span>
          <span className="text-[9px] text-[#BFE8FF] font-medium -mt-0.5">
            دقيقة
          </span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="relative z-10 pt-3 border-t border-white/15 flex items-center gap-2">
        <button
          type="button"
          onClick={toggleTimer}
          className="flex-1 py-2 px-4 rounded-xl bg-white hover:bg-brand-surface-soft text-brand-primary text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
        >
          {isActive ? (
            <>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
              <span>إيقاف مؤقت</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>{secondsLeft < 25 * 60 ? "استئناف" : "ابدأ الجلسة"}</span>
            </>
          )}
        </button>

        {secondsLeft < 25 * 60 && (
          <button
            type="button"
            onClick={resetTimer}
            className="py-2 px-3 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold transition-colors"
          >
            إعادة ضبط
          </button>
        )}
      </div>
    </div>
  );
}
