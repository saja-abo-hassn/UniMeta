import { GraduationProject } from "@/src/data/graduation-projects-data";

export type ScopeFilterType = "all" | "مشروع 1" | "مشروع 2" | "مشروع 1 و 2";

export interface AppliedProjectInfo {
  stage: string;
  date: string;
}

export type { GraduationProject };

