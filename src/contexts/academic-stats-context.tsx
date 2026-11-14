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
import { apiClient } from "@/src/services/api-client";
import { academicService } from "@/src/services/academic-service";
import { reportApiError } from "@/src/services/api-result";
import { useAuth } from "./auth-context";
import { useAcademicCalculations } from "@/src/hooks/use-academic-calculations";

export type { CourseOverride, AcademicStatsValue } from "@/src/types/academic-stats";
export { INITIAL_SEED_GRADES } from "@/src/data/academic-stats-constants";

const AcademicStatsContext = createContext<AcademicStatsValue | undefined>(undefined);

export function AcademicStatsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const live = !apiClient.isUsingMock();
  const [plans, setPlans] = useState<StudyPlan[]>(live ? [] : initialStudyPlans);
  const [revision,setRevision]=useState(0);
  useEffect(()=>{const changed=()=>setRevision(v=>v+1);window.addEventListener("unimeta_academic_change",changed);return()=>window.removeEventListener("unimeta_academic_change",changed);},[]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [selectedPlanId, setSelectedPlanId] = useState<string>(() => {
    if (!apiClient.isUsingMock()) return "";
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
    if (!apiClient.isUsingMock()) return false;
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
    if (!apiClient.isUsingMock()) return {};
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
    if (!apiClient.isUsingMock()) return [];
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
    if (!apiClient.isUsingMock()) return {};
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
    if (!live) { setIsLoaded(true); return; }
    setCourseGrades({}); setHasPlanSelectedState(false); setPlans([]);
    if (user?.role !== "student") { setIsLoaded(true); return; }
    let active = true;
    setIsLoaded(false);
    academicService.load().then(data => {
      if (!active) return;
      setPlans(data.plans); setSelectedPlanId(data.selectedPlanId);
      setHasPlanSelectedState(Boolean(data.selectedPlanId)); setCourseGrades(data.grades);
    }).catch(reportApiError).finally(() => { if (active) setIsLoaded(true); });
    return () => { active = false; };
  }, [live, user?.id, user?.role, revision]);

  useEffect(() => {
    if (!isLoaded || live) return;
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
    return plans.find((p) => p.id === selectedPlanId) || plans[0] || { ...initialStudyPlans[0], id: "", courses: [], totalCredits: 0, hourlyRate: 0 };
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

  const selectPlan = useCallback(async (planId: string) => {
    if (live) {
      await academicService.select(planId);
      const data = await academicService.load();
      setSelectedPlanId(data.selectedPlanId); setHasPlanSelectedState(true); setCourseGrades(data.grades);
      return;
    }
    if (plans.some((p) => p.id === planId)) {
      setSelectedPlanId(planId);
      setHasPlanSelectedState(true);
    }
  }, [live, plans]);

  const setHasPlanSelected = useCallback((hasPlan: boolean) => {
    if (live) return;
    setHasPlanSelectedState(hasPlan);
  }, []);

  const setCourseGrade = useCallback((courseCode: string, grade: number | undefined) => {
    if (live) {
      void academicService.grade(selectedPlanId, courseCode, grade).then(() => {
        setCourseGrades(prev => { const next = { ...prev }; if (grade === undefined) delete next[courseCode]; else next[courseCode] = grade; return next; });
      }).catch(reportApiError);
      return;
    }
    setCourseGrades((prev) => {
      const copy = { ...prev };
      if (grade === undefined || isNaN(grade)) {
        delete copy[courseCode];
      } else {
        copy[courseCode] = Math.min(100, Math.max(0, grade));
      }
      return copy;
    });
  }, [live, selectedPlanId]);

  const toggleCourseCompletion = useCallback((courseCode: string, completed?: boolean) => {
    if (live) { reportApiError(new Error("أدخل العلامة الفعلية للمادة لحفظ الإنجاز؛ لا تُسجَّل علامة افتراضية.")); return; }
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
    if (live) { reportApiError(new Error("هذه العملية غير متاحة حاليًا.")); return; }
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
      if (live) {
        const course = selectedPlan.courses.find(c=>c.code===courseCode);
        if ((data.name !== undefined && data.name !== course?.name) || (data.credits !== undefined && data.credits !== course?.credits)) reportApiError(new Error("تعديل اسم المادة وساعاتها غير متاح حاليًا."));
        if (data.grade !== undefined) setCourseGrade(courseCode, data.grade ?? undefined);
        return;
      }
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
    [live, setCourseGrade, selectedPlan]
  );

  const addCustomCourse = useCallback((course: Course, initialGrade?: number) => {
    if (live) { reportApiError(new Error("هذه العملية غير متاحة حاليًا.")); return; }
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
    if (live) { reportApiError(new Error("هذه العملية غير متاحة حاليًا.")); return; }
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
    if (live) { void Promise.all(Object.keys(courseGrades).map(code => academicService.grade(selectedPlanId, code, undefined))).then(() => setCourseGrades({})).catch(reportApiError); return; }
    setCourseGrades({});
    setCourseOverrides({});
  }, [live, courseGrades, selectedPlanId]);

  const resetAllStats = useCallback(() => {
    if (live) { reportApiError(new Error("هذه العملية غير متاحة حاليًا.")); return; }
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
