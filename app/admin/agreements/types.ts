import { AdminAgreementStatus } from "@/src/types/admin";

export const STATUS_CONFIG: Record<
  AdminAgreementStatus,
  { label: string; badge: string; dot: string }
> = {
  "قيد الانتظار": {
    label: "بانتظار القرار",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  "موافق عليها": {
    label: "معتمدة",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  "مرفوضة": {
    label: "مرفوضة",
    badge: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
  "طلب تعديل": {
    label: "بانتظار تعديل الأطراف",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-brand-primary",
  },
};

