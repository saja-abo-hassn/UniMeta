import { ContentStatus } from "@/src/contexts/admin-context";

export const MAIN_CATEGORIES = [
  { id: "الكتب", label: "الكتب", icon: "📚", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { id: "الملخصات", label: "الملخصات", icon: "📝", badge: "bg-brand-surface-blue text-brand-primary border-brand-border-soft" },
  { id: "النماذج السابقة", label: "النماذج السابقة", icon: "📋", badge: "bg-brand-surface-blue text-brand-primary border-brand-border-soft" },
  { id: "الفيديوهات", label: "الفيديوهات", icon: "🎬", badge: "bg-brand-surface-blue text-brand-primary border-brand-border-soft" },
] as const;

export type MainCategoryType = (typeof MAIN_CATEGORIES)[number]["id"];

export function normalizeCategory(cat: string): MainCategoryType {
  const c = (cat || "").toLowerCase();
  if (c === "الكتب" || c === "resources" || c.includes("كتاب") || c.includes("مراجع") || c.includes("مصادر")) {
    return "الكتب";
  }
  if (c === "الملخصات" || c === "summaries" || c.includes("ملخص") || c.includes("مذكرة")) {
    return "الملخصات";
  }
  if (
    c === "النماذج السابقة" ||
    c === "exams" ||
    c.includes("امتحان") ||
    c.includes("اسئلة") ||
    c.includes("أسئلة") ||
    c.includes("اختبار")
  ) {
    return "النماذج السابقة";
  }
  if (
    c === "الفيديوهات" ||
    c === "lectures" ||
    c === "videos" ||
    c.includes("فيديو") ||
    c.includes("شرح") ||
    c.includes("سلايد")
  ) {
    return "الفيديوهات";
  }
  return "الملخصات";
}

export const CATEGORY_MAP: Record<MainCategoryType, { label: string; icon: string; badge: string }> = {
  "الكتب": { label: "الكتب", icon: "📚", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  "الملخصات": { label: "الملخصات", icon: "📝", badge: "bg-brand-surface-blue text-brand-primary border-brand-border-soft" },
  "النماذج السابقة": { label: "النماذج السابقة", icon: "📋", badge: "bg-brand-surface-blue text-brand-primary border-brand-border-soft" },
  "الفيديوهات": { label: "الفيديوهات", icon: "🎬", badge: "bg-brand-surface-blue text-brand-primary border-brand-border-soft" },
};

export const STATUS_BADGES: Record<ContentStatus, { label: string; badge: string }> = {
  "منشور": { label: "منشور للطلاب", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  "مسودة": { label: "مسودة غير معلنة", badge: "bg-slate-100 text-brand-ink border-brand-border-soft" },
  "قيد المراجعة": { label: "قيد المراجعة والتدقيق", badge: "bg-brand-surface-blue text-brand-primary border-brand-border-soft" },
  "مرفوض": { label: "مرفوض", badge: "bg-red-50 text-red-700 border-red-200" },
};

export const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".doc", ".pptx", ".ppt", ".png", ".jpg", ".jpeg", ".mp4", ".zip"];
export const MAX_FILE_SIZE_MB = 50;

export interface ContentFormData {
  courseName: string;
  courseCode: string;
  title: string;
  category: MainCategoryType;
  fileType: "PDF" | "DOCX" | "SLIDES" | "IMAGE" | "ZIP" | "VIDEO" | "LINK";
  fileSize: string;
  author: string;
  status: ContentStatus;
  description: string;
  url: string;
}

