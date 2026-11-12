export type MemberStatus = "نشط" | "معلق" | "محظور";
export type StatusFilter = "all" | MemberStatus;

export const STATUS_BADGES: Record<
  MemberStatus,
  { label: string; badge: string; dot: string }
> = {
  "نشط": {
    label: "حساب نشط",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  "معلق": {
    label: "حساب معلق",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  "محظور": {
    label: "حساب محظور",
    badge: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
};

