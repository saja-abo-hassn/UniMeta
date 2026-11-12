"use client";

import { useState, useMemo } from "react";
import { useAdmin, CourseMaterialItem, ContentStatus } from "@/src/contexts/admin-context";
import {
  MAIN_CATEGORIES,
  MainCategoryType,
  normalizeCategory,
  ALLOWED_EXTENSIONS,
  MAX_FILE_SIZE_MB,
  ContentFormData,
} from "../types";

export function useAdminContent() {
  const { courses, materials, addMaterial, updateMaterial, deleteMaterial, toggleMaterialStatus } = useAdmin();

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
    author: "المكتب الأكاديمي",
    status: "منشور",
    description: "",
    url: "",
  });
  const [formError, setFormError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");

  const courseSuggestions = useMemo(() => {
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
  }, [courses, materials]);

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
    setFormData({
      courseName: selectedSubjectFilter !== "all" ? selectedSubjectFilter : "",
      courseCode: "",
      title: "",
      category: activeCategory !== "all" ? activeCategory : "الملخصات",
      fileType: "PDF",
      fileSize: "2.5 MB",
      author: "المكتب الأكاديمي",
      status: "منشور",
      description: "",
      url: "",
    });
    setFormError("");
    setUploadedFileName("");
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
    setUploadedFileName("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormError("");
    const fileName = file.name.toLowerCase();
    const ext = "." + fileName.split(".").pop();

    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setFormError(`صيغة الملف غير مدعومة (${ext}). الصيغ المسموحة هي: PDF, Word, PowerPoint, صور, MP4, ZIP.`);
      return;
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      setFormError(`حجم الملف كبير جداً (${fileSizeMB.toFixed(1)} ميجابايت). الحد الأقصى المسموح به هو ${MAX_FILE_SIZE_MB} ميجابايت.`);
      return;
    }

    let detectedType: "PDF" | "DOCX" | "SLIDES" | "IMAGE" | "ZIP" | "VIDEO" | "LINK" = "PDF";
    if (ext === ".pdf") detectedType = "PDF";
    else if (ext === ".docx" || ext === ".doc") detectedType = "DOCX";
    else if (ext === ".pptx" || ext === ".ppt") detectedType = "SLIDES";
    else if (ext === ".png" || ext === ".jpg" || ext === ".jpeg") detectedType = "IMAGE";
    else if (ext === ".mp4") detectedType = "VIDEO";
    else if (ext === ".zip") detectedType = "ZIP";

    setIsUploading(true);
    setUploadedFileName(file.name);

    setTimeout(() => {
      setIsUploading(false);
      setFormData((prev) => ({
        ...prev,
        fileSize: `${fileSizeMB.toFixed(1)} MB`,
        fileType: detectedType,
        title: prev.title || file.name.replace(/\.[^/.]+$/, ""),
      }));
    }, 500);
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.courseName.trim()) {
      setFormError("يرجى كتابة اسم المادة الدراسية (مثال: تشريح الإنسان، برمجة الويب، هندسة البرمجيات...).");
      return;
    }
    if (!formData.title.trim()) {
      setFormError("يرجى إدخال عنوان المادة أو الملف التعليمي.");
      return;
    }

    let code = formData.courseCode.trim();
    if (!code) {
      const existing = courses.find((c) => c.nameAr === formData.courseName.trim());
      if (existing) {
        code = existing.code;
      } else {
        code = `CRS-${Math.floor(100 + Math.random() * 900)}`;
      }
    }

    addMaterial({
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
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

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

  return {
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
  };
}

