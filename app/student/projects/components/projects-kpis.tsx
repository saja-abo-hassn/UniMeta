import { GraduationProject } from "@/src/data/graduation-projects-data";

interface ProjectsKPIsProps {
  projects: GraduationProject[];
}

export function ProjectsKPIs({ projects }: ProjectsKPIsProps) {
  const lookingForPartnersCount = projects.filter((p) => p.status === "يبحث عن شركاء").length;
  const completedTeamCount = projects.filter((p) => p.status === "مكتمل الفريق").length;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="card-hover-effect p-5 rounded-2xl bg-white border border-brand-border-soft shadow-xs">
        <span className="text-xs font-semibold text-brand-muted block mb-1">المشاريع المسجلة</span>
        <div className="text-2xl sm:text-3xl font-black text-brand-ink">{projects.length} مشاريع</div>
        <span className="text-[11px] text-brand-primary font-bold mt-1 block">الفصل الثاني 2025/2026</span>
      </div>

      <div className="card-hover-effect p-5 rounded-2xl bg-white border border-[#BEE3F8] shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-brand-primary">أفرقة تبحث عن شركاء</span>
          <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
        </div>
        <div className="text-2xl sm:text-3xl font-black text-brand-primary">
          {lookingForPartnersCount} فريق
        </div>
        <span className="text-[11px] text-brand-hover-medium mt-1 block">مقاعد شاغرة لمطورين وباحثين</span>
      </div>

      <div className="card-hover-effect p-5 rounded-2xl bg-white border border-brand-border-soft shadow-xs">
        <span className="text-xs font-semibold text-brand-muted block mb-1">أفرقة مكتملة</span>
        <div className="text-2xl sm:text-3xl font-black text-emerald-700">
          {completedTeamCount} فريق
        </div>
        <span className="text-[11px] text-emerald-600 mt-1 block">في مرحلة التطوير والاختبار</span>
      </div>

      <div className="card-hover-effect p-5 rounded-2xl bg-white border border-brand-border-soft shadow-xs">
        <span className="text-xs font-semibold text-brand-muted block mb-1">موعد التسليم النهائي</span>
        <div className="text-xl sm:text-2xl font-black text-brand-ink">30 مايو 2026</div>
        <span className="text-[11px] text-brand-muted mt-1 block">لجان المناقشة والتحكيم</span>
      </div>
    </section>
  );
}

