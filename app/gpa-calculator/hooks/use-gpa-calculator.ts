"use client";

import { useState, useMemo, useEffect } from "react";
import { useStudyPlan } from "@/src/contexts/study-plan-context";
import { useNotifications } from "@/src/contexts/notifications-context";
import {
  GpaCourseItem,
  GpaSemesterData,
  GpaYearData,
  STORAGE_GPA_DATA_KEY,
  YEAR_TITLES,
} from "../types";

export function useGpaCalculator() {
  const {
    selectedPlan,
    hasPlanSelected,
    courseGrades,
    setCourseGrade,
    updateCourseCredits,
  } = useStudyPlan();

  const { notify } = useNotifications();

  const totalYears = useMemo(() => {
    if (selectedPlan.degree === "ماجستير" || selectedPlan.totalCredits <= 36) return 2;
    if (selectedPlan.totalCredits >= 150 || selectedPlan.semestersCount >= 10) return 5;
    return 4;
  }, [selectedPlan]);

  const buildInitialYears = (keepExistingGrades = true): GpaYearData[] => {
    const years: GpaYearData[] = [];

    for (let y = 1; y <= totalYears; y++) {
      const s1Index = (y - 1) * 2 + 1;
      const s2Index = (y - 1) * 2 + 2;

      const s1PlanCourses = selectedPlan.courses.filter((c) => c.semester === s1Index);
      const s2PlanCourses = selectedPlan.courses.filter((c) => c.semester === s2Index);

      const s1Courses: GpaCourseItem[] = s1PlanCourses.map((c) => {
        const existingGrade = keepExistingGrades ? courseGrades[c.code] : undefined;
        return {
          id: `${c.code}-${s1Index}`,
          code: c.code,
          name: c.name,
          credits: c.credits,
          grade: existingGrade !== undefined ? existingGrade : "",
        };
      });

      const s2Courses: GpaCourseItem[] = s2PlanCourses.map((c) => {
        const existingGrade = keepExistingGrades ? courseGrades[c.code] : undefined;
        return {
          id: `${c.code}-${s2Index}`,
          code: c.code,
          name: c.name,
          credits: c.credits,
          grade: existingGrade !== undefined ? existingGrade : "",
        };
      });

      years.push({
        yearNumber: y,
        yearTitle: YEAR_TITLES[y - 1] || `السنة ${y}`,
        hasSummer: false,
        semesters: [
          {
            id: `y${y}-s1`,
            name: "الفصل الأول",
            courses: s1Courses,
          },
          {
            id: `y${y}-s2`,
            name: "الفصل الثاني",
            courses: s2Courses,
          },
        ],
      });
    }

    return years;
  };

  const [yearsData, setYearsData] = useState<GpaYearData[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(`${STORAGE_GPA_DATA_KEY}_${selectedPlan.id}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return buildInitialYears(true);
  });

  const [currentPlanId, setCurrentPlanId] = useState(selectedPlan.id);
  if (currentPlanId !== selectedPlan.id) {
    setCurrentPlanId(selectedPlan.id);
    const fresh = buildInitialYears(true);
    setYearsData(fresh);
  }

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_GPA_DATA_KEY}_${selectedPlan.id}`, JSON.stringify(yearsData));
    } catch {}
  }, [yearsData, selectedPlan.id]);

  useEffect(() => {
    setYearsData((prev) =>
      prev.map((yr) => ({
        ...yr,
        semesters: yr.semesters.map((sem) => ({
          ...sem,
          courses: sem.courses.map((c) => {
            if (c.code && courseGrades[c.code] !== undefined && c.grade !== courseGrades[c.code]) {
              return { ...c, grade: courseGrades[c.code] };
            }
            return c;
          }),
        })),
      }))
    );
  }, [courseGrades]);

  const handleImportPlanCourses = () => {
    const imported = buildInitialYears(true);
    setYearsData(imported);
    notify({
      type: "general",
      title: "تم استيراد مواد الخطة بنجاح! 📥",
      message: `تم توزيع مساقات خطة "${selectedPlan.major}" على السنوات والفصول الدراسية تلقائياً.`,
      playSound: true,
      browserNotify: false,
    });
  };

  const handleToggleSummer = (yearNumber: number) => {
    setYearsData((prev) =>
      prev.map((year) => {
        if (year.yearNumber !== yearNumber) return year;

        if (year.hasSummer) {
          return {
            ...year,
            hasSummer: false,
            semesters: year.semesters.filter((s) => !s.isSummer),
          };
        } else {
          const summerSemester: GpaSemesterData = {
            id: `y${yearNumber}-summer`,
            name: "الفصل الصيفي",
            isSummer: true,
            courses: [
              {
                id: `summer-${Date.now()}-1`,
                code: "",
                name: "مادة صيفية (1)",
                credits: 3,
                grade: "",
              },
            ],
          };
          return {
            ...year,
            hasSummer: true,
            semesters: [...year.semesters, summerSemester],
          };
        }
      })
    );
  };

  const handleAddCourse = (yearNumber: number, semesterId: string) => {
    setYearsData((prev) =>
      prev.map((year) => {
        if (year.yearNumber !== yearNumber) return year;
        return {
          ...year,
          semesters: year.semesters.map((sem) => {
            if (sem.id !== semesterId) return sem;
            const newCourse: GpaCourseItem = {
              id: `custom-${Date.now()}`,
              code: "",
              name: "مساق إضافي جديد",
              credits: 3,
              grade: "",
            };
            return {
              ...sem,
              courses: [...sem.courses, newCourse],
            };
          }),
        };
      })
    );
  };

  const handleRemoveCourse = (yearNumber: number, semesterId: string, courseId: string) => {
    setYearsData((prev) =>
      prev.map((year) => {
        if (year.yearNumber !== yearNumber) return year;
        return {
          ...year,
          semesters: year.semesters.map((sem) => {
            if (sem.id !== semesterId) return sem;
            return {
              ...sem,
              courses: sem.courses.filter((c) => c.id !== courseId),
            };
          }),
        };
      })
    );
  };

  const handleUpdateCourse = (
    yearNumber: number,
    semesterId: string,
    courseId: string,
    field: "name" | "credits" | "grade",
    value: string | number
  ) => {
    setYearsData((prev) =>
      prev.map((year) => {
        if (year.yearNumber !== yearNumber) return year;
        return {
          ...year,
          semesters: year.semesters.map((sem) => {
            if (sem.id !== semesterId) return sem;
            return {
              ...sem,
              courses: sem.courses.map((c) => {
                if (c.id !== courseId) return c;
                if (field === "grade") {
                  const numVal = value === "" ? "" : Math.min(100, Math.max(0, parseFloat(value as string) || 0));
                  if (c.code) {
                    setCourseGrade(c.code, numVal === "" ? undefined : (numVal as number));
                  }
                  return { ...c, grade: numVal };
                }
                if (field === "credits") {
                  const numCredits = Math.max(1, Math.min(10, parseInt(value as string, 10) || 1));
                  if (c.code && updateCourseCredits) {
                    updateCourseCredits(c.code, numCredits);
                  }
                  return { ...c, credits: numCredits };
                }
                return { ...c, name: String(value) };
              }),
            };
          }),
        };
      })
    );
  };

  const { semesterCalculations, yearCalculations, overallGpa, totalGradedCredits } = useMemo(() => {
    const semMap: Record<string, { hours: number; points: number; gpa: number }> = {};
    const yrMap: Record<number, { hours: number; points: number; gpa: number }> = {};

    let grandHours = 0;
    let grandPoints = 0;

    yearsData.forEach((year) => {
      let yrHours = 0;
      let yrPoints = 0;

      year.semesters.forEach((sem) => {
        let semHours = 0;
        let semPoints = 0;

        sem.courses.forEach((c) => {
          if (typeof c.grade === "number" && !isNaN(c.grade)) {
            semHours += c.credits;
            semPoints += c.grade * c.credits;
          }
        });

        const semGpa = semHours > 0 ? Number((semPoints / semHours).toFixed(2)) : 0;
        semMap[sem.id] = { hours: semHours, points: semPoints, gpa: semGpa };

        yrHours += semHours;
        yrPoints += semPoints;
      });

      const yrGpa = yrHours > 0 ? Number((yrPoints / yrHours).toFixed(2)) : 0;
      yrMap[year.yearNumber] = { hours: yrHours, points: yrPoints, gpa: yrGpa };

      grandHours += yrHours;
      grandPoints += yrPoints;
    });

    const grandGpa = grandHours > 0 ? Number((grandPoints / grandHours).toFixed(2)) : 0;

    return {
      semesterCalculations: semMap,
      yearCalculations: yrMap,
      overallGpa: grandGpa,
      totalGradedCredits: grandHours,
    };
  }, [yearsData]);

  const overallRating = useMemo(() => {
    if (totalGradedCredits === 0) {
      return { label: "لا توجد علامات مدخلة", color: "bg-slate-100 text-[#66788A] border-slate-200" };
    }
    if (overallGpa >= 90) return { label: "ممتاز (مرتبة شرف)", color: "bg-[#EAF4FD] text-[#0057C8] border-[#D7EAF7]" };
    if (overallGpa >= 80) return { label: "جيد جداً", color: "bg-[#F0F7FD] text-[#2D78B7] border-[#D7EAF7]" };
    if (overallGpa >= 70) return { label: "جيد", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    if (overallGpa >= 60) return { label: "مقبول", color: "bg-amber-50 text-amber-700 border-amber-200" };
    return { label: "راسب / إنذار أكاديمي", color: "bg-red-50 text-red-700 border-red-200" };
  }, [overallGpa, totalGradedCredits]);

  return {
    selectedPlan,
    hasPlanSelected,
    totalYears,
    yearsData,
    semesterCalculations,
    yearCalculations,
    overallGpa,
    totalGradedCredits,
    overallRating,
    handleImportPlanCourses,
    handleToggleSummer,
    handleAddCourse,
    handleRemoveCourse,
    handleUpdateCourse,
  };
}

