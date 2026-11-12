import Link from "next/link";
import { GraduationProject } from "@/src/data/graduation-projects-data";
import { AppliedProjectInfo } from "../types";

interface ProjectsGridProps {
  projects: GraduationProject[];
  appliedProjects: Record<string, AppliedProjectInfo>;
  onResetFilters: () => void;
  onApplyToProject: (p: GraduationProject) => void;
}

export function ProjectsGrid({
  projects,
  appliedProjects,
  onResetFilters,
  onApplyToProject,
}: ProjectsGridProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between text-xs text-[#66788A] px-1 font-semibold">
        <span>نتائج مشاريع التخرج ({projects.length})</span>
        <span>تحديث مباشر من عمادة كلية الهندسة وتكنولوجيا المعلومات</span>
      </div>

      {projects.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#D7EAF7] shadow-xs space-y-3">
          <h3 className="font-bold text-base text-[#16324A]">لا توجد مشاريع تطابق خيارات البحث</h3>
          <p className="text-xs text-[#66788A]">جرب تغيير كلمات البحث أو إعادة تعيين الفلاتر.</p>
          <button
            type="button"
            onClick={onResetFilters}
            className="px-4 py-2 rounded-xl bg-[#0057C8] text-white text-xs font-bold"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
          {projects.map((p) => {
            const isLookingForMembers = p.status === "يبحث عن شركاء";
            return (
              <div
                key={p.id}
                className="card-hover-effect rounded-3xl bg-white border border-[#D7EAF7] hover:border-[#0057C8] shadow-xs p-6 sm:p-7 flex flex-col justify-between gap-5 transition-all h-full"
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-xs px-3 py-1 rounded-full bg-[#EAF4FD] text-[#0057C8] border border-[#D7EAF7]">
                        {p.major}
                      </span>
                      <span className="font-bold text-xs px-2.5 py-1 rounded-full bg-[#F4FAFF] text-[#2D78B7] border border-[#D7EAF7]">
                        {p.projectScope}
                      </span>
                      <span className="text-xs text-[#66788A] font-medium">
                        {p.stage}
                      </span>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                        isLookingForMembers
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-emerald-50 text-emerald-800 border-emerald-200"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>

                  <div>
                    <Link
                      href={`/student/projects/${p.id}`}
                      className="font-extrabold text-lg sm:text-xl text-[#16324A] hover:text-[#0057C8] transition-colors leading-snug block line-clamp-2 min-h-[3.25rem]"
                    >
                      {p.title}
                    </Link>
                    <p className="text-xs sm:text-sm text-[#66788A] mt-2 leading-relaxed line-clamp-2">
                      {p.summary}
                    </p>
                  </div>

                  {isLookingForMembers && p.neededRoles.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-[#FFF9F2] border border-amber-200 flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 text-amber-900 font-semibold">
                        <span>📢</span>
                        <span>مطلوب للفريق: <strong>{p.neededRoles.join("، ")}</strong></span>
                      </div>
                      <span className="text-[11px] font-black text-amber-700 shrink-0">
                        ({p.neededCount} مقاعد شاغرة)
                      </span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {p.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] font-medium px-2.5 py-0.5 rounded-lg bg-[#F8FBFE] text-[#16324A] border border-[#D7EAF7]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[#D7EAF7]/60 flex flex-wrap items-center justify-between gap-3 text-xs text-[#66788A]">
                    <div className="flex items-center gap-2">
                      <span>المشرف الأكاديمي:</span>
                      <span className="font-bold text-[#16324A]">{p.supervisor}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span>الأعضاء:</span>
                      <div className="flex items-center -space-x-1.5 rtl:space-x-reverse">
                        {p.members.map((m, i) => (
                          <div
                            key={i}
                            title={`${m.name} (${m.role})`}
                            className="w-7 h-7 rounded-full bg-[#0057C8] text-white flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-2xs"
                          >
                            {m.initials}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#D7EAF7] flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5">
                  <Link
                    href={`/student/projects/${p.id}`}
                    className="px-4 py-2.5 rounded-xl border border-[#D7EAF7] hover:border-[#0057C8] hover:bg-[#F0F7FD] text-[#0057C8] text-xs font-bold transition-all text-center flex-1 sm:flex-none"
                  >
                    عرض تفاصيل المشروع الكاملة &larr;
                  </Link>

                  {appliedProjects[p.id] ? (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                      <span>✓ قيد المراجعة ({appliedProjects[p.id].stage})</span>
                    </span>
                  ) : isLookingForMembers ? (
                    <button
                      type="button"
                      onClick={() => onApplyToProject(p)}
                      className="px-5 py-2.5 rounded-xl bg-[#0057C8] hover:bg-[#2D78B7] text-white text-xs font-bold transition-all shadow-xs text-center flex-1 sm:flex-none"
                    >
                      طلب انضمام للفريق 🤝
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

