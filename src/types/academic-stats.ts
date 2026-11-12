import { StudyPlan, Course } from "@/src/data/study-plans-data";

export interface CourseOverride {
  name?: string;
  credits?: number;
  grade?: number;
  category?: Course["category"];
  isCompleted?: boolean;
}

export interface AcademicStatsValue {
  plans: StudyPlan[];
  selectedPlanId: string;
  selectedPlan: StudyPlan;
  hasPlanSelected: boolean;
  isLoaded: boolean;

  allCourses: Course[];
  completedCourses: Course[];
  courseGrades: Record<string, number>;
  customCourses: Course[];
  courseOverrides: Record<string, CourseOverride>;

  totalCredits: number;
  completedCredits: number;
  remainingCredits: number;
  progressPercentage: number;
  completionPercentage: number;
  cumulativeGpa: number;
  gpaFormatted: string;
  gpaRating: { label: string; color: string };

  selectPlan: (planId: string) => void;
  setHasPlanSelected: (hasPlan: boolean) => void;
  toggleCourseCompletion: (courseCode: string, completed?: boolean) => void;
  setCourseGrade: (courseCode: string, grade: number | undefined) => void;
  updateCourseCredits: (courseCode: string, credits: number) => void;
  updateCourseDetails: (
    courseCode: string,
    data: { name?: string; credits?: number; grade?: number | null; isCompleted?: boolean }
  ) => void;
  addCustomCourse: (course: Course, initialGrade?: number) => void;
  removeCustomCourse: (courseCode: string) => void;
  resetCourseGrades: () => void;
  resetAllStats: () => void;
}

