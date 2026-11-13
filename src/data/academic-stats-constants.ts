import { initialStudyPlans } from "@/src/data/study-plans-data";
import { AcademicStatsValue } from "@/src/types/academic-stats";

export const STORAGE_PLAN_KEY = "unimeta_selected_plan_id_v2";
export const STORAGE_GRADES_KEY = "unimeta_course_grades_v2";
export const STORAGE_CUSTOM_COURSES_KEY = "unimeta_custom_courses_v2";
export const STORAGE_COURSE_OVERRIDES_KEY = "unimeta_course_overrides_v2";
export const STORAGE_HAS_PLAN_KEY = "unimeta_has_plan_selected";

export const INITIAL_SEED_GRADES: Record<string, number> = {
  ITCS1401: 88,
  ITIS1302: 85,
  ISLM1101: 93,
  ITCC1301: 86,
  MATH1320: 84,
  ENGL1201: 90,
  ITCS1309: 89,
  ARAB1201: 88,
};

export const defaultFallbackPlan = initialStudyPlans[0];

export const defaultFallbackContext: AcademicStatsValue = {
  plans: initialStudyPlans,
  selectedPlanId: defaultFallbackPlan.id,
  selectedPlan: defaultFallbackPlan,
  hasPlanSelected: true,
  isLoaded: true,

  allCourses: defaultFallbackPlan.courses,
  completedCourses: [],
  courseGrades: INITIAL_SEED_GRADES,
  customCourses: [],
  courseOverrides: {},

  totalCredits: defaultFallbackPlan.totalCredits,
  completedCredits: 21,
  remainingCredits: defaultFallbackPlan.totalCredits - 21,
  progressPercentage: Math.round((21 / defaultFallbackPlan.totalCredits) * 100),
  completionPercentage: Math.round((21 / defaultFallbackPlan.totalCredits) * 100),
  cumulativeGpa: 87.29,
  gpaFormatted: "87.29",
  gpaRating: { label: "جيد جداً", color: "text-brand-hover-medium bg-brand-surface-soft border-brand-border-soft" },

  selectPlan: () => {},
  setHasPlanSelected: () => {},
  toggleCourseCompletion: () => {},
  setCourseGrade: () => {},
  updateCourseCredits: () => {},
  updateCourseDetails: () => {},
  addCustomCourse: () => {},
  removeCustomCourse: () => {},
  resetCourseGrades: () => {},
  resetAllStats: () => {},
};

