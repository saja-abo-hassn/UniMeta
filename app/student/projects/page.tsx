"use client";

import dynamic from "next/dynamic";
import { useStudentProjects } from "./hooks/use-student-projects";
import { ProjectsHeader } from "./components/projects-header";
import { ProjectsKPIs } from "./components/projects-kpis";
import { ProjectsFilterBar } from "./components/projects-filter-bar";
import { ProjectsGrid } from "./components/projects-grid";

export type { ScopeFilterType, AppliedProjectInfo, GraduationProject } from "./types";

const DynamicApplyProjectModal = dynamic(
  () => import("./components/apply-project-modal").then((mod) => mod.ApplyProjectModal),
  { ssr: false }
);

const DynamicNewProjectModal = dynamic(
  () => import("./components/new-project-modal").then((mod) => mod.NewProjectModal),
  { ssr: false }
);

export default function GraduationProjectsPage() {
  const {
    projects,
    filteredProjects,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    majorFilter,
    setMajorFilter,
    scopeFilter,
    setScopeFilter,
    isNewProjectModalOpen,
    setIsNewProjectModalOpen,
    applyingProject,
    setApplyingProject,
    applicantRole,
    setApplicantRole,
    applicantMessage,
    setApplicantMessage,
    applicantStage,
    setApplicantStage,
    stageError,
    setStageError,
    appliedProjects,
    newTitle,
    setNewTitle,
    newMajor,
    setNewMajor,
    newSupervisor,
    setNewSupervisor,
    newSummary,
    setNewSummary,
    newNeededRole,
    setNewNeededRole,
    handleApplySubmit,
    handleCreateProjectSubmit,
  } = useStudentProjects();

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      <ProjectsHeader onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)} />

      <ProjectsKPIs projects={projects} />

      <ProjectsFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        majorFilter={majorFilter}
        onMajorFilterChange={setMajorFilter}
        scopeFilter={scopeFilter}
        onScopeFilterChange={setScopeFilter}
        matchingCount={filteredProjects.length}
      />

      <ProjectsGrid
        projects={filteredProjects}
        appliedProjects={appliedProjects}
        onResetFilters={() => {
          setSearchQuery("");
          setStatusFilter("all");
          setMajorFilter("all");
          setScopeFilter("all");
        }}
        onApplyToProject={(p) => {
          setApplyingProject(p);
          setApplicantStage("");
          setStageError("");
        }}
      />

      {applyingProject && (
        <DynamicApplyProjectModal
          isOpen={!!applyingProject}
          onClose={() => setApplyingProject(null)}
          project={applyingProject}
          applicantStage={applicantStage}
          onStageChange={(stage) => {
            setApplicantStage(stage);
            setStageError("");
          }}
          stageError={stageError}
          applicantRole={applicantRole}
          onRoleChange={setApplicantRole}
          applicantMessage={applicantMessage}
          onMessageChange={setApplicantMessage}
          onSubmit={handleApplySubmit}
        />
      )}

      {isNewProjectModalOpen && (
        <DynamicNewProjectModal
          isOpen={isNewProjectModalOpen}
          onClose={() => setIsNewProjectModalOpen(false)}
          onSubmit={handleCreateProjectSubmit}
          newTitle={newTitle}
          onTitleChange={setNewTitle}
          newMajor={newMajor}
          onMajorChange={setNewMajor}
          newSupervisor={newSupervisor}
          onSupervisorChange={setNewSupervisor}
          newSummary={newSummary}
          onSummaryChange={setNewSummary}
          newNeededRole={newNeededRole}
          onNeededRoleChange={setNewNeededRole}
        />
      )}
    </div>
  );
}
