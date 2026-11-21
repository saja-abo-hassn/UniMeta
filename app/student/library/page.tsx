"use client";

import React from "react";
import { apiClient } from "@/src/services/api-client";
import dynamic from "next/dynamic";
import { useStudentLibrary } from "./hooks/use-student-library";
import { LibraryHeader } from "./components/library-header";
import { ActivePlanBanner } from "./components/active-plan-banner";
import { CoursesGrid } from "./components/courses-grid";
import { CourseDetailsView } from "./components/course-details-view";
import { MyContributionsSection } from "./components/my-contributions-section";
import { CardSkeleton } from "@/components/shared/skeleton";

export type { LibraryCategory, LibraryFile, LibraryCourse } from "./types";

const DynamicLibraryModals = dynamic(
  () => import("./components/library-modals").then((m) => m.LibraryModals),
  { ssr: false }
);

export default function StudentLibraryPage() { return <MockStudentLibraryPage/>; }
function MockStudentLibraryPage() {
  const {
    courses,
    selectedPlan,
    hasPlanSelected,
    isLoading,
    loadError,
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

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in" dir="rtl" aria-busy="true">
        <LibraryHeader onOpenUpload={() => setIsUploadModalOpen(true)} />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }, (_, index) => <CardSkeleton key={index} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      <LibraryHeader onOpenUpload={() => setIsUploadModalOpen(true)} />

      {hasPlanSelected && (
        <ActivePlanBanner
          selectedPlan={selectedPlan}
          totalCoursesCount={courses.length}
        />
      )}

      {isLoading && (
        <div role="status" aria-label="جارٍ تحميل مواد المكتبة" aria-busy="true" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 3 }, (_, index) => <CardSkeleton key={index} />)}
        </div>
      )}

      {loadError && !isLoading && (
        <p role="alert" className="p-4 rounded-2xl bg-white border border-red-200 text-sm text-red-700">
          {loadError}
        </p>
      )}

      {!isLoading && courses.length === 0 && (
        <p role="status" className="p-4 rounded-2xl bg-white border border-brand-border-soft text-sm text-brand-muted">
          لا توجد مواد منشورة لخطة دراستك حالياً.
        </p>
      )}

      {(!isLoading || apiClient.isUsingMock()) && <MyContributionsSection contributions={myContributions} />}

      {(!isLoading || apiClient.isUsingMock()) && (!activeCourse ? (
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
      ))}

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
