interface BooksHeaderProps {
  onOpenAddModal: () => void;
}

export function BooksHeader({ onOpenAddModal }: BooksHeaderProps) {
  return (
    <section className="card-entrance p-6 sm:p-7 rounded-3xl bg-white border border-[#D7EAF7] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex flex-col mb-1">
          <span className="text-xs font-bold text-[#0057C8] uppercase tracking-wider">
            Student Book Exchange & Marketplace
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#16324A] mt-0.5">
            تبادل وبيع واستئجار الكتب الأكاديمية
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-[#66788A] leading-relaxed max-w-xl">
          منصة طلابية مخصصة لشراء الكتب بشكل نهائي، أو استئجارها بالفترة بالشيكل ₪، أو تبادلها مع زملائك في الكلية.
        </p>
      </div>

      <button
        type="button"
        onClick={onOpenAddModal}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#0057C8] hover:bg-[#2D78B7] text-white text-xs sm:text-sm font-bold transition-all shadow-xs shrink-0"
      >
        <span>+ عرض كتاب (بيع / استئجار / تبادل)</span>
      </button>
    </section>
  );
}

