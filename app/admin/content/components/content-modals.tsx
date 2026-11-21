"use client";

import React from "react";
import { CourseMaterialItem } from "@/src/contexts/admin-context";
import { ContentFormData } from "../types";
import { AddContentModal } from "./modals/add-content-modal";
import { EditContentModal } from "./modals/edit-content-modal";
import { DeleteContentModal } from "./modals/delete-content-modal";
import type { CourseOption } from "./modals/add-content/course-select";

export { AddContentModal, EditContentModal, DeleteContentModal };

interface ContentModalsProps {
  isAddModalOpen: boolean;
  onCloseAdd: () => void;
  editingItem: CourseMaterialItem | null;
  onCloseEdit: () => void;
  deleteCandidate: CourseMaterialItem | null;
  onCloseDelete: () => void;
  onConfirmDelete: (id: string) => Promise<boolean>;
  formData: ContentFormData;
  setFormData: React.Dispatch<React.SetStateAction<ContentFormData>>;
  formError: string;
  isUploading: boolean;
  availableCourses: CourseOption[];
  courseSuggestions: string[];
  onSubmitAdd: (file: File | null, subjectId: string) => Promise<boolean>;
  onSubmitEdit: (e: React.FormEvent) => void;
}

export function ContentModals({
  isAddModalOpen,
  onCloseAdd,
  editingItem,
  onCloseEdit,
  deleteCandidate,
  onCloseDelete,
  onConfirmDelete,
  formData,
  setFormData,
  formError,
  isUploading,
  availableCourses,
  courseSuggestions,
  onSubmitAdd,
  onSubmitEdit,
}: ContentModalsProps) {
  return (
    <>
      <AddContentModal
        isOpen={isAddModalOpen}
        onClose={onCloseAdd}
        formData={formData}
        setFormData={setFormData}
        formError={formError}
        isUploading={isUploading}
        availableCourses={availableCourses}
        onSubmit={onSubmitAdd}
      />

      <EditContentModal
        editingItem={editingItem}
        onClose={onCloseEdit}
        formData={formData}
        setFormData={setFormData}
        formError={formError}
        isSaving={isUploading}
        courseSuggestions={courseSuggestions}
        onSubmit={onSubmitEdit}
      />

      <DeleteContentModal
        deleteCandidate={deleteCandidate}
        onClose={onCloseDelete}
        onConfirmDelete={onConfirmDelete}
      />
    </>
  );
}
