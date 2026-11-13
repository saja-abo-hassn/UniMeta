/**
 * UniMeta Study Plans Data Layer (مصدر واحد لجميع الخطط الدراسية)
 *
 * Designed according to Al-Azhar University (Faculty of Engineering & IT)
 * programs: Computer Science, Information Systems, Software & Computer Systems Engineering,
 * Mechatronics, Telecom, Biomedical, Renewable Energy, Geomatics, Multimedia, and MSc Data Science.
 */

export type CourseCategory = "university" | "college" | "major" | "elective" | "free";

export interface Course {
  code: string;
  name: string;
  credits: number;
  semester: number; // رقم الفصل في الخطة (1, 2, ..., 10)
  category: CourseCategory;
  prerequisites?: string[]; // أكواد المتطلبات السابقة
  description?: string;
}

export interface StudyPlan {
  id: string;
  major: string;
  college: string;
  degree: "بكالوريوس" | "ماجستير";
  totalCredits: number;
  compulsoryCredits: number;
  electiveCredits: number;
  universityElectiveCredits?: number;
  majorElectiveCredits?: number;
  semestersCount: number;
  hourlyRate: number; // بالدينار الأردني (JD)
  pdfUrl?: string;
  pdfFilename?: string;
  iconName?: string;
  description: string;
  courses: Course[];
}

export const CATEGORY_LABELS: Record<CourseCategory, { label: string; color: string }> = {
  university: { label: "متطلب جامعة", color: "bg-brand-surface-blue text-brand-primary border-brand-border-soft" },
  college: { label: "متطلب كلية", color: "bg-brand-surface-blue text-brand-primary border-brand-border-soft" },
  major: { label: "إجباري تخصص", color: "bg-brand-surface-blue text-brand-primary border-brand-border-soft" },
  elective: { label: "اختياري تخصص", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  free: { label: "مساق حر", color: "bg-brand-surface-blue text-brand-primary border-brand-border-soft" },
};

// ============================================================
// 1. الخطة التفصيلية لتخصص: علوم الحاسوب (خطة 9243 - 128 ساعة)
// 117 إجباري + 11 اختياري (2 جامعة + 9 تخصص)
// ============================================================
const csCourses: Course[] = [
  // المستوى 1 - الفصل 1 (16 ساعة)
  { code: "ITCS1401", name: "مقدمة في الحوسبة", credits: 4, semester: 1, category: "college" },
  { code: "ITIS1302", name: "مبادئ الإدارة", credits: 3, semester: 1, category: "college" },
  { code: "ISLM1101", name: "قرآن كريم (1)", credits: 1, semester: 1, category: "university" },
  { code: "ITCC1301", name: "دوائر كهربائية (1)", credits: 3, semester: 1, category: "college" },
  { code: "MATH1320", name: "تفاضل وتكامل (1)", credits: 3, semester: 1, category: "college" },
  { code: "ENGL1201", name: "اللغة الإنجليزية (1)", credits: 2, semester: 1, category: "university" },

  // المستوى 1 - الفصل 2 (17 ساعة)
  { code: "ITSN2308", name: "مهارات الكتابة التقنية", credits: 3, semester: 2, category: "college", prerequisites: ["ENGL1201"] },
  { code: "ITME1101", name: "مقدمة في الهندسة", credits: 1, semester: 2, category: "college" },
  { code: "ISLM1201", name: "دراسات في الفقه", credits: 2, semester: 2, category: "university" },
  { code: "MATH1321", name: "تفاضل وتكامل (2)", credits: 3, semester: 2, category: "college", prerequisites: ["MATH1320"] },
  { code: "ITCS1309", name: "برمجة حاسوب (1)", credits: 3, semester: 2, category: "college", prerequisites: ["ITCS1401"] },
  { code: "ARAB1201", name: "اللغة العربية (1)", credits: 2, semester: 2, category: "university" },
  { code: "ITCC1311", name: "إلكترونيات (1)", credits: 3, semester: 2, category: "college", prerequisites: ["ITCC1301"] },

  // المستوى 2 - الفصل 1 (17 ساعة)
  { code: "ITSE2301", name: "مقدمة في هندسة البرمجيات", credits: 3, semester: 3, category: "college", prerequisites: ["ITCS1309"] },
  { code: "ISLM2201", name: "دراسات في الحديث وعلومه", credits: 2, semester: 3, category: "university" },
  { code: "ITCC2303", name: "تصميم المنطق الرقمي", credits: 3, semester: 3, category: "major", prerequisites: ["ITCC1311"] },
  { code: "ITCS2307", name: "تراكيب البيانات", credits: 3, semester: 3, category: "major", prerequisites: ["ITCS1309"] },
  { code: "ITCS2301", name: "برمجة حاسوب (2)", credits: 3, semester: 3, category: "major", prerequisites: ["ITCS1309"] },
  { code: "ITCS2311", name: "التراكيب المنفصلة", credits: 3, semester: 3, category: "major", prerequisites: ["ITCS1309"] },

  // المستوى 2 - الفصل 2 (15 ساعة)
  { code: "ITCS2308", name: "هيكلية حاسوب ولغة أسمبلي", credits: 3, semester: 4, category: "major", prerequisites: ["ITCC2303"] },
  { code: "MATH2209", name: "مبادئ الإحصاء", credits: 2, semester: 4, category: "major", prerequisites: ["MATH1320"] },
  { code: "ISLM2105", name: "قرآن كريم (2)", credits: 1, semester: 4, category: "university" },
  { code: "MATH2305", name: "جبر خطي (1)", credits: 3, semester: 4, category: "major", prerequisites: ["MATH1320"] },
  { code: "ITCS2310", name: "تحليل وتصميم الأنظمة", credits: 3, semester: 4, category: "major", prerequisites: ["ITCS1309"] },
  { code: "ITCS2312", name: "الخوارزميات", credits: 3, semester: 4, category: "major", prerequisites: ["ITCS2307"] },

  // المستوى 3 - الفصل 1 (16 ساعة)
  { code: "ITCS3314", name: "نظرية الأتمتة", credits: 3, semester: 5, category: "major", prerequisites: ["ITCS2311", "ITCS1309"] },
  { code: "ISLM3107", name: "قرآن كريم (3)", credits: 1, semester: 5, category: "university" },
  { code: "ITCS4316", name: "شبكات الحاسوب", credits: 3, semester: 5, category: "major", prerequisites: ["ITCS2307"] },
  { code: "ISLM2202", name: "دراسات في العقيدة الإسلامية", credits: 2, semester: 5, category: "university" },
  { code: "ITCS3301", name: "العمل الحر وريادة الأعمال", credits: 3, semester: 5, category: "major" },
  { code: "ITCS3403", name: "أنظمة التشغيل", credits: 4, semester: 5, category: "major", prerequisites: ["ITCS2308"] },

  // المستوى 3 - الفصل 2 (18 ساعة)
  { code: "ITCS3402", name: "نظم قواعد البيانات", credits: 4, semester: 6, category: "major", prerequisites: ["ITCS2310"] },
  { code: "ISLM4113", name: "قرآن كريم (4)", credits: 1, semester: 6, category: "university" },
  { code: "ISLM3201", name: "دراسات في التفسير وعلوم القرآن", credits: 2, semester: 6, category: "university" },
  { code: "ITCS3310", name: "جرافيك حاسوب", credits: 3, semester: 6, category: "major", prerequisites: ["MATH2305", "ITCS1309"] },
  { code: "ITSE3302", name: "تطوير تطبيقات الشبكة العالمية", credits: 3, semester: 6, category: "elective", prerequisites: ["ITSE2302"] },
  { code: "ITCS3401", name: "تصميم صفحات الويب", credits: 4, semester: 6, category: "major", prerequisites: ["ITCS4316", "ITCS2310"] },
  { code: "ITCS3101", name: "تدريب ميداني", credits: 1, semester: 6, category: "major", prerequisites: ["ITCS2310"] },

  // المستوى 4 - الفصل 1 (15 ساعة)
  { code: "ITCS4330", name: "مشروع التخرج 1", credits: 3, semester: 7, category: "major", prerequisites: ["ITCS2310"] },
  { code: "PALS4212", name: "فلسطين الأرض والإنسان", credits: 2, semester: 7, category: "elective" }, // اختياري جامعة
  { code: "ITCS4319", name: "الذكاء الاصطناعي", credits: 3, semester: 7, category: "major", prerequisites: ["ITCS2307", "ITCS2311"] },
  { code: "ITCS4301", name: "أمن المعلومات", credits: 3, semester: 7, category: "major", prerequisites: ["ITCS4316"] },
  { code: "ITCS4346", name: "تنقيب البيانات", credits: 3, semester: 7, category: "elective", prerequisites: ["ITCS3402", "ITCS4319"] },
  { code: "ITCS4322", name: "تفاعل الإنسان والحاسوب", credits: 1, semester: 7, category: "elective", prerequisites: ["ITCS2310"] },

  // المستوى 4 - الفصل 2 (14 ساعة)
  { code: "ITCS4331", name: "مشروع التخرج 2", credits: 3, semester: 8, category: "major", prerequisites: ["ITCS4330"] },
  { code: "ITCS4302", name: "مبادئ لغات البرمجة", credits: 3, semester: 8, category: "major", prerequisites: ["ITCS2301", "ITCS3314", "ITCS4319"] },
  { code: "ITCS4317", name: "تصميم المترجمات", credits: 3, semester: 8, category: "major", prerequisites: ["ITCS3314"] },
  { code: "ITCS4320", name: "الأنظمة الموزعة", credits: 3, semester: 8, category: "major", prerequisites: ["ITCS3403", "ITCS3402", "ITCS4316"] },
  { code: "GEOL3203", name: "علوم البيئة", credits: 2, semester: 8, category: "elective" }, // اختياري جامعة
];

// ============================================================
// 2. الخطة التفصيلية لتخصص: نظم المعلومات (خطة 9274 - 128 ساعة)
// 117 إجباري + 11 اختياري (2 جامعة + 9 تخصص)
// ============================================================
const isCourses: Course[] = [
  // المستوى 1 - الفصل 1 (16 ساعة)
  { code: "ITCS1401", name: "مقدمة في الحوسبة", credits: 4, semester: 1, category: "college" },
  { code: "ITIS1302", name: "مبادئ الإدارة", credits: 3, semester: 1, category: "college" },
  { code: "ISLM1101", name: "قرآن كريم (1)", credits: 1, semester: 1, category: "university" },
  { code: "ITCC1301", name: "دوائر كهربائية (1)", credits: 3, semester: 1, category: "college" },
  { code: "MATH1320", name: "تفاضل وتكامل (1)", credits: 3, semester: 1, category: "college" },
  { code: "ENGL1201", name: "اللغة الإنجليزية (1)", credits: 2, semester: 1, category: "university" },

  // المستوى 1 - الفصل 2 (17 ساعة)
  { code: "ITSN2308", name: "مهارات الكتابة التقنية", credits: 3, semester: 2, category: "college", prerequisites: ["ENGL1201"] },
  { code: "ITME1101", name: "مقدمة في الهندسة", credits: 1, semester: 2, category: "college" },
  { code: "ISLM1201", name: "دراسات في الفقه", credits: 2, semester: 2, category: "university" },
  { code: "MATH1321", name: "تفاضل وتكامل (2)", credits: 3, semester: 2, category: "college", prerequisites: ["MATH1320"] },
  { code: "ITCS1309", name: "برمجة حاسوب (1)", credits: 3, semester: 2, category: "college", prerequisites: ["ITCS1401"] },
  { code: "ARAB1201", name: "اللغة العربية (1)", credits: 2, semester: 2, category: "university" },
  { code: "ITCC1311", name: "إلكترونيات (1)", credits: 3, semester: 2, category: "college", prerequisites: ["ITCC1301"] },

  // صيفي (2 ساعة)
  { code: "GEOL3203", name: "علوم البيئة", credits: 2, semester: 2, category: "elective" },

  // المستوى 2 - الفصل 1 (17 ساعة)
  { code: "ITSE2301", name: "مقدمة في هندسة البرمجيات", credits: 3, semester: 3, category: "college", prerequisites: ["ITCS1309"] },
  { code: "ISLM2201", name: "دراسات في الحديث وعلومه", credits: 2, semester: 3, category: "university" },
  { code: "ITCS2307", name: "تراكيب البيانات", credits: 3, semester: 3, category: "major", prerequisites: ["ITCS1309"] },
  { code: "ITCS2301", name: "برمجة حاسوب (2)", credits: 3, semester: 3, category: "major", prerequisites: ["ITCS1309"] },
  { code: "ITCS2311", name: "التراكيب المنفصلة", credits: 3, semester: 3, category: "major", prerequisites: ["ITCS1309"] },
  { code: "ECON1301", name: "اقتصاد جزئي", credits: 3, semester: 3, category: "major" },

  // المستوى 2 - الفصل 2 (15 ساعة)
  { code: "MATH2209", name: "مبادئ الإحصاء", credits: 2, semester: 4, category: "major" },
  { code: "ISLM2105", name: "قرآن كريم (2)", credits: 1, semester: 4, category: "university" },
  { code: "MATH2305", name: "جبر خطي (1)", credits: 3, semester: 4, category: "major", prerequisites: ["MATH1320"] },
  { code: "ITCS2310", name: "تحليل وتصميم الأنظمة", credits: 3, semester: 4, category: "major", prerequisites: ["ITCS1309"] },
  { code: "ITCS2312", name: "الخوارزميات", credits: 3, semester: 4, category: "major", prerequisites: ["ITCS2307"] },
  { code: "ITIS4306", name: "أنظمة المعلومات الإدارية", credits: 3, semester: 4, category: "major", prerequisites: ["ITIS1302"] },

  // المستوى 3 - الفصل 1 (16 ساعة)
  { code: "ISLM3107", name: "قرآن كريم (3)", credits: 1, semester: 5, category: "university" },
  { code: "ITCS4316", name: "شبكات الحاسوب", credits: 3, semester: 5, category: "major", prerequisites: ["ITCS2307"] },
  { code: "ISLM2202", name: "دراسات في العقيدة الإسلامية", credits: 2, semester: 5, category: "university" },
  { code: "ITIS3304", name: "بحوث العمليات (1)", credits: 3, semester: 5, category: "major", prerequisites: ["MATH2305"] },
  { code: "ITCS3301", name: "العمل الحر وريادة الأعمال", credits: 3, semester: 5, category: "major", prerequisites: ["ITCS2301"] },
  { code: "ITCS3403", name: "أنظمة التشغيل", credits: 4, semester: 5, category: "major", prerequisites: ["ITCS2307"] },

  // المستوى 3 - الفصل 2 (15 ساعة)
  { code: "ITCS3402", name: "نظم قواعد البيانات", credits: 4, semester: 6, category: "major", prerequisites: ["ITCS2310"] },
  { code: "ISLM4113", name: "قرآن كريم (4)", credits: 1, semester: 6, category: "university" },
  { code: "ISLM3201", name: "دراسات في التفسير وعلوم القرآن", credits: 2, semester: 6, category: "university" },
  { code: "ITCS3401", name: "تصميم صفحات الويب", credits: 4, semester: 6, category: "major", prerequisites: ["ITCS4316", "ITCS2310"] },
  { code: "ITCS3101", name: "تدريب ميداني", credits: 1, semester: 6, category: "major", prerequisites: ["ITCS2310"] },
  { code: "ITIS3301", name: "الثقافة التنظيمية", credits: 3, semester: 6, category: "major", prerequisites: ["ITIS1302"] },

  // المستوى 4 - الفصل 1 (15 ساعة)
  { code: "ITIS4330", name: "مشروع التخرج 1", credits: 3, semester: 7, category: "major", prerequisites: ["ITCS2310", "ITSE3302"] },
  { code: "ITSE4304", name: "إدارة البرمجيات", credits: 3, semester: 7, category: "major", prerequisites: ["ITSE2301", "ITCS2310"] },
  { code: "ITCS4301", name: "أمن المعلومات", credits: 3, semester: 7, category: "major", prerequisites: ["ITCS4316"] },
  { code: "ITCS4319", name: "الذكاء الاصطناعي", credits: 3, semester: 7, category: "elective", prerequisites: ["ITCS2307"] },
  { code: "ITIS4303", name: "المخاطر والإدارة الإستراتيجية", credits: 3, semester: 7, category: "elective", prerequisites: ["ITIS1302"] },

  // المستوى 4 - الفصل 2 (15 ساعة)
  { code: "ITIS4331", name: "مشروع التخرج 2", credits: 3, semester: 8, category: "major", prerequisites: ["ITIS4330"] },
  { code: "ITIS4336", name: "ريادة الأعمال في التكنولوجيا", credits: 3, semester: 8, category: "major", prerequisites: ["ITIS1302", "ITCC3301"] },
  { code: "ITIS4301", name: "أنظمة التجارة الإلكترونية", credits: 3, semester: 8, category: "major", prerequisites: ["ITIS4306"] },
  { code: "ITIS4341", name: "التسويق الإلكتروني", credits: 3, semester: 8, category: "major", prerequisites: ["ITCS3401"] },
  { code: "ITCS4346", name: "تنقيب البيانات", credits: 3, semester: 8, category: "elective", prerequisites: ["ITCS3402", "ITCS4319"] },
];

// ============================================================
// 3. الخطة التفصيلية لتخصص: هندسة أنظمة الحاسوب (خطة 9312 - 150 ساعة)
// ============================================================
const cceCourses: Course[] = [
  // الفصل 1 (18 ساعة)
  { code: "ITCS1401", name: "مقدمة في الحوسبة", credits: 4, semester: 1, category: "college" },
  { code: "ITIS1302", name: "مبادئ الإدارة", credits: 3, semester: 1, category: "college" },
  { code: "ISLM1101", name: "قرآن كريم (1)", credits: 1, semester: 1, category: "university" },
  { code: "ITCC1301", name: "دوائر كهربائية (1)", credits: 3, semester: 1, category: "college" },
  { code: "ISLM2201", name: "دراسات في الحديث وعلومه", credits: 2, semester: 1, category: "university" },
  { code: "MATH1320", name: "تفاضل وتكامل (1)", credits: 3, semester: 1, category: "college" },
  { code: "ENGL1201", name: "اللغة الإنجليزية (1)", credits: 2, semester: 1, category: "university" },

  // الفصل 2 (21 ساعة)
  { code: "ITME1101", name: "مقدمة في الهندسة", credits: 1, semester: 2, category: "college" },
  { code: "PALS4212", name: "فلسطين الأرض والإنسان", credits: 2, semester: 2, category: "university" },
  { code: "GEOL3203", name: "علوم البيئة", credits: 2, semester: 2, category: "university" },
  { code: "ISLM1201", name: "دراسات في الفقه", credits: 2, semester: 2, category: "university" },
  { code: "MATH1321", name: "تفاضل وتكامل (2)", credits: 3, semester: 2, category: "college", prerequisites: ["MATH1320"] },
  { code: "ITCC2303", name: "تصميم المنطق الرقمي", credits: 3, semester: 2, category: "college", prerequisites: ["ITCC1301"] },
  { code: "ITCS1309", name: "برمجة حاسوب (1)", credits: 3, semester: 2, category: "college", prerequisites: ["ITCS1401"] },
  { code: "ARAB1201", name: "اللغة العربية (1)", credits: 2, semester: 2, category: "university" },
  { code: "ITCC1311", name: "إلكترونيات (1)", credits: 3, semester: 2, category: "college", prerequisites: ["ITCC1301"] },

  // الفصل 3 (18 ساعة)
  { code: "ITSE2301", name: "مقدمة في هندسة البرمجيات", credits: 3, semester: 3, category: "major", prerequisites: ["ITCS1309"] },
  { code: "ITSE2101", name: "مختبر تكنولوجيا الشبكة العالمية", credits: 1, semester: 3, category: "major", prerequisites: ["ITSE2201"] },
  { code: "ITSE2201", name: "تكنولوجيا الشبكة العالمية", credits: 2, semester: 3, category: "major", prerequisites: ["ITCS1309"] },
  { code: "ITCS2307", name: "تراكيب البيانات", credits: 3, semester: 3, category: "major", prerequisites: ["ITCS1309"] },
  { code: "ITCS2301", name: "برمجة حاسوب (2)", credits: 3, semester: 3, category: "major", prerequisites: ["ITCS1309"] },
  { code: "ITCS2311", name: "التراكيب المنفصلة", credits: 3, semester: 3, category: "major", prerequisites: ["MATH1320"] },
  { code: "MATH2301", name: "احتمالات وإحصاء هندسي", credits: 3, semester: 3, category: "college", prerequisites: ["MATH1321"] },

  // الفصل 4 (20 ساعة)
  { code: "ITSE3304", name: "هندسة متطلبات البرمجيات", credits: 3, semester: 4, category: "major", prerequisites: ["ITSE2301"] },
  { code: "ITSE2304", name: "نظم قواعد البيانات", credits: 3, semester: 4, category: "major", prerequisites: ["ITCS2307"] },
  { code: "ITSE2103", name: "مختبر نظم قواعد البيانات", credits: 1, semester: 4, category: "major", prerequisites: ["ITSE2304"] },
  { code: "ITSE2104", name: "مختبر تطوير تطبيقات الشبكة العالمية", credits: 1, semester: 4, category: "major", prerequisites: ["ITSE2204"] },
  { code: "ITSE2102", name: "مختبر برمجة متقدمة", credits: 1, semester: 4, category: "major", prerequisites: ["ITSE2202"] },
  { code: "MATH2305", name: "جبر خطي (1)", credits: 3, semester: 4, category: "college", prerequisites: ["MATH1320"] },
  { code: "ITSE2204", name: "تطوير تطبيقات الشبكة العالمية", credits: 2, semester: 4, category: "major", prerequisites: ["ITSE2201"] },
  { code: "ITSE2202", name: "برمجة متقدمة", credits: 2, semester: 4, category: "major", prerequisites: ["ITCS1309"] },
  { code: "ITCS2312", name: "الخوارزميات", credits: 3, semester: 4, category: "major", prerequisites: ["ITCS2307"] },
  { code: "ISLM2105", name: "قرآن كريم (2)", credits: 1, semester: 4, category: "university" },

  // الفصل 5 (18 ساعة)
  { code: "ITSE3102", name: "مختبر تصميم البرمجيات", credits: 1, semester: 5, category: "major", prerequisites: ["ITSE3202"] },
  { code: "ITSE3201", name: "قضايا اجتماعية ومهنية", credits: 2, semester: 5, category: "major", prerequisites: ["ITSE2301"] },
  { code: "ISLM3107", name: "قرآن كريم (3)", credits: 1, semester: 5, category: "university" },
  { code: "ITCS4316", name: "شبكات الحاسوب", credits: 3, semester: 5, category: "major", prerequisites: ["ITCS3403"] },
  { code: "ISLM2202", name: "دراسات في العقيدة الإسلامية", credits: 2, semester: 5, category: "university" },
  { code: "ITSE3202", name: "تصميم البرمجيات", credits: 2, semester: 5, category: "major", prerequisites: ["ITSE3304"] },
  { code: "ITSE4304", name: "إدارة البرمجيات", credits: 3, semester: 5, category: "major", prerequisites: ["ITSE2301"] },
  { code: "ITCS3403", name: "أنظمة التشغيل", credits: 4, semester: 5, category: "major" },

  // الفصل 6 (19 ساعة)
  { code: "ITCS2308", name: "هيكلية حاسوب ولغة أسمبلي", credits: 3, semester: 6, category: "major", prerequisites: ["ITCC1311"] },
  { code: "ITSE3103", name: "مختبر تطوير ونمذجة البرمجيات", credits: 1, semester: 6, category: "major", prerequisites: ["ITSE3203"] },
  { code: "ITSE3104", name: "مختبر تطوير التطبيقات المتحركة", credits: 1, semester: 6, category: "major", prerequisites: ["ITSE4310"] },
  { code: "ISLM4113", name: "قرآن كريم (4)", credits: 1, semester: 6, category: "university" },
  { code: "ISLM3201", name: "دراسات في التفسير وعلوم القرآن", credits: 2, semester: 6, category: "university" },
  { code: "ITCS3310", name: "جرافيك حاسوب", credits: 3, semester: 6, category: "elective", prerequisites: ["MATH2305"] },
  { code: "ITSE3203", name: "تطوير ونمذجة البرمجيات", credits: 2, semester: 6, category: "major", prerequisites: ["ITSE3202"] },
  { code: "ITSE4310", name: "تطوير التطبيقات المتحركة", credits: 3, semester: 6, category: "major", prerequisites: ["ITSE2204"] },
  { code: "ITSE3101", name: "تدريب ميداني", credits: 1, semester: 6, category: "major", prerequisites: ["ITSE2204"] },
  { code: "ITSE4202", name: "العمل الحر في تكنولوجيا المعلومات", credits: 2, semester: 6, category: "major", prerequisites: ["ITSE2204"] },

  // الفصل 7 (18 ساعة)
  { code: "ITSE4322", name: "هندسة تجربة المستخدم", credits: 3, semester: 7, category: "major" },
  { code: "ITSE5330", name: "مشروع التخرج (1)", credits: 3, semester: 7, category: "major", prerequisites: ["ITSE4312"] },
  { code: "ITSE4101", name: "مختبر تصميم البرمجيات - متقدم", credits: 1, semester: 7, category: "major", prerequisites: ["ITSE4312"] },
  { code: "ITSE5306", name: "علم البيانات", credits: 3, semester: 7, category: "major", prerequisites: ["ITSE2304"] },
  { code: "ITSE4312", name: "تصميم البرمجيات - متقدم", credits: 3, semester: 7, category: "major", prerequisites: ["ITSE3202"] },
  { code: "ITCS4319", name: "الذكاء الاصطناعي", credits: 3, semester: 7, category: "major", prerequisites: ["ITCS2307"] },
  { code: "ITCS4301", name: "أمن المعلومات", credits: 2, semester: 7, category: "major", prerequisites: ["MATH2305", "ITCS1309"] },

  // الفصل 8 (18 ساعة)
  { code: "ITSE4319", name: "هندسة الذكاء الاصطناعي", credits: 3, semester: 8, category: "major", prerequisites: ["ITCS4319"] },
  { code: "ITSE5331", name: "مشروع التخرج (2)", credits: 3, semester: 8, category: "major", prerequisites: ["ITSE5330"] },
  { code: "ITSE4102", name: "مختبر اختبار البرمجيات", credits: 1, semester: 8, category: "major", prerequisites: ["ITSE4305"] },
  { code: "ITSE5336", name: "الحوسبة الموزعة والسحابية", credits: 3, semester: 8, category: "major", prerequisites: ["ITSE4310"] },
  { code: "ITSE4305", name: "اختبار البرمجيات", credits: 3, semester: 8, category: "major", prerequisites: ["ITSE3203"] },
  { code: "ITCS4346", name: "تنقيب البيانات", credits: 3, semester: 8, category: "elective", prerequisites: ["ITCS4319", "ITSE2304"] },
  { code: "ITSE5303", name: "هندسة البرمجيات - متقدم", credits: 2, semester: 8, category: "elective", prerequisites: ["ITSE4308"] },
];

// ============================================================
// 4. الخطة التفصيلية لتخصص: هندسة الحاسوب والاتصالات (خطة 9313 - 150 ساعة)
// ============================================================
const telecomCourses: Course[] = [
  // الفصل 1 (18 ساعة)
  { code: "ITCS1401", name: "مقدمة في الحوسبة", credits: 4, semester: 1, category: "college" },
  { code: "ITIS1302", name: "مبادئ الإدارة", credits: 3, semester: 1, category: "college" },
  { code: "ISLM1101", name: "قرآن كريم (1)", credits: 1, semester: 1, category: "university" },
  { code: "ITCC1301", name: "دوائر كهربائية (1)", credits: 3, semester: 1, category: "college" },
  { code: "ISLM2201", name: "دراسات في الحديث وعلومه", credits: 2, semester: 1, category: "university" },
  { code: "MATH1320", name: "تفاضل وتكامل (1)", credits: 3, semester: 1, category: "college" },
  { code: "ENGL1201", name: "اللغة الإنجليزية (1)", credits: 2, semester: 1, category: "university" },

  // الفصل 2 (21 ساعة)
  { code: "ITME1101", name: "مقدمة في الهندسة", credits: 1, semester: 2, category: "college" },
  { code: "PALS4212", name: "فلسطين الأرض والإنسان", credits: 2, semester: 2, category: "university" },
  { code: "GEOL3203", name: "علوم البيئة", credits: 2, semester: 2, category: "university" },
  { code: "ISLM1201", name: "دراسات في الفقه", credits: 2, semester: 2, category: "university" },
  { code: "MATH1321", name: "تفاضل وتكامل (2)", credits: 3, semester: 2, category: "college", prerequisites: ["MATH1320"] },
  { code: "ITCC2303", name: "تصميم المنطق الرقمي", credits: 3, semester: 2, category: "college", prerequisites: ["ITCC1311"] },
  { code: "ITCS1309", name: "برمجة حاسوب (1)", credits: 3, semester: 2, category: "college", prerequisites: ["ITCS1401"] },
  { code: "ARAB1201", name: "اللغة العربية (1)", credits: 2, semester: 2, category: "university" },
  { code: "ITCC1311", name: "إلكترونيات (1)", credits: 3, semester: 2, category: "college", prerequisites: ["ITCC1301"] },

  // الفصل 3 (18 ساعة)
  { code: "ITCC2101", name: "مختبر دوائر كهربائية", credits: 1, semester: 3, category: "major", prerequisites: ["ITCC2302"] },
  { code: "ITME2101", name: "مختبر الرسم الهندسي", credits: 1, semester: 3, category: "college", prerequisites: ["ITME2201"] },
  { code: "ITCS4316", name: "شبكات الحاسوب", credits: 3, semester: 3, category: "major", prerequisites: ["ITCC1311"] },
  { code: "ITCC2302", name: "دوائر كهربائية (2)", credits: 3, semester: 3, category: "major", prerequisites: ["ITCC1301"] },
  { code: "ISLM2202", name: "دراسات في العقيدة الإسلامية", credits: 2, semester: 3, category: "university" },
  { code: "ITCS2301", name: "برمجة حاسوب (2)", credits: 3, semester: 3, category: "major", prerequisites: ["ITCS1309"] },
  { code: "ITME2201", name: "الرسم الهندسي", credits: 2, semester: 3, category: "college" },
  { code: "MATH2301", name: "احتمالات وإحصاء هندسي", credits: 3, semester: 3, category: "college", prerequisites: ["MATH1321"] },

  // الفصل 4 (19 ساعة)
  { code: "ITME2121", name: "ورش هندسية", credits: 1, semester: 4, category: "college" },
  { code: "ITCC2104", name: "مختبر الإشارات والأنظمة", credits: 1, semester: 4, category: "major", prerequisites: ["ITCC2304"] },
  { code: "ITCC2102", name: "مختبر إلكترونيات", credits: 1, semester: 4, category: "major", prerequisites: ["ITCC2331"] },
  { code: "ITCC3311", name: "كهرومغناطيسية (1)", credits: 3, semester: 4, category: "major", prerequisites: ["MATH2308"] },
  { code: "ISLM2105", name: "قرآن كريم (2)", credits: 1, semester: 4, category: "university" },
  { code: "MATH2305", name: "جبر خطي (1)", credits: 3, semester: 4, category: "college", prerequisites: ["MATH1321"] },
  { code: "ITCS2312", name: "الخوارزميات", credits: 3, semester: 4, category: "major", prerequisites: ["ITCS2301"] },
  { code: "ITCC2331", name: "إلكترونيات (2)", credits: 3, semester: 4, category: "major", prerequisites: ["ITCC1311"] },
  { code: "ITCC2304", name: "مقدمة في الإشارات والأنظمة", credits: 3, semester: 4, category: "major", prerequisites: ["MATH1321"] },

  // الفصل 5 (19 ساعة)
  { code: "MATH2308", name: "معادلات تفاضلية عادية (1)", credits: 3, semester: 5, category: "college", prerequisites: ["MATH2305"] },
  { code: "ITCC3101", name: "مختبر المعالجات الدقيقة وواصلات الحاسوب", credits: 1, semester: 5, category: "major", prerequisites: ["ITCC3201"] },
  { code: "ITCC4312", name: "كهرومغناطيسية (2)", credits: 3, semester: 5, category: "major", prerequisites: ["ITCC3311"] },
  { code: "ITCS2307", name: "تراكيب البيانات", credits: 3, semester: 5, category: "major", prerequisites: ["ITCS1309"] },
  { code: "ITCC3201", name: "المعالجات الدقيقة وواصلات الحاسوب", credits: 2, semester: 5, category: "major", prerequisites: ["ITCC2303"] },
  { code: "ITCS3403", name: "أنظمة التشغيل", credits: 4, semester: 5, category: "major", prerequisites: ["ITCS2301"] },
  { code: "ITCS4301", name: "أمن المعلومات", credits: 3, semester: 5, category: "major", prerequisites: ["MATH2305"] },

  // الفصل 6 (19 ساعة)
  { code: "ITCC4325", name: "مقدمة في معالجة الإشارات الرقمية", credits: 3, semester: 6, category: "major", prerequisites: ["ITCC2304"] },
  { code: "ITME3101", name: "مختبر المتحكم الدقيق: البرمجة والتطبيقات", credits: 1, semester: 6, category: "major", prerequisites: ["ITME3201"] },
  { code: "ISLM3201", name: "دراسات في التفسير وعلوم القرآن", credits: 2, semester: 6, category: "university" },
  { code: "ITCS3401", name: "تصميم صفحات الويب", credits: 4, semester: 6, category: "major", prerequisites: ["ITCS1309"] },
  { code: "ITCC4101", name: "تدريب ميداني", credits: 1, semester: 6, category: "major" },
  { code: "ITME3201", name: "المتحكم الدقيق: البرمجة والتطبيقات", credits: 2, semester: 6, category: "major", prerequisites: ["ITCC2331"] },
  { code: "ITCC3321", name: "الاتصالات التناظرية", credits: 3, semester: 6, category: "major", prerequisites: ["ITCC2304"] },
  { code: "ITCC5336", name: "أنظمة اتصالات الأقمار الصناعية", credits: 3, semester: 6, category: "elective", prerequisites: ["ITCC3321"] },

  // الفصل 7 (18 ساعة)
  { code: "ITCC4201", name: "مشروع التخرج (1)", credits: 2, semester: 7, category: "major" },
  { code: "ITCC4123", name: "مختبر الاتصالات", credits: 1, semester: 7, category: "major", prerequisites: ["ITCC3321"] },
  { code: "ISLM3107", name: "قرآن كريم (3)", credits: 1, semester: 7, category: "university" },
  { code: "ITCC4301", name: "البرمجة بلغة البايثون", credits: 3, semester: 7, category: "major", prerequisites: ["ITCS2301"] },
  { code: "ITCC4322", name: "الاتصالات الرقمية", credits: 3, semester: 7, category: "major", prerequisites: ["ITCC3321"] },
  { code: "ITCC5327", name: "اتصالات لاسلكية", credits: 3, semester: 7, category: "major", prerequisites: ["ITCC3321"] },
  { code: "ITCC4324", name: "اتصالات الألياف الضوئية", credits: 3, semester: 7, category: "major", prerequisites: ["ITCC4312"] },
  { code: "ITCS4319", name: "الذكاء الاصطناعي", credits: 2, semester: 7, category: "elective", prerequisites: ["ITCS2307"] },

  // الفصل 8 (18 ساعة)
  { code: "ITCC5328", name: "هندسة أنظمة شبكات الاتصالات", credits: 3, semester: 8, category: "major", prerequisites: ["ITCC5327"] },
  { code: "ITCS3402", name: "نظم قواعد البيانات", credits: 4, semester: 8, category: "major", prerequisites: ["ITCS2301"] },
  { code: "ITCC4202", name: "مشروع التخرج (2)", credits: 2, semester: 8, category: "major" },
  { code: "ISLM4113", name: "قرآن كريم (4)", credits: 1, semester: 8, category: "university" },
  { code: "ITSE4310", name: "تطوير التطبيقات المتحركة", credits: 3, semester: 8, category: "major", prerequisites: ["ITCS3401"] },
  { code: "ITME4302", name: "الرياضيات والمحاكاه للمهندسين", credits: 3, semester: 8, category: "college", prerequisites: ["MATH2301"] },
  { code: "ITCC5302", name: "شبكات حاسوب متقدمة", credits: 2, semester: 8, category: "elective", prerequisites: ["ITCC5328"] },
];

// ============================================================
// 5. الخطة التفصيلية لتخصص: هندسة الطاقة المتجددة (خطة 9315 - 150 ساعة)
// ============================================================
const energyCourses: Course[] = [
  // الفصل 1 (18 ساعة)
  { code: "ITCS1401", name: "مقدمة في الحوسبة", credits: 4, semester: 1, category: "college" },
  { code: "ITIS1302", name: "مبادئ الإدارة", credits: 3, semester: 1, category: "college" },
  { code: "ISLM1101", name: "قرآن كريم (1)", credits: 1, semester: 1, category: "university" },
  { code: "ITCC1301", name: "دوائر كهربائية (1)", credits: 3, semester: 1, category: "college" },
  { code: "ISLM2201", name: "دراسات في الحديث وعلومه", credits: 2, semester: 1, category: "university" },
  { code: "MATH1320", name: "تفاضل وتكامل (1)", credits: 3, semester: 1, category: "college" },
  { code: "ENGL1201", name: "اللغة الإنجليزية (1)", credits: 2, semester: 1, category: "university" },

  // الفصل 2 (21 ساعة)
  { code: "ITME1101", name: "مقدمة في الهندسة", credits: 1, semester: 2, category: "college" },
  { code: "PALS4212", name: "فلسطين الأرض والإنسان", credits: 2, semester: 2, category: "university" },
  { code: "GEOL3203", name: "علوم البيئة", credits: 2, semester: 2, category: "university" },
  { code: "ISLM1201", name: "دراسات في الفقه", credits: 2, semester: 2, category: "university" },
  { code: "MATH1321", name: "تفاضل وتكامل (2)", credits: 3, semester: 2, category: "college", prerequisites: ["MATH1320"] },
  { code: "ITCC2303", name: "تصميم المنطق الرقمي", credits: 3, semester: 2, category: "college" },
  { code: "ITCS1309", name: "برمجة حاسوب (1)", credits: 3, semester: 2, category: "college", prerequisites: ["ITCS1401"] },
  { code: "ARAB1201", name: "اللغة العربية (1)", credits: 2, semester: 2, category: "university" },
  { code: "ITCC1311", name: "إلكترونيات (1)", credits: 3, semester: 2, category: "college", prerequisites: ["ITCC1301"] },

  // الفصل 3 (19 ساعة)
  { code: "ITME3329", name: "هندسة وعلم المواد", credits: 3, semester: 3, category: "major" },
  { code: "ITME2302", name: "هندسة ميكانيكية (1)", credits: 3, semester: 3, category: "major" },
  { code: "ITME2102", name: "مختبر هندسة وعلم المواد", credits: 1, semester: 3, category: "major", prerequisites: ["ITME3329"] },
  { code: "ITCC2101", name: "مختبر دوائر كهربائية", credits: 1, semester: 3, category: "major", prerequisites: ["ITCC2302"] },
  { code: "ITME2101", name: "مختبر الرسم الهندسي", credits: 1, semester: 3, category: "college", prerequisites: ["ITME2201"] },
  { code: "ITCC2302", name: "دوائر كهربائية (2)", credits: 3, semester: 3, category: "major", prerequisites: ["ITCC1301"] },
  { code: "ISLM2202", name: "دراسات في العقيدة الإسلامية", credits: 2, semester: 3, category: "university" },
  { code: "ITME2201", name: "الرسم الهندسي", credits: 2, semester: 3, category: "college" },
  { code: "MATH2301", name: "احتمالات وإحصاء هندسي", credits: 3, semester: 3, category: "college", prerequisites: ["MATH1321"] },

  // الفصل 4 (20 ساعة)
  { code: "ITME2121", name: "ورش هندسية", credits: 1, semester: 4, category: "college" },
  { code: "ITME2303", name: "هندسة ميكانيكية (2)", credits: 3, semester: 4, category: "major", prerequisites: ["ITME2302"] },
  { code: "ITRE2330", name: "مقدمة في الطاقة المتجددة", credits: 3, semester: 4, category: "major" },
  { code: "ITCC2104", name: "مختبر الإشارات والأنظمة", credits: 1, semester: 4, category: "major", prerequisites: ["ITCC2304"] },
  { code: "ITCC2102", name: "مختبر إلكترونيات", credits: 1, semester: 4, category: "major", prerequisites: ["ITCC2331"] },
  { code: "ISLM2105", name: "قرآن كريم (2)", credits: 1, semester: 4, category: "university" },
  { code: "ITRE3335", name: "توليد الطاقة الكهربائية", credits: 3, semester: 4, category: "major", prerequisites: ["ITCC2302"] },
  { code: "ITCC2331", name: "إلكترونيات (2)", credits: 3, semester: 4, category: "major", prerequisites: ["ITCC1311"] },
  { code: "ITCC2304", name: "مقدمة في الإشارات والأنظمة", credits: 3, semester: 4, category: "major", prerequisites: ["MATH1321"] },
  { code: "MATH2308", name: "معادلات تفاضلية عادية (1)", credits: 1, semester: 4, category: "college" },

  // الفصل 5 (19 ساعة)
  { code: "ITRE2350", name: "ميكانيكا الموائع", credits: 3, semester: 5, category: "major", prerequisites: ["ITME2302"] },
  { code: "MATH2308", name: "معادلات تفاضلية عادية (2)", credits: 2, semester: 5, category: "college" },
  { code: "ITRE2151", name: "مختبر ميكانيكا الموائع", credits: 1, semester: 5, category: "major", prerequisites: ["ITRE2350"] },
  { code: "ITME3105", name: "مختبر الماكينات الكهربية", credits: 1, semester: 5, category: "major", prerequisites: ["ITME3306"] },
  { code: "ITRE3156", name: "مختبر التركيبات الكهربائية والسلامة العامة", credits: 1, semester: 5, category: "major", prerequisites: ["ITRE3233"] },
  { code: "ITME3102", name: "مختبر أنظمة التحكم", credits: 1, semester: 5, category: "major", prerequisites: ["ITME3302"] },
  { code: "ITME3306", name: "ماكينات كهربية", credits: 3, semester: 5, category: "major", prerequisites: ["ITME2302"] },
  { code: "ITMD5139", name: "قضايا مهنية في الهندسة", credits: 1, semester: 5, category: "college" },
  { code: "ITME3302", name: "أنظمة التحكم", credits: 3, semester: 5, category: "major", prerequisites: ["ITCC2304"] },
  { code: "ITRE3233", name: "التركيبات الكهربائية والسلامة العامة", credits: 2, semester: 5, category: "major", prerequisites: ["ITME3306"] },
  { code: "ISLM3107", name: "قرآن كريم (3)", credits: 1, semester: 5, category: "university" },

  // الفصل 6 (19 ساعة)
  { code: "ITME3104", name: "مختبر أنظمة إلكترونيات القوى", credits: 1, semester: 6, category: "major", prerequisites: ["ITME3203"] },
  { code: "ITRE3132", name: "مختبر أنظمة الطاقة الكهروضوئية", credits: 1, semester: 6, category: "major", prerequisites: ["ITRE3331"] },
  { code: "ITME3101", name: "مختبر المتحكم الدقيق: البرمجة والتطبيقات", credits: 1, semester: 6, category: "major", prerequisites: ["ITME3201"] },
  { code: "ITRE3133", name: "مختبر أجهزة قياس الطاقة", credits: 1, semester: 6, category: "major", prerequisites: ["ITRE3232"] },
  { code: "ISLM3201", name: "دراسات في التفسير وعلوم القرآن", credits: 2, semester: 6, category: "university" },
  { code: "ITRE4133", name: "تدريب ميداني", credits: 1, semester: 6, category: "major" },
  { code: "ITME3203", name: "أنظمة إلكترونيات القوى", credits: 2, semester: 6, category: "major", prerequisites: ["ITCC2331"] },
  { code: "ITME3201", name: "المتحكم الدقيق: البرمجة والتطبيقات", credits: 2, semester: 6, category: "major", prerequisites: ["ITCC2331"] },
  { code: "ITME3301", name: "الديناميكا الحرارية", credits: 3, semester: 6, category: "major", prerequisites: ["ITRE2350"] },
  { code: "ITRE3331", name: "أنظمة الطاقة الكهروضوئية", credits: 3, semester: 6, category: "major", prerequisites: ["ITCC2331"] },
  { code: "ITRE3232", name: "أجهزة قياس الطاقة", credits: 2, semester: 6, category: "major", prerequisites: ["ITRE2330"] },

  // الفصل 7 (17 ساعة)
  { code: "ITRE4201", name: "مشروع التخرج (1)", credits: 2, semester: 7, category: "major" },
  { code: "ITRE4135", name: "مختبر أنظمة الطاقة الشمسية الحرارية", credits: 1, semester: 7, category: "major", prerequisites: ["ITRE4235"] },
  { code: "ITRE4304", name: "دمج الطاقة المتجددة في شبكة الكهرباء", credits: 3, semester: 7, category: "major", prerequisites: ["ITME3203"] },
  { code: "ITRE4303", name: "تخطيط وتشغيل أنظمة الطاقة الكهربائية", credits: 3, semester: 7, category: "major", prerequisites: ["ITRE3331"] },
  { code: "ITME5201", name: "الطاقة الحيوية", credits: 2, semester: 7, category: "major", prerequisites: ["ITRE2330"] },
  { code: "ITRE3355", name: "الانتقال الحراري", credits: 3, semester: 7, category: "major", prerequisites: ["ITME3301"] },
  { code: "ITME4306", name: "عناصر الماكينات الميكانيكية", credits: 3, semester: 7, category: "elective", prerequisites: ["ITME2303"] },

  // الفصل 8 (17 ساعة)
  { code: "ITRE4202", name: "مشروع التخرج (2)", credits: 2, semester: 8, category: "major" },
  { code: "ISLM4113", name: "قرآن كريم (4)", credits: 1, semester: 8, category: "university" },
  { code: "ITRE5201", name: "أنظمة التكييف والتبريد", credits: 2, semester: 8, category: "major", prerequisites: ["ITRE3355"] },
  { code: "ITME4302", name: "الرياضيات والمحاكاه للمهندسين", credits: 3, semester: 8, category: "college", prerequisites: ["MATH2301"] },
  { code: "ITRE4337", name: "أنظمة طاقة الرياح", credits: 3, semester: 8, category: "major", prerequisites: ["ITME3306"] },
  { code: "ITRE4334", name: "أنظمة تخزين الطاقة", credits: 3, semester: 8, category: "major", prerequisites: ["ITRE2330"] },
  { code: "ITRE5339", name: "تصميم المباني الموفرة للطاقة", credits: 3, semester: 8, category: "elective", prerequisites: ["ITRE3232"] },
];

// ============================================================
// 6. الخطة التفصيلية لتخصص: هندسة المعدات الطبية (خطة 9316 - 150 ساعة)
// ============================================================
const biomedicalCourses: Course[] = [
  // الفصل 1 (18 ساعة)
  { code: "ITCS1401", name: "مقدمة في الحوسبة", credits: 4, semester: 1, category: "college" },
  { code: "ITIS1302", name: "مبادئ الإدارة", credits: 3, semester: 1, category: "college" },
  { code: "ISLM1101", name: "قرآن كريم (1)", credits: 1, semester: 1, category: "university" },
  { code: "ITCC1301", name: "دوائر كهربائية (1)", credits: 3, semester: 1, category: "college" },
  { code: "ISLM2201", name: "دراسات في الحديث وعلومه", credits: 2, semester: 1, category: "university" },
  { code: "MATH1320", name: "تفاضل وتكامل (1)", credits: 3, semester: 1, category: "college" },
  { code: "ENGL1201", name: "اللغة الإنجليزية (1)", credits: 2, semester: 1, category: "university" },

  // الفصل 2 (21 ساعة)
  { code: "ITME1101", name: "مقدمة في الهندسة", credits: 1, semester: 2, category: "college" },
  { code: "PALS4212", name: "فلسطين الأرض والإنسان", credits: 2, semester: 2, category: "university" },
  { code: "GEOL3203", name: "علوم البيئة", credits: 2, semester: 2, category: "university" },
  { code: "ISLM1201", name: "دراسات في الفقه", credits: 2, semester: 2, category: "university" },
  { code: "MATH1321", name: "تفاضل وتكامل (2)", credits: 3, semester: 2, category: "college", prerequisites: ["MATH1320"] },
  { code: "ITCC2303", name: "تصميم المنطق الرقمي", credits: 3, semester: 2, category: "college", prerequisites: ["ITCC1311"] },
  { code: "ITCS1309", name: "برمجة حاسوب (1)", credits: 3, semester: 2, category: "college", prerequisites: ["ITCS1401"] },
  { code: "ARAB1201", name: "اللغة العربية (1)", credits: 2, semester: 2, category: "university" },
  { code: "ITCC1311", name: "إلكترونيات (1)", credits: 3, semester: 2, category: "college", prerequisites: ["ITCC1301"] },

  // الفصل 3 (19 ساعة)
  { code: "ITME2302", name: "هندسة ميكانيكية (1)", credits: 3, semester: 3, category: "major" },
  { code: "ITCC2101", name: "مختبر دوائر كهربائية", credits: 1, semester: 3, category: "major" },
  { code: "ITME2101", name: "مختبر الرسم الهندسي", credits: 1, semester: 3, category: "college", prerequisites: ["ITME2201"] },
  { code: "ITCC2302", name: "دوائر كهربائية (2)", credits: 3, semester: 3, category: "major", prerequisites: ["ITCC1301"] },
  { code: "ITMD2310", name: "الكيمياء الهندسية", credits: 3, semester: 3, category: "major" },
  { code: "ITME2201", name: "الرسم الهندسي", credits: 2, semester: 3, category: "college" },
  { code: "MATH2301", name: "احتمالات وإحصاء هندسي", credits: 3, semester: 3, category: "college", prerequisites: ["MATH1321"] },
  { code: "ITMD2301", name: "أجهزة طبية (1)", credits: 3, semester: 3, category: "major", prerequisites: ["ITCC1311"] },

  // الفصل 4 (18 ساعة)
  { code: "ITME2121", name: "ورش هندسية", credits: 1, semester: 4, category: "college" },
  { code: "ITCC2102", name: "مختبر إلكترونيات", credits: 1, semester: 4, category: "major", prerequisites: ["ITCC2331"] },
  { code: "ISLM2105", name: "قرآن كريم (2)", credits: 1, semester: 4, category: "university" },
  { code: "BIOL1301", name: "بيولوجيا عامة", credits: 3, semester: 4, category: "major" },
  { code: "ITMD3315", name: "الميكانيكا الحيوية (1)", credits: 3, semester: 4, category: "major", prerequisites: ["ITME2302"] },
  { code: "PHYS2348", name: "الفيزياء الطبية", credits: 3, semester: 4, category: "major", prerequisites: ["MATH2308"] },
  { code: "ITCC2331", name: "إلكترونيات (2)", credits: 3, semester: 4, category: "major", prerequisites: ["ITCC1311"] },
  { code: "ITMD2302", name: "أجهزة طبية (2)", credits: 3, semester: 4, category: "major", prerequisites: ["ITMD2301"] },

  // الفصل 5 (19 ساعة)
  { code: "MATH2308", name: "معادلات تفاضلية عادية (1)", credits: 3, semester: 5, category: "college", prerequisites: ["MATH1321"] },
  { code: "ITME3102", name: "مختبر أنظمة التحكم", credits: 1, semester: 5, category: "major", prerequisites: ["ITME3302"] },
  { code: "ISLM3107", name: "قرآن كريم (3)", credits: 1, semester: 5, category: "university" },
  { code: "ISLM2202", name: "دراسات في العقيدة الإسلامية", credits: 2, semester: 5, category: "university" },
  { code: "ITMD2303", name: "تشريح وعلم وظائف الأعضاء", credits: 3, semester: 5, category: "major", prerequisites: ["ITMD2310", "BIOL1301", "PHYS2348"] },
  { code: "ITMD3314", name: "القياسات والأجهزة", credits: 3, semester: 5, category: "major", prerequisites: ["ITCC2331"] },
  { code: "ITME3302", name: "أنظمة التحكم", credits: 3, semester: 5, category: "major", prerequisites: ["ITCC2304"] },
  { code: "ITMD3301", name: "أجهزة التصوير الطبي (1)", credits: 3, semester: 5, category: "major", prerequisites: ["ITMD2301"] },

  // الفصل 6 (18 ساعة)
  { code: "ITME3104", name: "مختبر أنظمة إلكترونيات القوى", credits: 1, semester: 6, category: "major", prerequisites: ["ITME3203"] },
  { code: "ITME3101", name: "مختبر المتحكم الدقيق: البرمجة والتطبيقات", credits: 1, semester: 6, category: "major", prerequisites: ["ITME3201"] },
  { code: "ITCC2104", name: "مختبر الإشارات والأنظمة", credits: 1, semester: 6, category: "major", prerequisites: ["ITCC2304"] },
  { code: "ISLM3201", name: "دراسات في التفسير وعلوم القرآن", credits: 2, semester: 6, category: "university" },
  { code: "ITMD3102", name: "تدريب ميداني", credits: 1, semester: 6, category: "major" },
  { code: "ITME3203", name: "أنظمة إلكترونيات القوى", credits: 2, semester: 6, category: "major", prerequisites: ["ITCC2331"] },
  { code: "ITME3201", name: "المتحكم الدقيق: البرمجة والتطبيقات", credits: 2, semester: 6, category: "major", prerequisites: ["ITCC2331"] },
  { code: "ITMD3303", name: "أجهزة التصوير الطبي (2)", credits: 3, semester: 6, category: "major", prerequisites: ["ITMD3301"] },
  { code: "ITMD4321", name: "أجهزة التحاليل", credits: 3, semester: 6, category: "major", prerequisites: ["ITMD2301"] },
  { code: "ITCC2304", name: "مقدمة في الإشارات والأنظمة", credits: 2, semester: 6, category: "major", prerequisites: ["MATH1321"] },

  // الفصل 7 (18 ساعة)
  { code: "ITMD4201", name: "مشروع التخرج (1)", credits: 2, semester: 7, category: "major" },
  { code: "ITME3105", name: "مختبر الماكينات الكهربية", credits: 1, semester: 7, category: "major", prerequisites: ["ITME3306"] },
  { code: "ITME3306", name: "ماكينات كهربية", credits: 3, semester: 7, category: "major", prerequisites: ["ITME2302"] },
  { code: "ITMD5139", name: "قضايا مهنية في الهندسة", credits: 1, semester: 7, category: "college" },
  { code: "ITME4306", name: "عناصر الماكينات الميكانيكية", credits: 3, semester: 7, category: "major", prerequisites: ["ITME2302"] },
  { code: "ITMD5319", name: "تقنية التصنيع والإنتاج", credits: 3, semester: 7, category: "major", prerequisites: ["ITME2201"] },
  { code: "ITMD4320", name: "المواد الحيوية", credits: 3, semester: 7, category: "major", prerequisites: ["ITMD2310"] },
  { code: "ITCS3301", name: "العمل الحر وريادة الأعمال", credits: 2, semester: 7, category: "elective", prerequisites: ["ITIS1302"] },

  // الفصل 8 (18 ساعة)
  { code: "ITMD4202", name: "مشروع التخرج (2)", credits: 2, semester: 8, category: "major" },
  { code: "ISLM4113", name: "قرآن كريم (4)", credits: 1, semester: 8, category: "university" },
  { code: "ITMD3316", name: "تقنية معلومات الرعاية الصحية", credits: 3, semester: 8, category: "major", prerequisites: ["ITMD2301", "ITCS1309"] },
  { code: "ITMD5124", name: "تصميم منشآت الرعاية الصحية", credits: 1, semester: 8, category: "major", prerequisites: ["ITME2201"] },
  { code: "ITMD3302", name: "الهندسة السريرية", credits: 3, semester: 8, category: "major", prerequisites: ["ITMD2301", "ITMD2303"] },
  { code: "ITME5341", name: "التقنيات المساعدة في هندسة التأهيل", credits: 3, semester: 8, category: "major", prerequisites: ["ITMD2301"] },
  { code: "ITMD5330", name: "معالجة الإشارات والصور الحيوية الطبية", credits: 3, semester: 8, category: "elective", prerequisites: ["ITCC2304"] },
  { code: "ITCC4325", name: "مقدمة في معالجة الإشارات الرقمية", credits: 3, semester: 8, category: "elective", prerequisites: ["ITCC2304"] },
];

// ============================================================
// 7. الخطة التفصيلية لتخصص: الوسائط المتعددة التطبيقية (خطة 9291 - 128 ساعة)
// ============================================================
const multimediaCourses: Course[] = [
  // الفصل 1 (16 ساعة)
  { code: "ITAM1301", name: "مقدمة في الوسائط المتعددة", credits: 3, semester: 1, category: "major" },
  { code: "ITCS1401", name: "مقدمة في الحوسبة", credits: 4, semester: 1, category: "college" },
  { code: "ITIS1302", name: "مبادئ الإدارة", credits: 3, semester: 1, category: "college" },
  { code: "ISLM1101", name: "قرآن كريم (1)", credits: 1, semester: 1, category: "university" },
  { code: "ITAM1302", name: "رياضيات للوسائط المتعددة", credits: 3, semester: 1, category: "college" },
  { code: "ENGL1201", name: "اللغة الإنجليزية (1)", credits: 2, semester: 1, category: "university" },

  // الفصل 2 (17 ساعة)
  { code: "ITAM1305", name: "مبادئ التصميم", credits: 3, semester: 2, category: "major", prerequisites: ["ITAM1301"] },
  { code: "ISLM1201", name: "دراسات في الفقه", credits: 2, semester: 2, category: "university" },
  { code: "ITAM1404", name: "تصميم صفحات الويب", credits: 4, semester: 2, category: "major", prerequisites: ["ITAM1301"] },
  { code: "ITAM1303", name: "تحرير وإخراج المحتوى الرقمي", credits: 3, semester: 2, category: "major" },
  { code: "ITCS1309", name: "برمجة حاسوب (1)", credits: 3, semester: 2, category: "major", prerequisites: ["ITCS1401"] },
  { code: "ARAB1201", name: "اللغة العربية (1)", credits: 2, semester: 2, category: "university" },

  // الفصل 3 (17 ساعة)
  { code: "ITAM2300", name: "نظرية الألوان", credits: 3, semester: 3, category: "major", prerequisites: ["ITAM1305"] },
  { code: "ITCS4347", name: "معالجة الصور", credits: 3, semester: 3, category: "major" },
  { code: "ISLM2201", name: "دراسات في الحديث وعلومه", credits: 2, semester: 3, category: "university" },
  { code: "ITAM2301", name: "تصوير البيانات", credits: 3, semester: 3, category: "major", prerequisites: ["ITAM1301"] },
  { code: "ITCS2301", name: "برمجة حاسوب (2)", credits: 3, semester: 3, category: "major", prerequisites: ["ITCS1309"] },
  { code: "ITAM2302", name: "برمجة الويب", credits: 3, semester: 3, category: "major", prerequisites: ["ITCS1309"] },

  // الفصل 4 (17 ساعة)
  { code: "ITAM2306", name: "مقدمة في التصوير", credits: 3, semester: 4, category: "major" },
  { code: "ITAM2304", name: "معالجة الصوتيات والفيديو الرقمية", credits: 3, semester: 4, category: "major", prerequisites: ["ITAM2301"] },
  { code: "ISLM2105", name: "قرآن كريم (2)", credits: 1, semester: 4, category: "university" },
  { code: "ITCS2310", name: "تحليل وتصميم الأنظمة", credits: 3, semester: 4, category: "major", prerequisites: ["ITCS1309"] },
  { code: "ITAM2305", name: "الواقع الافتراضي", credits: 3, semester: 4, category: "major", prerequisites: ["ITAM2301"] },
  { code: "ITAM2309", name: "الرسم الحر", credits: 3, semester: 4, category: "major" },
  { code: "ITAM2103", name: "أخلاقيات المهنة", credits: 1, semester: 4, category: "major" },

  // الفصل 5 (15 ساعة)
  { code: "ISLM3107", name: "قرآن كريم (3)", credits: 1, semester: 5, category: "university" },
  { code: "ISLM2202", name: "دراسات في العقيدة الإسلامية", credits: 2, semester: 5, category: "university" },
  { code: "ITCS4322", name: "تفاعل الإنسان والحاسوب", credits: 3, semester: 5, category: "major", prerequisites: ["ITCS2310"] },
  { code: "ITAM3333", name: "تطوير وإدارة البرمجيات", credits: 3, semester: 5, category: "major", prerequisites: ["ITCS1309"] },
  { code: "ITAM3302", name: "الواقع المعزز", credits: 3, semester: 5, category: "major", prerequisites: ["ITAM2305"] },
  { code: "ITAM3301", name: "الرسوم المتحركة ثنائية الأبعاد", credits: 3, semester: 5, category: "major", prerequisites: ["ITAM2304", "ITCS1309"] },

  // الفصل 6 (17 ساعة)
  { code: "ITCS3402", name: "نظم قواعد البيانات", credits: 4, semester: 6, category: "major", prerequisites: ["ITCS2310"] },
  { code: "ISLM4113", name: "قرآن كريم (4)", credits: 1, semester: 6, category: "university" },
  { code: "ISLM3201", name: "دراسات في التفسير وعلوم القرآن", credits: 2, semester: 6, category: "university" },
  { code: "ITCS3310", name: "جرافيك حاسوب", credits: 3, semester: 6, category: "major", prerequisites: ["ITAM1302", "ITCS1309"] },
  { code: "ITAM3103", name: "تدريب ميداني", credits: 1, semester: 6, category: "major", prerequisites: ["ITCS2310"] },
  { code: "ITAM3304", name: "العمل الحر في الوسائط المتعددة", credits: 3, semester: 6, category: "major", prerequisites: ["ITCS2301"] },
  { code: "ITAM3305", name: "الرسوم المتحركة ثلاثية الأبعاد", credits: 3, semester: 6, category: "major", prerequisites: ["ITAM3301"] },

  // الفصل 7 (14 ساعة)
  { code: "ITSN2308", name: "مهارات الكتابة التقنية", credits: 3, semester: 7, category: "major", prerequisites: ["ENGL1201"] },
  { code: "ITAM4330", name: "مشروع تخرج 1", credits: 3, semester: 7, category: "major", prerequisites: ["ITCS2310"] },
  { code: "PALS4212", name: "فلسطين الأرض والإنسان", credits: 2, semester: 7, category: "university" },
  { code: "ITCS4301", name: "أمن المعلومات", credits: 3, semester: 7, category: "major", prerequisites: ["ITCS2301"] },
  { code: "ITCS4339", name: "برمجة ألعاب الحاسوب", credits: 3, semester: 7, category: "elective", prerequisites: ["ITAM4301"] },

  // الفصل 8 (15 ساعة)
  { code: "ITAM4331", name: "مشروع تخرج 2", credits: 3, semester: 8, category: "major", prerequisites: ["ITAM4330"] },
  { code: "ITAM4301", name: "برمجة الموبيل", credits: 3, semester: 8, category: "major", prerequisites: ["ITCS3402", "ITCS2310"] },
  { code: "ITIS4341", name: "التسويق الإلكتروني", credits: 3, semester: 8, category: "major", prerequisites: ["ITIS1302"] },
  { code: "GEOL3203", name: "علوم البيئة", credits: 2, semester: 8, category: "university" },
  { code: "ITCS4327", name: "جرافيك متقدم", credits: 3, semester: 8, category: "elective", prerequisites: ["ITCS3310"] },
  { code: "ITAM4328", name: "موضوع مختار في الوسائط المتعددة 2", credits: 1, semester: 8, category: "elective", prerequisites: ["ITAM3305"] },
];

// ============================================================
// 8. الخطة التفصيلية لتخصص: هندسة الميكاترونكس (خطة 9314 - 150 ساعة)
// 142 إجباري + 8 اختياري (2 جامعة + 6 تخصص)
// ============================================================
const mechatronicsCourses: Course[] = [
  // المستوى 1 - الفصل 1 (18 ساعة)
  { code: "ITCS1401", name: "مقدمة في الحوسبة", credits: 4, semester: 1, category: "college" },
  { code: "ITIS1302", name: "مبادئ الإدارة", credits: 3, semester: 1, category: "college" },
  { code: "ISLM1101", name: "قرآن كريم (1)", credits: 1, semester: 1, category: "university" },
  { code: "ITCC1301", name: "دوائر كهربائية (1)", credits: 3, semester: 1, category: "college" },
  { code: "ISLM2201", name: "دراسات في الحديث وعلومه", credits: 2, semester: 1, category: "university" },
  { code: "MATH1320", name: "تفاضل وتكامل (1)", credits: 3, semester: 1, category: "college" },
  { code: "ENGL1201", name: "اللغة الإنجليزية (1)", credits: 2, semester: 1, category: "university" },

  // المستوى 1 - الفصل 2 (21 ساعة)
  { code: "ITME1101", name: "مقدمة في الهندسة", credits: 1, semester: 2, category: "college" },
  { code: "PALS4212", name: "فلسطين الأرض والإنسان", credits: 2, semester: 2, category: "elective" },
  { code: "GEOL3203", name: "علوم البيئة", credits: 2, semester: 2, category: "elective" },
  { code: "ISLM1201", name: "دراسات في الفقه", credits: 2, semester: 2, category: "university" },
  { code: "MATH1321", name: "تفاضل وتكامل (2)", credits: 3, semester: 2, category: "college", prerequisites: ["MATH1320"] },
  { code: "ITCC2303", name: "تصميم المنطق الرقمي", credits: 3, semester: 2, category: "college", prerequisites: ["ITCC1311"] },
  { code: "ITCS1309", name: "برمجة حاسوب (1)", credits: 3, semester: 2, category: "college", prerequisites: ["ITCS1401"] },
  { code: "ARAB1201", name: "اللغة العربية (1)", credits: 2, semester: 2, category: "university" },
  { code: "ITCC1311", name: "إلكترونيات (1)", credits: 3, semester: 2, category: "college", prerequisites: ["ITCC1301"] },

  // المستوى 2 - الفصل 1 (19 ساعة)
  { code: "ITME3329", name: "هندسة وعلم المواد", credits: 3, semester: 3, category: "major" },
  { code: "ITME2302", name: "هندسة ميكانيكية (1)", credits: 3, semester: 3, category: "major" },
  { code: "ITME2102", name: "مختبر هندسة وعلم المواد", credits: 1, semester: 3, category: "major", prerequisites: ["ITME3329"] },
  { code: "ITCC2101", name: "مختبر دوائر كهربائية", credits: 1, semester: 3, category: "major", prerequisites: ["ITCC2302"] },
  { code: "ITME2101", name: "مختبر الرسم الهندسي", credits: 1, semester: 3, category: "college", prerequisites: ["ITME2201"] },
  { code: "ITCC2302", name: "دوائر كهربائية (2)", credits: 3, semester: 3, category: "major", prerequisites: ["ITCC1301"] },
  { code: "ISLM2202", name: "دراسات في العقيدة الإسلامية", credits: 2, semester: 3, category: "university" },
  { code: "ITME2201", name: "الرسم الهندسي", credits: 2, semester: 3, category: "college" },
  { code: "MATH2301", name: "احتمالات وإحصاء هندسي", credits: 3, semester: 3, category: "college", prerequisites: ["MATH1321"] },

  // المستوى 2 - الفصل 2 (19 ساعة)
  { code: "ITME2121", name: "ورش هندسية", credits: 1, semester: 4, category: "college" },
  { code: "ITCS2308", name: "هيكلية حاسوب ولغة أسمبلي", credits: 3, semester: 4, category: "major", prerequisites: ["ITCC2303"] },
  { code: "ITME2303", name: "هندسة ميكانيكية (2)", credits: 3, semester: 4, category: "major", prerequisites: ["ITME2302"] },
  { code: "ITCC2104", name: "مختبر الإشارات والأنظمة", credits: 1, semester: 4, category: "major", prerequisites: ["ITCC2304"] },
  { code: "ITCC2102", name: "مختبر إلكترونيات", credits: 1, semester: 4, category: "major", prerequisites: ["ITCC2331"] },
  { code: "ISLM2105", name: "قرآن كريم (2)", credits: 1, semester: 4, category: "university" },
  { code: "MATH2305", name: "جبر خطي (1)", credits: 3, semester: 4, category: "college", prerequisites: ["MATH1321"] },
  { code: "ITCC2331", name: "إلكترونيات (2)", credits: 3, semester: 4, category: "major", prerequisites: ["ITCC1311"] },
  { code: "ITCC2304", name: "مقدمة في الإشارات والأنظمة", credits: 3, semester: 4, category: "major", prerequisites: ["MATH1321"] },

  // المستوى 3 - الفصل 1 (19 ساعة)
  { code: "MATH2308", name: "معادلات تفاضلية عادية (1)", credits: 3, semester: 5, category: "college", prerequisites: ["MATH2305"] },
  { code: "ITCC3101", name: "مختبر المعالجات الدقيقة وواصلات الحاسوب", credits: 1, semester: 5, category: "major", prerequisites: ["ITCC3201"] },
  { code: "ITME3102", name: "مختبر أنظمة التحكم", credits: 1, semester: 5, category: "major", prerequisites: ["ITME3302"] },
  { code: "ITME3331", name: "عناصر الميكاترونكس", credits: 3, semester: 5, category: "major", prerequisites: ["ITCC2331"] },
  { code: "ITME4306", name: "عناصر الماكينات الميكانيكية", credits: 3, semester: 5, category: "major", prerequisites: ["ITME2303"] },
  { code: "ITME3328", name: "عمليات التصنيع", credits: 3, semester: 5, category: "major", prerequisites: ["ITME2303"] },
  { code: "ITCC3201", name: "المعالجات الدقيقة وواصلات الحاسوب", credits: 2, semester: 5, category: "major", prerequisites: ["ITCC2303"] },
  { code: "ITME3302", name: "أنظمة التحكم", credits: 3, semester: 5, category: "major", prerequisites: ["ITCC2304"] },

  // المستوى 3 - الفصل 2 (20 ساعة)
  { code: "ITME3103", name: "مختبر تطبيقات برمجية", credits: 1, semester: 6, category: "major", prerequisites: ["ITME3202"] },
  { code: "ITME3104", name: "مختبر أنظمة إلكترونيات القوى", credits: 1, semester: 6, category: "major", prerequisites: ["ITME3203"] },
  { code: "ITME3101", name: "مختبر المتحكم الدقيق: البرمجة والتطبيقات", credits: 1, semester: 6, category: "major", prerequisites: ["ITME3201"] },
  { code: "ITME3202", name: "تطبيقات برمجية", credits: 2, semester: 6, category: "major", prerequisites: ["ITME3331"] },
  { code: "ITME4333", name: "تصميم الميكاترونكس", credits: 3, semester: 6, category: "major", prerequisites: ["ITME3331"] },
  { code: "ITME4141", name: "تدريب ميداني", credits: 1, semester: 6, category: "major" },
  { code: "ITME3203", name: "أنظمة إلكترونيات القوى", credits: 2, semester: 6, category: "major", prerequisites: ["ITCC2331"] },
  { code: "ITME3201", name: "المتحكم الدقيق: البرمجة والتطبيقات", credits: 2, semester: 6, category: "major", prerequisites: ["ITCC2331"] },
  { code: "ITME3301", name: "الديناميكا الحرارية", credits: 3, semester: 6, category: "major", prerequisites: ["ITME2303"] },
  { code: "ITME5388", name: "أنظمة الهيدروليك والنيوماتيك", credits: 3, semester: 6, category: "elective", prerequisites: ["ITME2303"] },
  { code: "ISLM3107", name: "قرآن كريم (3)", credits: 1, semester: 6, category: "university" },

  // المستوى 4 - الفصل 1 (17 ساعة)
  { code: "ITME4201", name: "مشروع التخرج (1)", credits: 2, semester: 7, category: "major" },
  { code: "ITME3105", name: "مختبر الماكينات الكهربية", credits: 1, semester: 7, category: "major", prerequisites: ["ITME3306"] },
  { code: "ITME3306", name: "ماكينات كهربية", credits: 3, semester: 7, category: "major", prerequisites: ["ITME2302"] },
  { code: "ITMD5139", name: "قضايا مهنية في الهندسة", credits: 1, semester: 7, category: "college" },
  { code: "ITME5344", name: "الروبوت والأتمتة", credits: 3, semester: 7, category: "major", prerequisites: ["ITME3331"] },
  { code: "ITME5343", name: "إدارة الجودة والاعتمادية", credits: 3, semester: 7, category: "major", prerequisites: ["ITIS1302"] },
  { code: "ITME4335", name: "أتمتة صناعية", credits: 3, semester: 7, category: "major", prerequisites: ["ITME3331"] },
  { code: "ITCS4319", name: "الذكاء الاصطناعي", credits: 1, semester: 7, category: "elective", prerequisites: ["ITCS1309"] },

  // المستوى 4 - الفصل 2 (17 ساعة)
  { code: "ITCC4325", name: "مقدمة في معالجة الإشارات الرقمية", credits: 3, semester: 8, category: "major", prerequisites: ["ITCC2304"] },
  { code: "ITME4202", name: "مشروع التخرج (2)", credits: 2, semester: 8, category: "major" },
  { code: "ITME4103", name: "مختبر المتحكمات المنطقية المبرمجة", credits: 1, semester: 8, category: "major", prerequisites: ["ITME4203"] },
  { code: "ISLM4113", name: "قرآن كريم (4)", credits: 1, semester: 8, category: "university" },
  { code: "ISLM3201", name: "دراسات في التفسير وعلوم القرآن", credits: 2, semester: 8, category: "university" },
  { code: "ITME4310", name: "أنظمة التحكم الحديثة", credits: 3, semester: 8, category: "major", prerequisites: ["ITCC2304"] },
  { code: "ITME4203", name: "المتحكمات المنطقية المبرمجة", credits: 2, semester: 8, category: "major", prerequisites: ["ITME4335"] },
  { code: "ITME4302", name: "الرياضيات والمحاكاه للمهندسين", credits: 3, semester: 8, category: "college", prerequisites: ["MATH2301"] },
];

// ============================================================
// 9. الخطة التفصيلية لماجستير علم البيانات (خطة 9279 - 30 ساعة)
// 24 إجباري (مع أطروحة الماجستير) + 6 اختياري
// ============================================================
const dataScienceMscCourses: Course[] = [
  { code: "ITDS6301", name: "مقدمة في علم البيانات", credits: 3, semester: 1, category: "major" },
  { code: "ITDS6303", name: "قواعد البيانات لعلم البيانات", credits: 3, semester: 1, category: "major" },
  { code: "ITDS6306", name: "طرق البحث العلمي", credits: 3, semester: 1, category: "college" },
  { code: "ITDS6302", name: "المحاكاة لعلم البيانات", credits: 3, semester: 2, category: "major" },
  { code: "ITDS6305", name: "الخوارزميات لعلم البيانات", credits: 3, semester: 2, category: "major" },
  { code: "ITDS6304", name: "الاستدلال والنمذجة الإحصائية", credits: 3, semester: 2, category: "major" },
  { code: "ITDS6307", name: "التعلم العميق التطبيقي", credits: 3, semester: 3, category: "elective" },
  { code: "ITDS6310", name: "تعلم الآلة التطبيقي", credits: 3, semester: 3, category: "elective" },
  { code: "ITDS7331", name: "الرسالة (الجزء الأول)", credits: 3, semester: 3, category: "major" },
  { code: "ITDS7332", name: "الرسالة (الجزء الثاني)", credits: 3, semester: 4, category: "major" },
];

// ============================================================
// 10. الخطة التفصيلية لماجستير الحوسبة ونظم المعلومات (خطة 9147 - 30 ساعة)
// 24 إجباري (مع أطروحة الماجستير) + 6 اختياري
// ============================================================
const cisMscCourses: Course[] = [
  { code: "ITCS6319", name: "أمن المعلومات المتقدم", credits: 3, semester: 1, category: "major" },
  { code: "ITCS6301", name: "الذكاء الاصطناعي المتقدم", credits: 3, semester: 1, category: "major" },
  { code: "ITCS6304", name: "طرق وأدوات البحث العلمي", credits: 3, semester: 1, category: "college" },
  { code: "ITCS6306", name: "أنظمة مبنية على المعرفة", credits: 3, semester: 2, category: "major" },
  { code: "ITCS6302", name: "أنظمة النمذجة والمحاكاة المتقدمة", credits: 3, semester: 2, category: "major" },
  { code: "ITCS6303", name: "أمن شبكات الحاسوب والتشفير", credits: 3, semester: 2, category: "major" },
  { code: "ITCS6313", name: "هندسة البرامج المتقدمة", credits: 3, semester: 3, category: "elective" },
  { code: "ITCS6305", name: "تنقيب البيانات المتقدم", credits: 3, semester: 3, category: "elective" },
  { code: "ITCS7331", name: "الرسالة (الجزء الأول)", credits: 3, semester: 3, category: "major" },
  { code: "ITCS7332", name: "الرسالة (الجزء الثاني)", credits: 3, semester: 4, category: "major" },
];

// ============================================================
// كشف كامل لخطط كلية الهندسة وتكنولوجيا المعلومات بجامعة الأزهر
// مطابق تماماً للخطط الرسمية المعتمدة
// ============================================================
export const initialStudyPlans: StudyPlan[] = [
  {
    id: "cs",
    major: "علوم الحاسوب",
    college: "كلية الهندسة وتكنولوجيا المعلومات",
    degree: "بكالوريوس",
    totalCredits: 128,
    compulsoryCredits: 117,
    electiveCredits: 11,
    universityElectiveCredits: 2,
    majorElectiveCredits: 9,
    semestersCount: 8,
    hourlyRate: 28,
    pdfUrl: "/plans/Computer-Science-Curriculum-Plan-9243.pdf",
    pdfFilename: "Computer-Science-Curriculum-Plan-9243.pdf",
    iconName: "computer",
    description: "الخطة المعتمدة لقسم علوم الحاسوب (خطة 9243) وتغطي الخوارزميات، الذكاء الاصطناعي، تراكيب البيانات وتصميم المترجمات وهندسة البرمجيات.",
    courses: csCourses,
  },
  {
    id: "is",
    major: "نظم المعلومات",
    college: "كلية الهندسة وتكنولوجيا المعلومات",
    degree: "بكالوريوس",
    totalCredits: 128,
    compulsoryCredits: 117,
    electiveCredits: 11,
    universityElectiveCredits: 2,
    majorElectiveCredits: 9,
    semestersCount: 8,
    hourlyRate: 28,
    pdfUrl: "/plans/Information-Systems-Curriculum-Plan-9274.pdf",
    pdfFilename: "Information-Systems-Curriculum-Plan-9274.pdf",
    iconName: "database",
    description: "الخطة المعتمدة لقسم نظم المعلومات (خطة 9274) للربط بين تكنولوجيا المعلومات وإدارة الأعمال وحوكمة البيانات المؤسسية والتجارة الإلكترونية.",
    courses: isCourses,
  },
  {
    id: "cce",
    major: "هندسة أنظمة الحاسوب",
    college: "كلية الهندسة وتكنولوجيا المعلومات",
    degree: "بكالوريوس",
    totalCredits: 150,
    compulsoryCredits: 136,
    electiveCredits: 14,
    universityElectiveCredits: 2,
    majorElectiveCredits: 12,
    semestersCount: 10,
    hourlyRate: 32,
    pdfUrl: "/plans/Computer-Systems-Engineering-Plan-9312.pdf",
    pdfFilename: "Computer-Systems-Engineering-Plan-9312.pdf",
    iconName: "chip",
    description: "خطة هندسية معتمدة (رقم 9312) تركز على العتاد المادي، المعالجات الدقيقة، الأنظمة المدمجة، والشبكات والتحكم الرقمي وهندسة البرمجيات.",
    courses: cceCourses,
  },
  {
    id: "mechatronics",
    major: "هندسة الميكاترونكس",
    college: "كلية الهندسة وتكنولوجيا المعلومات",
    degree: "بكالوريوس",
    totalCredits: 150,
    compulsoryCredits: 142,
    electiveCredits: 8,
    universityElectiveCredits: 2,
    majorElectiveCredits: 6,
    semestersCount: 10,
    hourlyRate: 32,
    pdfUrl: "/plans/Mechatronics-Engineering-Plan-9314.pdf",
    pdfFilename: "Mechatronics-Engineering-Plan-9314.pdf",
    iconName: "robot",
    description: "خطة هندسية معتمدة (رقم 9314) لدمج الهندسة الميكانيكية والإلكترونية والبرمجيات لتصميم وتطوير الروبوتات والأنظمة المؤتمتة ومعدات التصنيع الذكية.",
    courses: mechatronicsCourses,
  },
  {
    id: "telecom",
    major: "هندسة الحاسوب والاتصالات",
    college: "كلية الهندسة وتكنولوجيا المعلومات",
    degree: "بكالوريوس",
    totalCredits: 150,
    compulsoryCredits: 139,
    electiveCredits: 11,
    universityElectiveCredits: 2,
    majorElectiveCredits: 9,
    semestersCount: 10,
    hourlyRate: 32,
    pdfUrl: "/plans/Computer-and-Communications-Engineering-Plan-9313.pdf",
    pdfFilename: "Computer-and-Communications-Engineering-Plan-9313.pdf",
    iconName: "signal",
    description: "خطة هندسية معتمدة (رقم 9313) لإعداد مهندسي اتصالات وشبكات متقدمين لتصميم وتشغيل أنظمة الاتصالات اللاسلكية، الألياف الضوئية، وتراسل البيانات.",
    courses: telecomCourses,
  },
  {
    id: "biomedical",
    major: "هندسة المعدات الطبية",
    college: "كلية الهندسة وتكنولوجيا المعلومات",
    degree: "بكالوريوس",
    totalCredits: 150,
    compulsoryCredits: 139,
    electiveCredits: 11,
    universityElectiveCredits: 2,
    majorElectiveCredits: 9,
    semestersCount: 10,
    hourlyRate: 32,
    pdfUrl: "/plans/Biomedical-Equipment-Engineering-Plan-9316.pdf",
    pdfFilename: "Biomedical-Equipment-Engineering-Plan-9316.pdf",
    iconName: "heartbeat",
    description: "خطة هندسية معتمدة (رقم 9316) لتطبيق المبادئ الهندسية والفيزيائية في صيانة وتطوير الأجهزة الطبية التشخيصية وأجهزة التصوير والتحاليل والمستشفيات.",
    courses: biomedicalCourses,
  },
  {
    id: "energy",
    major: "هندسة الطاقة المتجددة",
    college: "كلية الهندسة وتكنولوجيا المعلومات",
    degree: "بكالوريوس",
    totalCredits: 150,
    compulsoryCredits: 142,
    electiveCredits: 8,
    universityElectiveCredits: 2,
    majorElectiveCredits: 6,
    semestersCount: 10,
    hourlyRate: 32,
    pdfUrl: "/plans/Renewable-Energy-Engineering-Plan-9315.pdf",
    pdfFilename: "Renewable-Energy-Engineering-Plan-9315.pdf",
    iconName: "sun",
    description: "خطة هندسية معتمدة (رقم 9315) لتصميم وإدارة محطات الطاقة الشمسية والكهروضوئية، طاقة الرياح، كفاءة استخدام الطاقة، وتخزين الطاقة والشبكات الذكية.",
    courses: energyCourses,
  },
  {
    id: "multimedia",
    major: "الوسائط المتعددة التطبيقية",
    college: "كلية الهندسة وتكنولوجيا المعلومات",
    degree: "بكالوريوس",
    totalCredits: 128,
    compulsoryCredits: 117,
    electiveCredits: 11,
    universityElectiveCredits: 2,
    majorElectiveCredits: 9,
    semestersCount: 8,
    hourlyRate: 28,
    pdfUrl: "/plans/Applied-Multimedia-Plan-9291.pdf",
    pdfFilename: "Applied-Multimedia-Plan-9291.pdf",
    iconName: "palette",
    description: "خطة معتمدة (رقم 9291) لتطوير واجهات وتجارب المستخدم UI/UX، الرسوم المتحركة ثنائية وثلاثية الأبعاد، الواقع الافتراضي والمعزز، والإنتاج الرقمي الحديث.",
    courses: multimediaCourses,
  },
  {
    id: "geomatics",
    major: "هندسة المساحة والجيوماتكس",
    college: "كلية الهندسة وتكنولوجيا المعلومات",
    degree: "بكالوريوس",
    totalCredits: 150,
    compulsoryCredits: 142,
    electiveCredits: 8,
    universityElectiveCredits: 2,
    majorElectiveCredits: 6,
    semestersCount: 10,
    hourlyRate: 32,
    pdfUrl: "/plans/Computer-Systems-Engineering-Plan-9312.pdf",
    pdfFilename: "Geomatics-Engineering-Plan.pdf",
    iconName: "chip",
    description: "خطة هندسية معتمدة بكلية الهندسة وتكنولوجيا المعلومات في نظم المعلومات الجغرافية GIS، الاستشعار عن بعد، المساحة التصويرية والتحليل المكاني ورسم الخرائط الرقمية.",
    courses: cceCourses,
  },
  {
    id: "ms-data",
    major: "علم البيانات (ماجستير)",
    college: "كلية الدراسات العليا",
    degree: "ماجستير",
    totalCredits: 30,
    compulsoryCredits: 24,
    electiveCredits: 6,
    majorElectiveCredits: 6,
    semestersCount: 4,
    hourlyRate: 45,
    pdfUrl: "/plans/MSc-Data-Science-Plan-9279.pdf",
    pdfFilename: "MSc-Data-Science-Plan-9279.pdf",
    iconName: "sparkles",
    description: "برنامج ماجستير معتمد (خطة 9279) بكلية الدراسات العليا، يغطي تعلم الآلة والتعلم العميق، خوارزميات علم البيانات، الاستدلال والنمذجة الإحصائية، ورسالة الماجستير.",
    courses: dataScienceMscCourses,
  },
  {
    id: "ms-cis",
    major: "الحوسبة ونظم المعلومات (ماجستير)",
    college: "كلية الدراسات العليا",
    degree: "ماجستير",
    totalCredits: 30,
    compulsoryCredits: 24,
    electiveCredits: 6,
    majorElectiveCredits: 6,
    semestersCount: 4,
    hourlyRate: 45,
    pdfUrl: "/plans/MSc-Computing-Info-Systems-Plan-9147.pdf",
    pdfFilename: "MSc-Computing-Info-Systems-Plan-9147.pdf",
    iconName: "cpu",
    description: "دراسات عليا معتمدة (خطة 9147) بكلية الدراسات العليا في أمن المعلومات المتقدم، الذكاء الاصطناعي المتقدم، الأنظمة المبنية على المعرفة، ورسالة الماجستير.",
    courses: cisMscCourses,
  },
];

