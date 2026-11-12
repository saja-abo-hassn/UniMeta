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
    <section className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D7EAF7] shadow-xs space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#F8FBFE] border border-[#D7EAF7] text-xs font-bold">
          <button
            type="button"
            onClick={() => onTabChange("all")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "all" ? "bg-white text-[#0057C8] shadow-xs" : "text-[#66788A] hover:text-[#16324A]"
            }`}
          >
            جميع البلاغات ({counts.total})
          </button>
          <button
            type="button"
            onClick={() => onTabChange("مفتوح")}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "مفتوح" ? "bg-white text-red-700 shadow-xs font-bold" : "text-[#66788A] hover:text-[#16324A]"
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
              activeTab === "قيد المعالجة" ? "bg-white text-amber-700 shadow-xs" : "text-[#66788A] hover:text-[#16324A]"
            }`}
          >
            قيد المعالجة ({counts.inProgress})
          </button>
          <button
            type="button"
            onClick={() => onTabChange("مغلق")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "مغلق" ? "bg-white text-emerald-700 shadow-xs" : "text-[#66788A] hover:text-[#16324A]"
            }`}
          >
            المغلقة ({counts.closed})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#66788A] font-semibold">نوع الهدف:</span>
          <select
            value={targetTypeFilter}
            onChange={(e) => onTargetTypeFilterChange(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-[#D7EAF7] bg-[#F8FBFE] text-xs font-bold text-[#16324A] focus:outline-none focus:border-[#0057C8]"
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
        <span className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-[#66788A]">
          🔍
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="ابحث برقم البلاغ، مقدم البلاغ، موضوع المخالفة أو السبب..."
          className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-[#D7EAF7] bg-[#F8FBFE] text-xs sm:text-sm font-semibold text-[#16324A] focus:outline-none focus:border-[#0057C8] focus:bg-white"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute inset-y-0 end-0 pe-3.5 text-xs text-[#66788A] hover:text-[#16324A]"
          >
            مسح ✕
          </button>
        )}
      </div>
    </section>
  );
}

