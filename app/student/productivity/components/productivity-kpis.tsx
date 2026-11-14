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
      <div className="card-hover-effect p-4 sm:p-5 rounded-2xl bg-white border border-[#D7EAF7] shadow-xs space-y-1">
        <div className="flex items-center justify-between text-xs text-[#66788A]">
          <span>جلسات اليوم</span>
          <span className="p-1 rounded-lg bg-[#EAF4FD] text-[#0057C8]">🍅</span>
        </div>
        <div className="text-2xl font-black text-[#16324A]">{stats.completedToday}</div>
        <span className="text-[10px] text-[#2D78B7] font-semibold block">جلسات مكتملة اليوم</span>
      </div>

      <div className="card-hover-effect p-4 sm:p-5 rounded-2xl bg-white border border-[#D7EAF7] shadow-xs space-y-1">
        <div className="flex items-center justify-between text-xs text-[#66788A]">
          <span>جلسات الأسبوع</span>
          <span className="p-1 rounded-lg bg-[#EAF4FD] text-[#0057C8]">📅</span>
        </div>
        <div className="text-2xl font-black text-[#0057C8]">{stats.completedThisWeek}</div>
        <span className="text-[10px] text-[#66788A] block">الأسبوع الحالي</span>
      </div>

      <div className="card-hover-effect p-4 sm:p-5 rounded-2xl bg-white border border-[#D7EAF7] shadow-xs space-y-1">
        <div className="flex items-center justify-between text-xs text-[#66788A]">
          <span>وقت التركيز</span>
          <span className="p-1 rounded-lg bg-[#EAF4FD] text-[#0057C8]">⏱️</span>
        </div>
        <div className="text-2xl font-black text-[#16324A]">
          {totalHours}<span className="text-sm font-bold text-[#66788A] ms-1">س</span> {remainingMinutes}<span className="text-sm font-bold text-[#66788A] ms-1">د</span>
        </div>
        <span className="text-[10px] text-[#66788A] block">الوقت المخطط للجلسات المكتملة هذا الأسبوع</span>
      </div>

      <div className="card-hover-effect p-4 sm:p-5 rounded-2xl bg-white border border-[#D7EAF7] shadow-xs space-y-1">
        <div className="flex items-center justify-between text-xs text-[#66788A]">
          <span>معدل التركيز</span>
          <span className="p-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs">%</span>
        </div>
        <div className="text-2xl font-black text-emerald-600">{focusRate}%</div>
        <span className="text-[10px] text-[#66788A] block">
          {stats.completedThisWeek} مكتملة من {stats.startedSessions} مبدوءة
        </span>
      </div>

      <div className="col-span-2 lg:col-span-1 card-hover-effect p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#0057C8] to-[#2D78B7] text-white shadow-xs space-y-1">
        <div className="flex items-center justify-between text-xs text-blue-100">
          <span>سلسلة الالتزام</span>
          <span className="text-lg">🔥</span>
        </div>
        <div className="text-2xl font-black text-white">{stats.streakDays} أيام</div>
        <span className="text-[10px] text-[#BFE8FF] font-semibold block">أيام متتالية خلال الأسبوع الحالي</span>
      </div>
    </section>
  );
}

