"use client";
import React, { useEffect, useState } from "react";
import { PagePlaceholder } from "@/components/placeholders/page-placeholder";
import { TableContainer, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/shared/table";
import { Button } from "@/components/shared/button";
import { PermissionGuard } from "@/components/admin/permission-guard";
import { apiClient } from "@/src/services/api-client";
import type { components } from "@/types/api";

type LibraryResource = components["schemas"]["LibraryResource"];
type LibrarySubject = components["schemas"]["LibrarySubject"];
type ResourceRow = { id: string; title: string; course: string; type: string; status: string; date: string };

const resourceTypes: Record<LibraryResource["resource_type"], string> = {
  SUMMARY: "ملخص",
  LECTURE: "محاضرة",
  STUDY_NOTE: "ملاحظات دراسية",
  EXAM_MODEL: "امتحان سابق",
  APPROVED_REFERENCE: "مرجع معتمد",
  AUTHORIZED_DIGITAL_BOOK: "كتاب رقمي مصرح",
};

export default function AdminLibraryPage() { return <MockAdminLibraryPage/>; }
function MockAdminLibraryPage() {
  const mockResources: ResourceRow[] = [
    { id: "RES-101", title: "سلايدات المحاضرة 1-4: الخوارزميات", course: "ENCS2340", type: "محاضرة", status: "منشور للطلاب", date: "2026-10-28" },
    { id: "RES-102", title: "ملخص مراجعة شامل لمساق نظم التشغيل", course: "ENCS3330", type: "ملخص", status: "منشور للطلاب", date: "2026-10-25" },
    { id: "RES-103", title: "نموذج امتحان نصفي 2024 - قواعد البيانات", course: "ENCS3320", type: "امتحان سابق", status: "مسودة غير منشورة", date: "2026-11-01" },
  ];
  const [resources, setResources] = useState<ResourceRow[]>(apiClient.isUsingMock() ? mockResources : []);
  const [isLoading, setIsLoading] = useState(!apiClient.isUsingMock());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (apiClient.isUsingMock()) return;
    let active = true;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [resourceResponse, subjectResponse] = await Promise.all([
          apiClient.all<LibraryResource>("/admin/library/resources"),
          apiClient.all<LibrarySubject>("/admin/library/subjects"),
        ]);
        if (resourceResponse.errors || subjectResponse.errors || !resourceResponse.data || !subjectResponse.data) {
          throw new Error(resourceResponse.message || subjectResponse.message || "تعذر تحميل بيانات المكتبة.");
        }
        const subjectById = new Map(subjectResponse.data.map((subject) => [subject.id, subject]));
        const rows = resourceResponse.data.map((resource): ResourceRow => ({
          id: String(resource.id),
          title: resource.title,
          course: subjectById.get(resource.subject_id)?.subject_code ?? "—",
          type: resourceTypes[resource.resource_type],
          status: resource.visibility_status === "VISIBLE" ? "منشور للطلاب" : "مسودة غير منشورة",
          date: resource.created_at.slice(0, 10),
        }));
        if (active) setResources(rows);
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : "تعذر تحميل بيانات المكتبة.");
      } finally {
        if (active) setIsLoading(false);
      }
    };
    void load();
    return () => { active = false; };
  }, []);

  return (
    <PermissionGuard permission="manage_content">
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
              {resources.map((res) => (
                <TableRow key={res.id}>
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
                        : "bg-brand-surface-blue text-brand-primary border border-brand-border-soft"
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
              {isLoading && <TableRow><TableCell colSpan={7}>جارٍ تحميل موارد المكتبة…</TableCell></TableRow>}
              {!isLoading && error && <TableRow><TableCell colSpan={7} className="text-red-700">{error}</TableCell></TableRow>}
              {!isLoading && !error && resources.length === 0 && <TableRow><TableCell colSpan={7}>لا توجد موارد في المكتبة.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </PagePlaceholder>
    </PermissionGuard>
  );
}

