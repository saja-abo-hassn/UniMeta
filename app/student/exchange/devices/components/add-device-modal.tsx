"use client";

import React from "react";
import { DeviceItem } from "../types";
import { Modal } from "@/components/shared/modal";

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  newDeviceName: string;
  setNewDeviceName: (name: string) => void;
  newDeviceCategory: DeviceItem["category"];
  setNewDeviceCategory: (category: DeviceItem["category"]) => void;
  newDeviceType: DeviceItem["type"];
  setNewDeviceType: (type: DeviceItem["type"]) => void;
  newFeeText: string;
  setNewFeeText: (feeText: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AddDeviceModal({
  isOpen,
  onClose,
  newDeviceName,
  setNewDeviceName,
  newDeviceCategory,
  setNewDeviceCategory,
  newDeviceType,
  setNewDeviceType,
  newFeeText,
  setNewFeeText,
  onSubmit,
}: AddDeviceModalProps) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <Modal.Header
          title="إضافة جهاز أو أداة للإعارة الطلابية"
          onClose={onClose}
        />

        <Modal.Body className="p-5 sm:p-6 space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-[#16324A] block">اسم الجهاز والموديل:</label>
            <input
              type="text"
              required
              value={newDeviceName}
              onChange={(e) => setNewDeviceName(e.target.value)}
              placeholder="مثال: راسبيري باي 4 أو حاسبة بيانية TI-84"
              className="w-full px-3.5 py-2 rounded-xl border border-[#D7EAF7] font-semibold text-[#16324A] bg-[#F8FBFE] focus:outline-none focus:border-[#0057C8]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-[#16324A] block">تصنيف الأداة:</label>
              <select
                value={newDeviceCategory}
                onChange={(e) => setNewDeviceCategory(e.target.value as DeviceItem["category"])}
                className="w-full px-3.5 py-2 rounded-xl border border-[#D7EAF7] font-semibold text-[#16324A] bg-[#F8FBFE]"
              >
                <option value="حاسبات بيانية">حاسبات بيانية</option>
                <option value="لوحات إلكترونية ومتحكمات">لوحات إلكترونية ومتحكمات</option>
                <option value="كاميرات ومعدات إعلام">كاميرات ومعدات إعلام</option>
                <option value="أجهزة قياس ومعامل">أجهزة قياس ومعامل</option>
                <option value="أجهزة لوحية وملحقات">أجهزة لوحية وملحقات</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#16324A] block">نوع الإتاحة:</label>
              <select
                value={newDeviceType}
                onChange={(e) => setNewDeviceType(e.target.value as DeviceItem["type"])}
                className="w-full px-3.5 py-2 rounded-xl border border-[#D7EAF7] font-semibold text-[#16324A] bg-[#F8FBFE]"
              >
                <option value="إعارة مجانية">إعارة مجانية</option>
                <option value="استئجار رمزي">استئجار رمزي</option>
                <option value="تبادل بأداة أخرى">تبادل بأداة أخرى</option>
              </select>
            </div>
          </div>

          {newDeviceType === "استئجار رمزي" && (
            <div className="space-y-1">
              <label className="font-bold text-[#16324A] block">بدل الإيجار أو الشروط:</label>
              <input
                type="text"
                value={newFeeText}
                onChange={(e) => setNewFeeText(e.target.value)}
                placeholder="مثال: 15 ₪ / أسبوع مع تأمين"
                className="w-full px-3.5 py-2 rounded-xl border border-[#D7EAF7] font-semibold text-[#16324A] bg-[#F8FBFE] focus:outline-none focus:border-[#0057C8]"
              />
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#D7EAF7] text-[#16324A] font-semibold hover:bg-[#F8FBFE] cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-[#0057C8] text-white font-bold shadow-xs hover:bg-[#2D78B7] cursor-pointer"
          >
            حفظ وإدراج
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
