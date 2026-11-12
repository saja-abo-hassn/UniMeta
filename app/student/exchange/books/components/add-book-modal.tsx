"use client";

import React, { useState } from "react";
import { BookListingType, ExchangeBook } from "../types";
import { Modal } from "@/components/shared/modal";

export interface NewBookPayload {
  title: string;
  courseCode: string;
  author: string;
  type: BookListingType;
  price?: number;
  rentalPeriod?: string;
  exchangeTarget?: string;
  condition: ExchangeBook["condition"];
  notes?: string;
}

export interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent, payload?: NewBookPayload) => void;
  newTitle?: string;
  onTitleChange?: (v: string) => void;
  newCourseCode?: string;
  onCourseCodeChange?: (v: string) => void;
  newAuthor?: string;
  onAuthorChange?: (v: string) => void;
  newType?: BookListingType;
  onTypeChange?: (v: BookListingType) => void;
  newPrice?: number;
  onPriceChange?: (v: number) => void;
  newRentalPeriod?: string;
  onRentalPeriodChange?: (v: string) => void;
  newExchangeTarget?: string;
  onExchangeTargetChange?: (v: string) => void;
  newCondition?: ExchangeBook["condition"];
  onConditionChange?: (v: ExchangeBook["condition"]) => void;
  newNotes?: string;
  onNotesChange?: (v: string) => void;
}

export function AddBookModal({
  isOpen,
  onClose,
  onSubmit,
  newTitle = "",
  onTitleChange,
  newCourseCode = "ENCS3310",
  onCourseCodeChange,
  newAuthor = "",
  onAuthorChange,
  newType = "بيع",
  onTypeChange,
  newPrice = 25,
  onPriceChange,
  newRentalPeriod = "فصل دراسي",
  onRentalPeriodChange,
  newExchangeTarget = "",
  onExchangeTargetChange,
  newCondition = "ممتازة",
  onConditionChange,
  newNotes = "",
  onNotesChange,
}: AddBookModalProps) {
  const [localTitle, setLocalTitle] = useState(newTitle);
  const [localCourseCode, setLocalCourseCode] = useState(newCourseCode);
  const [localAuthor, setLocalAuthor] = useState(newAuthor);
  const [localType, setLocalType] = useState<BookListingType>(newType);
  const [localPrice, setLocalPrice] = useState<number>(newPrice);
  const [localRentalPeriod, setLocalRentalPeriod] = useState(newRentalPeriod);
  const [localExchangeTarget, setLocalExchangeTarget] = useState(newExchangeTarget);
  const [localCondition, setLocalCondition] = useState<ExchangeBook["condition"]>(newCondition);
  const [localNotes, setLocalNotes] = useState(newNotes);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localTitle.trim()) return;

    if (onTitleChange) onTitleChange(localTitle);
    if (onCourseCodeChange) onCourseCodeChange(localCourseCode);
    if (onAuthorChange) onAuthorChange(localAuthor);
    if (onTypeChange) onTypeChange(localType);
    if (onPriceChange) onPriceChange(localPrice);
    if (onRentalPeriodChange) onRentalPeriodChange(localRentalPeriod);
    if (onExchangeTargetChange) onExchangeTargetChange(localExchangeTarget);
    if (onConditionChange) onConditionChange(localCondition);
    if (onNotesChange) onNotesChange(localNotes);

    onSubmit(e, {
      title: localTitle,
      courseCode: localCourseCode,
      author: localAuthor,
      type: localType,
      price: localPrice,
      rentalPeriod: localRentalPeriod,
      exchangeTarget: localExchangeTarget,
      condition: localCondition,
      notes: localNotes,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <Modal.Header
          title="عرض كتاب أو مرجع دراسي"
          description="أضف كتابك ليتمكن زملاؤك من استعارته أو شرائه أو مبادلته"
          onClose={onClose}
        />

        <Modal.Body className="p-5 sm:p-6 space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-[#16324A] block">
              عنوان الكتاب / المرجع: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              placeholder="مثال: Operating System Concepts"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D7EAF7] font-semibold text-[#16324A] bg-[#F8FBFE] focus:outline-none focus:border-[#0057C8]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-[#16324A] block">رمز أو اسم المساق:</label>
              <input
                type="text"
                value={localCourseCode}
                onChange={(e) => setLocalCourseCode(e.target.value)}
                placeholder="مثال: CS331 أو أنظمة تشغيل"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D7EAF7] font-semibold text-[#16324A] bg-[#F8FBFE] focus:outline-none focus:border-[#0057C8]"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-[#16324A] block">المؤلف أو الطبعة:</label>
              <input
                type="text"
                value={localAuthor}
                onChange={(e) => setLocalAuthor(e.target.value)}
                placeholder="مثال: Silberschatz - 10th Ed"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D7EAF7] font-semibold text-[#16324A] bg-[#F8FBFE] focus:outline-none focus:border-[#0057C8]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#16324A] block">نوع العرض:</label>
            <div className="grid grid-cols-3 gap-2">
              {(["بيع", "استئجار", "تبادل"] as BookListingType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setLocalType(t)}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    localType === t
                      ? "bg-[#0057C8] text-white border-[#0057C8] shadow-xs"
                      : "bg-[#F8FBFE] text-[#16324A] border-[#D7EAF7] hover:border-[#0057C8]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {localType !== "تبادل" && (
              <div className="space-y-1">
                <label className="font-bold text-[#16324A] block">السعر / بدل الاستخدام (شيكل):</label>
                <input
                  type="number"
                  min={0}
                  value={localPrice}
                  onChange={(e) => setLocalPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D7EAF7] font-semibold text-[#16324A] bg-[#F8FBFE] focus:outline-none focus:border-[#0057C8]"
                />
              </div>
            )}

            {localType === "استئجار" && (
              <div className="space-y-1">
                <label className="font-bold text-[#16324A] block">المدة المقترحة:</label>
                <input
                  type="text"
                  value={localRentalPeriod}
                  onChange={(e) => setLocalRentalPeriod(e.target.value)}
                  placeholder="مثال: فصل دراسي كامل"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D7EAF7] font-semibold text-[#16324A] bg-[#F8FBFE] focus:outline-none focus:border-[#0057C8]"
                />
              </div>
            )}

            {localType === "تبادل" && (
              <div className="space-y-1 sm:col-span-2">
                <label className="font-bold text-[#16324A] block">المادة أو الكتاب المطلوب بالمقابل:</label>
                <input
                  type="text"
                  value={localExchangeTarget}
                  onChange={(e) => setLocalExchangeTarget(e.target.value)}
                  placeholder="مثال: كتاب هندسة البرمجيات أو ملخصات الذكاء الاصطناعي"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D7EAF7] font-semibold text-[#16324A] bg-[#F8FBFE] focus:outline-none focus:border-[#0057C8]"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="font-bold text-[#16324A] block">حالة النسخة:</label>
              <select
                value={localCondition}
                onChange={(e) => setLocalCondition(e.target.value as ExchangeBook["condition"])}
                className="w-full px-3 py-2.5 rounded-xl border border-[#D7EAF7] font-semibold text-[#16324A] bg-[#F8FBFE] focus:outline-none focus:border-[#0057C8]"
              >
                <option value="ممتازة">حالة ممتازة</option>
                <option value="جيدة جداً">حالة جيدة جداً</option>
                <option value="جيدة">حالة جيدة</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#16324A] block">ملاحظات إضافية:</label>
            <textarea
              rows={3}
              value={localNotes}
              onChange={(e) => setLocalNotes(e.target.value)}
              placeholder="هل توجد تلخيصات أو حلول أسئلة سابقة داخل المرجع؟"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D7EAF7] font-semibold text-[#16324A] bg-[#F8FBFE] focus:outline-none focus:border-[#0057C8] resize-none"
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[#D7EAF7] text-[#16324A] font-semibold hover:bg-[#F8FBFE] transition-colors cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#0057C8] hover:bg-[#2D78B7] text-white font-bold shadow-xs transition-all cursor-pointer"
          >
            نشر الكتاب الآن
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
