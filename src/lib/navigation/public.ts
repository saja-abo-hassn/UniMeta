import { Destination } from "@/src/types/ui";

export const publicDestinations: Destination[] = [
  {
    id: "landing",
    title: "الرئيسية",
    area: "public",
    path: "/",
    description: "الصفحة التعريفية لمنصة UniMeta الجامعية",
  },
  {
    id: "login",
    title: "تسجيل الدخول",
    area: "public",
    path: "/login",
    description: "بوابة الدخول لحسابات الطلاب والإدارة",
  },
  {
    id: "register",
    title: "إنشاء حساب",
    area: "public",
    path: "/register",
    description: "تسجيل حساب طالب جديد بالجامعة",
  },
];

