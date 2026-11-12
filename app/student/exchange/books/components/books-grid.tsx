import { formatCurrency } from "@/src/lib/currency";
import { ExchangeBook } from "../types";

interface BooksGridProps {
  books: ExchangeBook[];
  onRequestBook: (book: ExchangeBook) => void;
}

export function BooksGrid({ books, onRequestBook }: BooksGridProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between text-xs text-[#66788A] px-1 font-semibold">
        <span>المراجع والكتب المتوفرة ({books.length})</span>
        <span>العملة المعتمدة: <strong>الشيكل (₪)</strong></span>
      </div>

      {books.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#D7EAF7] shadow-xs space-y-3">
          <h3 className="font-bold text-base text-[#16324A]">لا توجد كتب مطابقة لخيارات البحث</h3>
          <p className="text-xs text-[#66788A]">جرب استخدام رمز المساق أو كلمة من عنوان المرجع.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
          {books.map((bk) => (
            <div
              key={bk.id}
              className="card-hover-effect rounded-3xl bg-white border border-[#D7EAF7] hover:border-[#0057C8] shadow-xs p-5 sm:p-6 flex flex-col justify-between gap-4 transition-all h-full"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EAF4FD] text-[#0057C8] border border-[#D7EAF7]" dir="ltr">
                    {bk.courseCode}
                  </span>

                  <span
                    className={`text-[11px] font-bold px-3 py-0.5 rounded-full border ${
                      bk.type === "بيع"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : bk.type === "استئجار"
                        ? "bg-blue-50 text-blue-800 border-blue-200"
                        : "bg-purple-50 text-purple-800 border-purple-200"
                    }`}
                  >
                    {bk.type === "بيع" && "بيع نهائي 🏷️"}
                    {bk.type === "استئجار" && "استئجار ⏳"}
                    {bk.type === "تبادل" && "تبادل 🔄"}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-[#16324A] leading-snug line-clamp-2 min-h-[2.75rem]">
                    {bk.title}
                  </h3>
                  <span className="text-xs text-[#66788A] block mt-0.5 line-clamp-1">
                    المساق: {bk.courseName} · المؤلف: {bk.author}
                  </span>
                </div>

                <p className="text-xs text-[#66788A] leading-relaxed line-clamp-2">
                  {bk.notes}
                </p>

                <div className="p-3.5 rounded-2xl bg-[#F8FBFE] border border-[#D7EAF7]/80 text-xs space-y-2">
                  {bk.type === "بيع" && (
                    <div className="flex items-center justify-between">
                      <span className="text-[#66788A]">سعر البيع النهائي:</span>
                      <span className="text-base font-black text-emerald-700">
                        {formatCurrency(bk.price || 0, "ILS")}
                      </span>
                    </div>
                  )}

                  {bk.type === "استئجار" && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-[#66788A]">سعر الاستئجار:</span>
                        <span className="text-base font-black text-[#0057C8]">
                          {formatCurrency(bk.price || 0, "ILS")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#D7EAF7]/60">
                        <span className="text-[#66788A]">فترة الاستئجار:</span>
                        <span className="font-bold text-[#16324A]">
                          {bk.rentalPeriod || "فصل دراسي"}
                        </span>
                      </div>
                    </>
                  )}

                  {bk.type === "تبادل" && (
                    <div className="space-y-1">
                      <span className="text-[#66788A] block text-[11px]">المطلوب كبديل:</span>
                      <strong className="text-purple-800 block text-xs">
                        {bk.exchangeTarget || "كتاب تخصصي مكافئ"}
                      </strong>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-[#D7EAF7]/60 text-[#66788A]">
                    <span>المالك: <strong className="text-[#16324A]">{bk.owner}</strong></span>
                    <span>الحالة: <strong className="text-[#0057C8]">{bk.condition}</strong></span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#D7EAF7]">
                <button
                  type="button"
                  onClick={() => onRequestBook(bk)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0057C8] hover:bg-[#2D78B7] text-white text-xs font-bold transition-all shadow-xs"
                >
                  {bk.type === "بيع" && "طلب شراء الكتاب 🏷️"}
                  {bk.type === "استئجار" && "طلب استئجار الكتاب ⏳"}
                  {bk.type === "تبادل" && "تقديم عرض تبادل 🔄"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

