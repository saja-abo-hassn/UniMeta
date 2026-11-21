"use client";
import React from "react";
import dynamic from "next/dynamic";
import { PermissionGuard } from "@/components/admin/permission-guard";
import { useAdminContent } from "./hooks/use-admin-content";
import { ContentHeader } from "./components/content-header";
import { ContentFilterBar } from "./components/content-filter-bar";
import { MaterialsTable } from "./components/materials-table";
import { PendingContributions } from "./components/pending-contributions";

export type { MainCategoryType, ContentFormData } from "./types";

const DynamicContentModals = dynamic(
  () => import("./components/content-modals").then((m) => m.ContentModals),
  { ssr: false }
);

export default function AdminContentPage() {
  return <PermissionGuard permission="manage_content"><AdminContent /></PermissionGuard>;
}

function AdminContent() {
  const {
    materials,
    pendingMaterials,
    isLoading,
    loadError,
    activeCategory,
    setActiveCategory,
    selectedSubjectFilter,
    setSelectedSubjectFilter,
    activeStatus,
    setActiveStatus,
    searchQuery,
    setSearchQuery,
    isAddModalOpen,
    setIsAddModalOpen,
    editingItem,
    setEditingItem,
    deleteCandidate,
    setDeleteCandidate,
    formData,
    setFormData,
    formError,
    isUploading,
    availableCourses,
    courseSuggestions,
    existingSubjects,
    filteredMaterials,
    categoryCounts,
    handleOpenAdd,
    handleOpenEdit,
    handleSubmitAdd,
    handleSubmitEdit,
    deleteMaterial,
    toggleMaterialStatus,
    reviewContribution,
  } = useAdminContent();

  return (
      <div className="space-y-6" dir="rtl">
        <ContentHeader onOpenAdd={handleOpenAdd} />

        <PendingContributions
          materials={pendingMaterials}
          onApprove={(id) => reviewContribution(id, "APPROVED")}
          onReject={(id) => reviewContribution(id, "REJECTED")}
        />

        <ContentFilterBar
          totalMaterialsCount={materials.length}
          filteredCount={filteredMaterials.length}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          categoryCounts={categoryCounts}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedSubjectFilter={selectedSubjectFilter}
          setSelectedSubjectFilter={setSelectedSubjectFilter}
          existingSubjects={existingSubjects}
          activeStatus={activeStatus}
          setActiveStatus={setActiveStatus}
        />

        {isLoading ? <p role="status">جارٍ تحميل محتوى المكتبة…</p>
          : loadError ? <p role="alert">{loadError}</p>
          : <MaterialsTable
          materials={filteredMaterials}
          onOpenAdd={handleOpenAdd}
          onOpenEdit={handleOpenEdit}
          onDeleteClick={setDeleteCandidate}
          onToggleStatus={toggleMaterialStatus}
        />}

        <DynamicContentModals
          isAddModalOpen={isAddModalOpen}
          onCloseAdd={() => setIsAddModalOpen(false)}
          editingItem={editingItem}
          onCloseEdit={() => setEditingItem(null)}
          deleteCandidate={deleteCandidate}
          onCloseDelete={() => setDeleteCandidate(null)}
          onConfirmDelete={deleteMaterial}
          formData={formData}
          setFormData={setFormData}
          formError={formError}
          isUploading={isUploading}
          availableCourses={availableCourses}
          courseSuggestions={courseSuggestions}
          onSubmitAdd={handleSubmitAdd}
          onSubmitEdit={handleSubmitEdit}
        />
      </div>
  );
}
