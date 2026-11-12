"use client";

import { useState, useMemo } from "react";
import { useStudyPlan } from "@/src/contexts/study-plan-context";
import { CourseCategory, CATEGORY_LABELS, Course } from "@/src/data/study-plans-data";
import {
  EditingCourseState,
  NewCourseState,
  CategoryStat,
  YearGroup,
  CategoryGroup,
} from "../types";

export function useMyHours() {
  const {
    selectedPlan,
    hasPlanSelected,
    totalCredits,
    allCourses,
    customCourses,
    courseGrades,
    courseOverrides,
    toggleCourseCompletion,
    updateCourseDetails,
    addCustomCourse,
    removeCustomCourse,
    resetAllStats,
    completedCredits,
    remainingCredits,
    completionPercentage,
    cumulativeGpa,
    gpaFormatted,
    gpaRating,
  } = useStudyPlan();

  const [groupBy, setGroupBy] = useState<"semester" | "category">("semester");
  const [filterMode, setFilterMode] = useState<"all" | "completed" | "remaining">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [editingCourse, setEditingCourse] = useState<EditingCourseState | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState<NewCourseState>({
    code: "",
    name: "",
    credits: 3,
    category: "major",
    semester: 1,
    grade: "",
    isCompleted: false,
  });

  const categoryStats = useMemo<CategoryStat[]>(() => {
    const stats: Record<CourseCategory, CategoryStat> = {
      university: { id: "university", title: "متطلبات الجامعة", required: 0, completed: 0 },
      college: { id: "college", title: "متطلبات الكلية", required: 0, completed: 0 },
      major: { id: "major", title: "متطلبات التخصص الإجبارية", required: 0, completed: 0 },
      elective: { id: "elective", title: "متطلبات التخصص الاختيارية", required: 0, completed: 0 },
      free: { id: "free", title: "المساقات الحرة", required: 0, completed: 0 },
    };

    allCourses.forEach((c) => {
      const cat = c.category in stats ? c.category : "major";
      stats[cat].required += c.credits;
      const g = courseGrades[c.code];
      const isComp =
        courseOverrides[c.code]?.isCompleted !== undefined
          ? courseOverrides[c.code].isCompleted
          : g !== undefined && g >= 60;
      if (isComp) {
        stats[cat].completed += c.credits;
      }
    });

    return Object.values(stats).filter((s) => s.required > 0);
  }, [allCourses, courseGrades, courseOverrides]);

  const filteredCourses = useMemo(() => {
    return allCourses.filter((c) => {
      const g = courseGrades[c.code];
      const isCompleted =
        courseOverrides[c.code]?.isCompleted !== undefined
          ? courseOverrides[c.code].isCompleted
          : g !== undefined && g >= 60;

      if (filterMode === "completed" && !isCompleted) return false;
      if (filterMode === "remaining" && isCompleted) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesCode = c.code.toLowerCase().includes(query);
        const matchesName = c.name.toLowerCase().includes(query);
        return matchesCode || matchesName;
      }

      return true;
    });
  }, [allCourses, courseGrades, courseOverrides, filterMode, searchQuery]);

  const yearGroups = useMemo<YearGroup[]>(() => {
    const yearNames = ["السنة الأولى", "السنة الثانية", "السنة الثالثة", "السنة الرابعة", "السنة الخامسة"];
    const totalYrs =
      selectedPlan.degree === "ماجستير" || selectedPlan.totalCredits <= 36
        ? 2
        : selectedPlan.totalCredits >= 150 || selectedPlan.semestersCount >= 10
        ? 5
        : 4;

    const result: YearGroup[] = [];
    for (let y = 1; y <= totalYrs; y++) {
      const sem1Raw = (y - 1) * 2 + 1;
      const sem2Raw = (y - 1) * 2 + 2;

      const courses1 = filteredCourses.filter((c) => (c.semester || 1) === sem1Raw);
      const courses2 = filteredCourses.filter((c) => (c.semester || 1) === sem2Raw);

      if (courses1.length === 0 && courses2.length === 0) continue;

      const semList = [];
      if (courses1.length > 0) {
        semList.push({
          id: `y${y}-s1`,
          title: "الفصل الأول",
          subtitle: `${courses1.reduce((sum, c) => sum + c.credits, 0)} ساعة معتمدة`,
          courses: courses1,
        });
      }
      if (courses2.length > 0) {
        semList.push({
          id: `y${y}-s2`,
          title: "الفصل الثاني",
          subtitle: `${courses2.reduce((sum, c) => sum + c.credits, 0)} ساعة معتمدة`,
          courses: courses2,
        });
      }

      const allYearCourses = [...courses1, ...courses2];
      const yrTotalCredits = allYearCourses.reduce((sum, c) => sum + c.credits, 0);
      const yrCompletedCredits = allYearCourses.reduce((sum, c) => {
        const g = courseGrades[c.code];
        const isComp =
          courseOverrides[c.code]?.isCompleted !== undefined
            ? courseOverrides[c.code].isCompleted
            : g !== undefined && g >= 60;
        return isComp ? sum + c.credits : sum;
      }, 0);

      result.push({
        yearNumber: y,
        yearTitle: yearNames[y - 1] || `السنة ${y}`,
        totalCredits: yrTotalCredits,
        completedCredits: yrCompletedCredits,
        semesters: semList,
      });
    }

    return result;
  }, [filteredCourses, selectedPlan, courseGrades, courseOverrides]);

  const categoryGroups = useMemo<CategoryGroup[]>(() => {
    const map: Record<CourseCategory, Course[]> = {
      university: [],
      college: [],
      major: [],
      elective: [],
      free: [],
    };
    filteredCourses.forEach((c) => {
      const cat = c.category in map ? c.category : "major";
      map[cat].push(c);
    });
    return Object.entries(map)
      .filter(([, courses]) => courses.length > 0)
      .map(([cat, courses]) => {
        const badge = CATEGORY_LABELS[cat as CourseCategory] || CATEGORY_LABELS.major;
        return {
          key: `cat-${cat}`,
          title: badge.label,
          subtitle: `${courses.reduce((sum, c) => sum + c.credits, 0)} ساعة معتمدة`,
          courses,
        };
      });
  }, [filteredCourses]);

  const handleSaveCourseEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    updateCourseDetails(editingCourse.code, {
      name: editingCourse.name,
      credits: Number(editingCourse.credits) || 3,
      grade: editingCourse.grade === "" ? null : Number(editingCourse.grade),
      isCompleted: editingCourse.isCompleted,
    });

    setEditingCourse(null);
  };

  const handleSaveNewCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.code || !newCourse.name) return;

    const code = newCourse.code.trim().toUpperCase();
    addCustomCourse(
      {
        code,
        name: newCourse.name.trim(),
        credits: Number(newCourse.credits) || 3,
        category: newCourse.category,
        semester: Number(newCourse.semester) || 1,
      },
      newCourse.grade !== "" ? Number(newCourse.grade) : undefined
    );

    if (newCourse.isCompleted) {
      toggleCourseCompletion(code, true);
    }

    setIsAddModalOpen(false);
    setNewCourse({
      code: "",
      name: "",
      credits: 3,
      category: "major",
      semester: 1,
      grade: "",
      isCompleted: false,
    });
  };

  return {
    selectedPlan,
    hasPlanSelected,
    totalCredits,
    allCourses,
    customCourses,
    courseGrades,
    courseOverrides,
    toggleCourseCompletion,
    removeCustomCourse,
    resetAllStats,
    completedCredits,
    remainingCredits,
    completionPercentage,
    cumulativeGpa,
    gpaFormatted,
    gpaRating,
    groupBy,
    setGroupBy,
    filterMode,
    setFilterMode,
    searchQuery,
    setSearchQuery,
    editingCourse,
    setEditingCourse,
    isAddModalOpen,
    setIsAddModalOpen,
    newCourse,
    setNewCourse,
    categoryStats,
    filteredCourses,
    yearGroups,
    categoryGroups,
    handleSaveCourseEdit,
    handleSaveNewCourse,
  };
}

