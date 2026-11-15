"use client";
import { apiClient } from "@/src/services/api-client";
import { LiveLibrary } from "@/components/integration/live-library";

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

export default function AdminContentPage() { return apiClient.isUsingMock() ? <MockAdminContentPage/> : <LiveLibrary admin/>; }
function MockAdminContentPage() {
  const {
    materials,
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
    uploadedFileName,
    courseSuggestions,
    existingSubjects,
    filteredMaterials,
    categoryCounts,
    handleOpenAdd,
    handleOpenEdit,
    handleFileChange,
    handleSubmitAdd,
    handleSubmitEdit,
    deleteMaterial,
    toggleMaterialStatus,
  } = useAdminContent();

  const pendingMaterials = materials.filter((m) => m.status === "قيد المراجعة");

  return (
    <PermissionGuard permission="manage_content">
      <div className="space-y-6" dir="rtl">
        <ContentHeader onOpenAdd={handleOpenAdd} />

        <PendingContributions
          materials={pendingMaterials}
          onApprove={(id) => toggleMaterialStatus(id, "منشور")}
          onReject={(id) => toggleMaterialStatus(id, "مرفوض")}
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

        <MaterialsTable
          materials={filteredMaterials}
          onOpenAdd={handleOpenAdd}
          onOpenEdit={handleOpenEdit}
          onDeleteClick={setDeleteCandidate}
          onToggleStatus={toggleMaterialStatus}
        />

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
          uploadedFileName={uploadedFileName}
          courseSuggestions={courseSuggestions}
          onFileChange={handleFileChange}
          onSubmitAdd={handleSubmitAdd}
          onSubmitEdit={handleSubmitEdit}
        />
      </div>
    </PermissionGuard>
  );
}
