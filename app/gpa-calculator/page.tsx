"use client";

import { StudentShell } from "@/components/layout/student-shell";
import { useGpaCalculator } from "./hooks/use-gpa-calculator";
import { NoPlanView } from "./components/no-plan-view";
import { GpaHeaderBanner } from "./components/gpa-header-banner";
import { GpaKPIs } from "./components/gpa-kpis";
import { AcademicYearCard } from "./components/academic-year-card";
import { apiClient } from "@/src/services/api-client";
import { LiveGpa } from "@/components/integration/live-gpa";

export default function GpaCalculatorPage() { return apiClient.isUsingMock() ? <MockGpaCalculatorPage/> : <StudentShell><LiveGpa/></StudentShell>; }
function MockGpaCalculatorPage() {
  const {
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
  } = useGpaCalculator();

  if (!hasPlanSelected) {
    return (
      <StudentShell>
        <NoPlanView />
      </StudentShell>
    );
  }

  return (
    <StudentShell>
      <div className="space-y-6 animate-fade-in" dir="rtl">
        <GpaHeaderBanner
          selectedPlan={selectedPlan}
          onImportPlanCourses={handleImportPlanCourses}
        />

        <GpaKPIs
          overallGpa={overallGpa}
          overallRating={overallRating}
          totalGradedCredits={totalGradedCredits}
          totalYears={totalYears}
          selectedPlan={selectedPlan}
        />

        <div className="space-y-6">
          {yearsData.map((year) => (
            <AcademicYearCard
              key={year.yearNumber}
              year={year}
              yearCalc={yearCalculations[year.yearNumber] || { hours: 0, points: 0, gpa: 0 }}
              semesterCalculations={semesterCalculations}
              onToggleSummer={handleToggleSummer}
              onAddCourse={handleAddCourse}
              onRemoveCourse={handleRemoveCourse}
              onUpdateCourse={handleUpdateCourse}
            />
          ))}
        </div>
      </div>
    </StudentShell>
  );
}
