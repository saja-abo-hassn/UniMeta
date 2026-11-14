"use client";

import React from "react";
import { AuditLogEntry } from "@/src/services/student-verification-service";

interface AuditLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  auditLogs: AuditLogEntry[];
}

export function AuditLogDrawer({ isOpen, onClose, auditLogs }: AuditLogDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="p-5 rounded-3xl bg-brand-surface-muted border border-brand-border-soft shadow-xs space-y-3 animate-fade-in">
      <div className="flex items-center justify-between pb-2 border-b border-brand-border-soft">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-primary" />
          <h3 className="font-bold text-xs sm:text-sm text-brand-ink">
            سجل الوصول والتدقيق الأمني (Sensitive Data Audit Log)
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-brand-muted hover:text-brand-ink"
        >
          إغلاق ✕
        </button>
      </div>

      {auditLogs.length === 0 ? (
        <p className="text-xs text-brand-muted py-2">
          لم يتم تسجيل أي عمليات كشف لبيانات الهويات أو أرقام الهواتف حتى الآن. كافة البيانات مشفرة ومقنعة.
        </p>
      ) : (
        <div className="overflow-x-auto max-h-48 overflow-y-auto">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="text-brand-muted font-semibold border-b border-brand-border-soft/60">
                <th className="py-2 text-start">القائم بالعملية</th>
                <th className="py-2 text-start">رقم الاتفاقية</th>
                <th className="py-2 text-start">الطالب المستهدف</th>
                <th className="py-2 text-start">نوع الإجراء</th>
                <th className="py-2 text-start">التوقيت والتاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border-soft/40">
              {auditLogs.map((log) => (
                <tr key={log.id} className="text-brand-ink">
                  <td className="py-2 font-bold">{log.actorName} ({log.actorRole})</td>
                  <td className="py-2 font-mono text-brand-primary" dir="ltr">{log.agreementId}</td>
                  <td className="py-2">{log.targetPartyName} ({log.targetStudentId})</td>
                  <td className="py-2 text-brand-primary font-semibold">{log.action}</td>
                  <td className="py-2 font-mono text-brand-muted">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

