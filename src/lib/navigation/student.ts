export interface StudentNavSubItem {
  id: string;
  title: string;
  path: string;
  description?: string;
}

export interface StudentNavDestination {
  id: string;
  title: string;
  path: string;
  description?: string;
  badge?: string;
  icon?: string;
  subItems?: StudentNavSubItem[];
}

export const studentDestinations: StudentNavDestination[] = [
  {
    id: "student-overview",
    title: "الرئيسية",
    path: "/student",
    description: "لوحة المتابعة الشاملة وتقدم اليوم",
    icon: "home",
  },
  {
    id: "student-academic",
    title: "المسار الأكاديمي",
    path: "/student/academic",
    description: "الخطة الدراسية وتتبع المساقات والرسوم",
    icon: "academic",
    subItems: [
      {
        id: "my-hours",
        title: "الساعات المعتمدة",
        path: "/my-hours",
        description: "تفصيل الساعات المنجزة والمتبقية",
      },
      {
        id: "gpa-calculator",
        title: "حاسبة المعدل التراكمي",
        path: "/gpa-calculator",
        description: "حساب فوري للمعدل التراكمي من 100",
      },
      {
        id: "fee-calculator",
        title: "حاسبة الرسوم الجامعية",
        path: "/fee-calculator",
        description: "تقدير الرسوم الدراسية والتأمين بالدينار",
      },
    ],
  },
  {
    id: "student-library",
    title: "المكتبة الرقمية",
    path: "/student/library",
    description: "المراجع والملخصات ونماذج الامتحانات",
    icon: "library",
  },
  {
    id: "student-productivity",
    title: "إنتاجية الدراسة",
    path: "/student/productivity",
    description: "مؤقت بومودورو والمهام اليومية",
    icon: "productivity",
  },
  {
    id: "student-interests",
    title: "اختبار تحديد الميول",
    path: "/student/interests",
    description: "مقياس الميول والتخصصات المناسبة",
    icon: "interests",
  },
  {
    id: "student-teams",
    title: "مشاريع التخرج",
    path: "/student/teams",
    badge: "1",
    description: "تنسيق فرق التخرج والشركاء الأكاديميين",
    icon: "teams",
  },
  {
    id: "student-exchange-devices",
    title: "تبادل واستئجار الأجهزة",
    path: "/student/exchange/devices",
    description: "إعارة واستئجار الأجهزة والأدوات الهندسية",
    icon: "devices",
  },
  {
    id: "student-exchange-books",
    title: "تبادل واستئجار الكتب",
    path: "/student/exchange/books",
    description: "إعارة وتبادل المراجع والكتب الجامعية",
    icon: "books",
  },
  {
    id: "student-agreements",
    title: "اتفاقياتي وطلباتي",
    path: "/student/agreements",
    description: "توثيق الإعارات والطلبات النشطة",
    icon: "agreements",
  },
  {
    id: "student-settings",
    title: "الإعدادات",
    path: "/student/settings",
    description: "الملف الشخصي والتفضيلات الأكاديمية",
    icon: "settings",
  },
];
