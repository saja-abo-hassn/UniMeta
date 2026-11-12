export interface MockNotification {
  id: string;
  type: "rent" | "exchange" | "agreement" | "pomodoro" | "project" | "library" | "general";
  title: string;
  message: string;
  createdAt: number;
  read: boolean;
  link: string;
}

const NOW = Date.now();

export const MOCK_NOTIFICATIONS: MockNotification[] = [
  {
    id: "notif-1",
    type: "rent",
    title: "طلب استئجار جديد 🔌",
    message: "أرسل الطالب طارق زياد طلباً لاستئجار لوحة Arduino Mega 2560 لمدة 10 أيام.",
    createdAt: NOW - 1000 * 60 * 15,
    read: false,
    link: "/student/agreements",
  },
  {
    id: "notif-2",
    type: "exchange",
    title: "تمت الموافقة على طلب التبادل 📚",
    message: "وافق ميسرة خليل على تبادل مرجع تراكيب البيانات مقابل كتاب الخوارزميات.",
    createdAt: NOW - 1000 * 60 * 60 * 2,
    read: false,
    link: "/student/exchange/books",
  },
  {
    id: "notif-3",
    type: "library",
    title: "تمت إضافة ملخص جديد لمساقك 📝",
    message: "أضاف الدكتور ملف 'ملخص شامل لأنماط التصميم' لمساق هندسة البرمجيات.",
    createdAt: NOW - 1000 * 60 * 60 * 4,
    read: false,
    link: "/student/library",
  },
  {
    id: "notif-4",
    type: "project",
    title: "رد على طلب الانضمام لفريق التخرج 🤝",
    message: "قبل فريق 'نظام إدارة النفايات الطبية عبر IoT' انضمامك كمهندسة برمجيات.",
    createdAt: NOW - 1000 * 60 * 60 * 8,
    read: true,
    link: "/student/projects",
  },
  {
    id: "notif-5",
    type: "pomodoro",
    title: "تذكير جلسة التركيز اليومية ⏱️",
    message: "أحسنت! أكملت 3 دورات تركيز اليوم في مساحة الإنتاجية والدراسة.",
    createdAt: NOW - 1000 * 60 * 60 * 24,
    read: true,
    link: "/student/productivity",
  },
];

