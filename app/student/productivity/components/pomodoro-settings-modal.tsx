"use client";

import React from "react";
import { PomodoroSettings } from "../types";
import { Modal } from "@/components/shared/modal";

interface PomodoroSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PomodoroSettings;
  setSettings: React.Dispatch<React.SetStateAction<PomodoroSettings>>;
  customStudyInput: string;
  setCustomStudyInput: (val: string) => void;
  customShortBreakInput: string;
  setCustomShortBreakInput: (val: string) => void;
}

export function PomodoroSettingsModal({
  isOpen,
  onClose,
  settings,
  setSettings,
  customStudyInput,
  setCustomStudyInput,
  customShortBreakInput,
  setCustomShortBreakInput,
}: PomodoroSettingsModalProps) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <Modal.Header
        title="تخصيص أوقات بومودورو"
        description="حدد أوقات المذاكرة والاستراحة المفضلة لديك بدقة"
        onClose={onClose}
      />

      <Modal.Body className="p-5 sm:p-6 space-y-4 text-xs">
        <div className="space-y-2">
          <label className="block font-bold text-brand-ink">
            مدة جلسة المذاكرة والتركيز (بالدقائق):
          </label>
          <div className="flex flex-wrap gap-2">
            {[15, 25, 45, 60].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => {
                  setSettings((prev) => ({
                    ...prev,
                    studyMinutes: mins,
                    mode: mins === 25 ? "classic" : mins === 45 ? "deep" : "custom",
                  }));
                  setCustomStudyInput("");
                }}
                className={`py-2 px-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  settings.studyMinutes === mins && !customStudyInput
                    ? "bg-brand-primary text-white border-brand-primary shadow-xs"
                    : "bg-brand-surface-muted text-brand-ink border-brand-border-soft hover:border-brand-primary"
                }`}
              >
                {mins} دقيقة
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="number"
              min="1"
              max="180"
              placeholder="وقت مخصص بالدقائق..."
              value={customStudyInput}
              onChange={(e) => {
                const val = e.target.value;
                setCustomStudyInput(val);
                const num = parseInt(val, 10);
                if (!isNaN(num) && num > 0) {
                  setSettings((prev) => ({
                    ...prev,
                    studyMinutes: num,
                    mode: "custom",
                  }));
                }
              }}
              className="w-48 px-3 py-1.5 rounded-xl border border-brand-border-soft bg-brand-surface-muted text-xs font-bold text-brand-ink focus:outline-none focus:border-brand-primary"
            />
            <span className="text-[11px] text-brand-muted">دقيقة (مخصص)</span>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-brand-border-soft/60">
          <label className="block font-bold text-brand-ink">
            مدة الاستراحة القصيرة (بالدقائق):
          </label>
          <div className="flex flex-wrap gap-2">
            {[3, 5, 10, 15].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => {
                  setSettings((prev) => ({
                    ...prev,
                    shortBreakMinutes: mins,
                  }));
                  setCustomShortBreakInput("");
                }}
                className={`py-2 px-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  settings.shortBreakMinutes === mins && !customShortBreakInput
                    ? "bg-brand-primary text-white border-brand-primary shadow-xs"
                    : "bg-brand-surface-muted text-brand-ink border-brand-border-soft hover:border-brand-primary"
                }`}
              >
                {mins} دقائق
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="number"
              min="1"
              max="60"
              placeholder="استراحة مخصصة..."
              value={customShortBreakInput}
              onChange={(e) => {
                const val = e.target.value;
                setCustomShortBreakInput(val);
                const num = parseInt(val, 10);
                if (!isNaN(num) && num > 0) {
                  setSettings((prev) => ({
                    ...prev,
                    shortBreakMinutes: num,
                  }));
                }
              }}
              className="w-48 px-3 py-1.5 rounded-xl border border-brand-border-soft bg-brand-surface-muted text-xs font-bold text-brand-ink focus:outline-none focus:border-brand-primary"
            />
            <span className="text-[11px] text-brand-muted">دقيقة</span>
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-brand-border-soft/60">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block font-bold text-brand-ink">الاستراحة الطويلة:</label>
              <select
                value={settings.longBreakMinutes}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    longBreakMinutes: parseInt(e.target.value, 10),
                  }))
                }
                className="w-full px-3 py-2 rounded-xl border border-brand-border-soft bg-brand-surface-muted text-xs font-bold text-brand-ink"
              >
                <option value={15}>15 دقيقة</option>
                <option value={20}>20 دقيقة</option>
                <option value={25}>25 دقيقة</option>
                <option value={30}>30 دقيقة</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-brand-ink">تكرار الاستراحة الطويلة:</label>
              <select
                value={settings.sessionsBeforeLongBreak}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    sessionsBeforeLongBreak: parseInt(e.target.value, 10),
                  }))
                }
                className="w-full px-3 py-2 rounded-xl border border-brand-border-soft bg-brand-surface-muted text-xs font-bold text-brand-ink"
              >
                <option value={3}>كل 3 جلسات</option>
                <option value={4}>كل 4 جلسات (افتراضي)</option>
                <option value={5}>كل 5 جلسات</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-brand-border-soft/60">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={settings.autoStartBreak}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, autoStartBreak: e.target.checked }))
              }
              className="w-4 h-4 rounded text-brand-primary border-brand-border-soft focus:ring-brand-secondary/30 cursor-pointer"
            />
            <span className="font-bold text-brand-ink">
              بدء الاستراحة تلقائياً فور اكتمال جلسة التركيز
            </span>
          </label>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2 rounded-xl bg-brand-primary hover:bg-brand-hover-medium text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          حفظ وإغلاق
        </button>
      </Modal.Footer>
    </Modal>
  );
}
