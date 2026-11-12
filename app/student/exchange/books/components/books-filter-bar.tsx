import { BookListingType } from "../types";

interface BooksFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  typeFilter: "all" | BookListingType;
  onTypeFilterChange: (type: "all" | BookListingType) => void;
  conditionFilter: string;
  onConditionFilterChange: (cond: string) => void;
}

export function BooksFilterBar({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  conditionFilter,
  onConditionFilterChange,
}: BooksFilterBarProps) {
  return (
    <section className="p-4 sm:p-5 rounded-3xl bg-white border border-[#D7EAF7] shadow-xs space-y-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث باسم المرجع، رمز المساق (مثل ENCS3310)، المؤلف، أو المالك..."
            className="w-full ps-11 pe-4 py-2.5 rounded-2xl border border-[#D7EAF7] focus:border-[#0057C8] text-xs sm:text-sm font-semibold outline-hidden bg-[#F8FBFE]"
          />
          <span className="absolute start-3.5 top-3 text-[#66788A]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#F4FAFF] border border-[#D7EAF7]">
            {(["all", "بيع", "استئجار", "تبادل"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onTypeFilterChange(t)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  typeFilter === t
                    ? "bg-[#0057C8] text-white shadow-xs"
                    : "text-[#16324A] hover:text-[#0057C8]"
                }`}
              >
                {t === "all" ? "كافة الأنواع" : t}
              </button>
            ))}
          </div>

          <select
            value={conditionFilter}
            onChange={(e) => onConditionFilterChange(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#D7EAF7] font-semibold text-[#16324A] bg-[#F8FBFE]"
          >
            <option value="all">كافة حالات الكتاب</option>
            <option value="ممتازة">حالة ممتازة</option>
            <option value="جيدة جداً">حالة جيدة جداً</option>
            <option value="جيدة">حالة جيدة</option>
          </select>
        </div>
      </div>
    </section>
  );
}

