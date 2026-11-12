export const TARGET_TYPE_BADGES: Record<string, { label: string; badge: string }> = {
  "محتوى": { label: "محتوى تعليمي", badge: "bg-blue-50 text-blue-700 border-blue-200" },
  "تعليق": { label: "تعليق / منتدى", badge: "bg-purple-50 text-purple-700 border-purple-200" },
  "اتفاقية": { label: "اتفاقية عهدة", badge: "bg-amber-50 text-amber-700 border-amber-200" },
  "مستخدم": { label: "حساب طالب", badge: "bg-rose-50 text-rose-700 border-rose-200" },
};

export const STATUS_CONFIG: Record<
  "مفتوح" | "قيد المعالجة" | "مغلق",
  { label: string; badge: string; dot: string }
> = {
  "مفتوح": {
    label: "بلاغ مفتوح",
    badge: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
  "قيد المعالجة": {
    label: "قيد المتابعة والتحقيق",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  "مغلق": {
    label: "تمت المعالجة والإغلاق",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
};

