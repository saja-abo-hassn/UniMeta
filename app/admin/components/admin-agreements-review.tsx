import { AdminAgreementItem } from "@/src/types/admin";

interface AdminAgreementsReviewProps {
  agreements: AdminAgreementItem[];
  filteredAgreements: AdminAgreementItem[];
  agreementStatusFilter: string;
  onStatusFilterChange: (status: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  pendingAgreementsCount: number;
  activeAgreementsCount: number;
  onApprove: (id: string) => void;
  onRejectPrompt: (id: string) => void;
  onViewDetails: (agr: AdminAgreementItem) => void;
}

export function AdminAgreementsReview({
  agreements,
  filteredAgreements,
  agreementStatusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchChange,
  pendingAgreementsCount,
  activeAgreementsCount,
  onApprove,
  onRejectPrompt,
  onViewDetails,
}: AdminAgreementsReviewProps) {
  return (
    <section className="p-6 sm:p-7 rounded-3xl bg-white border border-brand-border-soft shadow-xs space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-brand-border-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-primary" />
            <h2 className="text-lg sm:text-xl font-black text-brand-ink">
              مراجعة الاتفاقيات والعهد
            </h2>
          </div>
          <p className="text-xs text-brand-muted mt-0.5">
            السعر —إن وجد— توثيقي فقط ولا توجد مدفوعات داخل المنصة. يتطلب كل اتفاق إقرار الإدارة للمتابعة.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#F4FAFF] border border-brand-border-soft text-xs font-bold">
            <button
              type="button"
              onClick={() => onStatusFilterChange("all")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                agreementStatusFilter === "all" ? "bg-white text-brand-primary shadow-xs" : "text-brand-muted"
              }`}
            >
              جميع الحالات ({agreements.length})
            </button>
            <button
              type="button"
              onClick={() => onStatusFilterChange("قيد الانتظار")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                agreementStatusFilter === "قيد الانتظار" ? "bg-white text-amber-700 shadow-xs" : "text-brand-muted"
              }`}
            >
              بانتظار القرار ({pendingAgreementsCount})
            </button>
            <button
              type="button"
              onClick={() => onStatusFilterChange("موافق عليها")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                agreementStatusFilter === "موافق عليها" ? "bg-white text-brand-primary shadow-xs" : "text-brand-muted"
              }`}
            >
              المعتمدة ({activeAgreementsCount})
            </button>
          </div>
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
          placeholder="ابحث برقم الاتفاقية، اسم الغرض، أو اسم الطالب (مثال: UM-2817 أو هياكل أو ريم)..."
          className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-brand-border-soft bg-brand-surface-muted text-xs sm:text-sm font-semibold text-brand-ink focus:outline-none focus:border-brand-secondary focus:bg-white"
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

      <div className="overflow-x-auto rounded-2xl border border-brand-border-soft">
        <table className="w-full text-start text-xs sm:text-sm">
          <thead>
            <tr className="bg-brand-surface-muted border-b border-brand-border-soft text-brand-muted font-semibold">
              <th className="py-3 px-3.5 text-start">رقم الاتفاقية</th>
              <th className="py-3 px-3.5 text-start">العنصر / الغرض</th>
              <th className="py-3 px-3.5 text-start">النوع</th>
              <th className="py-3 px-3.5 text-start">الأطراف</th>
              <th className="py-3 px-3.5 text-start">التأمين</th>
              <th className="py-3 px-3.5 text-start">الموعد النهائي</th>
              <th className="py-3 px-3.5 text-start">الحالة</th>
              <th className="py-3 px-3.5 text-start">إجراءات الإدارة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border-soft/60">
            {filteredAgreements.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-xs text-brand-muted">
                  لا توجد اتفاقيات مطابقة لخيارات الفلترة أو البحث.
                </td>
              </tr>
            ) : (
              filteredAgreements.map((agr) => {
                const isPending = agr.status === "قيد الانتظار";
                const isApproved = agr.status === "موافق عليها";

                return (
                  <tr key={agr.id} className="hover:bg-brand-surface-muted transition-colors">
                    <td className="py-3.5 px-3.5 font-mono font-bold text-brand-primary" dir="ltr">
                      #{agr.id}
                    </td>

                    <td className="py-3.5 px-3.5">
                      <span className="font-bold text-brand-ink block">
                        {agr.title}
                      </span>
                      <span className="text-[10px] text-brand-muted block">
                        تاريخ الإنشاء: {agr.createdAt}
                      </span>
                    </td>

                    <td className="py-3.5 px-3.5">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-surface-blue text-brand-primary border border-brand-border-soft">
                        {agr.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-3.5 text-xs">
                      <div className="font-semibold text-brand-ink">
                        <span className="text-brand-muted">المستعير: </span>
                        {agr.requesterName}
                      </div>
                      <div className="text-[11px] text-brand-muted">
                        <span>المالك: </span>
                        {agr.ownerName}
                      </div>
                    </td>

                    <td className="py-3.5 px-3.5 font-bold text-brand-ink">
                      {agr.depositAmount} د.أ
                    </td>

                    <td className="py-3.5 px-3.5 text-xs text-brand-muted">
                      {agr.returnDeadline}
                    </td>

                    <td className="py-3.5 px-3.5">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isPending
                            ? "bg-brand-surface-blue text-amber-800 border-brand-border-soft"
                            : isApproved
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {agr.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-3.5">
                      <div className="flex items-center gap-1.5">
                        {isPending && (
                          <>
                            <button
                              type="button"
                              onClick={() => onApprove(agr.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-2xs"
                              title="موافقة واعتماد"
                            >
                              موافقة
                            </button>
                            <button
                              type="button"
                              onClick={() => onRejectPrompt(agr.id)}
                              className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-colors"
                              title="رفض مع إبداء سبب"
                            >
                              رفض
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => onViewDetails(agr)}
                          className="px-2.5 py-1 rounded-lg border border-brand-border-soft bg-white hover:bg-brand-surface-soft text-brand-primary text-xs font-bold transition-colors"
                        >
                          التفاصيل
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
