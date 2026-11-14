"use client";

import React from "react";
import { DeviceItem } from "../types";

interface DevicesGridProps {
  filteredDevices: DeviceItem[];
  onRequestDevice: (device: DeviceItem) => void;
}

export function DevicesGrid({ filteredDevices, onRequestDevice }: DevicesGridProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between text-xs text-brand-muted px-1 font-semibold">
        <span>نتائج الأجهزة ({filteredDevices.length})</span>
        <span>يتم توثيق كل طلب إعارة تلقائياً في قسم &quot;اتفاقياتي&quot;</span>
      </div>

      {filteredDevices.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-brand-border-soft shadow-xs space-y-3">
          <h3 className="font-bold text-base text-brand-ink">لا توجد أجهزة مطابقة للبحث</h3>
          <p className="text-xs text-brand-muted">جرب البحث بكلمات أخرى أو اختر فئة مختلفة.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
          {filteredDevices.map((dev) => (
            <div
              key={dev.id}
              className="card-hover-effect rounded-3xl bg-white border border-brand-border-soft hover:border-brand-primary shadow-xs p-5 sm:p-6 flex flex-col justify-between gap-4 transition-all h-full"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-brand-surface-blue text-brand-primary border border-brand-border-soft">
                    {dev.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      dev.status === "متاح فوراً"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-slate-100 text-brand-muted border-brand-border-soft"
                    }`}
                  >
                    {dev.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-brand-ink leading-snug line-clamp-2 min-h-[2.75rem]">
                    {dev.name}
                  </h3>
                  <span className="font-mono text-xs text-brand-muted block mt-0.5 line-clamp-1" dir="ltr">
                    {dev.model}
                  </span>
                </div>

                <p className="text-xs text-brand-muted leading-relaxed line-clamp-2">
                  {dev.description}
                </p>

                <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-brand-surface-muted border border-brand-border-soft/80 text-[11px]">
                  <div>
                    <span className="text-brand-muted block">نوع الإتاحة:</span>
                    <strong className="text-brand-primary">{dev.type}</strong>
                  </div>
                  <div>
                    <span className="text-brand-muted block">السعر:</span>
                    <strong className="text-brand-ink">{dev.feeText}</strong>
                  </div>
                  <div>
                    <span className="text-brand-muted block">الحالة الفنية:</span>
                    <strong className="text-brand-ink">{dev.condition}</strong>
                  </div>
                  <div>
                    <span className="text-brand-muted block">الوديعة/التأمين:</span>
                    <strong className="text-brand-hover-medium">{dev.deposit}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-brand-muted pt-1">
                  <div className="w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center text-[10px] font-bold">
                    {dev.owner.split(" ").map((w) => w[0]).join("")}
                  </div>
                  <div>
                    <span className="font-bold text-brand-ink">{dev.owner}</span>
                    <span className="text-[10px] text-brand-muted block">{dev.ownerMajor}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-brand-border-soft">
                <button
                  type="button"
                  disabled={dev.status !== "متاح فوراً"}
                  onClick={() => onRequestDevice(dev)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                    dev.status === "متاح فوراً"
                      ? "bg-brand-primary hover:bg-brand-hover-medium text-white shadow-xs"
                      : "bg-slate-100 text-brand-subtle cursor-not-allowed"
                  }`}
                >
                  {dev.status === "متاح فوراً" ? "طلب استئجار / استعارة" : "الجهاز غير متاح حالياً"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

