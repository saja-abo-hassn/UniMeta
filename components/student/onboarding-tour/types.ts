export interface TourStepConfig {
  id: string;
  tourKey: string;
  selector: string;
  title: string;
  description: string;
  mascotSrc: string;
  mascotAlt: string;
  actionUrl: string;
}

export const ALL_TOUR_STEPS: TourStepConfig[] = [
  {
    id: "academic-path",
    tourKey: "academic-path",
    selector: '[data-tour="academic-path"]',
    title: "مساري الأكاديمي",
    description: "من هنا تختار خطتك الجامعية، وعليها تُبنى كل أرقامك.",
    mascotSrc: "/mascot/wave.png",
    mascotAlt: "مساعد UniMeta يرحّب بك في المسار الأكاديمي",
    actionUrl: "/student/academic",
  },
  {
    id: "hours",
    tourKey: "hours",
    selector: '[data-tour="hours"]',
    title: "الساعات المعتمدة",
    description: "تعرف كم ساعة أنجزت وكم بقي لك.",
    mascotSrc: "/mascot/think.png",
    mascotAlt: "مساعد UniMeta يفكر مع المصباح الذكي",
    actionUrl: "/my-hours",
  },
  {
    id: "gpa",
    tourKey: "gpa",
    selector: '[data-tour="gpa"]',
    title: "حاسبة المعدل التراكمي",
    description: "احسب معدلك التراكمي بناءً على مواد خطتك.",
    mascotSrc: "/mascot/think.png",
    mascotAlt: "مساعد UniMeta يحسب معدلك التراكمي",
    actionUrl: "/gpa-calculator",
  },
  {
    id: "fees",
    tourKey: "fees",
    selector: '[data-tour="fees"]',
    title: "حاسبة الرسوم الجامعية",
    description: "اعرف الرسوم المطلوبة منك.",
    mascotSrc: "/mascot/think.png",
    mascotAlt: "مساعد UniMeta يحسب الرسوم المطلوبة",
    actionUrl: "/fee-calculator",
  },
  {
    id: "study-space",
    tourKey: "study-space",
    selector: '[data-tour="study-space"]',
    title: "المساحة الدراسية",
    description: "مساحة هادئة للدراسة بدون تشتيت.",
    mascotSrc: "/mascot/book.png",
    mascotAlt: "مساعد UniMeta مع كتاب المعرفة والتركيز",
    actionUrl: "/student/productivity",
  },
  {
    id: "exchange-devices",
    tourKey: "exchange-devices",
    selector: '[data-tour="exchange-devices"]',
    title: "تبادل واستئجار الأجهزة",
    description: "استأجر أو بادل جهازًا مع زملائك بأمان.",
    mascotSrc: "/mascot/wave2.png",
    mascotAlt: "مساعد UniMeta يلوّح لتبادل الأجهزة",
    actionUrl: "/student/exchange/devices",
  },
  {
    id: "exchange-books",
    tourKey: "exchange-books",
    selector: '[data-tour="exchange-books"]',
    title: "تبادل واستئجار الكتب",
    description: "استأجر أو بادل كتابًا مع زملائك.",
    mascotSrc: "/mascot/wave2.png",
    mascotAlt: "مساعد UniMeta يلوّح لتبادل الكتب",
    actionUrl: "/student/exchange/books",
  },
  {
    id: "agreements",
    tourKey: "agreements",
    selector: '[data-tour="agreements"]',
    title: "اتفاقياتي وطلباتي",
    description: "من هنا تراقب حالة كل اتفاقية وطلب قدّمته.",
    mascotSrc: "/mascot/head.png",
    mascotAlt: "رأس مساعد UniMeta لمراقبة الطلبات",
    actionUrl: "/student/agreements",
  },
];

export const SPOTLIGHT_PADDING = 6;

export interface MeasuredTarget {
  left: number;
  top: number;
  width: number;
  height: number;
  borderRadius: number;
}

export interface CardPosition {
  left: number;
  top: number;
  arrowTop: number;
  arrowPlacement: "right" | "left";
  isMobile: boolean;
}

export function getVisibleElement(selector: string): HTMLElement | null {
  if (typeof document === "undefined") return null;
  const elements = document.querySelectorAll<HTMLElement>(selector);
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    if (
      rect.width > 0 &&
      rect.height > 0 &&
      style.display !== "none" &&
      style.visibility !== "hidden"
    ) {
      return el;
    }
  }
  return null;
}

