interface ProjectsHeaderProps {
  onOpenNewProjectModal: () => void;
}

export function ProjectsHeader({ onOpenNewProjectModal }: ProjectsHeaderProps) {
  return (
    <section className="card-entrance p-6 sm:p-7 rounded-3xl bg-white border border-brand-border-soft shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div>
        <div className="flex flex-col mb-1">
          <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
            Graduation Projects & Teams
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-ink mt-0.5">
            مشاريع التخرج والفرق الطلابية
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-brand-muted leading-relaxed max-w-2xl">
          استكشف أفكار ومشاريع التخرج المعتمدة لجامعة الأزهر، ابحث عن شركاء لتشكيل فريقك، أو قدم مقترح مشروع تخرج جديد للاعتماد الأكاديمي.
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onOpenNewProjectModal}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-primary hover:bg-brand-hover-medium text-white text-xs sm:text-sm font-bold transition-all shadow-md group"
        >
          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-sm group-hover:rotate-90 transition-transform">
            +
          </span>
          <span>تقديم مقترح مشروع تخرج</span>
        </button>
      </div>
    </section>
  );
}

