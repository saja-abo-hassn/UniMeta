"use client";
import { apiClient } from "@/src/services/api-client";

import { useState, useCallback } from "react";
import {
  AdminCourse,
  CourseMaterialItem,
  ContentStatus,
  AdminExamItem,
} from "@/src/types/admin";
import {
  initialCoursesList,
  initialMaterialsList,
  initialExamsList,
} from "@/src/data/mock-admin-data";

export function useAdminContentManagement() {
  const [courses] = useState<AdminCourse[]>(apiClient.isUsingMock() ? initialCoursesList : []);

  const [materials, setMaterials] = useState<CourseMaterialItem[]>(() => {
    if (apiClient.isUsingMock() && typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("unimeta_admin_materials_v1");
        if (stored) return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return apiClient.isUsingMock() ? initialMaterialsList : [];
  });

  const [exams, setExams] = useState<AdminExamItem[]>(() => {
    if (apiClient.isUsingMock() && typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("unimeta_admin_exams_v1");
        if (stored) return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return apiClient.isUsingMock() ? initialExamsList : [];
  });

  const addMaterial = useCallback(
    (
      item: Omit<CourseMaterialItem, "id" | "date" | "downloads" | "courseId" | "courseCode"> & {
        courseId?: string;
        courseCode?: string;
      }
    ) => {
      const courseId = item.courseId || `crs-${Date.now()}`;
      const courseCode = item.courseCode || `CRS-${Math.floor(100 + Math.random() * 900)}`;
      const newItem: CourseMaterialItem = {
        ...item,
        courseId,
        courseCode,
        id: `mat-${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        downloads: 0,
      };
      setMaterials((prev) => [newItem, ...prev]);
    },
    []
  );

  const updateMaterial = useCallback((id: string, updates: Partial<CourseMaterialItem>) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  }, []);

  const deleteMaterial = useCallback((id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const toggleMaterialStatus = useCallback((id: string, status: ContentStatus) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
  }, []);

  const addExam = useCallback((exam: Omit<AdminExamItem, "id">) => {
    const newExam: AdminExamItem = {
      ...exam,
      id: `ex-${Date.now()}`,
    };
    setExams((prev) => [newExam, ...prev]);
  }, []);

  const updateExam = useCallback((id: string, updates: Partial<AdminExamItem>) => {
    setExams((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, ...updates } : ex))
    );
  }, []);

  const deleteExam = useCallback((id: string) => {
    setExams((prev) => prev.filter((ex) => ex.id !== id));
  }, []);

  return {
    courses,
    materials,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    toggleMaterialStatus,
    exams,
    addExam,
    updateExam,
    deleteExam,
  };
}

