import { GpaYearData } from "../types";
import { SemesterCoursesTable } from "./semester-courses-table";

interface AcademicYearCardProps {
  year: GpaYearData;
  yearCalc: { hours: number; points: number; gpa: number };
  semesterCalculations: Record<string, { hours: number; points: number; gpa: number }>;
  onToggleSummer: (yearNumber: number) => void;
  onAddCourse: (yearNumber: number, semesterId: string) => void;
  onRemoveCourse: (yearNumber: number, semesterId: string, courseId: string) => void;
  onUpdateCourse: (
    yearNumber: number,
    semesterId: string,
    courseId: string,
    field: "name" | "credits" | "grade",
    value: string | number
  ) => void;
}

export function AcademicYearCard({
  year,
  yearCalc,
  semesterCalculations,
  onToggleSummer,
  onAddCourse,
  onRemoveCourse,
  onUpdateCourse,
}: AcademicYearCardProps) {
  return (
    <section className="p-6 sm:p-7 rounded-3xl bg-white border border-[#D7EAF7] shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D7EAF7]">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl bg-[#0057C8] text-white flex items-center justify-center font-bold text-sm shrink-0">
            {year.yearNumber}
          </span>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#16324A]">
              {year.yearTitle}
            </h2>
            <span className="text-xs text-[#66788A]">
              {year.semesters.length} فصول دراسية (تشمل {year.hasSummer ? "الفصل الصيفي" : "الفصلين الأول والثاني"})
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-[#F4FAFF] border border-[#D7EAF7] text-xs flex items-center gap-2">
            <span className="text-[#66788A] font-semibold">معدل {year.yearTitle}:</span>
            <strong className="text-[#0057C8] font-bold text-sm" dir="ltr">
              {yearCalc.gpa > 0 ? `${yearCalc.gpa.toFixed(2)}%` : "-"}
            </strong>
            <span className="text-[#66788A] text-[10px]">({yearCalc.hours} س)</span>
          </div>

          <button
            type="button"
            onClick={() => onToggleSummer(year.yearNumber)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              year.hasSummer
                ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                : "bg-white text-[#0057C8] border-[#0057C8] hover:bg-[#EAF4FD]"
            }`}
          >
            {year.hasSummer ? "✕ حذف الفصل الصيفي" : "+ إضافة فصل صيفي"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {year.semesters.map((sem) => (
          <SemesterCoursesTable
            key={sem.id}
            yearNumber={year.yearNumber}
            semester={sem}
            semesterCalc={semesterCalculations[sem.id] || { hours: 0, points: 0, gpa: 0 }}
            onAddCourse={onAddCourse}
            onRemoveCourse={onRemoveCourse}
            onUpdateCourse={onUpdateCourse}
          />
        ))}
      </div>
    </section>
  );
}

