import React from "react";
import { CourseMaterialItem, ContentStatus } from "@/src/contexts/admin-context";
import { normalizeCategory, CATEGORY_MAP, STATUS_BADGES } from "../types";

interface MaterialsTableProps {
  materials: CourseMaterialItem[];
  onOpenAdd: () => void;
  onOpenEdit: (item: CourseMaterialItem) => void;
  onDeleteClick: (item: CourseMaterialItem) => void;
  onToggleStatus: (id: string, newStatus: ContentStatus) => void;
}

export function MaterialsTable({
  materials,
  onOpenAdd,
  onOpenEdit,
  onDeleteClick,
  onToggleStatus,
}: MaterialsTableProps) {
  if (materials.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#D7EAF7] overflow-hidden shadow-xs">
        <div className="p-12 text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#EAF4FD] text-[#0057C8] flex items-center justify-center text-2xl font-bold">
            📁
          </div>
          <h3 className="text-base font-bold text-[#16324A]">
            لا توجد ملفات تطابق الفلترة الحالية
          </h3>
          <p className="text-xs text-[#66788A] max-w-sm mx-auto">
            لم يتم العثور على محتوى في هذا القسم. يمكنك رفع كتاب، ملخص، نموذج امتحان، أو فيديو لأي مادة دراسية.
          </p>
          <button
            type="button"
            onClick={onOpenAdd}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0057C8] text-white text-xs font-bold hover:bg-[#2D78B7] transition-colors"
          >
            + رفع أول ملف الآن
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#D7EAF7] overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-start text-xs sm:text-sm">
          <thead>
            <tr className="bg-[#F8FBFE] border-b border-[#D7EAF7] text-[#66788A] font-semibold">
              <th className="py-3 px-3.5 text-start">المادة الدراسية</th>
              <th className="py-3 px-3.5 text-start">عنوان الملف والملاحظات</th>
              <th className="py-3 px-3.5 text-start">القسم (الـ 4 أقسام)</th>
              <th className="py-3 px-3.5 text-start">الصيغة</th>
              <th className="py-3 px-3.5 text-start">الحجم والتنزيل</th>
              <th className="py-3 px-3.5 text-start">الحالة</th>
              <th className="py-3 px-3.5 text-start">تاريخ الإضافة</th>
              <th className="py-3 px-3.5 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D7EAF7]/60">
            {materials.map((item) => {
              const normCat = normalizeCategory(item.category);
              const catMeta = CATEGORY_MAP[normCat];
              const statusBadge = STATUS_BADGES[item.status] || STATUS_BADGES["منشور"];

              return (
                <tr key={item.id} className="hover:bg-[#F8FBFE] transition-colors">
                  <td className="py-3 px-3.5">
                    <div className="flex flex-col">
                      <span className="text-xs text-[#16324A] font-bold">
                        {item.courseName || "مادة دراسية"}
                      </span>
                      {item.courseCode && (
                        <span className="font-mono text-[11px] text-[#0057C8] font-semibold" dir="ltr">
                          {item.courseCode}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3.5">
                    <div className="font-bold text-[#16324A] max-w-xs line-clamp-1">
                      {item.title}
                    </div>
                    {item.description && (
                      <span className="text-[11px] text-[#66788A] line-clamp-1">
                        {item.description}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3.5">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border inline-flex items-center gap-1 ${catMeta.badge}`}>
                      <span>{catMeta.icon}</span>
                      <span>{catMeta.label}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3.5 font-mono text-xs font-bold text-[#16324A]">
                    <span className="px-2 py-0.5 rounded-md bg-[#F0F7FD] border border-[#D7EAF7] text-[#0057C8]">
                      {item.fileType}
                    </span>
                  </td>
                  <td className="py-3 px-3.5">
                    <div className="flex items-center gap-1.5 text-xs text-[#66788A]">
                      <span>{item.fileSize}</span>
                      <span>•</span>
                      <span className="text-[#0057C8] font-bold">{item.downloads} تحميل</span>
                    </div>
                  </td>
                  <td className="py-3 px-3.5">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border inline-flex items-center gap-1 ${statusBadge.badge}`}>
                      {statusBadge.label}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-xs font-mono text-[#66788A]">
                    {item.date}
                  </td>
                  <td className="py-3 px-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {item.status === "قيد المراجعة" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => onToggleStatus(item.id, "منشور")}
                            className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 text-xs font-bold transition-colors cursor-pointer"
                            title="موافقة ونشر في المكتبة"
                          >
                            موافقة ونشر
                          </button>
                          <button
                            type="button"
                            onClick={() => onToggleStatus(item.id, "مرفوض")}
                            className="px-2 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 text-xs font-bold transition-colors cursor-pointer"
                            title="رفض الملف"
                          >
                            رفض
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onToggleStatus(item.id, item.status === "منشور" ? "مسودة" : "منشور")}
                          className={`p-1.5 rounded-lg border text-xs transition-colors ${
                            item.status === "منشور"
                              ? "bg-slate-50 text-[#66788A] border-slate-200 hover:text-amber-600"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                          }`}
                          title={item.status === "منشور" ? "حجب وتحويل لمسودة" : "نشر للطلاب مباشرة"}
                          aria-label={item.status === "منشور" ? "حجب وتحويل لمسودة" : "نشر للطلاب"}
                        >
                          {item.status === "منشور" ? "إخفاء" : "نشر"}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onOpenEdit(item)}
                        className="p-1.5 rounded-lg border border-[#D7EAF7] bg-white text-[#0057C8] hover:bg-[#EAF4FD] transition-colors"
                        title="تعديل المحتوى"
                        aria-label="تعديل المحتوى"
                      >
                        ✏️
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteClick(item)}
                        className="p-1.5 rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 transition-colors"
                        title="حذف المحتوى"
                        aria-label="حذف المحتوى"
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
    </div>
  );
}

