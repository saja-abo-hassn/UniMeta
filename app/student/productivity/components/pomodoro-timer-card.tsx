import React from "react";
import { PomodoroSettings } from "../types";

interface PomodoroTimerCardProps {
  sessionType: "focus" | "shortBreak" | "longBreak";
  settings: PomodoroSettings;
  setSettings: React.Dispatch<React.SetStateAction<PomodoroSettings>>;
  timerStr: string;
  timerRunning: boolean;
  onSwitchSessionType: (type: "focus" | "shortBreak" | "longBreak") => void;
  onToggleTimer: () => void;
  onResetTimer: () => void;
}

export function PomodoroTimerCard({
  sessionType,
  settings,
  setSettings,
  timerStr,
  timerRunning,
  onSwitchSessionType,
  onToggleTimer,
  onResetTimer,
}: PomodoroTimerCardProps) {
  return (
    <section className="lg:col-span-5 card-hover-effect p-6 sm:p-7 rounded-3xl bg-white border border-[#D7EAF7] shadow-xs flex flex-col items-center justify-between text-center space-y-5">
      <div className="w-full">
        <span className="text-[10px] font-bold text-[#0057C8] uppercase tracking-wider block mb-1">
          Academic Pomodoro Timer
        </span>
        <h2 className="text-lg font-black text-[#16324A] mb-3">
          {sessionType === "focus"
            ? "جلسة تركيز دراسي"
            : sessionType === "shortBreak"
            ? "استراحة قصيرة ☕"
            : "استراحة طويلة 🌴"}
        </h2>

        <div className="flex items-center justify-center gap-1.5 p-1 rounded-2xl bg-[#F4FAFF] border border-[#D7EAF7] text-xs font-bold w-fit mx-auto">
          <button
            type="button"
            onClick={() => onSwitchSessionType("focus")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              sessionType === "focus"
                ? "bg-[#0057C8] text-white shadow-xs"
                : "text-[#16324A] hover:text-[#0057C8]"
            }`}
          >
            تركيز ({settings.studyMinutes}د)
          </button>
          <button
            type="button"
            onClick={() => onSwitchSessionType("shortBreak")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              sessionType === "shortBreak"
                ? "bg-[#0057C8] text-white shadow-xs"
                : "text-[#16324A] hover:text-[#0057C8]"
            }`}
          >
            استراحة ({settings.shortBreakMinutes}د)
          </button>
          <button
            type="button"
            onClick={() => onSwitchSessionType("longBreak")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              sessionType === "longBreak"
                ? "bg-[#0057C8] text-white shadow-xs"
                : "text-[#16324A] hover:text-[#0057C8]"
            }`}
          >
            استراحة طويلة ({settings.longBreakMinutes}د)
          </button>
        </div>
      </div>

      <div className="relative w-48 h-48 sm:w-52 sm:h-52 rounded-full border-8 border-[#D7EAF7] bg-gradient-to-b from-[#F8FBFE] to-white flex flex-col items-center justify-center shadow-inner">
        <span className="text-4xl sm:text-5xl font-black font-mono text-[#0057C8] tracking-tight" dir="ltr">
          {timerStr}
        </span>
        <span className="text-xs font-semibold text-[#66788A] mt-1.5">
          {timerRunning ? "الجلسة جارية الآن" : "جاهز للبدء"}
        </span>

        {timerRunning && (
          <span className="absolute bottom-4 inline-flex items-center gap-1.5 text-[10px] text-[#0057C8] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#4DB7F2] animate-ping" />
            <span>مستمر</span>
          </span>
        )}
      </div>

      <div className="space-y-3 w-full max-w-sm">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTimer}
            className="flex-1 py-3 px-5 rounded-2xl bg-[#0057C8] hover:bg-[#2D78B7] text-white text-xs sm:text-sm font-bold transition-all shadow-xs"
          >
            {timerRunning ? "إيقاف مؤقت" : "بدء الجلسة"}
          </button>
          <button
            type="button"
            onClick={onResetTimer}
            className="py-3 px-4 rounded-2xl border border-[#D7EAF7] hover:bg-[#F0F7FD] text-[#16324A] text-xs font-bold transition-colors"
            title="إعادة ضبط الجلسة"
          >
            إعادة ضبط
          </button>
        </div>

        <label className="flex items-center justify-center gap-2 text-xs text-[#66788A] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={settings.autoStartBreak}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, autoStartBreak: e.target.checked }))
            }
            className="w-4 h-4 rounded text-[#0057C8] border-[#D7EAF7] focus:ring-[#4DB7F2]/30"
          />
          <span>بدء الاستراحة تلقائياً عند انتهاء الجلسة</span>
        </label>
      </div>
    </section>
  );
}

