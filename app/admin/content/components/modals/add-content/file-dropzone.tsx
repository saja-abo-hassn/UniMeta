"use client";

import React, { useRef, useState } from "react";
import { ALLOWED_EXTENSIONS, MAX_FILE_SIZE_MB } from "../../../types";

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
  progress: number;
  error?: string;
}

export function FileDropzone({
  onFileSelect,
  isUploading,
  progress,
  error,
}: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-1.5 text-start">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-[#16324A] block">
          رفع الملف الرقمي <span className="text-red-500">*</span>
        </label>
        <span className="text-[10px] text-[#66788A]">حد أقصى {MAX_FILE_SIZE_MB} ميجابايت</span>
      </div>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative h-28 rounded-2xl border-2 border-dashed p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all select-none ${
          isDragOver
            ? "border-[#0057C8] bg-[#EAF4FD]"
            : error
            ? "border-red-400 bg-red-50/30"
            : "border-[#D7EAF7] bg-[#F8FBFE] hover:bg-[#F0F7FD] hover:border-[#0057C8]/40"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_EXTENSIONS.join(",")}
          onChange={handleChange}
          className="hidden"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="w-full max-w-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#0057C8]">
              <span>جاري فحص ورفع الملف...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#D7EAF7] overflow-hidden">
              <div
                className="h-full bg-[#0057C8] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="w-9 h-9 rounded-xl bg-[#0057C8]/10 text-[#0057C8] flex items-center justify-center mb-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-xs font-bold text-[#16324A]">
              اضغط لاختيار ملف أو اسحبه إلى هنا
            </p>
            <p className="text-[10px] text-[#66788A] mt-0.5">
              يدعم PDF، Word، سلايدات، صور، MP4، ZIP
            </p>
          </>
        )}
      </div>

      {error && (
        <p className="text-[11px] text-red-600 font-medium" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

