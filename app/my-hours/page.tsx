"use client";

import React from "react";
import dynamic from "next/dynamic";
import { StudentShell } from "@/components/layout/student-shell";
import { useMyHours } from "./hooks/use-my-hours";
import { NoPlanSelected } from "./components/no-plan-selected";
import { MyHoursHero } from "./components/my-hours-hero";
import { MyHoursKPIs } from "./components/my-hours-kpis";
import { CurriculumSection } from "./components/curriculum-section";

const DynamicMyHoursModals = dynamic(
  () => import("./components/my-hours-modals").then((m) => m.MyHoursModals),
  { ssr: false }
);

export default function MyHoursPage() {
  const {
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
    yearGroups,
    categoryGroups,
    handleSaveCourseEdit,
    handleSaveNewCourse,
  } = useMyHours();

  if (!hasPlanSelected) {
    return (
      <StudentShell>
        <NoPlanSelected />
      </StudentShell>
    );
  }

  return (
    <StudentShell>
      <div className="space-y-6 animate-fade-in" dir="rtl">
        <MyHoursHero selectedPlan={selectedPlan} totalCredits={totalCredits} />

        <MyHoursKPIs
          totalCredits={totalCredits}
          completedCredits={completedCredits}
          remainingCredits={remainingCredits}
          completionPercentage={completionPercentage}
          cumulativeGpa={cumulativeGpa}
          gpaRating={gpaRating}
          categoryStats={categoryStats}
        />

        <CurriculumSection
          selectedPlan={selectedPlan}
          allCourses={allCourses}
          customCourses={customCourses}
          courseGrades={courseGrades}
          courseOverrides={courseOverrides}
          toggleCourseCompletion={toggleCourseCompletion}
          removeCustomCourse={removeCustomCourse}
          resetAllStats={resetAllStats}
          groupBy={groupBy}
          setGroupBy={setGroupBy}
          filterMode={filterMode}
          setFilterMode={setFilterMode}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          yearGroups={yearGroups}
          categoryGroups={categoryGroups}
          setIsAddModalOpen={setIsAddModalOpen}
          setEditingCourse={setEditingCourse}
        />
      </div>

      <DynamicMyHoursModals
        editingCourse={editingCourse}
        setEditingCourse={setEditingCourse}
        handleSaveCourseEdit={handleSaveCourseEdit}
        isAddModalOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen}
        newCourse={newCourse}
        setNewCourse={setNewCourse}
        handleSaveNewCourse={handleSaveNewCourse}
      />
    </StudentShell>
  );
}
