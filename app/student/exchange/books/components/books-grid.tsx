import { formatCurrency } from "@/src/lib/currency";
import { ExchangeBook } from "../types";

interface BooksGridProps {
  books: ExchangeBook[];
  onRequestBook: (book: ExchangeBook) => void;
}

export function BooksGrid({ books, onRequestBook }: BooksGridProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between text-xs text-brand-muted px-1 font-semibold">
        <span>المراجع والكتب المتوفرة ({books.length})</span>
        <span>العملة المعتمدة: <strong>الشيكل (₪)</strong></span>
      </div>

      {books.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-brand-border-soft shadow-xs space-y-3">
          <h3 className="font-bold text-base text-brand-ink">لا توجد كتب مطابقة لخيارات البحث</h3>
          <p className="text-xs text-brand-muted">جرب استخدام رمز المساق أو كلمة من عنوان المرجع.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
          {books.map((bk) => (
            <div
              key={bk.id}
              className="card-hover-effect rounded-3xl bg-white border border-brand-border-soft hover:border-brand-primary shadow-xs p-5 sm:p-6 flex flex-col justify-between gap-4 transition-all h-full"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-brand-surface-blue text-brand-primary border border-brand-border-soft" dir="ltr">
                    {bk.courseCode}
                  </span>

                  <span
                    className={`text-[11px] font-bold px-3 py-0.5 rounded-full border ${
                      bk.type === "بيع"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : bk.type === "استئجار"
                        ? "bg-brand-surface-blue text-brand-ink border-brand-border-soft"
                        : "bg-brand-surface-blue text-brand-ink border-brand-border-soft"
                    }`}
                  >
                    {bk.type === "بيع" && "بيع نهائي 🏷️"}
                    {bk.type === "استئجار" && "استئجار ⏳"}
                    {bk.type === "تبادل" && "تبادل 🔄"}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-brand-ink leading-snug line-clamp-2 min-h-[2.75rem]">
                    {bk.title}
                  </h3>
                  <span className="text-xs text-brand-muted block mt-0.5 line-clamp-1">
                    المساق: {bk.courseName} · المؤلف: {bk.author}
                  </span>
                </div>

                <p className="text-xs text-brand-muted leading-relaxed line-clamp-2">
                  {bk.notes}
                </p>

                <div className="p-3.5 rounded-2xl bg-brand-surface-muted border border-brand-border-soft/80 text-xs space-y-2">
                  {bk.type === "بيع" && (
                    <div className="flex items-center justify-between">
                      <span className="text-brand-muted">سعر البيع النهائي:</span>
                      <span className="text-base font-black text-emerald-700">
                        {formatCurrency(bk.price || 0, "ILS")}
                      </span>
                    </div>
                  )}

                  {bk.type === "استئجار" && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-brand-muted">سعر الاستئجار:</span>
                        <span className="text-base font-black text-brand-primary">
                          {formatCurrency(bk.price || 0, "ILS")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-brand-border-soft/60">
                        <span className="text-brand-muted">فترة الاستئجار:</span>
                        <span className="font-bold text-brand-ink">
                          {bk.rentalPeriod || "فصل دراسي"}
                        </span>
                      </div>
                    </>
                  )}

                  {bk.type === "تبادل" && (
                    <div className="space-y-1">
                      <span className="text-brand-muted block text-[11px]">المطلوب كبديل:</span>
                      <strong className="text-brand-ink block text-xs">
                        {bk.exchangeTarget || "كتاب تخصصي مكافئ"}
                      </strong>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-brand-border-soft/60 text-brand-muted">
                    <span>المالك: <strong className="text-brand-ink">{bk.owner}</strong></span>
                    <span>الحالة: <strong className="text-brand-primary">{bk.condition}</strong></span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-brand-border-soft">
                <button
                  type="button"
                  onClick={() => onRequestBook(bk)}
                  className="w-full py-2.5 px-4 rounded-xl bg-brand-primary hover:bg-brand-hover-medium text-white text-xs font-bold transition-all shadow-xs"
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

