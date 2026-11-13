import { useMemo } from "react";
import { StudyPlan, Course } from "@/src/data/study-plans-data";
import { CourseOverride } from "@/src/types/academic-stats";

interface AcademicCalculationsInput {
  hasPlanSelected: boolean;
  selectedPlan: StudyPlan;
  customCourses: Course[];
  courseOverrides: Record<string, CourseOverride>;
  courseGrades: Record<string, number>;
}

export function useAcademicCalculations({
  hasPlanSelected,
  selectedPlan,
  customCourses,
  courseOverrides,
  courseGrades,
}: AcademicCalculationsInput) {
  const allCourses = useMemo(() => {
    const planCourses = selectedPlan.courses.map((course) => {
      const override = courseOverrides[course.code];
      if (override) {
        return {
          ...course,
          name: override.name ?? course.name,
          credits: override.credits !== undefined ? override.credits : course.credits,
          category: override.category ?? course.category,
        };
      }
      return course;
    });

    const customs = customCourses.map((c) => {
      const override = courseOverrides[c.code];
      if (override) {
        return {
          ...c,
          name: override.name ?? c.name,
          credits: override.credits !== undefined ? override.credits : c.credits,
          category: override.category ?? c.category,
        };
      }
      return c;
    });

    return [...planCourses, ...customs];
  }, [selectedPlan, customCourses, courseOverrides]);

  const completedCourses = useMemo(() => {
    return allCourses.filter((course) => {
      const override = courseOverrides[course.code];
      if (override?.isCompleted !== undefined) {
        return override.isCompleted;
      }
      const grade = courseGrades[course.code];
      return grade !== undefined && !isNaN(grade) && grade >= 60;
    });
  }, [allCourses, courseGrades, courseOverrides]);

  const derivedStats = useMemo(() => {
    if (!hasPlanSelected) {
      return {
        totalCredits: 0,
        completedCredits: 0,
        remainingCredits: 0,
        progressPercentage: 0,
        cumulativeGpa: 0,
        gpaFormatted: "—",
        gpaRating: { label: "لم تُحدد الخطة", color: "text-brand-muted bg-brand-surface-muted border-brand-border-soft" },
      };
    }

    const customCreditsSum = customCourses.reduce((sum, c) => {
      const override = courseOverrides[c.code];
      return sum + (override?.credits !== undefined ? override.credits : c.credits);
    }, 0);
    const planTotal = selectedPlan.totalCredits + customCreditsSum;

    let rawCompleted = 0;
    allCourses.forEach((c) => {
      const override = courseOverrides[c.code];
      const isComp =
        override?.isCompleted !== undefined
          ? override.isCompleted
          : courseGrades[c.code] !== undefined && !isNaN(courseGrades[c.code]) && courseGrades[c.code] >= 60;

      if (isComp) {
        rawCompleted += c.credits;
      }
    });

    const finalCompleted = Math.min(planTotal, rawCompleted);
    const finalRemaining = Math.max(0, planTotal - finalCompleted);
    const finalPercentage = planTotal > 0 ? Math.min(100, Math.round((finalCompleted / planTotal) * 100)) : 0;

    let totalGradePoints = 0;
    let gradedCreditsCount = 0;

    allCourses.forEach((c) => {
      const grade = courseGrades[c.code];
      if (typeof grade === "number" && !isNaN(grade) && grade >= 0 && grade <= 100) {
        gradedCreditsCount += c.credits;
        totalGradePoints += grade * c.credits;
      }
    });

    const gpa = gradedCreditsCount > 0 ? Number((totalGradePoints / gradedCreditsCount).toFixed(2)) : 0;
    const formatted = gradedCreditsCount > 0 && gpa > 0 ? gpa.toFixed(2) : "—";

    let rating = { label: "لا توجد علامات", color: "text-brand-muted bg-brand-surface-muted border-brand-border-soft" };
    if (gradedCreditsCount > 0 && gpa > 0) {
      if (gpa >= 90) rating = { label: "ممتاز", color: "text-brand-primary bg-brand-surface-blue border-brand-border-soft" };
      else if (gpa >= 80) rating = { label: "جيد جداً", color: "text-brand-hover-medium bg-brand-surface-soft border-brand-border-soft" };
      else if (gpa >= 70) rating = { label: "جيد", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
      else if (gpa >= 60) rating = { label: "مقبول", color: "text-amber-700 bg-amber-50 border-amber-200" };
      else rating = { label: "راسب / غير مستوف", color: "text-red-700 bg-red-50 border-red-200" };
    }

    return {
      totalCredits: planTotal,
      completedCredits: finalCompleted,
      remainingCredits: finalRemaining,
      progressPercentage: finalPercentage,
      cumulativeGpa: gpa,
      gpaFormatted: formatted,
      gpaRating: rating,
    };
  }, [hasPlanSelected, selectedPlan, customCourses, allCourses, courseGrades, courseOverrides]);

  return {
    allCourses,
    completedCourses,
    ...derivedStats,
  };
}

