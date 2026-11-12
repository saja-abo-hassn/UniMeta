import React from "react";
import { PagePlaceholder } from "@/components/placeholders/page-placeholder";
import { TableContainer, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/shared/table";
import { Button } from "@/components/shared/button";

export default function AdminLibraryPage() {
  const sampleResources = [
    { id: "RES-101", title: "سلايدات المحاضرة 1-4: الخوارزميات", course: "ENCS2340", type: "محاضرة", status: "منشور للطلاب", date: "2026-10-28" },
    { id: "RES-102", title: "ملخص مراجعة شامل لمساق نظم التشغيل", course: "ENCS3330", type: "ملخص", status: "منشور للطلاب", date: "2026-10-25" },
    { id: "RES-103", title: "نموذج امتحان نصفي 2024 - قواعد البيانات", course: "ENCS3320", type: "امتحان سابق", status: "مسودة غير منشورة", date: "2026-11-01" },
  ];

  return (
    <PagePlaceholder
      title="إدارة المكتبة الرقمية"
      description="إدارة المواد الدراسية ورفع المراجع والملخصات، والتحكم في نشر الملفات للطلاب أو حجبها."
      area="admin"
      serviceNotReadyNotice="نظام رفع الملفات وإدارة المواد الدراسية الفعلي قيد التطوير للمرحلة الخامسة. الملفات المنشورة تظهر تلقائياً في حسابات الطلاب لنفس المساق."
      actions={
        <Button variant="primary" size="sm" disabled>
          + رفع مصدر أو مرجع جديد
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-white/70 border border-brand-secondary/20">
          <input
            type="text"
            placeholder="ابحث بالعنوان أو رمز المساق..."
            disabled
            className="w-full sm:w-80 text-xs p-2.5 rounded-lg bg-brand-light/60 border border-brand-secondary/30"
          />
          <div className="flex items-center gap-2">
            <select disabled className="text-xs p-2 rounded-lg bg-brand-light border border-brand-secondary/30">
              <option>جميع أنواع الملفات</option>
              <option>ملخصات</option>
              <option>سلايدات</option>
              <option>امتحانات سابقة</option>
            </select>
          </div>
        </div>

        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>معرف الملف</TableHead>
                <TableHead>عنوان الملف</TableHead>
                <TableHead>المساق</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>حالة النشر</TableHead>
                <TableHead>تاريخ الرفع</TableHead>
                <TableHead>التحكم</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleResources.map((res, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-mono text-xs text-brand-secondary">
                    {res.id}
                  </TableCell>
                  <TableCell className="font-semibold text-brand-dark">
                    {res.title}
                  </TableCell>
                  <TableCell className="font-mono text-xs font-bold text-brand-primary">
                    {res.course}
                  </TableCell>
                  <TableCell className="text-xs">{res.type}</TableCell>
                  <TableCell>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                      res.status === "منشور للطلاب"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>
                      {res.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs font-mono">{res.date}</TableCell>
                  <TableCell>
                    <button
                      type="button"
                      disabled
                      className="text-xs text-brand-primary font-medium opacity-50 cursor-not-allowed"
                    >
                      تعديل / حجب
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </PagePlaceholder>
  );
}

