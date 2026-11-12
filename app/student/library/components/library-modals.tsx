"use client";

import React, { useRef } from "react";
import { LibraryCategory, LibraryFile, LibraryCourse } from "../types";
import { Modal } from "@/components/shared/modal";

interface LibraryModalsProps {
  courses: LibraryCourse[];
  previewFile: LibraryFile | null;
  onClosePreview: () => void;
  onDownload: (file: LibraryFile) => void;
  isUploadModalOpen: boolean;
  onCloseUpload: () => void;
  uploadTitle: string;
  setUploadTitle: (title: string) => void;
  uploadCourseCode: string;
  setUploadCourseCode: (code: string) => void;
  uploadCategory: LibraryCategory;
  setUploadCategory: (category: LibraryCategory) => void;
  uploadFileName?: string;
  uploadFileSize?: string;
  onFileSelect?: (file: File) => void;
  onClearFile?: () => void;
  onUploadSubmit: (e: React.FormEvent) => void;
}

export function LibraryModals({
  courses,
  previewFile,
  onClosePreview,
  onDownload,
  isUploadModalOpen,
  onCloseUpload,
  uploadTitle,
  setUploadTitle,
  uploadCourseCode,
  setUploadCourseCode,
  uploadCategory,
  setUploadCategory,
  uploadFileName,
  uploadFileSize,
  onFileSelect,
  onClearFile,
  onUploadSubmit,
}: LibraryModalsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
  };

  return (
    <>
      <Modal
        isOpen={!!previewFile}
        onClose={onClosePreview}
        size="md"
      >
        {previewFile && (
          <>
            <Modal.Header
              title={`معاينة: ${previewFile.title}`}
              badge={
                <span className="px-2 py-0.5 rounded-lg bg-[#EAF4FD] text-[#0057C8] font-bold text-xs">
                  {previewFile.fileType}
                </span>
              }
              onClose={onClosePreview}
            />

            <Modal.Body className="p-5 sm:p-6 space-y-4 text-xs">
              <div className="h-44 rounded-2xl bg-[#F0F7FD] border border-[#D7EAF7] flex flex-col items-center justify-center text-center p-4">
                <span className="text-4xl mb-2">📄</span>
                <p className="font-bold text-[#16324A] text-sm">{previewFile.title}</p>
                <p className="text-[#66788A] text-xs mt-1">
                  الحجم: {previewFile.fileSize} • التنزيلات: {previewFile.downloads}
                </p>
                <p className="text-[11px] text-[#2D78B7] mt-2">
                  الملف معتمد أكاديمياً ومتاح للعرض المباشر أو التنزيل
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#F8FBFE] border border-[#D7EAF7]">
                  <span className="text-[#66788A] block text-[10px]">المُعد:</span>
                  <span className="font-bold text-[#16324A]">{previewFile.author}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F8FBFE] border border-[#D7EAF7]">
                  <span className="text-[#66788A] block text-[10px]">تاريخ الرفع:</span>
                  <span className="font-bold text-[#16324A]">{previewFile.date}</span>
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <button
                type="button"
                onClick={onClosePreview}
                className="px-4 py-2 rounded-xl border border-[#D7EAF7] text-xs font-bold text-[#66788A] hover:bg-[#F8FBFE] cursor-pointer"
              >
                إغلاق
              </button>
              <button
                type="button"
                onClick={() => {
                  onDownload(previewFile);
                  onClosePreview();
                }}
                className="px-5 py-2 rounded-xl bg-[#0057C8] text-white text-xs font-bold shadow-xs hover:bg-[#2D78B7] transition-all cursor-pointer"
              >
                تنزيل الملف الآن 📥
              </button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      <Modal
        isOpen={isUploadModalOpen}
        onClose={onCloseUpload}
        size="lg"
      >
        <form onSubmit={onUploadSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <Modal.Header
            title="مشاركة وتزويد ملف تعليمي"
            description="ساعد زملاءك بمشاركة تلخيصك أو دفتر محاضراتك أو نموذج امتحان"
            onClose={onCloseUpload}
          />

          <Modal.Body className="p-5 sm:p-6 space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-[#16324A] block">
                اختر المادة الدراسية: <span className="text-red-500">*</span>
              </label>
              <select
                value={uploadCourseCode}
                onChange={(e) => setUploadCourseCode(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#D7EAF7] font-semibold text-[#16324A] bg-[#F8FBFE]"
                required
              >
                {courses.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.nameAr} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#16324A] block">
                عنوان الملف: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="مثال: تلخيص الوحدة الثالثة - الخوارزميات"
                className="w-full px-3.5 py-2 rounded-xl border border-[#D7EAF7] font-semibold text-[#16324A] bg-[#F8FBFE] focus:outline-none focus:border-[#0057C8]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#16324A] block">تصنيف الملف:</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "summaries" as const, label: "تلخيصات وشروحات" },
                  { id: "exams" as const, label: "نماذج امتحانات" },
                  { id: "books" as const, label: "مراجع وكتب" },
                  { id: "other" as const, label: "أخرى" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setUploadCategory(item.id)}
                    className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      uploadCategory === item.id
                        ? "bg-[#0057C8] text-white border-[#0057C8] shadow-xs"
                        : "bg-[#F8FBFE] text-[#16324A] border-[#D7EAF7] hover:border-[#0057C8]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.docx,.doc,.pptx,.ppt,.zip,.mp4,.png,.jpg"
              className="hidden"
            />

            {uploadFileName ? (
              <div className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                    📄
                  </span>
                  <div className="truncate">
                    <p className="font-bold text-[#16324A] text-xs truncate">{uploadFileName}</p>
                    <p className="text-[10px] text-[#66788A]">{uploadFileSize || "ملف جاهز"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] text-[#0057C8] hover:underline font-bold px-2 py-1 rounded-lg"
                  >
                    تغيير
                  </button>
                  {onClearFile && (
                    <button
                      type="button"
                      onClick={onClearFile}
                      className="text-[11px] text-red-600 hover:bg-red-50 font-bold px-2 py-1 rounded-lg"
                    >
                      إلغاء
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-4 rounded-2xl border-2 border-dashed border-[#D7EAF7] bg-[#F8FBFE] text-center hover:bg-[#F0F7FD] cursor-pointer transition-colors"
              >
                <span className="text-2xl block mb-1">☁️</span>
                <p className="text-xs font-bold text-[#0057C8]">انقر لاختيار الملف (PDF, Word, PPT)</p>
                <p className="text-[10px] text-[#66788A]">الحد الأقصى 25 ميجابايت</p>
              </div>
            )}
          </Modal.Body>

          <Modal.Footer>
            <button
              type="button"
              onClick={onCloseUpload}
              className="px-4 py-2 rounded-xl border border-[#D7EAF7] text-xs font-bold text-[#66788A] hover:bg-[#F8FBFE] cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0057C8] text-white text-xs font-bold shadow-xs hover:bg-[#2D78B7] cursor-pointer transition-colors"
            >
              إرسال للمراجعة
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}
