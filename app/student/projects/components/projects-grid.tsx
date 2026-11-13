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
      <div className="flex items-center justify-between text-xs text-brand-muted px-1 font-semibold">
        <span>نتائج مشاريع التخرج ({projects.length})</span>
        <span>تحديث مباشر من عمادة كلية الهندسة وتكنولوجيا المعلومات</span>
      </div>

      {projects.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-brand-border-soft shadow-xs space-y-3">
          <h3 className="font-bold text-base text-brand-ink">لا توجد مشاريع تطابق خيارات البحث</h3>
          <p className="text-xs text-brand-muted">جرب تغيير كلمات البحث أو إعادة تعيين الفلاتر.</p>
          <button
            type="button"
            onClick={onResetFilters}
            className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold"
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
                className="card-hover-effect rounded-3xl bg-white border border-brand-border-soft hover:border-brand-primary shadow-xs p-6 sm:p-7 flex flex-col justify-between gap-5 transition-all h-full"
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-xs px-3 py-1 rounded-full bg-brand-surface-blue text-brand-primary border border-brand-border-soft">
                        {p.major}
                      </span>
                      <span className="font-bold text-xs px-2.5 py-1 rounded-full bg-[#F4FAFF] text-brand-hover-medium border border-brand-border-soft">
                        {p.projectScope}
                      </span>
                      <span className="text-xs text-brand-muted font-medium">
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
                      className="font-extrabold text-lg sm:text-xl text-brand-ink hover:text-brand-primary transition-colors leading-snug block line-clamp-2 min-h-[3.25rem]"
                    >
                      {p.title}
                    </Link>
                    <p className="text-xs sm:text-sm text-brand-muted mt-2 leading-relaxed line-clamp-2">
                      {p.summary}
                    </p>
                  </div>

                  {isLookingForMembers && p.neededRoles.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-[#FFF9F2] border border-brand-border-soft flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 text-amber-900 font-semibold">
                        <span>📢</span>
                        <span>مطلوب للفريق: <strong>{p.neededRoles.join("، ")}</strong></span>
                      </div>
                      <span className="text-[11px] font-black text-brand-primary shrink-0">
                        ({p.neededCount} مقاعد شاغرة)
                      </span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {p.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] font-medium px-2.5 py-0.5 rounded-lg bg-brand-surface-muted text-brand-ink border border-brand-border-soft"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-brand-border-soft/60 flex flex-wrap items-center justify-between gap-3 text-xs text-brand-muted">
                    <div className="flex items-center gap-2">
                      <span>المشرف الأكاديمي:</span>
                      <span className="font-bold text-brand-ink">{p.supervisor}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span>الأعضاء:</span>
                      <div className="flex items-center -space-x-1.5 rtl:space-x-reverse">
                        {p.members.map((m, i) => (
                          <div
                            key={i}
                            title={`${m.name} (${m.role})`}
                            className="w-7 h-7 rounded-full bg-brand-primary text-white flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-2xs"
                          >
                            {m.initials}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-brand-border-soft flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5">
                  <Link
                    href={`/student/projects/${p.id}`}
                    className="px-4 py-2.5 rounded-xl border border-brand-border-soft hover:border-brand-primary hover:bg-brand-surface-soft text-brand-primary text-xs font-bold transition-all text-center flex-1 sm:flex-none"
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
                      className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-hover-medium text-white text-xs font-bold transition-all shadow-xs text-center flex-1 sm:flex-none"
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

