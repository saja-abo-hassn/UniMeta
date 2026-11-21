"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { PagePlaceholder } from "@/components/placeholders/page-placeholder";
import { TableContainer, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/shared/table";
import { Button } from "@/components/shared/button";
import { PermissionGuard } from "@/components/admin/permission-guard";
import { apiClient } from "@/src/services/api-client";
import type { components } from "@/types/api";
import { useAdminContent } from "../content/hooks/use-admin-content";

type LibraryResource = components["schemas"]["LibraryResource"];
type ResourceRow = { id: string; title: string; course: string; type: string; status: string; date: string };
const ContentModals = dynamic(() => import("../content/components/content-modals").then((m) => m.ContentModals), { ssr: false });

const resourceTypes: Record<LibraryResource["resource_type"], string> = {
  SUMMARY: "ملخص",
  LECTURE: "محاضرة",
  STUDY_NOTE: "ملاحظات دراسية",
  EXAM_MODEL: "امتحان سابق",
  APPROVED_REFERENCE: "مرجع معتمد",
  AUTHORIZED_DIGITAL_BOOK: "كتاب رقمي مصرح",
};

export default function AdminLibraryPage() {
  return <PermissionGuard permission="manage_content"><AdminLibrary /></PermissionGuard>;
}

function AdminLibrary() {
  const mockResources: ResourceRow[] = [
    { id: "RES-101", title: "سلايدات المحاضرة 1-4: الخوارزميات", course: "ENCS2340", type: "محاضرة", status: "منشور للطلاب", date: "2026-10-28" },
    { id: "RES-102", title: "ملخص مراجعة شامل لمساق نظم التشغيل", course: "ENCS3330", type: "ملخص", status: "منشور للطلاب", date: "2026-10-25" },
    { id: "RES-103", title: "نموذج امتحان نصفي 2024 - قواعد البيانات", course: "ENCS3320", type: "امتحان سابق", status: "مسودة غير منشورة", date: "2026-11-01" },
  ];
  const mock = apiClient.isUsingMock();
  const content = useAdminContent(false);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const { isLoading, loadError: error } = content;
  const materialsById = new Map(content.materials.map((item) => [item.id, item]));
  const resources = (mock ? mockResources : content.resources.map((resource): ResourceRow => {
    const id = String(resource.id);
    return {
      id,
      title: resource.title,
      course: materialsById.get(id)?.courseCode || "—",
      type: resourceTypes[resource.resource_type],
      status: resource.visibility_status === "VISIBLE" ? "منشور للطلاب" : "مسودة غير منشورة",
      date: resource.created_at.slice(0, 10),
    };
  })).filter((row) => (!type || row.type === type) && (row.title + " " + row.course).toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <PagePlaceholder
      title="إدارة المكتبة الرقمية"
      description="إدارة المواد الدراسية ورفع المراجع والملخصات، والتحكم في نشر الملفات للطلاب أو حجبها."
      area="admin"
      serviceNotReadyNotice={mock ? "الملفات المنشورة تظهر تلقائياً في مكتبة الطلاب." : undefined}
      actions={
        <Button variant="primary" size="sm" disabled={mock || isLoading || !!error} onClick={content.handleOpenAdd}>
          + رفع مصدر أو مرجع جديد
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-white/70 border border-brand-secondary/20">
          <input
            type="text"
            placeholder="ابحث بالعنوان أو رمز المساق..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full sm:w-80 text-xs p-2.5 rounded-lg bg-brand-light/60 border border-brand-secondary/30"
          />
          <div className="flex items-center gap-2">
            <select value={type} onChange={(event) => setType(event.target.value)} className="text-xs p-2 rounded-lg bg-brand-light border border-brand-secondary/30">
              <option value="">جميع أنواع الملفات</option>
              {Object.entries(resourceTypes).map(([key, label]) => <option key={key} value={label}>{label}</option>)}
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
                      disabled={mock}
                      onClick={() => {
                        const item = materialsById.get(res.id);
                        if (item) content.handleOpenEdit(item);
                      }}
                      className="text-xs text-brand-primary font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
        <ContentModals
          isAddModalOpen={content.isAddModalOpen}
          onCloseAdd={() => content.setIsAddModalOpen(false)}
          editingItem={content.editingItem}
          onCloseEdit={() => content.setEditingItem(null)}
          deleteCandidate={null}
          onCloseDelete={() => {}}
          onConfirmDelete={content.deleteMaterial}
          formData={content.formData}
          setFormData={content.setFormData}
          formError={content.formError}
          isUploading={content.isUploading}
          availableCourses={content.availableCourses}
          courseSuggestions={content.courseSuggestions}
          onSubmitAdd={content.handleSubmitAdd}
          onSubmitEdit={content.handleSubmitEdit}
        />
      </div>
    </PagePlaceholder>
  );
}

