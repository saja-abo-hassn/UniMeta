import { ScopeFilterType } from "../types";

interface ProjectsFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  majorFilter: string;
  onMajorFilterChange: (val: string) => void;
  scopeFilter: ScopeFilterType;
  onScopeFilterChange: (val: ScopeFilterType) => void;
  matchingCount: number;
}

export function ProjectsFilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  majorFilter,
  onMajorFilterChange,
  scopeFilter,
  onScopeFilterChange,
  matchingCount,
}: ProjectsFilterBarProps) {
  return (
    <section className="p-5 rounded-3xl bg-white border border-brand-border-soft shadow-xs space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث باسم المشروع، المشرف، التقنية (مثل: IoT, AI, Flutter)..."
            className="w-full ps-11 pe-4 py-2.5 rounded-2xl border border-brand-border-soft focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 text-xs sm:text-sm font-semibold outline-hidden transition-all bg-brand-surface-muted"
          />
          <span className="absolute start-3.5 top-3 text-brand-muted">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="px-3 py-2 rounded-xl border border-brand-border-soft font-semibold text-brand-ink bg-brand-surface-muted outline-hidden"
          >
            <option value="all">كافة الحالات</option>
            <option value="يبحث عن شركاء">يبحث عن شركاء</option>
            <option value="مكتمل الفريق">مكتمل الفريق</option>
          </select>

          <select
            value={majorFilter}
            onChange={(e) => onMajorFilterChange(e.target.value)}
            className="px-3 py-2 rounded-xl border border-brand-border-soft font-semibold text-brand-ink bg-brand-surface-muted outline-hidden"
          >
            <option value="all">كافة التخصصات</option>
            <option value="هندسة البرمجيات">هندسة البرمجيات</option>
            <option value="هندسة أنظمة الحاسوب">هندسة الحاسوب</option>
            <option value="علوم الحاسوب">علوم الحاسوب</option>
            <option value="علم البيانات والذكاء الاصطناعي">الذكاء الاصطناعي</option>
          </select>
        </div>
      </div>

      <div className="pt-3 border-t border-brand-border-soft flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xs text-brand-ink">المرحلة الأكاديمية:</span>
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-[#F4FAFF] border border-brand-border-soft text-xs font-bold">
            {(["all", "مشروع 1", "مشروع 2", "مشروع 1 و 2"] as const).map((scope) => (
              <button
                key={scope}
                type="button"
                onClick={() => onScopeFilterChange(scope)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  scopeFilter === scope
                    ? "bg-brand-primary text-white shadow-xs"
                    : "text-brand-ink hover:bg-white hover:text-brand-primary"
                }`}
              >
                {scope === "all" ? "كافة المراحل (الكل)" : scope}
              </button>
            ))}
          </div>
        </div>
        <span className="text-xs text-brand-muted font-medium">
          المشاريع المطابقة: <strong className="text-brand-primary">{matchingCount}</strong>
        </span>
      </div>
    </section>
  );
}

