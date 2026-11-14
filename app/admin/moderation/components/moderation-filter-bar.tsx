interface ModerationFilterBarProps {
  activeTab: "all" | "مفتوح" | "قيد المعالجة" | "مغلق";
  onTabChange: (tab: "all" | "مفتوح" | "قيد المعالجة" | "مغلق") => void;
  targetTypeFilter: string;
  onTargetTypeFilterChange: (type: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  counts: {
    total: number;
    open: number;
    inProgress: number;
    closed: number;
  };
}

export function ModerationFilterBar({
  activeTab,
  onTabChange,
  targetTypeFilter,
  onTargetTypeFilterChange,
  searchQuery,
  onSearchChange,
  counts,
}: ModerationFilterBarProps) {
  return (
    <section className="p-4 sm:p-5 rounded-2xl bg-white border border-brand-border-soft shadow-xs space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-brand-surface-muted border border-brand-border-soft text-xs font-bold">
          <button
            type="button"
            onClick={() => onTabChange("all")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "all" ? "bg-white text-brand-primary shadow-xs" : "text-brand-muted hover:text-brand-ink"
            }`}
          >
            جميع البلاغات ({counts.total})
          </button>
          <button
            type="button"
            onClick={() => onTabChange("مفتوح")}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "مفتوح" ? "bg-white text-red-700 shadow-xs font-bold" : "text-brand-muted hover:text-brand-ink"
            }`}
          >
            <span>مفتوح</span>
            {counts.open > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-100 text-red-800">
                {counts.open}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => onTabChange("قيد المعالجة")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "قيد المعالجة" ? "bg-white text-amber-700 shadow-xs" : "text-brand-muted hover:text-brand-ink"
            }`}
          >
            قيد المعالجة ({counts.inProgress})
          </button>
          <button
            type="button"
            onClick={() => onTabChange("مغلق")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "مغلق" ? "bg-white text-emerald-700 shadow-xs" : "text-brand-muted hover:text-brand-ink"
            }`}
          >
            المغلقة ({counts.closed})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-brand-muted font-semibold">نوع الهدف:</span>
          <select
            value={targetTypeFilter}
            onChange={(e) => onTargetTypeFilterChange(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-brand-border-soft bg-brand-surface-muted text-xs font-bold text-brand-ink focus:outline-none focus:border-brand-primary"
          >
            <option value="all">جميع الأنواع</option>
            <option value="محتوى">محتوى تعليمي</option>
            <option value="تعليق">تعليق / منتدى</option>
            <option value="اتفاقية">اتفاقية عهدة</option>
            <option value="مستخدم">حساب طالب</option>
          </select>
        </div>
      </div>

      <div className="relative">
        <span className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-brand-muted">
          🔍
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="ابحث برقم البلاغ، مقدم البلاغ، موضوع المخالفة أو السبب..."
          className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-brand-border-soft bg-brand-surface-muted text-xs sm:text-sm font-semibold text-brand-ink focus:outline-none focus:border-brand-primary focus:bg-white"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute inset-y-0 end-0 pe-3.5 text-xs text-brand-muted hover:text-brand-ink"
          >
            مسح ✕
          </button>
        )}
      </div>
    </section>
  );
}

