import React from "react";
import { PomodoroStats } from "../types";

interface ProductivityKPIsProps {
  stats: PomodoroStats;
  totalHours: number;
  remainingMinutes: number;
  focusRate: number;
}

export function ProductivityKPIs({
  stats,
  totalHours,
  remainingMinutes,
  focusRate,
}: ProductivityKPIsProps) {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
      <div className="card-hover-effect p-4 sm:p-5 rounded-2xl bg-white border border-brand-border-soft shadow-xs space-y-1">
        <div className="flex items-center justify-between text-xs text-brand-muted">
          <span>جلسات اليوم</span>
          <span className="p-1 rounded-lg bg-brand-surface-blue text-brand-primary">🍅</span>
        </div>
        <div className="text-2xl font-black text-brand-ink">{stats.completedToday}</div>
        <span className="text-[10px] text-brand-hover-medium font-semibold block">جلسات مكتملة اليوم</span>
      </div>

      <div className="card-hover-effect p-4 sm:p-5 rounded-2xl bg-white border border-brand-border-soft shadow-xs space-y-1">
        <div className="flex items-center justify-between text-xs text-brand-muted">
          <span>جلسات الأسبوع</span>
          <span className="p-1 rounded-lg bg-brand-surface-blue text-brand-primary">📅</span>
        </div>
        <div className="text-2xl font-black text-brand-primary">{stats.completedThisWeek}</div>
        <span className="text-[10px] text-brand-muted block">خلال آخر 7 أيام</span>
      </div>

      <div className="card-hover-effect p-4 sm:p-5 rounded-2xl bg-white border border-brand-border-soft shadow-xs space-y-1">
        <div className="flex items-center justify-between text-xs text-brand-muted">
          <span>وقت التركيز</span>
          <span className="p-1 rounded-lg bg-brand-surface-blue text-brand-primary">⏱️</span>
        </div>
        <div className="text-2xl font-black text-brand-ink">
          {totalHours}<span className="text-sm font-bold text-brand-muted ms-1">س</span> {remainingMinutes}<span className="text-sm font-bold text-brand-muted ms-1">د</span>
        </div>
        <span className="text-[10px] text-brand-muted block">إجمالي زمن التركيز</span>
      </div>

      <div className="card-hover-effect p-4 sm:p-5 rounded-2xl bg-white border border-brand-border-soft shadow-xs space-y-1">
        <div className="flex items-center justify-between text-xs text-brand-muted">
          <span>معدل التركيز</span>
          <span className="p-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs">%</span>
        </div>
        <div className="text-2xl font-black text-emerald-600">{focusRate}%</div>
        <span className="text-[10px] text-brand-muted block">
          {stats.completedThisWeek} مكتملة من {stats.startedSessions} مبدوءة
        </span>
      </div>

      <div className="col-span-2 lg:col-span-1 card-hover-effect p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-hover-medium text-white shadow-xs space-y-1">
        <div className="flex items-center justify-between text-xs text-brand-light">
          <span>سلسلة الالتزام</span>
          <span className="text-lg">🔥</span>
        </div>
        <div className="text-2xl font-black text-white">{stats.streakDays} أيام</div>
        <span className="text-[10px] text-[#BFE8FF] font-semibold block">أيام متتالية من التركيز</span>
      </div>
    </section>
  );
}

