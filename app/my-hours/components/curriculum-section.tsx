import React from "react";
import { Course, StudyPlan } from "@/src/data/study-plans-data";
import { CourseOverride } from "@/src/contexts/academic-stats-context";
import { EditingCourseState, YearGroup, CategoryGroup } from "../types";
import { CoursesTable } from "./courses-table";

interface CurriculumSectionProps {
  selectedPlan: StudyPlan;
  allCourses: Course[];
  customCourses: Course[];
  courseGrades: Record<string, number>;
  courseOverrides: Record<string, CourseOverride>;
  toggleCourseCompletion: (code: string, isCompleted?: boolean) => void;
  removeCustomCourse: (code: string) => void;
  resetAllStats: () => void;
  groupBy: "semester" | "category";
  setGroupBy: (mode: "semester" | "category") => void;
  filterMode: "all" | "completed" | "remaining";
  setFilterMode: (mode: "all" | "completed" | "remaining") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  yearGroups: YearGroup[];
  categoryGroups: CategoryGroup[];
  setIsAddModalOpen: (open: boolean) => void;
  setEditingCourse: (course: EditingCourseState) => void;
}

export function CurriculumSection({
  selectedPlan,
  allCourses,
  customCourses,
  courseGrades,
  courseOverrides,
  toggleCourseCompletion,
  removeCustomCourse,
  resetAllStats,
  groupBy,
  setGroupBy,
  filterMode,
  setFilterMode,
  searchQuery,
  setSearchQuery,
  yearGroups,
  categoryGroups,
  setIsAddModalOpen,
  setEditingCourse,
}: CurriculumSectionProps) {
  return (
    <section className="p-6 sm:p-7 rounded-3xl bg-white border border-[#D7EAF7] shadow-xs space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#D7EAF7]">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-[#16324A]">
            قائمة مواد الخطة الدراسية ({selectedPlan.major})
          </h2>
          <p className="text-xs text-[#66788A] mt-0.5">
            يمكنك تعليم المواد كمنجزة، أو تعديل علامتها وساعاتها، أو إضافة مواد جديدة لحساب معدلك وساعاتك تلقائياً.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-[#0057C8] hover:bg-[#2D78B7] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <span>+ إضافة مساق جديد</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm("هل تريد استعادة الحالة الافتراضية للخطة (21 ساعة منجزة بمعدل 87.29)؟")) {
                resetAllStats();
              }
            }}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-[#66788A] hover:text-[#16324A] border border-[#D7EAF7] text-xs font-semibold transition-all"
            title="استعادة الساعات والعلامات الافتراضية"
          >
            <span>🔄 استعادة الافتراضي</span>
          </button>

          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#F4FAFF] border border-[#D7EAF7] text-xs font-bold">
            <button
              type="button"
              onClick={() => setGroupBy("semester")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                groupBy === "semester" ? "bg-white text-[#0057C8] shadow-xs" : "text-[#66788A] hover:text-[#16324A]"
              }`}
            >
              حسب الفصول
            </button>
            <button
              type="button"
              onClick={() => setGroupBy("category")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                groupBy === "category" ? "bg-white text-[#0057C8] shadow-xs" : "text-[#66788A] hover:text-[#16324A]"
              }`}
            >
              حسب التصنيف
            </button>
          </div>

          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#F4FAFF] border border-[#D7EAF7] text-xs font-bold">
            <button
              type="button"
              onClick={() => setFilterMode("all")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterMode === "all" ? "bg-white text-[#0057C8] shadow-xs" : "text-[#66788A] hover:text-[#16324A]"
              }`}
            >
              الكل ({allCourses.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("completed")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterMode === "completed" ? "bg-white text-[#0057C8] shadow-xs" : "text-[#66788A] hover:text-[#16324A]"
              }`}
            >
              المنجزة فقط
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("remaining")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterMode === "remaining" ? "bg-white text-[#0057C8] shadow-xs" : "text-[#66788A] hover:text-[#16324A]"
              }`}
            >
              المتبقية فقط
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        <span className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-[#66788A]">
          🔍
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث برمز أو اسم المادة (مثال: ITCS1401 أو برمجة أو تفاضل)..."
          className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-[#D7EAF7] bg-[#F8FBFE] text-xs sm:text-sm font-semibold text-[#16324A] focus:outline-none focus:border-[#4DB7F2] focus:bg-white"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 end-0 pe-3.5 text-xs text-[#66788A] hover:text-[#16324A]"
          >
            مسح ✕
          </button>
        )}
      </div>

      <div className="space-y-6">
        {groupBy === "semester" ? (
          yearGroups.length === 0 ? (
            <div className="p-10 text-center rounded-2xl bg-[#F8FBFE] border border-[#D7EAF7] text-xs text-[#66788A]">
              لا توجد مواد مطابقة لخيارات البحث أو الفلترة.
            </div>
          ) : (
            yearGroups.map((year) => (
              <section
                key={year.yearNumber}
                className="p-5 sm:p-6 rounded-3xl bg-[#F8FBFE]/70 border border-[#D7EAF7] shadow-xs space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D7EAF7]">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-[#0057C8] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                      {year.yearNumber}
                    </span>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-[#16324A]">
                        {year.yearTitle}
                      </h3>
                      <span className="text-xs text-[#66788A]">
                        ساعات السنة: {year.totalCredits} س (المنجز: {year.completedCredits} س)
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-bold px-3 py-1 rounded-xl bg-white text-[#0057C8] border border-[#D7EAF7] self-start sm:self-auto">
                    {year.semesters.length} فصول دراسية
                  </span>
                </div>

                <div className="space-y-5">
                  {year.semesters.map((sem) => (
                    <div key={sem.id} className="space-y-2.5">
                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#0057C8]" />
                          <h4 className="font-extrabold text-sm sm:text-base text-[#16324A]">
                            {year.yearTitle} - {sem.title}
                          </h4>
                        </div>
                        <span className="text-xs font-semibold text-[#0057C8] bg-white px-2.5 py-0.5 rounded-lg border border-[#D7EAF7]">
                          {sem.subtitle}
                        </span>
                      </div>

                      <CoursesTable
                        courses={sem.courses}
                        courseGrades={courseGrades}
                        courseOverrides={courseOverrides}
                        customCourses={customCourses}
                        toggleCourseCompletion={toggleCourseCompletion}
                        removeCustomCourse={removeCustomCourse}
                        setEditingCourse={setEditingCourse}
                      />
                    </div>
                  ))}
                </div>
              </section>
            ))
          )
        ) : categoryGroups.length === 0 ? (
          <div className="p-10 text-center rounded-2xl bg-[#F8FBFE] border border-[#D7EAF7] text-xs text-[#66788A]">
            لا توجد مواد مطابقة لخيارات البحث أو الفلترة.
          </div>
        ) : (
          categoryGroups.map((group) => (
            <div key={group.key} className="space-y-3">
              <div className="flex items-center justify-between pb-1 px-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0057C8]" />
                  <h3 className="font-extrabold text-sm sm:text-base text-[#16324A]">
                    {group.title}
                  </h3>
                </div>
                <span className="text-xs font-semibold text-[#0057C8] bg-[#F0F7FD] px-2.5 py-0.5 rounded-lg border border-[#D7EAF7]">
                  {group.subtitle}
                </span>
              </div>

              <CoursesTable
                courses={group.courses}
                courseGrades={courseGrades}
                courseOverrides={courseOverrides}
                customCourses={customCourses}
                toggleCourseCompletion={toggleCourseCompletion}
                removeCustomCourse={removeCustomCourse}
                setEditingCourse={setEditingCourse}
              />
            </div>
          ))
        )}
      </div>
    </section>
  );
}

