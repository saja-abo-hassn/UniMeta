/**
 * UniMeta Course-to-Majors Mapping Layer (جدول ربط المواد بالتخصصات والخطط الدراسية)
 *
 * One course can belong to multiple majors and study plans.
 * Used by Admin to assign materials, and by Student Portal to filter library files
 * strictly by the student's currently active study plan.
 */

export interface CourseMajorLink {
  courseCode: string;
  courseNameAr: string;
  courseNameEn: string;
  creditHours: number;
  category: "university" | "college" | "major" | "elective" | "free";
  /** List of all majors / academic programs that include this course in their curriculum */
  applicableMajors: string[];
  /** Level / Year recommendation per major if applicable */
  recommendedYear?: string;
  description?: string;
}

export const COURSE_MAJORS_MAP: Record<string, CourseMajorLink> = {
  // 1. مقدمة في الحوسبة (مشترك في كافة تخصصات الكلية)
  ITCS1401: {
    courseCode: "ITCS1401",
    courseNameAr: "مقدمة في الحوسبة والبرمجة",
    courseNameEn: "Introduction to Computing",
    creditHours: 4,
    category: "college",
    applicableMajors: [
      "علوم الحاسوب",
      "نظم المعلومات",
      "هندسة أنظمة الحاسوب",
      "هندسة الحاسوب والاتصالات",
      "هندسة الميكاترونكس",
      "هندسة المعدات الطبية",
      "الوسائط المتعددة التطبيقية",
      "هندسة الطاقة المتجددة",
      "هندسة المساحة والجيوماتكس",
      "هندسة البرمجيات",
    ],
    recommendedYear: "السنة الأولى",
    description: "أساسيات الخوارزميات، البرمجة الإجرائية، والمتغيرات وهياكل التحكم.",
  },

  // 2. تفاضل وتكامل (1) (مشترك بكافة تخصصات الهندسة والحاسوب)
  MATH1320: {
    courseCode: "MATH1320",
    courseNameAr: "تفاضل وتكامل (1)",
    courseNameEn: "Calculus I",
    creditHours: 3,
    category: "college",
    applicableMajors: [
      "علوم الحاسوب",
      "نظم المعلومات",
      "هندسة أنظمة الحاسوب",
      "هندسة الحاسوب والاتصالات",
      "هندسة الميكاترونكس",
      "هندسة المعدات الطبية",
      "الوسائط المتعددة التطبيقية",
      "هندسة الطاقة المتجددة",
      "هندسة المساحة والجيوماتكس",
      "هندسة البرمجيات",
    ],
    recommendedYear: "السنة الأولى",
    description: "النهايات، الاتصال، قواعد الاشتقاق وتطبيقاتها الهندسية وحساب المساحات.",
  },

  // 3. دوائر كهربائية (1)
  ITCC1301: {
    courseCode: "ITCC1301",
    courseNameAr: "دوائر كهربائية (1)",
    courseNameEn: "Electric Circuits I",
    creditHours: 3,
    category: "college",
    applicableMajors: [
      "علوم الحاسوب",
      "هندسة أنظمة الحاسوب",
      "هندسة الحاسوب والاتصالات",
      "هندسة الميكاترونكس",
      "هندسة المعدات الطبية",
      "هندسة الطاقة المتجددة",
      "هندسة البرمجيات",
    ],
    recommendedYear: "السنة الأولى",
    description: "قوانين كيرشوف، المقاومات، المكثفات، وتحليل الدوائر في التيار المستمر والمتردد.",
  },

  // 4. تراكيب البيانات والخوارزميات
  ENCS2301: {
    courseCode: "ENCS2301",
    courseNameAr: "تراكيب البيانات والخوارزميات",
    courseNameEn: "Data Structures & Algorithms",
    creditHours: 3,
    category: "major",
    applicableMajors: [
      "علوم الحاسوب",
      "نظم المعلومات",
      "هندسة أنظمة الحاسوب",
      "هندسة البرمجيات",
      "هندسة الحاسوب والاتصالات",
      "الوسائط المتعددة التطبيقية",
      "علم البيانات",
    ],
    recommendedYear: "السنة الثانية",
    description: "القوائم المتصلة، المكدسات، الطوابير، الأشجار، والرسوم البيانية وخوارزميات الفرز.",
  },

  // 5. هندسة البرمجيات المتقدمة
  ENCS3310: {
    courseCode: "ENCS3310",
    courseNameAr: "هندسة البرمجيات المتقدمة",
    courseNameEn: "Advanced Software Engineering",
    creditHours: 3,
    category: "major",
    applicableMajors: [
      "هندسة البرمجيات",
      "علوم الحاسوب",
      "نظم المعلومات",
      "هندسة أنظمة الحاسوب",
      "الحوسبة ونظم المعلومات",
    ],
    recommendedYear: "السنة الثالثة",
    description: "منهجيات Agile، أنماط التصميم Design Patterns، فحص وتوكيد جودة البرمجيات.",
  },

  // 6. نظم قواعد البيانات
  ITIS2301: {
    courseCode: "ITIS2301",
    courseNameAr: "نظم قواعد البيانات وتصميمها",
    courseNameEn: "Database Systems",
    creditHours: 3,
    category: "major",
    applicableMajors: [
      "علوم الحاسوب",
      "نظم المعلومات",
      "هندسة أنظمة الحاسوب",
      "الوسائط المتعددة التطبيقية",
      "هندسة البرمجيات",
      "علم البيانات",
      "الحوسبة ونظم المعلومات",
    ],
    recommendedYear: "السنة الثانية",
    description: "مخططات ERD، لغة SQL، المعاملات، والتطبيع وتصميم قواعد البيانات العلائقية.",
  },

  // 7. النظم المدمجة وإنترنت الأشياء
  ENCS4302: {
    courseCode: "ENCS4302",
    courseNameAr: "النظم المدمجة وإنترنت الأشياء",
    courseNameEn: "Embedded Systems & IoT",
    creditHours: 3,
    category: "major",
    applicableMajors: [
      "هندسة أنظمة الحاسوب",
      "هندسة الحاسوب والاتصالات",
      "هندسة الميكاترونكس",
      "هندسة المعدات الطبية",
    ],
    recommendedYear: "السنة الرابعة",
    description: "المتحكمات الدقيقة، مجسات IoT، بروتوكولات الاتصال MQTT و I2C، والمعالجة الحية.",
  },

  // 8. الذكاء الاصطناعي وتعلم الآلة
  ITCS4305: {
    courseCode: "ITCS4305",
    courseNameAr: "الذكاء الاصطناعي وتعلم الآلة",
    courseNameEn: "Artificial Intelligence & Machine Learning",
    creditHours: 3,
    category: "major",
    applicableMajors: [
      "علوم الحاسوب",
      "هندسة أنظمة الحاسوب",
      "علم البيانات",
      "هندسة البرمجيات",
      "الحوسبة ونظم المعلومات",
    ],
    recommendedYear: "السنة الرابعة",
    description: "خوارزميات البحث الذكي، الشبكات العصبية، التعلم الخاضع للإشراف والانحدار والتصنيف.",
  },

  // 9. هندسة الاتصالات الرقمية
  ENCC3302: {
    courseCode: "ENCC3302",
    courseNameAr: "هندسة الاتصالات الرقمية ومعالجة الإشارات",
    courseNameEn: "Digital Communications & DSP",
    creditHours: 3,
    category: "major",
    applicableMajors: [
      "هندسة الحاسوب والاتصالات",
      "هندسة المعدات الطبية",
      "هندسة أنظمة الحاسوب",
    ],
    recommendedYear: "السنة الثالثة",
    description: "تعديل الإشارات الرقمية QAM/PSK، تحليل فورييه، والمرشحات الرقمية وقنوات النقل.",
  },

  // 10. أنظمة الطاقة الشمسية والمتجددة
  ENRE3301: {
    courseCode: "ENRE3301",
    courseNameAr: "أنظمة الخلايا الكهروضوئية والطاقة الشمسية",
    courseNameEn: "Photovoltaic & Solar Energy Systems",
    creditHours: 3,
    category: "major",
    applicableMajors: [
      "هندسة الطاقة المتجددة",
      "هندسة الميكاترونكس",
    ],
    recommendedYear: "السنة الثالثة",
    description: "تصميم مصفوفات الطاقة الشمسية، محولات القدرة Inverters، وشبكات التغذية الذكية.",
  },
};

/**
 * Check if a course belongs to a specific major/plan
 */
export function isCourseInMajor(courseCode: string, majorName: string): boolean {
  const mapping = COURSE_MAJORS_MAP[courseCode];
  if (!mapping) return true; // If not explicitly restricted, allow general visibility
  return mapping.applicableMajors.some(
    (m) => m === majorName || majorName.includes(m) || m.includes(majorName)
  );
}

/**
 * Get all courses available for a given major
 */
export function getCoursesForMajor(majorName: string): CourseMajorLink[] {
  return Object.values(COURSE_MAJORS_MAP).filter((link) =>
    link.applicableMajors.some(
      (m) => m === majorName || majorName.includes(m) || m.includes(majorName)
    )
  );
}

