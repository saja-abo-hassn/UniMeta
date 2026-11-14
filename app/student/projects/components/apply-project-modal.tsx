"use client";

import React from "react";
import { GraduationProject } from "@/src/data/graduation-projects-data";
import { Modal } from "@/components/shared/modal";

interface ApplyProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: GraduationProject | null;
  applicantStage: "مشروع 1" | "مشروع 2" | "مشروع 1 و 2" | "";
  onStageChange: (stage: "مشروع 1" | "مشروع 2" | "مشروع 1 و 2") => void;
  stageError: string;
  applicantRole: string;
  onRoleChange: (role: string) => void;
  applicantMessage: string;
  onMessageChange: (msg: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ApplyProjectModal({
  isOpen,
  onClose,
  project,
  applicantStage,
  onStageChange,
  stageError,
  applicantRole,
  onRoleChange,
  applicantMessage,
  onMessageChange,
  onSubmit,
}: ApplyProjectModalProps) {
  if (!isOpen || !project) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <Modal.Header
          title="طلب انضمام لفريق مشروع التخرج"
          description={`${project.title} (${project.projectScope})`}
          onClose={onClose}
        />

        <Modal.Body className="p-5 sm:p-6 space-y-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-brand-surface-soft border border-brand-border-soft space-y-1 text-xs">
            <div><strong>قائد الفريق:</strong> {project.leader}</div>
            <div><strong>المشرف الأكاديمي:</strong> {project.supervisor}</div>
            <div><strong>التخصص المعتمد:</strong> {project.major}</div>
            <div><strong>نطاق العمل:</strong> {project.projectScope}</div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-brand-ink block">
              المرحلة المسجل بها رسمياً في الجامعة: <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["مشروع 1", "مشروع 2", "مشروع 1 و 2"] as const).map((stage) => (
                <button
                  key={stage}
                  type="button"
                  onClick={() => onStageChange(stage)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    applicantStage === stage
                      ? "bg-brand-primary text-white border-brand-primary shadow-xs"
                      : "bg-brand-surface-muted text-brand-ink border-brand-border-soft hover:border-brand-primary"
                  }`}
                >
                  {stage}
                </button>
              ))}
            </div>
            {stageError && (
              <p className="text-red-600 text-[11px] font-bold mt-1 bg-red-50 p-2 rounded-xl border border-red-200">
                {stageError}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="font-bold text-brand-ink block">الدور المقترح داخل الفريق:</label>
            <input
              type="text"
              required
              value={applicantRole}
              onChange={(e) => onRoleChange(e.target.value)}
              placeholder="مثال: مطور واجهات أو باحث ذكاء اصطناعي..."
              className="w-full px-3.5 py-2 rounded-xl border border-brand-border-soft font-semibold text-brand-ink bg-brand-surface-muted"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-brand-ink block">رسالة توضيحية لقائد الفريق:</label>
            <textarea
              rows={2}
              value={applicantMessage}
              onChange={(e) => onMessageChange(e.target.value)}
              placeholder="وضح خبرتك والمهام التي تستطيع إنجازها..."
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
            className="px-5 py-2 rounded-xl bg-brand-primary text-white font-bold shadow-xs hover:bg-brand-hover-medium cursor-pointer"
          >
            إرسال طلب الانضمام
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
