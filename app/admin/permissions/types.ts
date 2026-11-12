import { AdminPermission } from "@/src/types/admin";

export interface PermissionDef {
  key: AdminPermission;
  label: string;
  description: string;
}

export const PERMISSION_COLUMNS: PermissionDef[] = [
  { key: "manage_content", label: "المحتوى والمواد", description: "رفع وتعديل وحذف الملخصات والمناهج" },
  { key: "manage_agreements", label: "الاتفاقيات والعهد", description: "مراجعة واعتماد عقود الإعارة والتأمين" },
  { key: "manage_reports", label: "الإشراف والبلاغات", description: "متابعة شكاوى الطلاب وحجب المحتوى المخالف" },
  { key: "manage_members", label: "إدارة الأعضاء", description: "متابعة الحسابات وتغيير حالة الطلاب" },
  { key: "manage_settings", label: "إعدادات المنصة", description: "تعديل إعدادات وسياسات المنصة" },
];

