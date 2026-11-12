"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useStudentLibrary } from "./hooks/use-student-library";
import { NoPlanView } from "./components/no-plan-view";
import { LibraryHeader } from "./components/library-header";
import { ActivePlanBanner } from "./components/active-plan-banner";
import { CoursesGrid } from "./components/courses-grid";
import { CourseDetailsView } from "./components/course-details-view";
import { MyContributionsSection } from "./components/my-contributions-section";

export type { LibraryCategory, LibraryFile, LibraryCourse } from "./types";

const DynamicLibraryModals = dynamic(
  () => import("./components/library-modals").then((m) => m.LibraryModals),
  { ssr: false }
);

export default function StudentLibraryPage() {
  const {
    courses,
    selectedPlan,
    hasPlanSelected,
    searchQuery,
    setSearchQuery,
    selectedLevel,
    setSelectedLevel,
    filteredCourses,
    activeCourse,
    setActiveCourse,
    activeCategory,
    setActiveCategory,
    selectedFileType,
    setSelectedFileType,
    currentCategoryFiles,
    getCategoryCount,
    handleOpenCourse,
    handleDownload,
    previewFile,
    setPreviewFile,
    isUploadModalOpen,
    setIsUploadModalOpen,
    uploadTitle,
    setUploadTitle,
    uploadCourseCode,
    setUploadCourseCode,
    uploadCategory,
    setUploadCategory,
    uploadFileName,
    uploadFileSize,
    handleFileSelect,
    handleClearFile,
    handleUploadSubmit,
    myContributions,
  } = useStudentLibrary();

  if (!hasPlanSelected) {
    return <NoPlanView />;
  }

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      <LibraryHeader onOpenUpload={() => setIsUploadModalOpen(true)} />

      <ActivePlanBanner
        selectedPlan={selectedPlan}
        totalCoursesCount={courses.length}
      />

      <MyContributionsSection contributions={myContributions} />

      {!activeCourse ? (
        <CoursesGrid
          courses={courses}
          filteredCourses={filteredCourses}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedLevel={selectedLevel}
          setSelectedLevel={setSelectedLevel}
          onOpenCourse={handleOpenCourse}
          getCategoryCount={getCategoryCount}
        />
      ) : (
        <CourseDetailsView
          activeCourse={activeCourse}
          onBack={() => setActiveCourse(null)}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          selectedFileType={selectedFileType}
          setSelectedFileType={setSelectedFileType}
          currentCategoryFiles={currentCategoryFiles}
          getCategoryCount={getCategoryCount}
          onOpenUploadForCourse={(code, cat) => {
            setUploadCourseCode(code);
            setUploadCategory(cat);
            setIsUploadModalOpen(true);
          }}
          onPreview={setPreviewFile}
          onDownload={handleDownload}
        />
      )}

      <DynamicLibraryModals
        courses={courses}
        previewFile={previewFile}
        onClosePreview={() => setPreviewFile(null)}
        onDownload={handleDownload}
        isUploadModalOpen={isUploadModalOpen}
        onCloseUpload={() => {
          setIsUploadModalOpen(false);
          handleClearFile();
        }}
        uploadTitle={uploadTitle}
        setUploadTitle={setUploadTitle}
        uploadCourseCode={uploadCourseCode}
        setUploadCourseCode={setUploadCourseCode}
        uploadCategory={uploadCategory}
        setUploadCategory={setUploadCategory}
        uploadFileName={uploadFileName}
        uploadFileSize={uploadFileSize}
        onFileSelect={handleFileSelect}
        onClearFile={handleClearFile}
        onUploadSubmit={handleUploadSubmit}
      />
    </div>
  );
}
