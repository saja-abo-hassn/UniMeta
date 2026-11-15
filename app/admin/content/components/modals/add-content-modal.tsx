"use client";

import React, { useMemo, useState } from "react";
import { Modal } from "@/components/shared/modal";
import { ContentFormData } from "../../types";
import { useContentUpload } from "./add-content/use-content-upload";
import { ContentForm } from "./add-content/content-form";
import { ContentFormValues, ContentFormErrors } from "./add-content/types";

interface AddContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: ContentFormData;
  setFormData: React.Dispatch<React.SetStateAction<ContentFormData>>;
  formError: string;
  isUploading: boolean;
  uploadedFileName: string;
  courseSuggestions: string[];
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AddContentModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  formError: externalError,
  onSubmit,
}: AddContentModalProps) {
  const { uploadState, handleFile, removeFile, resetUpload } = useContentUpload();

  const [internalErrors, setInternalErrors] = useState<ContentFormErrors>({});

  const formValues: ContentFormValues = useMemo(
    () => ({
      courseId: "",
      courseName: formData.courseName,
      courseCode: formData.courseCode,
      type:
        formData.category === "الكتب"
          ? "مصدر"
          : formData.category === "الفيديوهات"
          ? "شرح"
          : formData.category === "النماذج السابقة"
          ? "امتحان"
          : "ملخص",
      category: formData.category,
      title: formData.title,
      description: formData.description,
      author: formData.author,
      status: formData.status,
      url: formData.url,
    }),
    [formData]
  );

  const handleFormValuesChange = (
    updater: (prev: ContentFormValues) => ContentFormValues
  ) => {
    const updated = updater(formValues);
    setFormData((prev) => ({
      ...prev,
      title: updated.title,
      courseName: updated.courseName,
      category: updated.category,
      description: updated.description,
      author: updated.author,
      status: updated.status,
      url: updated.url,
    }));
    if (updated.title.trim()) {
      setInternalErrors((prev) => ({ ...prev, title: undefined }));
    }
    if (updated.courseName.trim()) setInternalErrors((prev) => ({ ...prev, courseId: undefined }));
  };

  const handleFileSelect = (file: File) => {
    const ok = handleFile(file);
    if (ok) {
      setFormData((prev) => ({
        ...prev,
        title: prev.title || file.name.replace(/\.[^/.]+$/, ""),
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      }));
      setInternalErrors((prev) => ({ ...prev, file: undefined }));
    }
  };

  const handleFileRemove = () => {
    removeFile();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: ContentFormErrors = {};

    if (!formData.courseName.trim()) {
      errors.courseId = "يرجى كتابة اسم المادة الدراسية.";
    }
    if (!formData.title.trim()) {
      errors.title = "يرجى كتابة عنوان واضح للمحتوى التعليمي.";
    }

    if (Object.keys(errors).length > 0) {
      setInternalErrors(errors);
      return;
    }

    onSubmit(e);
    resetUpload();
  };

  const handleClose = () => {
    resetUpload();
    setInternalErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <form onSubmit={handleFormSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <Modal.Header
          title="إضافة ملف تعليمي للمادة"
          description="ارفع الملخصات والمراجع والنماذج والفيديوهات لتظهر للطلبة وفق حالة النشر"
          onClose={handleClose}
        />

        <Modal.Body className="p-6">
          <ContentForm
            values={formValues}
            errors={{
              ...internalErrors,
              general: externalError || internalErrors.general,
            }}
            uploadState={uploadState}
            onValuesChange={handleFormValuesChange}
            onFileSelect={handleFileSelect}
            onFileRemove={handleFileRemove}
          />
        </Modal.Body>

        <Modal.Footer>
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 rounded-xl border border-brand-border-soft text-xs font-bold text-brand-muted hover:bg-brand-surface-muted cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={uploadState.isUploading}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-primary hover:bg-brand-hover-medium disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            {uploadState.isUploading && (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            <span>حفظ ورفع المحتوى</span>
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
