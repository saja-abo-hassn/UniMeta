export interface GpaCourseItem {
  id: string;
  code: string;
  name: string;
  credits: number;
  grade: number | "";
}

export interface GpaSemesterData {
  id: string;
  name: string;
  isSummer?: boolean;
  courses: GpaCourseItem[];
}

export interface GpaYearData {
  yearNumber: number;
  yearTitle: string;
  hasSummer: boolean;
  semesters: GpaSemesterData[];
}

export const STORAGE_GPA_DATA_KEY = "unimeta_gpa_year_calculator_v3";

export const YEAR_TITLES = [
  "السنة الأولى",
  "السنة الثانية",
  "السنة الثالثة",
  "السنة الرابعة",
  "السنة الخامسة",
];

