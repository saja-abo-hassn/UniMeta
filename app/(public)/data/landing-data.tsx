import React from "react";

export interface WhyUnimetaItem {
  category: string;
  title: string;
  desc: string;
  href: string;
  icon: React.ReactNode;
}

export interface FeatureItem {
  title: string;
  desc: string;
  href: string;
  icon: React.ReactNode;
}

export const whyUnimetaItems: WhyUnimetaItem[] = [
  {
    category: "حاسبة المعدل",
    title: "حساب المعدل التراكمي",
    desc: "حاسبة فورية مرتبطة بساعات ودرجات موادك.",
    href: "/student/academic",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    category: "مساري الأكاديمي",
    title: "الساعات المتبقية والإجبارية",
    desc: "تقدم واضح لكل فئة من متطلبات الخطة.",
    href: "/student/academic",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    category: "المكتبة الرقمية",
    title: "الكتب والملخصات",
    desc: "مصادر منظمة حسب المادة ونوع الملف.",
    href: "/student/library",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    category: "المستلزمات الجامعية",
    title: "تأجير وتبادل المستلزمات",
    desc: "كتب وأجهزة وأدوات باتفاق موثق بين الطلاب.",
    href: "/student/exchange/books",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    category: "تنظيم المهام",
    title: "الامتحانات والمهام",
    desc: "مهام يومية محفوظة تساعدك على متابعة التزاماتك.",
    href: "/student/productivity",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    category: "وقت الدراسة",
    title: "ضعف التركيز",
    desc: "مؤقت جلسات ومهام وإحصاءات فعلية.",
    href: "/student/productivity",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    category: "مشاريع التخرج",
    title: "فريق مشروع التخرج",
    desc: "بحث وتقديم وقبول مع إدارة السعة.",
    href: "/student/teams",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    category: "المساعد الأكاديمي",
    title: "فهم الخطة الأكاديمية",
    desc: "مساعد تجريبي يميّز المعلومة المؤكدة من الاقتراح.",
    href: "/student",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

export const featureItems: FeatureItem[] = [
  {
    title: "المسار الأكاديمي",
    desc: "متابعة الخطة والمواد الإجبارية والاختيارية والساعات المنجزة والمتبقية.",
    href: "/student/academic",
    icon: (
      <svg className="w-6 h-6 text-[#0057C8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    title: "حاسبة المعدل التراكمي",
    desc: "حساب المعدل الفصلي والتراكمي وتوقّع المعدل المستقبلي.",
    href: "/student/academic",
    icon: (
      <svg className="w-6 h-6 text-[#0057C8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    ),
  },
  {
    title: "المكتبة الرقمية",
    desc: "الوصول إلى الكتب والملخصات والمراجع والموارد الدراسية.",
    href: "/student/library",
    icon: (
      <svg className="w-6 h-6 text-[#0057C8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
      </svg>
    ),
  },
  {
    title: "المهام اليومية",
    desc: "إنشاء المهام الدراسية ومتابعة المكتمل وغير المكتمل.",
    href: "/student/productivity",
    icon: (
      <svg className="w-6 h-6 text-[#0057C8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "المساعد الذكي",
    desc: "الوصول إلى المعلومات والموارد المتاحة مع توضيح أنه مساعد تجريبي.",
    href: "/student",
    icon: (
      <svg className="w-6 h-6 text-[#0057C8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: "تبادل الكتب والأجهزة",
    desc: "عرض الموارد الدراسية واستئجارها أو تبادلها بين الطلاب.",
    href: "/student/exchange/books",
    icon: (
      <svg className="w-6 h-6 text-[#0057C8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    title: "مؤقت التركيز والإنتاجية",
    desc: "جلسات دراسة تفاعلية بتقنية بومودورو مع إحصاءات الإنجاز.",
    href: "/student/productivity",
    icon: (
      <svg className="w-6 h-6 text-[#0057C8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "فرق مشاريع التخرج",
    desc: "تكوين الفرق والبحث عن زملاء التخرج حسب التخصص والمهارات.",
    href: "/student/teams",
    icon: (
      <svg className="w-6 h-6 text-[#0057C8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
];


