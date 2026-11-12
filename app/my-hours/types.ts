import { Course, CourseCategory } from "@/src/data/study-plans-data";

export interface EditingCourseState {
  code: string;
  name: string;
  credits: number;
  grade: number | "";
  isCompleted: boolean;
  category: CourseCategory;
}

export interface NewCourseState {
  code: string;
  name: string;
  credits: number;
  category: CourseCategory;
  semester: number;
  grade: number | "";
  isCompleted: boolean;
}

export interface CategoryStat {
  id: CourseCategory;
  title: string;
  required: number;
  completed: number;
}

export interface SemesterGroup {
  id: string;
  title: string;
  subtitle: string;
  courses: Course[];
}

export interface YearGroup {
  yearNumber: number;
  yearTitle: string;
  totalCredits: number;
  completedCredits: number;
  semesters: SemesterGroup[];
}

export interface CategoryGroup {
  key: string;
  title: string;
  subtitle: string;
  courses: Course[];
}

