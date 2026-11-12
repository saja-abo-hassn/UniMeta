interface ModerationKPIsProps {
  counts: {
    total: number;
    open: number;
    inProgress: number;
    closed: number;
  };
}

export function ModerationKPIs({ counts }: ModerationKPIsProps) {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div className="p-5 rounded-2xl bg-white border border-[#D7EAF7] shadow-xs space-y-1">
        <span className="text-xs font-semibold text-[#66788A] block">إجمالي البلاغات</span>
        <div className="text-2xl sm:text-3xl font-black text-[#16324A]">
          {counts.total}
        </div>
        <span className="text-[11px] text-[#66788A] block">مسجلة في سجل النظام</span>
      </div>

      <div className="p-5 rounded-2xl bg-red-50/70 border border-red-200 shadow-xs space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-red-800 block">بلاغات مفتوحة عاجلة</span>
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
        </div>
        <div className="text-2xl sm:text-3xl font-black text-red-700">
          {counts.open}
        </div>
        <span className="text-[11px] text-red-600 font-semibold block">تحتاج تدخل فوري</span>
      </div>

      <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-xs space-y-1">
        <span className="text-xs font-bold text-amber-800 block">قيد المتابعة والتحقيق</span>
        <div className="text-2xl sm:text-3xl font-black text-amber-800">
          {counts.inProgress}
        </div>
        <span className="text-[11px] text-amber-700 block">جلسات استيضاح جارية</span>
      </div>

      <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-xs space-y-1">
        <span className="text-xs font-bold text-emerald-800 block">تمت المعالجة والإغلاق</span>
        <div className="text-2xl sm:text-3xl font-black text-emerald-800">
          {counts.closed}
        </div>
        <span className="text-[11px] text-emerald-700 block">قرارات نهائية موثقة</span>
      </div>
    </section>
  );
}

