import { GpaSemesterData } from "../types";

interface SemesterCoursesTableProps {
  yearNumber: number;
  semester: GpaSemesterData;
  semesterCalc: { hours: number; points: number; gpa: number };
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

export function SemesterCoursesTable({
  yearNumber,
  semester,
  semesterCalc,
  onAddCourse,
  onRemoveCourse,
  onUpdateCourse,
}: SemesterCoursesTableProps) {
  return (
    <div className="rounded-2xl border border-brand-border-soft bg-brand-surface-muted/60 p-4 sm:p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-brand-border-soft">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${semester.isSummer ? "bg-brand-secondary" : "bg-brand-primary"}`} />
          <h3 className="font-extrabold text-sm sm:text-base text-brand-ink">
            {semester.name}
          </h3>
          {semester.isSummer && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-surface-blue text-brand-primary border border-brand-border-soft">
              صيفي
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-brand-ink bg-white px-3 py-1.5 rounded-xl border border-brand-border-soft">
            <span className="text-brand-muted">معدل الفصل: </span>
            <strong className="text-brand-primary font-bold" dir="ltr">
              {semesterCalc.gpa > 0 ? `${semesterCalc.gpa.toFixed(2)}%` : "-"}
            </strong>
            <span className="text-brand-muted text-[10px] ms-1">({semesterCalc.hours} س)</span>
          </div>

          <button
            type="button"
            onClick={() => onAddCourse(yearNumber, semester.id)}
            className="px-3 py-1.5 rounded-xl bg-white text-brand-primary border border-brand-border-soft hover:border-brand-secondary text-xs font-bold transition-colors"
          >
            + إضافة مادة
          </button>
        </div>
      </div>

      {semester.courses.length === 0 ? (
        <div className="p-4 text-center rounded-xl bg-white border border-dashed border-brand-border-soft text-xs text-brand-muted">
          لا توجد مواد مضافة لهذا الفصل. اضغط على "+ إضافة مادة" لإدراج مساق جديد.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-brand-border-soft bg-white">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="bg-brand-surface-muted border-b border-brand-border-soft text-brand-muted font-semibold">
                <th className="py-2.5 px-3 text-start">رمز المادة</th>
                <th className="py-2.5 px-3 text-start">اسم المساق</th>
                <th className="py-2.5 px-3 text-start w-24">الساعات</th>
                <th className="py-2.5 px-3 text-start w-28">العلامة (من 100)</th>
                <th className="py-2.5 px-3 text-start">النقاط</th>
                <th className="py-2.5 px-3 text-start w-16">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border-soft/50">
              {semester.courses.map((course) => {
                const hasGrade = typeof course.grade === "number";
                const points = hasGrade ? (course.grade as number) * course.credits : 0;

                return (
                  <tr key={course.id} className="hover:bg-brand-surface-muted transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-brand-primary" dir="ltr">
                      {course.code || "-"}
                    </td>

                    <td className="py-2.5 px-3 font-semibold text-brand-ink">
                      <input
                        type="text"
                        value={course.name}
                        onChange={(e) =>
                          onUpdateCourse(
                            yearNumber,
                            semester.id,
                            course.id,
                            "name",
                            e.target.value
                          )
                        }
                        className="w-full max-w-sm px-2 py-1 rounded-lg border border-transparent hover:border-brand-border-soft focus:border-brand-secondary focus:bg-white text-xs font-semibold text-brand-ink bg-transparent"
                      />
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={course.credits}
                          onChange={(e) =>
                            onUpdateCourse(
                              yearNumber,
                              semester.id,
                              course.id,
                              "credits",
                              e.target.value
                            )
                          }
                          className="w-14 h-8 px-2 text-center rounded-lg border border-brand-border-soft font-bold text-xs text-brand-ink bg-white focus:outline-none focus:border-brand-secondary"
                        />
                        <span className="text-[10px] text-brand-muted">س</span>
                      </div>
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.5"
                          placeholder="-"
                          value={course.grade}
                          onChange={(e) =>
                            onUpdateCourse(
                              yearNumber,
                              semester.id,
                              course.id,
                              "grade",
                              e.target.value
                            )
                          }
                          className="w-16 h-8 px-2 text-center rounded-lg border border-brand-border-soft font-bold text-xs text-brand-primary bg-white focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary"
                        />
                        <span className="text-[11px] text-brand-muted">%</span>
                      </div>
                    </td>

                    <td className="py-2.5 px-3 font-mono font-bold text-xs text-brand-ink" dir="ltr">
                      {hasGrade ? points.toFixed(1) : "-"}
                    </td>

                    <td className="py-2.5 px-3">
                      <button
                        type="button"
                        onClick={() =>
                          onRemoveCourse(yearNumber, semester.id, course.id)
                        }
                        className="text-xs text-red-500 hover:text-red-700 font-bold p-1 rounded hover:bg-red-50 transition-colors"
                        title="حذف المساق"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

