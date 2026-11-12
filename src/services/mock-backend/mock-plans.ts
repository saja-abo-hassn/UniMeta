export interface MockPlanCourse {
  code: string;
  name: string;
  hours: number;
  grade?: number;
  status: "completed" | "in_progress" | "remaining";
  semester: string;
  year: number;
}

export const MOCK_STUDY_PLAN_COURSES: MockPlanCourse[] = [
  { code: "ENCS1101", name: "مقدمة في الحوسبة", hours: 3, grade: 92, status: "completed", semester: "الفصل الأول", year: 1 },
  { code: "MATH1301", name: "تفاضل وتكامل 1", hours: 3, grade: 88, status: "completed", semester: "الفصل الأول", year: 1 },
  { code: "PHYS1101", name: "فيزياء عامة 1", hours: 3, grade: 85, status: "completed", semester: "الفصل الأول", year: 1 },
  { code: "ENCS2301", name: "تراكيب البيانات والخوارزميات", hours: 3, grade: 94, status: "completed", semester: "الفصل الثاني", year: 2 },
  { code: "ENCS3310", name: "هندسة البرمجيات المتقدمة", hours: 3, grade: 90, status: "completed", semester: "الفصل الأول", year: 3 },
  { code: "ENCS3304", name: "أنظمة قواعد البيانات", hours: 3, status: "in_progress", semester: "الفصل الحالي", year: 3 },
  { code: "ENCS4301", name: "أمن المعلومات والتشفير", hours: 3, status: "remaining", semester: "الفصل القادم", year: 4 },
  { code: "ENCS4399", name: "مشروع التخرج", hours: 3, status: "remaining", semester: "الفصل النهائي", year: 4 },
];

