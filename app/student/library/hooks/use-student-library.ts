"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useNotifications } from "@/src/contexts/notifications-context";
import { useStudyPlan } from "@/src/contexts/study-plan-context";
import { useAdmin } from "@/src/contexts/admin-context";
import { useAuth } from "@/src/contexts/auth-context";
import { apiClient } from "@/src/services/api-client";
import { materialsService } from "@/src/services/materials-service";
import { reportApiError, requireData } from "@/src/services/api-result";
import { libraryFileTypes, libraryMaterial, libraryMaxFileMb, libraryService, type LibraryContribution, type ResourceType } from "@/src/services/library-service";
import { isCourseInMajor } from "@/src/data/course-majors-mapping";
import { initialCourses } from "../data/initial-courses-data";
import { LibraryCategory, LibraryFile, LibraryCourse } from "../types";
import type { CourseMaterialItem } from "@/src/types/admin";

const contributionTypes: Record<LibraryCategory, ResourceType> = {
  books: "APPROVED_REFERENCE",
  summaries: "SUMMARY",
  exams: "EXAM_MODEL",
  other: "LECTURE",
};

export function useStudentLibrary() {
  const { notify } = useNotifications();
  const { selectedPlan, hasPlanSelected, isLoaded: isPlanLoaded } = useStudyPlan();
  const { materials: adminMaterials, addMaterial } = useAdmin();
  const { user } = useAuth();
  const mock = apiClient.isUsingMock();
  const [liveCatalog, setLiveCatalog] = useState<Awaited<ReturnType<typeof materialsService.getLibraryCatalog>>["data"]>(null);
  const [contributions, setContributions] = useState<{ userId: string; rows: LibraryContribution[] } | null>(null);
  const [isLoading, setIsLoading] = useState(!apiClient.isUsingMock());
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (apiClient.isUsingMock()) return;
    let active = true;
    // Enter the loading state when the authenticated student changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    setLoadError(null);
    void materialsService.getLibraryCatalog().then((response) => {
      const catalog = requireData(response);
      if (active) setLiveCatalog(catalog);
    }).catch((error: unknown) => {
      if (active) setLoadError(error instanceof Error ? error.message : "تعذر تحميل مواد المكتبة.");
      reportApiError(error);
    }).finally(() => {
      if (active) setIsLoading(false);
    });
    return () => { active = false; };
  }, [user?.id]);

  useEffect(() => {
    if (mock || !user?.id) return;
    const userId = user.id;
    let active = true;
    void libraryService.contributions(false).then((rows) => {
      if (active) setContributions({ userId, rows });
    }).catch((error: unknown) => {
      if (active) reportApiError(error);
    });
    return () => { active = false; };
  }, [mock, user?.id]);

  const materials: CourseMaterialItem[] = useMemo(() => mock
    ? adminMaterials
    : (liveCatalog?.materials ?? []).map((item) => ({
        ...item,
        courseId: "",
        fileType: item.fileType.toLowerCase().includes("word") ? "DOCX" as const
          : item.fileType.toLowerCase().includes("presentation") ? "SLIDES" as const
          : item.fileType.toLowerCase().includes("image") ? "IMAGE" as const
          : item.fileType.toLowerCase().includes("zip") ? "ZIP" as const
          : item.fileType.toLowerCase().includes("video") ? "VIDEO" as const : "PDF" as const,
        downloads: item.downloads ?? 0,
        author: item.author ?? "غير متاح",
        fileName: undefined,
        status: "منشور" as const,
        description: item.description,
        url: `/api/backend/library/resources/${item.id}/download`,
      })), [mock, adminMaterials, liveCatalog]);

  const courses = useMemo<LibraryCourse[]>(() => {
    const courseMap = new Map<string, LibraryCourse>();

    if (apiClient.isUsingMock() && hasPlanSelected) {
      initialCourses.forEach((c) => {
        const inPlan = selectedPlan.courses.some((pc) => pc.code.toLowerCase() === c.code.toLowerCase());
        const inMajor = isCourseInMajor(c.code, selectedPlan.major);
        if (inPlan || inMajor) {
          courseMap.set(c.code.toUpperCase(), { ...c, files: [...c.files] });
        }
      });
    }

    liveCatalog?.subjects.forEach((subject) => {
      const code = subject.subject_code.toUpperCase();
      courseMap.set(code, {
        code: subject.subject_code,
        nameAr: subject.subject_name,
        nameEn: subject.subject_code,
        majorName: subject.major.name,
        instructor: "غير متاح",
        level: "جميع المستويات",
        semester: "—",
        files: [],
      });
    });

    if (mock && hasPlanSelected) selectedPlan.courses.forEach((pc) => {
      const code = pc.code.toUpperCase();
      if (!courseMap.has(code)) {
        courseMap.set(code, {
          code: pc.code,
          nameAr: pc.name,
          nameEn: pc.name,
          instructor: "",
          level:
            pc.semester <= 2
              ? "السنة الأولى"
              : pc.semester <= 4
              ? "السنة الثانية"
              : pc.semester <= 6
              ? "السنة الثالثة"
              : "السنة الرابعة",
          semester: pc.semester % 2 === 1 ? "الفصل الأول" : "الفصل الثاني",
          files: [],
        });
      }
    });

    const publishedMaterials = materials.filter((m) => m.status === "منشور");
    publishedMaterials.forEach((m) => {
      const code = m.courseCode.toUpperCase();
      let courseEntry = courseMap.get(code);

      if (!courseEntry) {
        courseEntry = {
          code: m.courseCode,
          nameAr: m.courseName || m.courseCode,
          nameEn: m.courseCode,
          instructor: "هيئة تدريس القسم",
          level: "السنة التخصصية",
          semester: "الفصل الحالي",
          files: [],
        };
        courseMap.set(code, courseEntry);
      }

      if (courseEntry) {
        let category: LibraryCategory = "other";
        if (["summaries", "الملخصات", "الملاحظات الدراسية"].includes(m.category)) category = "summaries";
        else if (m.category === "exams" || m.category === "النماذج السابقة") category = "exams";
        else if (["resources", "books", "الكتب", "المراجع"].includes(m.category)) category = "books";
        else if (m.category === "lectures" || m.category === "الفيديوهات" || m.category === "other") category = "other";

        const existingFile = courseEntry.files.find((f) => f.id === m.id);
        if (!existingFile) {
          courseEntry.files.push({
            id: m.id,
            title: m.title,
            category,
            author: m.author,
            fileType: m.fileType.toLowerCase().includes("pdf")
              ? "PDF"
              : m.fileType === "DOCX" || m.fileType.toLowerCase().includes("wordprocessingml") || m.fileType.toLowerCase().includes("msword")
              ? "DOCX"
              : m.fileType.toLowerCase().includes("presentationml") || m.fileType.toLowerCase().includes("powerpoint")
              ? "SLIDES"
              : m.fileType === "SLIDES" || m.fileType === "ZIP" || m.fileType === "VIDEO"
              ? m.fileType
              : "PDF",
            fileSize: m.fileSize,
            downloads: m.downloads,
            date: m.date,
            description: m.description,
          });
        }
      }
    });

    return Array.from(courseMap.values());
  }, [mock, selectedPlan, hasPlanSelected, materials, liveCatalog]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [activeCourse, setActiveCourse] = useState<LibraryCourse | null>(null);
  const [activeCategory, setActiveCategory] = useState<LibraryCategory>("books");
  const [selectedFileType, setSelectedFileType] = useState<string>("all");
  const [previewFile, setPreviewFile] = useState<LibraryFile | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [uploadTitle, setUploadTitle] = useState("");
  const [selectedUploadCode, setUploadCourseCode] = useState(mock ? "ENCS3310" : "");
  const uploadCourseCode = courses.some((course) => course.code === selectedUploadCode)
    ? selectedUploadCode : courses[0]?.code ?? "";
  const [uploadCategory, setUploadCategory] = useState<LibraryCategory>("summaries");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadFileSize, setUploadFileSize] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitting = useRef(false);

  const currentStudentName = user?.name || "";

  const myContributions = useMemo(() => {
    if (!mock) {
      if (!contributions || contributions.userId !== user?.id) return [];
      const subjects = new Map(liveCatalog?.subjects.map((subject) => [subject.id, subject]));
      return contributions.rows.map((item) => ({
        ...libraryMaterial(item, subjects),
        description: item.review_reason ?? item.description ?? undefined,
      }));
    }
    return materials.filter(
      (m) =>
        m.studentName === currentStudentName ||
        m.author === currentStudentName ||
        m.description?.includes(currentStudentName) ||
        m.status === "قيد المراجعة" ||
        m.status === "مرفوض"
    );
  }, [mock, contributions, liveCatalog, user?.id, materials, currentStudentName]);

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.code.toLowerCase().includes(q) ||
        c.nameAr.toLowerCase().includes(q) ||
        c.nameEn.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q);

      const matchesLevel = selectedLevel === "all" || c.level === selectedLevel;
      return matchesSearch && matchesLevel;
    });
  }, [courses, searchQuery, selectedLevel]);

  const handleOpenCourse = (course: LibraryCourse) => {
    setActiveCourse(course);
    setActiveCategory("books");
    setSelectedFileType("all");
  };

  const handleDownload = (file: LibraryFile) => {
    if (!apiClient.isUsingMock()) {
      window.open(`/api/backend/library/resources/${encodeURIComponent(file.id)}/download`, "_blank", "noopener,noreferrer");
      return;
    }
    notify({
      type: "library",
      title: "بدأ تحميل الملف",
      message: `جاري تحميل: "${file.title}" (${file.fileSize})`,
      playSound: false,
      browserNotify: false,
    });
    alert(`بدء تحميل: ${file.title}\nالحجم: ${file.fileSize}`);
  };

  const handleFileSelect = (file: File) => {
    if (submitting.current) return;
    if (!mock && (!libraryFileTypes.includes("." + file.name.split(".").pop()?.toLowerCase()) || file.size > libraryMaxFileMb * 1024 * 1024)) {
      reportApiError(new Error("اختر ملف PDF أو DOCX أو PPTX بحجم لا يتجاوز " + libraryMaxFileMb + " ميجابايت."));
      return;
    }
    setUploadFile(file);
    setUploadFileName(file.name);
    setUploadFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
    if (!uploadTitle.trim()) {
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleClearFile = () => {
    setUploadFile(null);
    setUploadFileName("");
    setUploadFileSize("");
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim() || submitting.current) return;

    if (!mock) {
      const subject = liveCatalog?.subjects.find((item) => item.subject_code === uploadCourseCode);
      if (!subject || !uploadFile || !user?.id) {
        reportApiError(new Error("اختر مادة من المكتبة وأرفق ملفاً قبل الإرسال."));
        return;
      }
      const userId = user.id;
      submitting.current = true;
      setIsSubmitting(true);
      try {
        const saved = await libraryService.contribute({
          subject_id: subject.id,
          title: uploadTitle.trim(),
          resource_type: contributionTypes[uploadCategory],
        }, uploadFile);
        setContributions((previous) => ({
          userId,
          rows: [saved, ...(previous?.userId === userId ? previous.rows.filter((row) => row.id !== saved.id) : [])],
        }));
      } catch (error) {
        reportApiError(error);
        return;
      } finally {
        submitting.current = false;
        setIsSubmitting(false);
      }
    } else {
    const matchedCourse = courses.find((c) => c.code.toUpperCase() === uploadCourseCode.toUpperCase());

    const catMap: Record<LibraryCategory, string> = {
      books: "الكتب",
      summaries: "الملخصات",
      exams: "النماذج السابقة",
      other: "الفيديوهات",
    };

    const ext = uploadFileName ? uploadFileName.split(".").pop()?.toUpperCase() : "PDF";
    const fileType = ext === "PDF" || ext === "ZIP" || ext === "VIDEO" || ext === "SLIDES" ? ext : "PDF";

    addMaterial({
      courseName: matchedCourse?.nameAr || uploadCourseCode,
      courseCode: uploadCourseCode,
      title: uploadTitle.trim(),
      category: catMap[uploadCategory] || "الملخصات",
      fileType,
      fileSize: uploadFileSize || "3.5 MB",
      author: currentStudentName,
      studentName: currentStudentName,
      fileName: uploadFileName || `${uploadTitle.trim()}.${fileType.toLowerCase()}`,
      status: "قيد المراجعة",
      description: `مساهمة طلابية مقدمة للمراجعة الأكاديمية بواسطة ${currentStudentName}`,
    });
    }

    notify({
      type: "library",
      title: "تم إرسال مساهمتك للمراجعة! 📚",
      message: `تم رفع "${uploadTitle}" لقسم المراجعة الأكاديمية لاعتماده لجميع الطلاب.`,
      playSound: true,
      browserNotify: true,
    });

    setIsUploadModalOpen(false);
    setUploadTitle("");
    handleClearFile();
  };

  const currentCategoryFiles = activeCourse
    ? activeCourse.files.filter((f) => {
        const matchesCategory = f.category === activeCategory;
        const matchesType = selectedFileType === "all" || f.fileType === selectedFileType;
        return matchesCategory && matchesType;
      })
    : [];

  const getCategoryCount = (course: LibraryCourse, cat: LibraryCategory) => {
    return course.files.filter((f) => f.category === cat).length;
  };

  return {
    courses,
    selectedPlan,
    hasPlanSelected,
    isPlanLoaded,
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
    uploadFile,
    uploadFileName,
    uploadFileSize,
    isSubmitting,
    handleFileSelect,
    handleClearFile,
    handleUploadSubmit,
    myContributions,
  };
}
