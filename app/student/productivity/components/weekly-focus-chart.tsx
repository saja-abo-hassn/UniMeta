import React from "react";
import { PomodoroStats } from "../types";

interface WeeklyFocusChartProps {
  stats: PomodoroStats;
  maxWeeklyMinutes: number;
}

export function WeeklyFocusChart({ stats, maxWeeklyMinutes }: WeeklyFocusChartProps) {
  return (
    <div className="card-hover-effect p-6 rounded-3xl bg-white border border-brand-border-soft shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-brand-border-soft">
        <div>
          <h3 className="text-base font-black text-brand-ink">
            سجل التركيز الأسبوعي
          </h3>
          <span className="text-xs text-brand-muted">
            توزيع دقائق التركيز على مدار أيام الأسبوع
          </span>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-surface-blue text-brand-primary">
          مجموع الأسبوع: {stats.totalFocusMinutes} دقيقة
        </span>
      </div>

      <div className="grid grid-cols-7 gap-2.5 pt-4 items-end h-44 text-center">
        {stats.weeklyHistory.map((item, idx) => {
          const heightPercent = Math.min(
            100,
            Math.max(12, Math.round((item.minutes / maxWeeklyMinutes) * 100))
          );
          const isToday = (new Date().getDay() + 1) % 7 === idx;

          return (
            <div key={item.dayName} className="flex flex-col items-center justify-end h-full gap-2">
              <span className="text-[10px] text-brand-muted font-mono">{item.minutes}د</span>
              <div className="w-full max-w-[36px] bg-brand-surface-soft rounded-xl h-28 relative flex items-end overflow-hidden p-0.5">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-lg transition-all duration-500 ${
                    isToday
                      ? "bg-gradient-to-t from-brand-primary to-brand-secondary"
                      : "bg-brand-hover-medium/80 hover:bg-brand-primary"
                  }`}
                  title={`${item.dayName}: ${item.sessions} جلسات (${item.minutes} دقيقة)`}
                />
              </div>
              <span
                className={`text-[11px] font-bold ${
                  isToday ? "text-brand-primary" : "text-brand-muted"
                }`}
              >
                {item.dayShort}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

