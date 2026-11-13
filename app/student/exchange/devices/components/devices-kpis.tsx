"use client";

import React from "react";
import { DeviceItem } from "../types";

interface DevicesKPIsProps {
  devices: DeviceItem[];
}

export function DevicesKPIs({ devices }: DevicesKPIsProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="card-hover-effect p-5 rounded-2xl bg-white border border-brand-border-soft shadow-xs">
        <span className="text-xs font-semibold text-brand-muted block mb-1">الأجهزة المتاحة</span>
        <div className="text-2xl sm:text-3xl font-black text-brand-ink">{devices.length} أجهزة</div>
        <span className="text-[11px] text-brand-primary font-bold mt-1 block">جاهزة للتسليم الفوري</span>
      </div>

      <div className="card-hover-effect p-5 rounded-2xl bg-white border border-[#BEE3F8] shadow-xs">
        <span className="text-xs font-bold text-brand-primary block mb-1">متاح مجاناً</span>
        <div className="text-2xl sm:text-3xl font-black text-brand-primary">
          {devices.filter((d) => d.type === "إعارة مجانية").length} أجهزة
        </div>
        <span className="text-[11px] text-brand-hover-medium mt-1 block">إعارة طلابية غير ربحية</span>
      </div>

      <div className="card-hover-effect p-5 rounded-2xl bg-white border border-brand-border-soft shadow-xs">
        <span className="text-xs font-semibold text-brand-muted block mb-1">استئجار رمزي</span>
        <div className="text-2xl sm:text-3xl font-black text-brand-ink">
          {devices.filter((d) => d.type === "استئجار رمزي").length} أجهزة
        </div>
        <span className="text-[11px] text-brand-muted mt-1 block">أسعار تشجيعية (1-2 د.أ)</span>
      </div>

      <div className="card-hover-effect p-5 rounded-2xl bg-white border border-brand-border-soft shadow-xs">
        <span className="text-xs font-semibold text-brand-muted block mb-1">الضمان والأمان</span>
        <div className="text-xl sm:text-2xl font-black text-emerald-700">اتفاقية موثقة</div>
        <span className="text-[11px] text-emerald-600 mt-1 block">اعتماد متبادل بين الطرفين</span>
      </div>
    </section>
  );
}

