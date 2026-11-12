"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { StudyPlan, Course, initialStudyPlans } from "@/src/data/study-plans-data";
import { CourseOverride, AcademicStatsValue } from "@/src/types/academic-stats";
import {
  STORAGE_PLAN_KEY,
  STORAGE_GRADES_KEY,
  STORAGE_CUSTOM_COURSES_KEY,
  STORAGE_COURSE_OVERRIDES_KEY,
  STORAGE_HAS_PLAN_KEY,
  INITIAL_SEED_GRADES,
  defaultFallbackContext,
} from "@/src/data/academic-stats-constants";
import { useAcademicCalculations } from "@/src/hooks/use-academic-calculations";

export type { CourseOverride, AcademicStatsValue } from "@/src/types/academic-stats";
export { INITIAL_SEED_GRADES } from "@/src/data/academic-stats-constants";

const AcademicStatsContext = createContext<AcademicStatsValue | undefined>(undefined);

export function AcademicStatsProvider({ children }: { children: React.ReactNode }) {
  const [plans] = useState<StudyPlan[]>(initialStudyPlans);
  const [isLoaded, setIsLoaded] = useState(false);

  const [selectedPlanId, setSelectedPlanId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_PLAN_KEY);
        if (stored && initialStudyPlans.some((p) => p.id === stored)) return stored;
      } catch {
        // ignore
      }
    }
    return "cs";
  });

  const [hasPlanSelected, setHasPlanSelectedState] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_HAS_PLAN_KEY);
        if (stored !== null) return stored === "true";
      } catch {
        // ignore
      }
    }
    return true;
  });

  const [courseGrades, setCourseGrades] = useState<Record<string, number>>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_GRADES_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed === "object") return parsed;
        }
      } catch {
        // ignore
      }
    }
    return INITIAL_SEED_GRADES;
  });

  const [customCourses, setCustomCourses] = useState<Course[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_CUSTOM_COURSES_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch {
        // ignore
      }
    }
    return [];
  });

  const [courseOverrides, setCourseOverrides] = useState<Record<string, CourseOverride>>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_COURSE_OVERRIDES_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed === "object") return parsed;
        }
      } catch {
        // ignore
      }
    }
    return {};
  });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_PLAN_KEY, selectedPlanId);
      localStorage.setItem(STORAGE_HAS_PLAN_KEY, hasPlanSelected ? "true" : "false");
      localStorage.setItem(STORAGE_GRADES_KEY, JSON.stringify(courseGrades));
      localStorage.setItem(STORAGE_CUSTOM_COURSES_KEY, JSON.stringify(customCourses));
      localStorage.setItem(STORAGE_COURSE_OVERRIDES_KEY, JSON.stringify(courseOverrides));

      window.dispatchEvent(new Event("unimeta_academic_stats_updated"));
    } catch {
      // ignore
    }
  }, [selectedPlanId, hasPlanSelected, courseGrades, customCourses, courseOverrides, isLoaded]);

  const selectedPlan = useMemo(() => {
    return plans.find((p) => p.id === selectedPlanId) || plans[0];
  }, [plans, selectedPlanId]);

  const {
    allCourses,
    completedCourses,
    totalCredits,
    completedCredits,
    remainingCredits,
    progressPercentage,
    cumulativeGpa,
    gpaFormatted,
    gpaRating,
  } = useAcademicCalculations({
    hasPlanSelected,
    selectedPlan,
    customCourses,
    courseOverrides,
    courseGrades,
  });

  const selectPlan = useCallback((planId: string) => {
    if (initialStudyPlans.some((p) => p.id === planId)) {
      setSelectedPlanId(planId);
      setHasPlanSelectedState(true);
    }
  }, []);

  const setHasPlanSelected = useCallback((hasPlan: boolean) => {
    setHasPlanSelectedState(hasPlan);
  }, []);

  const setCourseGrade = useCallback((courseCode: string, grade: number | undefined) => {
    setCourseGrades((prev) => {
      const copy = { ...prev };
      if (grade === undefined || isNaN(grade)) {
        delete copy[courseCode];
      } else {
        copy[courseCode] = Math.min(100, Math.max(0, grade));
      }
      return copy;
    });
  }, []);

  const toggleCourseCompletion = useCallback((courseCode: string, completed?: boolean) => {
    setCourseGrades((prevGrades) => {
      const copyGrades = { ...prevGrades };
      const currentGrade = copyGrades[courseCode];
      const isCurrentlyCompleted = currentGrade !== undefined && currentGrade >= 60;

      const shouldComplete = completed !== undefined ? completed : !isCurrentlyCompleted;

      if (shouldComplete) {
        copyGrades[courseCode] = currentGrade && currentGrade >= 60 ? currentGrade : 85;
      } else {
        delete copyGrades[courseCode];
      }
      return copyGrades;
    });

    setCourseOverrides((prevOverrides) => {
      const copy = { ...prevOverrides };
      const current = copy[courseCode] || {};
      const shouldComplete = completed !== undefined ? completed : !current.isCompleted;
      copy[courseCode] = { ...current, isCompleted: shouldComplete };
      return copy;
    });
  }, []);

  const updateCourseCredits = useCallback((courseCode: string, credits: number) => {
    const validCredits = Math.max(1, Math.min(12, credits));
    setCourseOverrides((prev) => ({
      ...prev,
      [courseCode]: {
        ...prev[courseCode],
        credits: validCredits,
      },
    }));
  }, []);

  const updateCourseDetails = useCallback(
    (
      courseCode: string,
      data: { name?: string; credits?: number; grade?: number | null; isCompleted?: boolean }
    ) => {
      setCourseOverrides((prev) => {
        const copy = { ...prev };
        const current = copy[courseCode] || {};
        copy[courseCode] = {
          ...current,
          name: data.name !== undefined ? data.name : current.name,
          credits: data.credits !== undefined ? Math.max(1, Math.min(12, data.credits)) : current.credits,
          isCompleted: data.isCompleted !== undefined ? data.isCompleted : current.isCompleted,
        };
        return copy;
      });

      setCourseGrades((prev) => {
        const copy = { ...prev };
        if (data.grade === null || data.grade === undefined || isNaN(data.grade)) {
          if (data.isCompleted === false) {
            delete copy[courseCode];
          }
        } else {
          copy[courseCode] = Math.min(100, Math.max(0, data.grade));
        }
        return copy;
      });
    },
    []
  );

  const addCustomCourse = useCallback((course: Course, initialGrade?: number) => {
    setCustomCourses((prev) => {
      if (prev.some((c) => c.code === course.code)) return prev;
      return [...prev, course];
    });

    if (initialGrade !== undefined && !isNaN(initialGrade)) {
      setCourseGrades((prev) => ({
        ...prev,
        [course.code]: Math.min(100, Math.max(0, initialGrade)),
      }));
    }
  }, []);

  const removeCustomCourse = useCallback((courseCode: string) => {
    setCustomCourses((prev) => prev.filter((c) => c.code !== courseCode));
    setCourseGrades((prev) => {
      const copy = { ...prev };
      delete copy[courseCode];
      return copy;
    });
    setCourseOverrides((prev) => {
      const copy = { ...prev };
      delete copy[courseCode];
      return copy;
    });
  }, []);

  const resetCourseGrades = useCallback(() => {
    setCourseGrades({});
    setCourseOverrides({});
  }, []);

  const resetAllStats = useCallback(() => {
    setSelectedPlanId("cs");
    setHasPlanSelectedState(true);
    setCourseGrades(INITIAL_SEED_GRADES);
    setCustomCourses([]);
    setCourseOverrides({});
  }, []);

  const value = useMemo<AcademicStatsValue>(
    () => ({
      plans,
      selectedPlanId,
      selectedPlan,
      hasPlanSelected,
      isLoaded,

      allCourses,
      completedCourses,
      courseGrades,
      customCourses,
      courseOverrides,

      totalCredits,
      completedCredits,
      remainingCredits,
      progressPercentage,
      completionPercentage: progressPercentage,
      cumulativeGpa,
      gpaFormatted,
      gpaRating,

      selectPlan,
      setHasPlanSelected,
      toggleCourseCompletion,
      setCourseGrade,
      updateCourseCredits,
      updateCourseDetails,
      addCustomCourse,
      removeCustomCourse,
      resetCourseGrades,
      resetAllStats,
    }),
    [
      plans,
      selectedPlanId,
      selectedPlan,
      hasPlanSelected,
      isLoaded,

      allCourses,
      completedCourses,
      courseGrades,
      customCourses,
      courseOverrides,

      totalCredits,
      completedCredits,
      remainingCredits,
      progressPercentage,
      cumulativeGpa,
      gpaFormatted,
      gpaRating,

      selectPlan,
      setHasPlanSelected,
      toggleCourseCompletion,
      setCourseGrade,
      updateCourseCredits,
      updateCourseDetails,
      addCustomCourse,
      removeCustomCourse,
      resetCourseGrades,
      resetAllStats,
    ]
  );

  return (
    <AcademicStatsContext.Provider value={value}>
      {children}
    </AcademicStatsContext.Provider>
  );
}

export function useAcademicStats(): AcademicStatsValue {
  const context = useContext(AcademicStatsContext);
  if (!context) {
    return defaultFallbackContext;
  }
  return context;
}
