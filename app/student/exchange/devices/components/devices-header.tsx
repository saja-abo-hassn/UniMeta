interface DevicesHeaderProps {
  onOpenAddModal: () => void;
}

export function DevicesHeader({ onOpenAddModal }: DevicesHeaderProps) {
  return (
    <section className="card-entrance p-6 sm:p-7 rounded-3xl bg-white border border-[#D7EAF7] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex flex-col mb-1">
          <span className="text-xs font-bold text-[#0057C8] uppercase tracking-wider">
            Hardware & Devices Exchange Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#16324A] mt-0.5">
            تبادل واستئجار الأجهزة والأدوات
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-[#66788A] leading-relaxed max-w-2xl">
          منصة الإعارة الطلابية التعاونية: استعارة واستئجار لوحات التطوير، الحواسيب، أدوات القياس الهندسية، والمعدات المعملية بأمان وموثوقية.
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#0057C8] hover:bg-[#2D78B7] text-white text-xs sm:text-sm font-bold transition-all shadow-xs"
        >
          <span>+</span>
          <span>إضافة جهاز للإعارة</span>
        </button>
      </div>
    </section>
  );
}

