import React from "react";
import { LibraryCategory, LibraryCourse } from "../types";

interface CoursesGridProps {
  courses: LibraryCourse[];
  filteredCourses: LibraryCourse[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedLevel: string;
  setSelectedLevel: (level: string) => void;
  onOpenCourse: (course: LibraryCourse) => void;
  getCategoryCount: (course: LibraryCourse, cat: LibraryCategory) => number;
}

export function CoursesGrid({
  courses,
  filteredCourses,
  searchQuery,
  setSearchQuery,
  selectedLevel,
  setSelectedLevel,
  onOpenCourse,
  getCategoryCount,
}: CoursesGridProps) {
  return (
    <section className="space-y-6">
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-brand-border-soft shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم المادة، رمز المساق (مثل: ENCS3310)، أو اسم الدكتور..."
            className="w-full ps-11 pe-4 py-2.5 rounded-2xl border border-brand-border-soft focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 text-xs sm:text-sm font-semibold outline-hidden transition-all bg-brand-surface-muted"
          />
          <span className="absolute start-3.5 top-3 text-brand-muted">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute end-3 top-2.5 text-brand-muted hover:text-brand-ink text-xs"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 bg-[#F4FAFF] p-1 rounded-2xl border border-brand-border-soft text-xs shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setSelectedLevel("all")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
              selectedLevel === "all" ? "bg-brand-primary text-white shadow-xs" : "text-brand-muted hover:bg-white"
            }`}
          >
            كافة المستويات ({courses.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedLevel("السنة الثالثة")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
              selectedLevel === "السنة الثالثة" ? "bg-brand-primary text-white shadow-xs" : "text-brand-muted hover:bg-white"
            }`}
          >
            السنة الثالثة
          </button>
          <button
            type="button"
            onClick={() => setSelectedLevel("السنة الثانية")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
              selectedLevel === "السنة الثانية" ? "bg-brand-primary text-white shadow-xs" : "text-brand-muted hover:bg-white"
            }`}
          >
            السنة الثانية
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-brand-muted px-1 font-semibold">
          <span>المساقات الدراسية المتوفرة في المكتبة ({filteredCourses.length})</span>
          <span>اختر مادة لاستعراض تصنيفاتها الكاملة</span>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-brand-border-soft shadow-xs space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-surface-blue text-brand-primary flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="font-bold text-base text-brand-ink">لم يتم العثور على مادة تطابق بحثك</h3>
            <p className="text-xs text-brand-muted max-w-md mx-auto">
              تأكد من كتابة رمز المساق بدقة (مثل ENCS3310) أو جزء من اسم المادة أو المدرس.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedLevel("all");
              }}
              className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold"
            >
              عرض كافة المواد
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            {filteredCourses.map((c) => {
              const bCount = getCategoryCount(c, "books");
              const sCount = getCategoryCount(c, "summaries");
              const eCount = getCategoryCount(c, "exams");
              const oCount = getCategoryCount(c, "other");

              return (
                <div
                  key={c.code}
                  onClick={() => onOpenCourse(c)}
                  className="card-hover-effect p-6 rounded-3xl bg-white border border-brand-border-soft hover:border-brand-primary shadow-xs cursor-pointer flex flex-col justify-between gap-4 transition-all group h-full"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-brand-primary bg-brand-surface-blue px-2.5 py-1 rounded-lg border border-brand-border-soft" dir="ltr">
                        {c.code}
                      </span>
                      <span className="text-[11px] font-semibold text-brand-muted">
                        {c.level}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-base text-brand-ink group-hover:text-brand-primary transition-colors leading-snug line-clamp-2 min-h-[2.75rem]">
                        {c.nameAr}
                      </h3>
                      <span className="text-xs text-brand-muted block mt-0.5 line-clamp-1" dir="ltr">
                        {c.nameEn}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-brand-muted">
                      <svg className="w-4 h-4 text-brand-hover-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{c.instructor}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-brand-border-soft/70 space-y-3">
                    <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
                      <div className="p-1.5 rounded-xl bg-brand-surface-muted border border-brand-border-soft">
                        <span className="text-brand-muted block">كتب</span>
                        <span className="font-black text-brand-primary">{bCount}</span>
                      </div>
                      <div className="p-1.5 rounded-xl bg-brand-surface-muted border border-brand-border-soft">
                        <span className="text-brand-muted block">ملخصات</span>
                        <span className="font-black text-brand-primary">{sCount}</span>
                      </div>
                      <div className="p-1.5 rounded-xl bg-brand-surface-muted border border-brand-border-soft">
                        <span className="text-brand-muted block">امتحانات</span>
                        <span className="font-black text-brand-primary">{eCount}</span>
                      </div>
                      <div className="p-1.5 rounded-xl bg-brand-surface-muted border border-brand-border-soft">
                        <span className="text-brand-muted block">وسائط</span>
                        <span className="font-black text-brand-primary">{oCount}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs font-bold text-brand-primary group-hover:translate-x-1 transition-transform">
                      <span>دخول مساحة المادة وتصفح الملفات</span>
                      <span className="rtl:rotate-180">&larr;</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
