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
      <div className="flex items-center justify-between text-xs text-[#66788A] px-1 font-semibold">
        <span>نتائج الأجهزة ({filteredDevices.length})</span>
        <span>يتم توثيق كل طلب إعارة تلقائياً في قسم &quot;اتفاقياتي&quot;</span>
      </div>

      {filteredDevices.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#D7EAF7] shadow-xs space-y-3">
          <h3 className="font-bold text-base text-[#16324A]">لا توجد أجهزة مطابقة للبحث</h3>
          <p className="text-xs text-[#66788A]">جرب البحث بكلمات أخرى أو اختر فئة مختلفة.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
          {filteredDevices.map((dev) => (
            <div
              key={dev.id}
              className="card-hover-effect rounded-3xl bg-white border border-[#D7EAF7] hover:border-[#0057C8] shadow-xs p-5 sm:p-6 flex flex-col justify-between gap-4 transition-all h-full"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#EAF4FD] text-[#0057C8] border border-[#D7EAF7]">
                    {dev.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      dev.status === "متاح فوراً"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {dev.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-[#16324A] leading-snug line-clamp-2 min-h-[2.75rem]">
                    {dev.name}
                  </h3>
                  <span className="font-mono text-xs text-[#66788A] block mt-0.5 line-clamp-1" dir="ltr">
                    {dev.model}
                  </span>
                </div>

                <p className="text-xs text-[#66788A] leading-relaxed line-clamp-2">
                  {dev.description}
                </p>

                <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-[#F8FBFE] border border-[#D7EAF7]/80 text-[11px]">
                  <div>
                    <span className="text-[#66788A] block">نوع الإتاحة:</span>
                    <strong className="text-[#0057C8]">{dev.type}</strong>
                  </div>
                  <div>
                    <span className="text-[#66788A] block">السعر:</span>
                    <strong className="text-[#16324A]">{dev.feeText}</strong>
                  </div>
                  <div>
                    <span className="text-[#66788A] block">الحالة الفنية:</span>
                    <strong className="text-[#16324A]">{dev.condition}</strong>
                  </div>
                  <div>
                    <span className="text-[#66788A] block">الوديعة/التأمين:</span>
                    <strong className="text-[#2D78B7]">{dev.deposit}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#66788A] pt-1">
                  <div className="w-6 h-6 rounded-full bg-[#0057C8] text-white flex items-center justify-center text-[10px] font-bold">
                    {dev.owner.split(" ").map((w) => w[0]).join("")}
                  </div>
                  <div>
                    <span className="font-bold text-[#16324A]">{dev.owner}</span>
                    <span className="text-[10px] text-[#66788A] block">{dev.ownerMajor}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#D7EAF7]">
                <button
                  type="button"
                  disabled={dev.status !== "متاح فوراً"}
                  onClick={() => onRequestDevice(dev)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                    dev.status === "متاح فوراً"
                      ? "bg-[#0057C8] hover:bg-[#2D78B7] text-white shadow-xs"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
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

