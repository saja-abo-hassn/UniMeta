import { AdminReportItem } from "@/src/contexts/admin-context";
import { TARGET_TYPE_BADGES, STATUS_CONFIG } from "../types";

interface ReportsTableProps {
  reports: AdminReportItem[];
  onSelectReport: (report: AdminReportItem) => void;
  onOpenActionModal: (report: AdminReportItem) => void;
  onDeleteCandidate: (report: AdminReportItem) => void;
}

export function ReportsTable({
  reports,
  onSelectReport,
  onOpenActionModal,
  onDeleteCandidate,
}: ReportsTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#D7EAF7] overflow-hidden shadow-xs">
      {reports.length === 0 ? (
        <div className="p-12 text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#EAF4FD] text-[#0057C8] flex items-center justify-center text-2xl font-bold">
            🛡️
          </div>
          <h3 className="text-base font-bold text-[#16324A]">
            لا توجد بلاغات تطابق البحث أو الفلترة
          </h3>
          <p className="text-xs text-[#66788A] max-w-sm mx-auto">
            سجل المنصة خالٍ من البلاغات في هذا القسم. البيئة الأكاديمية آمنة ومستقرة.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#F8FBFE] border-b border-[#D7EAF7] text-[#66788A] font-semibold">
                <th className="py-3 px-3.5 text-start">رقم البلاغ</th>
                <th className="py-3 px-3.5 text-start">نوع الهدف</th>
                <th className="py-3 px-3.5 text-start">موضوع البلاغ / المحتوى</th>
                <th className="py-3 px-3.5 text-start">مقدم البلاغ</th>
                <th className="py-3 px-3.5 text-start">السبب المذكور</th>
                <th className="py-3 px-3.5 text-start">التاريخ</th>
                <th className="py-3 px-3.5 text-start">الحالة</th>
                <th className="py-3 px-3.5 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D7EAF7]/60">
              {reports.map((item) => {
                const typeCfg = TARGET_TYPE_BADGES[item.targetType] || TARGET_TYPE_BADGES["محتوى"];
                const statusCfg = STATUS_CONFIG[item.status] || STATUS_CONFIG["مفتوح"];

                return (
                  <tr key={item.id} className="hover:bg-[#F8FBFE] transition-colors">
                    <td className="py-3.5 px-3.5 font-mono font-bold text-[#0057C8] text-xs" dir="ltr">
                      {item.id}
                    </td>
                    <td className="py-3.5 px-3.5">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${typeCfg.badge}`}>
                        {typeCfg.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-3.5">
                      <div className="font-bold text-[#16324A] max-w-xs line-clamp-1">
                        {item.targetTitle}
                      </div>
                      {item.contentSnippet && (
                        <span className="text-[11px] text-[#66788A] line-clamp-1">
                          &ldquo;{item.contentSnippet}&rdquo;
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3.5 font-medium text-[#16324A] text-xs">
                      {item.reportedBy}
                    </td>
                    <td className="py-3.5 px-3.5 text-xs text-[#66788A] max-w-xs line-clamp-1">
                      {item.reason}
                    </td>
                    <td className="py-3.5 px-3.5 font-mono text-xs text-[#66788A]">
                      {item.createdAt}
                    </td>
                    <td className="py-3.5 px-3.5">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border inline-flex items-center gap-1.5 ${statusCfg.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                        <span>{statusCfg.label}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSelectReport(item)}
                          className="px-2.5 py-1.5 rounded-lg border border-[#D7EAF7] bg-white text-[#0057C8] hover:bg-[#EAF4FD] text-xs font-bold transition-colors"
                          title="عرض التفاصيل"
                        >
                          تفاصيل
                        </button>

                        <button
                          type="button"
                          onClick={() => onOpenActionModal(item)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#0057C8] hover:bg-[#2D78B7] text-white text-xs font-bold transition-colors shadow-2xs"
                          title="اتخاذ إجراء إداري"
                        >
                          إجراء ⚖️
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteCandidate(item)}
                          className="p-1.5 rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 text-xs transition-colors"
                          title="حذف سجل البلاغ"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

