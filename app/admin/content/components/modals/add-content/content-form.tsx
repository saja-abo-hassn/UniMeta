"use client";

import React from "react";
import { CourseSelect, CourseOption } from "./course-select";
import { ContentTypeSelect } from "./content-type-select";
import { FileDropzone } from "./file-dropzone";
import { FilePreview } from "./file-preview";
import { ContentFormValues, ContentFormErrors, ContentUploadState } from "./types";

interface ContentFormProps {
  values: ContentFormValues;
  errors: ContentFormErrors;
  courses: CourseOption[];
  uploadState: ContentUploadState;
  onCourseChange: (course: CourseOption) => void;
  onValuesChange: (updater: (prev: ContentFormValues) => ContentFormValues) => void;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
}

export function ContentForm({
  values,
  errors,
  courses,
  uploadState,
  onCourseChange,
  onValuesChange,
  onFileSelect,
  onFileRemove,
}: ContentFormProps) {
  return (
    <div className="space-y-4 text-start">
      {errors.general && (
        <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold" role="alert">
          {errors.general}
        </div>
      )}

      <CourseSelect
        courses={courses}
        selectedCourseId={values.courseId}
        onChange={onCourseChange}
        error={errors.courseId}
      />

      <ContentTypeSelect
        type={values.type}
        onTypeChange={(type) =>
          onValuesChange((prev) => ({
            ...prev,
            type,
            category:
              type === "مصدر"
                ? "الكتب"
                : type === "شرح"
                ? "الفيديوهات"
                : type === "امتحان"
                ? "النماذج السابقة"
                : "الملخصات",
          }))
        }
        status={values.status}
        onStatusChange={(status) => onValuesChange((prev) => ({ ...prev, status }))}
      />

      <div className="space-y-1.5">
        <label htmlFor="content-title-input" className="text-xs font-bold text-brand-ink block">
          عنوان الملف أو المحتوى <span className="text-red-500">*</span>
        </label>
        <input
          id="content-title-input"
          type="text"
          required
          value={values.title}
          onChange={(e) => {
            const val = e.target.value;
            onValuesChange((prev) => ({ ...prev, title: val }));
          }}
          placeholder="مثال: ملخص شامل للفصل الثاني مع مسائل نموذجية"
          className={`w-full px-3 py-2 rounded-xl border text-xs sm:text-sm font-semibold text-brand-ink bg-white transition-colors focus:outline-none ${
            errors.title ? "border-red-400 bg-red-50/30" : "border-brand-border-soft focus:border-brand-primary"
          }`}
        />
        {errors.title && (
          <p className="text-[11px] text-red-600 font-medium" role="alert">
            {errors.title}
          </p>
        )}
      </div>

      <div className="space-y-2">
        {uploadState.fileName ? (
          <FilePreview
            fileName={uploadState.fileName}
            fileSize={uploadState.fileSizeFormatted}
            fileType={uploadState.fileTypeDetected}
            onRemove={onFileRemove}
            disabled={uploadState.isUploading}
          />
        ) : (
          <FileDropzone
            onFileSelect={onFileSelect}
            isUploading={uploadState.isUploading}
            progress={uploadState.progress}
            error={errors.file || uploadState.error}
          />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label htmlFor="content-author-input" className="text-xs font-bold text-brand-ink block">
            المُعد أو المرجع الأكاديمي
          </label>
          <input
            id="content-author-input"
            type="text"
            value={values.author}
            onChange={(e) => {
              const val = e.target.value;
              onValuesChange((prev) => ({ ...prev, author: val }));
            }}
            placeholder="مثال: د. أحمد / المكتب الأكاديمي"
            className="w-full px-3 py-2 rounded-xl border border-brand-border-soft bg-white text-xs font-medium text-brand-ink focus:outline-none focus:border-brand-primary"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="content-url-input" className="text-xs font-bold text-brand-ink block">
            رابط سحابي مباشر <span className="text-brand-subtle font-normal">(اختياري)</span>
          </label>
          <input
            id="content-url-input"
            type="url"
            dir="ltr"
            value={values.url}
            onChange={(e) => {
              const val = e.target.value;
              onValuesChange((prev) => ({ ...prev, url: val }));
            }}
            placeholder="https://drive.google.com/..."
            className="w-full px-3 py-2 rounded-xl border border-brand-border-soft bg-white text-xs font-mono text-brand-ink focus:outline-none focus:border-brand-primary"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="content-desc-input" className="text-xs font-bold text-brand-ink block">
          وصف أو ملاحظات للطلبة <span className="text-brand-subtle font-normal">(اختياري)</span>
        </label>
        <textarea
          id="content-desc-input"
          rows={2}
          value={values.description}
          onChange={(e) => {
            const val = e.target.value;
            onValuesChange((prev) => ({ ...prev, description: val }));
          }}
          placeholder="ملاحظات حول الفصول المغطاة أو نصائح للدراسة..."
          className="w-full px-3 py-2 rounded-xl border border-brand-border-soft bg-white text-xs font-medium text-brand-ink focus:outline-none focus:border-brand-primary"
        />
      </div>
    </div>
  );
}

