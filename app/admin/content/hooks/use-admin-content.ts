"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useAdmin, CourseMaterialItem, ContentStatus } from "@/src/contexts/admin-context";
import { apiClient } from "@/src/services/api-client";
import { reportApiError } from "@/src/services/api-result";
import { libraryMaterial, libraryService, type LibraryContribution, type LibraryResource, type LibrarySubject, type ResourceType } from "@/src/services/library-service";
import {
  MainCategoryType,
  normalizeCategory,
  ContentFormData,
} from "../types";

const resourceTypes: Record<MainCategoryType, ResourceType> = {
  "الكتب": "APPROVED_REFERENCE",
  "الملخصات": "SUMMARY",
  "النماذج السابقة": "EXAM_MODEL",
  "الفيديوهات": "LECTURE",
};

function makeManualCourseCode(courseName: string): string {
  const normalized = courseName.trim().replace(/\s+/g, " ").toLocaleLowerCase();
  let hash = 2166136261;
  for (let index = 0; index < normalized.length; index += 1) {
    hash = Math.imul(hash ^ normalized.charCodeAt(index), 16777619);
  }
  return `MAN-${(hash >>> 0).toString(36).toUpperCase()}`;
}

export function useAdminContent(includeContributions = true) {
  const { courses, materials: mockMaterials, addMaterial, updateMaterial, deleteMaterial: deleteMock, toggleMaterialStatus: toggleMock } = useAdmin();
  const mock = apiClient.isUsingMock();
  const [subjects, setSubjects] = useState<LibrarySubject[]>([]);
  const [resources, setResources] = useState<LibraryResource[]>([]);
  const [contributions, setContributions] = useState<LibraryContribution[]>([]);
  const [isLoading, setIsLoading] = useState(!mock);
  const [loadError, setLoadError] = useState("");
  const operation = useRef(false);
  const subjectsById = useMemo(() => new Map(subjects.map((subject) => [subject.id, subject])), [subjects]);
  const materials = useMemo(() => mock ? mockMaterials
    : resources.map((resource) => libraryMaterial(resource, subjectsById)), [mock, mockMaterials, resources, subjectsById]);
  const pendingMaterials = mock ? materials.filter((item) => item.status === "قيد المراجعة")
    : contributions.filter((item) => item.status === "PENDING").map((item) => ({
      ...libraryMaterial(item, subjectsById),
      url: "/api/backend/admin/library/contributions/" + item.id + "/download",
    }));

  useEffect(() => {
    if (mock) return;
    let active = true;
    void Promise.all([libraryService.adminSubjects(), libraryService.adminResources()])
      .then(([catalog, rows]) => {
        if (!active) return;
        setSubjects(catalog);
        setResources(rows);
      }).catch((error: Error) => {
        if (active) setLoadError(error.message);
      }).finally(() => {
        if (active) setIsLoading(false);
      });
    if (includeContributions) void libraryService.contributions(true).then((rows) => {
      if (active) setContributions(rows);
    }).catch((error: unknown) => {
      if (active) reportApiError(error);
    });
    return () => { active = false; };
  }, [mock, includeContributions]);

  const [activeCategory, setActiveCategory] = useState<"all" | MainCategoryType>("all");
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>("all");
  const [activeStatus, setActiveStatus] = useState<"all" | ContentStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CourseMaterialItem | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<CourseMaterialItem | null>(null);

  const [formData, setFormData] = useState<ContentFormData>({
    courseName: "",
    courseCode: "",
    title: "",
    category: "الملخصات",
    fileType: "PDF",
    fileSize: "2.5 MB",
    author: mock ? "المكتب الأكاديمي" : "",
    status: "منشور",
    description: "",
    url: "",
  });
  const [formError, setFormError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const courseSuggestions = useMemo(() => {
    if (!mock) return [...new Set(subjects.map((subject) => subject.subject_name))];
    const set = new Set<string>();
    courses.forEach((c) => {
      if (c.nameAr) set.add(c.nameAr);
    });
    materials.forEach((m) => {
      if (m.courseName) set.add(m.courseName);
    });
    set.add("تشريح الإنسان");
    set.add("أساسيات الذكاء الاصطناعي");
    set.add("برمجة الويب المتقدمة");
    set.add("الفيزياء العامة 1");
    set.add("الكيمياء العامة");
    return Array.from(set);
  }, [mock, subjects, courses, materials]);

  const availableCourses = useMemo(() => {
    if (!mock) return subjects.map((subject) => ({
      id: String(subject.id), code: subject.subject_code, name: subject.subject_name,
    }));
    const options = courses.map((course) => ({ id: course.id || course.code, code: course.code, name: course.nameAr }));
    courseSuggestions.forEach((name, index) => {
      if (!options.some((option) => option.name === name)) {
        options.push({ id: "suggestion-" + index, code: "CRS-" + (100 + index), name });
      }
    });
    return options;
  }, [mock, subjects, courses, courseSuggestions]);

  const existingSubjects = useMemo(() => {
    const map = new Map<string, number>();
    materials.forEach((m) => {
      const name = m.courseName || "غير محدد";
      map.set(name, (map.get(name) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    return materials.filter((item) => {
      const normalizedCat = normalizeCategory(item.category);
      if (activeCategory !== "all" && normalizedCat !== activeCategory) return false;
      if (selectedSubjectFilter !== "all" && item.courseName !== selectedSubjectFilter) return false;
      if (activeStatus !== "all" && item.status !== activeStatus) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchesTitle = (item.title || "").toLowerCase().includes(q);
        const matchesCourse =
          (item.courseCode || "").toLowerCase().includes(q) ||
          (item.courseName || "").toLowerCase().includes(q);
        const matchesAuthor = (item.author || "").toLowerCase().includes(q);
        const matchesDesc = (item.description || "").toLowerCase().includes(q);
        return matchesTitle || matchesCourse || matchesAuthor || matchesDesc;
      }
      return true;
    });
  }, [materials, activeCategory, selectedSubjectFilter, activeStatus, searchQuery]);

  const categoryCounts = useMemo(() => {
    const counts: Record<MainCategoryType, number> = {
      "الكتب": 0,
      "الملخصات": 0,
      "النماذج السابقة": 0,
      "الفيديوهات": 0,
    };
    materials.forEach((m) => {
      if (selectedSubjectFilter !== "all" && m.courseName !== selectedSubjectFilter) return;
      if (activeStatus !== "all" && m.status !== activeStatus) return;
      const cat = normalizeCategory(m.category);
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [materials, selectedSubjectFilter, activeStatus]);

  const handleOpenAdd = () => {
    if (!mock && isLoading) return;
    setFormData({
      courseName: selectedSubjectFilter !== "all" ? selectedSubjectFilter : "",
      courseCode: "",
      title: "",
      category: activeCategory !== "all" ? activeCategory : "الملخصات",
      fileType: "PDF",
      fileSize: "2.5 MB",
      author: mock ? "المكتب الأكاديمي" : "",
      status: "منشور",
      description: "",
      url: "",
    });
    setFormError("");
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item: CourseMaterialItem) => {
    setEditingItem(item);
    setFormData({
      courseName: item.courseName || "",
      courseCode: item.courseCode || "",
      title: item.title || "",
      category: normalizeCategory(item.category),
      fileType: item.fileType || "PDF",
      fileSize: item.fileSize || "2.5 MB",
      author: item.author || "المكتب الأكاديمي",
      status: item.status || "منشور",
      description: item.description || "",
      url: item.url || "",
    });
    setFormError("");
  };

  const saveResource = async (file?: File, item?: CourseMaterialItem, selectedId?: string) => {
    if (operation.current) return false;
    const matches = subjects.filter((subject) => selectedId
      ? String(subject.id) === selectedId
      : subject.subject_name === formData.courseName.trim() && subject.subject_code.toUpperCase() === formData.courseCode.trim().toUpperCase());
    if (matches.length !== 1) {
      setFormError("اختر مادة موجودة في المكتبة وتأكد من مطابقة اسمها ورمزها.");
      return false;
    }
    if (formData.status !== "منشور" && formData.status !== "مسودة") {
      setFormError("اختر منشور أو مسودة. المراجعة تخص مساهمات الطلاب.");
      return false;
    }
    if (!item && (!file || formData.url.trim() || formData.author.trim())) {
      setFormError("ارفع ملفاً واترك حقلي الرابط والمُعد فارغين. يمكنك كتابة معلومات المُعد في الوصف.");
      return false;
    }

    const original = item && resources.find((resource) => String(resource.id) === item.id);
    const fields = {
      subject_id: matches[0].id,
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      resource_type: original && item && normalizeCategory(item.category) === formData.category
        ? original.resource_type : resourceTypes[formData.category],
      visibility_status: formData.status === "منشور" ? "VISIBLE" as const : "HIDDEN" as const,
    };
    operation.current = true;
    setIsUploading(true);
    setFormError("");
    try {
      if (item) {
        const saved = await libraryService.updateResource(item.id, fields);
        setResources((rows) => rows.map((row) => row.id === saved.id ? { ...row, ...saved } : row));
        setEditingItem(null);
      } else if (file) {
        const saved = await libraryService.createResource(fields, file);
        setResources((rows) => [...rows, { ...saved, download_requests: 0 }]);
        setIsAddModalOpen(false);
      }
      return true;
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "تعذر حفظ المحتوى.");
      return false;
    } finally {
      operation.current = false;
      setIsUploading(false);
    }
  };

  const handleSubmitAdd = async (file: File | null, selectedId: string) => {
    if (!mock) return saveResource(file ?? undefined, undefined, selectedId);
    if (!formData.courseName.trim()) {
      setFormError("يرجى كتابة اسم المادة الدراسية (مثال: تشريح الإنسان، برمجة الويب، هندسة البرمجيات...).");
      return false;
    }
    if (!formData.title.trim()) {
      setFormError("يرجى إدخال عنوان المادة أو الملف التعليمي.");
      return false;
    }

    const normalizedCourseName = formData.courseName.trim().replace(/\s+/g, " ").toLocaleLowerCase();
    const existingMaterial = materials.find(
      (material) => material.courseName.trim().replace(/\s+/g, " ").toLocaleLowerCase() === normalizedCourseName
    );
    const existingCourse = courses.find(
      (course) => course.nameAr.trim().replace(/\s+/g, " ").toLocaleLowerCase() === normalizedCourseName
    );
    const code = formData.courseCode.trim() || existingMaterial?.courseCode || existingCourse?.code || makeManualCourseCode(formData.courseName);
    const courseId = existingMaterial?.courseId || existingCourse?.id || `course-${code.toLowerCase()}`;

    addMaterial({
      courseId,
      courseName: formData.courseName.trim(),
      courseCode: code,
      title: formData.title.trim(),
      category: formData.category,
      fileType: formData.fileType,
      fileSize: formData.fileSize,
      author: formData.author.trim() || "إدارة المحتوى",
      status: formData.status,
      description: formData.description.trim(),
      url: formData.url.trim() || undefined,
    });

    setIsAddModalOpen(false);
    return true;
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    if (!mock) {
      void saveResource(undefined, editingItem);
      return;
    }

    if (!formData.courseName.trim()) {
      setFormError("يرجى كتابة اسم المادة الدراسية.");
      return;
    }
    if (!formData.title.trim()) {
      setFormError("يرجى إدخال عنوان المادة التعليمية.");
      return;
    }

    updateMaterial(editingItem.id, {
      courseName: formData.courseName.trim(),
      courseCode: formData.courseCode.trim() || editingItem.courseCode,
      title: formData.title.trim(),
      category: formData.category,
      fileType: formData.fileType,
      fileSize: formData.fileSize,
      author: formData.author.trim(),
      status: formData.status,
      description: formData.description.trim(),
      url: formData.url.trim() || undefined,
    });

    setEditingItem(null);
  };

  const deleteMaterial = async (id: string) => {
    if (mock) {
      deleteMock(id);
      return true;
    }
    if (operation.current) return false;
    operation.current = true;
    try {
      await libraryService.deleteResource(id);
      setResources((rows) => rows.filter((row) => String(row.id) !== id));
      return true;
    } catch (error) {
      reportApiError(error);
      return false;
    } finally {
      operation.current = false;
    }
  };

  const toggleMaterialStatus = async (id: string, status: ContentStatus) => {
    if (mock) return toggleMock(id, status);
    if (operation.current) return;
    operation.current = true;
    try {
      const saved = await libraryService.updateResource(id, { visibility_status: status === "منشور" ? "VISIBLE" : "HIDDEN" });
      setResources((rows) => rows.map((row) => row.id === saved.id ? { ...row, ...saved } : row));
    } catch (error) {
      reportApiError(error);
    } finally {
      operation.current = false;
    }
  };

  const reviewContribution = async (id: string, decision: "APPROVED" | "REJECTED") => {
    if (mock) return toggleMock(id, decision === "APPROVED" ? "منشور" : "مرفوض");
    if (operation.current || isLoading) return;
    const reason = window.prompt("سبب قرار المراجعة")?.trim();
    if (!reason) return;
    operation.current = true;
    try {
      await libraryService.review(id, decision, reason);
      setContributions((rows) => rows.filter((row) => String(row.id) !== id));
      if (decision === "APPROVED") setResources(await libraryService.adminResources());
    } catch (error) {
      reportApiError(error);
    } finally {
      operation.current = false;
    }
  };

  return {
    materials,
    resources,
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
  };
}

