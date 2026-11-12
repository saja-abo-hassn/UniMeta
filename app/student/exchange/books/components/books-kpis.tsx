import { ExchangeBook } from "../types";

interface BooksKPIsProps {
  books: ExchangeBook[];
}

export function BooksKPIs({ books }: BooksKPIsProps) {
  const forSaleCount = books.filter((b) => b.type === "بيع").length;
  const forRentCount = books.filter((b) => b.type === "استئجار").length;
  const forExchangeCount = books.filter((b) => b.type === "تبادل").length;

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      <div className="card-hover-effect p-4 sm:p-5 rounded-2xl bg-white border border-[#D7EAF7] shadow-xs">
        <span className="text-xs text-[#66788A] block mb-1">إجمالي المراجع</span>
        <div className="text-2xl font-black text-[#16324A]">{books.length} كتاب</div>
        <span className="text-[10px] text-[#0057C8] font-semibold mt-1 block">في مختلف التخصصات</span>
      </div>

      <div className="card-hover-effect p-4 sm:p-5 rounded-2xl bg-white border border-[#D7EAF7] shadow-xs">
        <span className="text-xs text-[#66788A] block mb-1">كتب معروضة للبيع</span>
        <div className="text-2xl font-black text-[#0057C8]">
          {forSaleCount}
        </div>
        <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">بيع نهائي بالشيكل ₪</span>
      </div>

      <div className="card-hover-effect p-4 sm:p-5 rounded-2xl bg-white border border-[#D7EAF7] shadow-xs">
        <span className="text-xs text-[#66788A] block mb-1">كتب للاستئجار</span>
        <div className="text-2xl font-black text-[#2D78B7]">
          {forRentCount}
        </div>
        <span className="text-[10px] text-[#66788A] mt-1 block">سعر محدد لكل فترة ₪</span>
      </div>

      <div className="card-hover-effect p-4 sm:p-5 rounded-2xl bg-white border border-[#D7EAF7] shadow-xs">
        <span className="text-xs text-[#66788A] block mb-1">كتب للتبادل</span>
        <div className="text-2xl font-black text-[#16324A]">
          {forExchangeCount}
        </div>
        <span className="text-[10px] text-purple-600 font-semibold mt-1 block">بدون سعر أو مدة ثابتة</span>
      </div>
    </section>
  );
}

