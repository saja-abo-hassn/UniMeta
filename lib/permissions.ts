import { AdminPermission } from "@/src/types/admin";

export interface PermissionDefinition {
  key: AdminPermission;
  label: string;
  description: string;
  category: "محتوى" | "عمليات" | "إشراف" | "نظام";
}

export const SYSTEM_PERMISSIONS: PermissionDefinition[] = [
  {
    key: "manage_content",
    label: "إدارة المحتوى والمواد",
    description: "رفع وتعديل وحذف الملخصات والمناهج والموافقة على مساهمات الطلاب",
    category: "محتوى",
  },
  {
    key: "manage_exams",
    label: "بنك الامتحانات والجداول",
    description: "إدارة نماذج الامتحانات السابقة والجداول الدراسية",
    category: "محتوى",
  },
  {
    key: "manage_agreements",
    label: "الاتفاقيات والعهد",
    description: "مراجعة واعتماد عقود الإعارة والتأمين للأجهزة والكتب",
    category: "عمليات",
  },
  {
    key: "manage_finances",
    label: "الرسوم والمالية",
    description: "متابعة السجلات المالية وحسابات الرسوم",
    category: "عمليات",
  },
  {
    key: "manage_reports",
    label: "الإشراف والبلاغات",
    description: "متابعة شكاوى الطلاب وحجب المحتوى المخالف",
    category: "إشراف",
  },
  {
    key: "manage_members",
    label: "إدارة الأعضاء والطلاب",
    description: "متابعة الحسابات وتغيير حالة الطلاب",
    category: "إشراف",
  },
  {
    key: "manage_moderators",
    label: "الصلاحيات والمشرفون",
    description: "إرسال الدعوات وتعيين الصلاحيات للمشرفين (Super Admin فقط)",
    category: "نظام",
  },
  {
    key: "manage_settings",
    label: "إعدادات المنصة",
    description: "تعديل إعدادات وسياسات المنصة (Super Admin فقط)",
    category: "نظام",
  },
];

export const DEFAULT_MODERATOR_PERMISSIONS: Record<AdminPermission, boolean> = {
  manage_content: true,
  manage_agreements: false,
  manage_exams: false,
  manage_finances: false,
  manage_reports: true,
  manage_members: false,
  manage_moderators: false,
  manage_settings: false,
};

export const SUPER_ADMIN_PERMISSIONS: Record<AdminPermission, boolean> = {
  manage_content: true,
  manage_agreements: true,
  manage_exams: true,
  manage_finances: true,
  manage_reports: true,
  manage_members: true,
  manage_moderators: true,
  manage_settings: true,
};

export function hasPermission(
  userPermissions: Record<AdminPermission, boolean> | undefined,
  permission: AdminPermission,
  isSuperAdmin = false
): boolean {
  if (isSuperAdmin) return true;
  if (!userPermissions) return false;
  return !!userPermissions[permission];
}

