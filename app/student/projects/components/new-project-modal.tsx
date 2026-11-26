"use client";

import React, { useEffect, useState } from "react";
import { apiClient } from "@/src/services/api-client";
import { requireData } from "@/src/services/api-result";
import { Modal } from "@/components/shared/modal";
import type { components } from "@/types/api";

type Major = components["schemas"]["Major"];

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  newTitle: string;
  onTitleChange: (v: string) => void;
  newMajor: string;
  onMajorChange: (v: string) => void;
  newSupervisor: string;
  onSupervisorChange: (v: string) => void;
  newSummary: string;
  onSummaryChange: (v: string) => void;
  newNeededRole: string;
  onNeededRoleChange: (v: string) => void;
}

export function NewProjectModal({
  isOpen,
  onClose,
  onSubmit,
  newTitle,
  onTitleChange,
  newMajor,
  onMajorChange,
  newSupervisor,
  onSupervisorChange,
  newSummary,
  onSummaryChange,
  newNeededRole,
  onNeededRoleChange,
}: NewProjectModalProps) {
  const [majors,setMajors]=useState<Major[]>([]);
  const [majorsLoading,setMajorsLoading]=useState(!apiClient.isUsingMock());
  const [majorsError,setMajorsError]=useState<string | null>(null);
  const [majorsRetry,setMajorsRetry]=useState(0);
  useEffect(()=>{
    if(apiClient.isUsingMock()||!isOpen)return;
    let active = true;
    const controller = new AbortController();
    setMajorsLoading(true);
    setMajorsError(null);
    void apiClient.all<Major>("/majors", controller.signal).then(requireData).then((items)=>{
      if (!active) return;
      setMajors(items);
      setMajorsError(null);
      if (items.length === 0) setMajorsError("لا توجد تخصصات متاحة لهذه الكلية حالياً.");
    }).catch((error: unknown)=>{
      if (!active) return;
      setMajors([]);
      setMajorsError(error instanceof Error ? `تعذر تحميل التخصصات: ${error.message}` : "تعذر تحميل التخصصات حالياً.");
    }).finally(()=>{ if(active)setMajorsLoading(false); });
    return ()=>{active=false;controller.abort();};
  },[isOpen,majorsRetry]);
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <Modal.Header
          title="نشر إعلان مشروع تخرج"
          description="اعرض فكرة المشروع لاستقبال طلبات الانضمام لفريقك."
          onClose={onClose}
        />

        <Modal.Body className="p-5 sm:p-6 space-y-3.5 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-brand-ink block">عنوان المشروع المقترح:</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="مثال: نظام ذكي للتنبؤ بالأعطال باستخدام تعلم الآلة"
              className="w-full px-3.5 py-2 rounded-xl border border-brand-border-soft font-semibold text-brand-ink bg-brand-surface-muted"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-brand-ink block">التخصص الأكاديمي:</label>
              <select
                value={newMajor}
                onChange={(e) => onMajorChange(e.target.value)}
                disabled={!apiClient.isUsingMock() && (majorsLoading || majors.length === 0)}
                required={!apiClient.isUsingMock()}
                className="w-full px-3.5 py-2 rounded-xl border border-brand-border-soft font-semibold text-brand-ink bg-brand-surface-muted"
              >
                {!apiClient.isUsingMock() ? <><option value="">{majorsLoading ? "جارٍ تحميل التخصصات…" : majorsError ?? "اختر التخصص"}</option>{majors.map(m=><option key={m.id} value={m.name}>{m.name}</option>)}</> : <><option value="هندسة البرمجيات ونظم المعلومات">هندسة البرمجيات ونظم المعلومات</option>
                <option value="علوم الحاسوب">علوم الحاسوب</option>
                <option value="هندسة أنظمة الحاسوب">هندسة أنظمة الحاسوب</option>
                <option value="الوسائط المتعددة">الوسائط المتعددة</option>
                <option value="هندسة الميكاترونكس">هندسة الميكاترونكس</option></>}
              </select>
              {!apiClient.isUsingMock() && majorsError && <div className="flex flex-wrap items-center gap-2 text-[11px] text-red-600"><span>{majorsError}</span><button type="button" onClick={() => setMajorsRetry((count) => count + 1)} disabled={majorsLoading} className="underline font-bold disabled:opacity-50">إعادة المحاولة</button></div>}
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-ink block">المشرف المقترح:</label>
              <input
                type="text"
                value={newSupervisor}
                onChange={(e) => onSupervisorChange(e.target.value)}
                placeholder="اسم الدكتور أو المدرس المقترح"
                className="w-full px-3.5 py-2 rounded-xl border border-brand-border-soft font-semibold text-brand-ink bg-brand-surface-muted"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-brand-ink block">ملخص الفكرة والأهداف:</label>
            <textarea
              rows={3}
              required
              value={newSummary}
              onChange={(e) => onSummaryChange(e.target.value)}
              placeholder="اشرح المشكلة والحل المقترح والتقنيات المستخدمة..."
              className="w-full px-3.5 py-2 rounded-xl border border-brand-border-soft font-semibold text-brand-ink bg-brand-surface-muted"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-brand-ink block">الدور الشاغر المطلوب انضمامه:</label>
            <input
              type="text"
              value={newNeededRole}
              onChange={(e) => onNeededRoleChange(e.target.value)}
              placeholder="مثال: مطور بايثون أو مهندس روبوتات أو مصمم تجربة مستخدم"
              className="w-full px-3.5 py-2 rounded-xl border border-brand-border-soft font-semibold text-brand-ink bg-brand-surface-muted"
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-brand-border-soft text-brand-ink font-semibold hover:bg-brand-surface-muted cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={!apiClient.isUsingMock() && (majorsLoading || majors.length === 0 || !newMajor)}
            className="px-5 py-2 rounded-xl bg-brand-primary text-white font-bold shadow-xs hover:bg-brand-hover-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            نشر الإعلان
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
