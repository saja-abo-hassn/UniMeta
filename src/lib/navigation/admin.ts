import { Destination } from "@/src/types/ui";

export const adminDestinations: Destination[] = [
  {
    id: "admin-overview",
    title: "نظرة عامة",
    area: "admin",
    path: "/admin",
    description: "مؤشرات الأداء الرئيسية وإحصائيات المنصة",
  },
  {
    id: "admin-students",
    title: "إدارة الطلاب",
    area: "admin",
    path: "/admin/students",
    description: "قوائم حسابات الطلاب، الصلاحيات، وسجل العمليات الإدارية",
  },
  {
    id: "admin-library",
    title: "إدارة المكتبة",
    area: "admin",
    path: "/admin/library",
    description: "إدارة المواد الدراسية، رفع المصادر، وحالة النشر",
  },
  {
    id: "admin-agreements",
    title: "مراجعة الاتفاقيات",
    area: "admin",
    path: "/admin/agreements",
    description: "مراجعة طلبات الإعارة والتبادل، التحقق من الهويات، والاعتماد",
  },
  {
    id: "admin-reports",
    title: "إدارة البلاغات",
    area: "admin",
    path: "/admin/reports",
    description: "متابعة الشكاوى والنزاعات بين الأطراف وسجل الإجراءات",
  },
];

