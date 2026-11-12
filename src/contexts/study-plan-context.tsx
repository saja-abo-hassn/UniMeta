"use client";

import React from "react";
import {
  AcademicStatsProvider,
  useAcademicStats,
  AcademicStatsValue,
} from "./academic-stats-context";
import { StudyPlan, Course } from "@/src/data/study-plans-data";

export type { CourseOverride } from "./academic-stats-context";

export interface StudyPlanContextValue extends AcademicStatsValue {
  // Backwards-compatible aliases
  setBatchGrades?: (grades: Record<string, number>) => void;
}

export function StudyPlanProvider({ children }: { children: React.ReactNode }) {
  return <AcademicStatsProvider>{children}</AcademicStatsProvider>;
}

export function useStudyPlan(): StudyPlanContextValue {
  return useAcademicStats();
}

export { useAcademicStats, AcademicStatsProvider };
