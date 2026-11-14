import React from "react";
import { LibraryCategory, LibraryFile, LibraryCourse } from "../types";

interface CourseDetailsViewProps {
  activeCourse: LibraryCourse;
  onBack: () => void;
  activeCategory: LibraryCategory;
  setActiveCategory: (cat: LibraryCategory) => void;
  selectedFileType: string;
  setSelectedFileType: (type: string) => void;
  currentCategoryFiles: LibraryFile[];
  getCategoryCount: (course: LibraryCourse, cat: LibraryCategory) => number;
  onOpenUploadForCourse: (code: string, cat: LibraryCategory) => void;
  onPreview: (file: LibraryFile) => void;
  onDownload: (file: LibraryFile) => void;
}

export function CourseDetailsView({
  activeCourse,
  onBack,
  activeCategory,
  setActiveCategory,
  selectedFileType,
  setSelectedFileType,
  currentCategoryFiles,
  getCategoryCount,
  onOpenUploadForCourse,
  onPreview,
  onDownload,
}: CourseDetailsViewProps) {
  return (
    <section className="space-y-6">
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-brand-border-soft shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-brand-surface-blue hover:bg-brand-border-soft text-brand-primary text-xs font-bold transition-colors"
          >
            <span>&rarr;</span>
            <span>العودة لكافة مواد المكتبة</span>
          </button>

          <span className="text-xs font-bold text-brand-muted">
            إجمالي الملفات: {activeCourse.files.length} ملف
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span className="font-mono text-xs font-bold text-brand-primary bg-brand-surface-soft px-2.5 py-0.5 rounded-md border border-brand-border-soft" dir="ltr">
                {activeCourse.code}
              </span>
              <span className="text-xs text-brand-muted">
                {activeCourse.level} · {activeCourse.semester}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-ink">
              {activeCourse.nameAr}
            </h2>
            <span className="text-xs text-brand-muted block mt-0.5" dir="ltr">
              {activeCourse.nameEn} · مدرس المساق: {activeCourse.instructor}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenUploadForCourse(activeCourse.code, activeCategory)}
              className="px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-hover-medium text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-2xs"
            >
              <span>+</span>
              <span>رفع ملف لهذه المادة</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 p-1.5 bg-white rounded-3xl border border-brand-border-soft shadow-xs overflow-x-auto text-xs sm:text-sm">
        <button
          type="button"
          onClick={() => setActiveCategory("books")}
          className={`flex-1 py-3 px-4 rounded-2xl font-bold transition-all text-center flex items-center justify-center gap-2 whitespace-nowrap ${
            activeCategory === "books"
              ? "bg-brand-primary text-white shadow-xs"
              : "text-brand-muted hover:bg-brand-surface-soft hover:text-brand-primary"
          }`}
        >
          <span>📚 الكتب والمراجع</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
            activeCategory === "books" ? "bg-white/20 text-white" : "bg-brand-surface-blue text-brand-primary"
          }`}>
            {getCategoryCount(activeCourse, "books")}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveCategory("summaries")}
          className={`flex-1 py-3 px-4 rounded-2xl font-bold transition-all text-center flex items-center justify-center gap-2 whitespace-nowrap ${
            activeCategory === "summaries"
              ? "bg-brand-primary text-white shadow-xs"
              : "text-brand-muted hover:bg-brand-surface-soft hover:text-brand-primary"
          }`}
        >
          <span>📝 الملخصات والشروحات</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
            activeCategory === "summaries" ? "bg-white/20 text-white" : "bg-brand-surface-blue text-brand-primary"
          }`}>
            {getCategoryCount(activeCourse, "summaries")}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveCategory("exams")}
          className={`flex-1 py-3 px-4 rounded-2xl font-bold transition-all text-center flex items-center justify-center gap-2 whitespace-nowrap ${
            activeCategory === "exams"
              ? "bg-brand-primary text-white shadow-xs"
              : "text-brand-muted hover:bg-brand-surface-soft hover:text-brand-primary"
          }`}
        >
          <span>📋 نماذج الامتحانات</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
            activeCategory === "exams" ? "bg-white/20 text-white" : "bg-brand-surface-blue text-brand-primary"
          }`}>
            {getCategoryCount(activeCourse, "exams")}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveCategory("other")}
          className={`flex-1 py-3 px-4 rounded-2xl font-bold transition-all text-center flex items-center justify-center gap-2 whitespace-nowrap ${
            activeCategory === "other"
              ? "bg-brand-primary text-white shadow-xs"
              : "text-brand-muted hover:bg-brand-surface-soft hover:text-brand-primary"
          }`}
        >
          <span>🎥 الشرائح والوسائط</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
            activeCategory === "other" ? "bg-white/20 text-white" : "bg-brand-surface-blue text-brand-primary"
          }`}>
            {getCategoryCount(activeCourse, "other")}
          </span>
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-brand-muted px-1">
          <span>الملفات المتاحة في هذا القسم ({currentCategoryFiles.length}):</span>
          <div className="flex items-center gap-1.5">
            <span className="font-medium">نوع الملف:</span>
            <select
              value={selectedFileType}
              onChange={(e) => setSelectedFileType(e.target.value)}
              className="px-2.5 py-1 rounded-xl border border-brand-border-soft bg-white text-xs font-semibold text-brand-ink outline-hidden"
            >
              <option value="all">الكل</option>
              <option value="PDF">PDF</option>
              <option value="SLIDES">Slides</option>
              <option value="ZIP">ZIP</option>
              <option value="VIDEO">Video</option>
            </select>
          </div>
        </div>

        {currentCategoryFiles.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-brand-border-soft shadow-xs space-y-3 animate-fade-in">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-surface-soft text-brand-primary flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 className="font-extrabold text-base text-brand-ink">
              لا توجد ملفات متوفرة في قسم ({
                activeCategory === "books"
                  ? "الكتب والمراجع"
                  : activeCategory === "summaries"
                  ? "الملخصات والشروحات"
                  : activeCategory === "exams"
                  ? "نماذج الامتحانات"
                  : "الشرائح والوسائط"
              }) حالياً
            </h4>
            <p className="text-xs text-brand-muted max-w-md mx-auto">
              كن أول من يساهم برفع ملف لهذا القسم لمساعدة زملائك في تخصص {activeCourse.nameAr}.
            </p>
            <button
              type="button"
              onClick={() => onOpenUploadForCourse(activeCourse.code, activeCategory)}
              className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-hover-medium text-white text-xs font-bold transition-all shadow-xs"
            >
              رفع ملف لهذا القسم الآن
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
            {currentCategoryFiles.map((file) => (
              <div
                key={file.id}
                className="p-5 sm:p-6 rounded-3xl bg-white border border-brand-border-soft hover:border-brand-secondary shadow-xs flex flex-col justify-between gap-4 transition-all h-full"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[10px] px-2.5 py-0.5 rounded-full bg-brand-surface-blue text-brand-primary border border-brand-border-soft">
                      {file.fileType} · {file.fileSize}
                    </span>
                    <span className="text-[11px] text-brand-muted flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-brand-hover-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>{file.downloads} تنزيل</span>
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm sm:text-base text-brand-ink leading-snug line-clamp-2 min-h-[2.5rem]">
                    {file.title}
                  </h4>

                  {file.description && (
                    <p className="text-xs text-brand-muted leading-relaxed line-clamp-2">
                      {file.description}
                    </p>
                  )}

                  <div className="flex items-center gap-1.5 text-xs text-brand-muted pt-1">
                    <span>المؤلف / الرافع:</span>
                    <span className="font-bold text-brand-ink">{file.author}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-brand-border-soft/60 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-brand-muted">
                    أُضيف في: {file.date}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onPreview(file)}
                      className="px-3 py-1.5 rounded-xl border border-brand-border-soft hover:bg-brand-surface-soft text-xs font-semibold text-brand-primary transition-colors"
                    >
                      معاينة
                    </button>
                    <button
                      type="button"
                      onClick={() => onDownload(file)}
                      className="px-3.5 py-1.5 rounded-xl bg-brand-primary hover:bg-brand-hover-medium text-white text-xs font-bold transition-all shadow-2xs inline-flex items-center gap-1"
                    >
                      <svg className="w-3.5 h-3.5 text-[#BFE8FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>تحميل</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
