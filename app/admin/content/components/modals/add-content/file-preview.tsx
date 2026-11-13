"use client";

import React from "react";

interface FilePreviewProps {
  fileName: string;
  fileSize: string;
  fileType: string;
  onRemove: () => void;
  disabled?: boolean;
}

export function FilePreview({
  fileName,
  fileSize,
  fileType,
  onRemove,
  disabled = false,
}: FilePreviewProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-2xl bg-brand-surface-soft border border-brand-border-soft text-start">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
          {fileType}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-brand-ink truncate max-w-[240px] sm:max-w-xs">
            {fileName}
          </p>
          <div className="flex items-center gap-2 text-[10px] text-brand-muted mt-0.5">
            <span className="font-mono">{fileSize}</span>
            <span>•</span>
            <span className="text-emerald-700 font-bold">تم الفحص بنجاح</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 active:scale-95 transition-all text-xs font-bold cursor-pointer shrink-0 disabled:opacity-50"
        aria-label="حذف الملف المرفوع"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}

