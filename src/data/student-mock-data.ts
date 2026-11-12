/**
 * UniMeta Student Dashboard Mock Data Layer
 *
 * NOTE: Backend API is not yet connected.
 * This mock data layer provides structured domain models and values
 * matching the Figma Student Platform specifications for Reem Al-Najjar (ريم النجار).
 * Completely separated from UI components for clean future API integration.
 */

export interface StudentProfile {
  id: string;
  studentId: string;
  nameAr: string;
  nameEn: string;
  initials: string;
  majorAr: string;
  majorEn: string;
  facultyAr: string;
  facultyEn: string;
  avatarUrl?: string;
  academicYear: string;
  semester: string;
  status: string;
}

export interface AcademicMetrics {
  gpa: number; // 100-point scale ONLY (e.g. 90.00)
  gpaScale: 100;
  gpaRating: string; // e.g. "تقديري - ممتاز"
  completedHours: number; // e.g. 6 or 92
  totalHours: number; // e.g. 135
  remainingHours: number; // e.g. 129
  completionRate: number; // percentage, e.g. 4 or 68
  currentSemesterHours: number; // e.g. 15
  activeTasksCount: number; // e.g. 2
  activeAgreementsCount: number; // e.g. 1
}

export interface ScheduleItem {
  id: string;
  time: string;
  type: "محاضرة" | "مختبر" | "مهمة شخصية";
  title: string;
  location: string;
  instructor?: string;
  duration?: string;
}

export interface StudentTask {
  id: string;
  title: string;
  course: string;
  dueDateText: string;
  priority: "عاجل" | "متوسط" | "عادي";
  completed: boolean;
}

export interface AcademicCourse {
  id: string;
  code: string;
  titleAr: string;
  titleEn: string;
  creditHours: number;
  grade?: number; // 100-point scale
  status: "منجز" | "قيد الدراسة" | "متبقي";
  semester?: string;
  prerequisites?: string[];
}

export const currentStudentProfile: StudentProfile = {
  id: "std-20221084",
  studentId: "20221084",
  nameAr: "ريم النجار",
  nameEn: "Reem Al-Najjar",
  initials: "رن",
  majorAr: "هندسة البرمجيات",
  majorEn: "Software Engineering",
  facultyAr: "كلية الهندسة وتكنولوجيا المعلومات",
  facultyEn: "Faculty of Engineering & IT",
  academicYear: "السنة الثالثة",
  semester: "الفصل الثاني 2025/2026",
  status: "منتظم",
};

export const currentAcademicMetrics: AcademicMetrics = {
  gpa: 90.00,
  gpaScale: 100,
  gpaRating: "ممتاز",
  completedHours: 6,
  totalHours: 135,
  remainingHours: 129,
  completionRate: 4,
  currentSemesterHours: 15,
  activeTasksCount: 2,
  activeAgreementsCount: 1,
};

export const semesterProgress = {
  semesterLabel: "هذا الفصل الدراسي",
  completionRate: 68,
  completedHours: 92,
  currentSemesterHours: 15,
  remainingHours: 28,
  advisorNote: "أنتِ على المسار الصحيح. إكمال 15 ساعة هذا الفصل يحافظ على موعد تخرجك المتوقع في صيف 2026.",
};

export const todaySchedule: ScheduleItem[] = [
  {
    id: "sch-1",
    time: "09:30",
    type: "محاضرة",
    title: "هندسة البرمجيات",
    location: "قاعة C204",
    instructor: "د. سارة الخطيب",
    duration: "90 دقيقة",
  },
  {
    id: "sch-2",
    time: "12:00",
    type: "مختبر",
    title: "قواعد البيانات",
    location: "مختبر 3 · مبنى الحاسوب",
    instructor: "م. إيناس خضير",
    duration: "120 دقيقة",
  },
  {
    id: "sch-3",
    time: "16:00",
    type: "مهمة شخصية",
    title: "مراجعة فصل الخوارزميات",
    location: "دراسة ذاتية",
    duration: "45 دقيقة",
  },
];

export const upcomingTasks: StudentTask[] = [
  {
    id: "tsk-1",
    title: "تسليم مخطط قاعدة البيانات",
    course: "قواعد البيانات",
    dueDateText: "اليوم، 11:59 م",
    priority: "عاجل",
    completed: false,
  },
  {
    id: "tsk-2",
    title: "قراءة الفصل الخامس: متطلبات الأنظمة",
    course: "هندسة البرمجيات",
    dueDateText: "غداً، 09:00 ص",
    priority: "متوسط",
    completed: false,
  },
  {
    id: "tsk-3",
    title: "تجهيز عرض فكرة مشروع التخرج",
    course: "مشروع التخرج",
    dueDateText: "الخميس، 12:00 م",
    priority: "متوسط",
    completed: false,
  },
];

