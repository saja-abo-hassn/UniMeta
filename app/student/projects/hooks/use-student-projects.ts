"use client";

import { useState, useEffect } from "react";
import { initialGraduationProjects, GraduationProject } from "@/src/data/graduation-projects-data";
import { useNotifications } from "@/src/contexts/notifications-context";
import { useStudentUser } from "@/src/hooks/use-student-user";
import { ScopeFilterType, AppliedProjectInfo } from "../types";

import { apiClient } from "@/src/services/api-client";
import { projectsService } from "@/src/services/projects-service";
import { reportApiError } from "@/src/services/api-result";

export function useStudentProjects() {
  const { notify } = useNotifications();
  const { fullName } = useStudentUser();
  const studentName = fullName || "طالب UniMeta";
  const studentInitials = fullName
    ? fullName.split(/\s+/).slice(0, 2).map((w) => w[0]).join("")
    : "ط";

  const [projects, setProjects] = useState<GraduationProject[]>(apiClient.isUsingMock() ? initialGraduationProjects : []);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [majorFilter, setMajorFilter] = useState<string>("all");
  const [scopeFilter, setScopeFilter] = useState<ScopeFilterType>("all");

  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [applyingProject, setApplyingProject] = useState<GraduationProject | null>(null);
  const [applicantRole, setApplicantRole] = useState("");
  const [applicantMessage, setApplicantMessage] = useState("");
  const [applicantStage, setApplicantStage] = useState<"مشروع 1" | "مشروع 2" | "مشروع 1 و 2" | "">("");
  const [stageError, setStageError] = useState("");
  const [appliedProjects, setAppliedProjects] = useState<Record<string, AppliedProjectInfo>>({});

  const [newTitle, setNewTitle] = useState("");
  const [newMajor, setNewMajor] = useState(apiClient.isUsingMock() ? "هندسة البرمجيات" : "");
  const [newSupervisor, setNewSupervisor] = useState(apiClient.isUsingMock() ? "د. سارة الخطيب" : "");
  const [newSummary, setNewSummary] = useState("");
  const [newNeededRole, setNewNeededRole] = useState("");

  useEffect(() => {
    if (apiClient.isUsingMock()) return;
    let active = true;
    Promise.all([projectsService.list(), projectsService.mine()]).then(([items, applications]) => {
      if (!active) return;
      setProjects(items);
      setAppliedProjects(Object.fromEntries(applications.filter(a => a.status !== "WITHDRAWN" && a.status !== "REJECTED").map(a => [String(a.project_id), {stage: "مشروع 1", date: a.created_at}])));
    }).catch(reportApiError);
    return () => { active = false; };
  }, []);

  const filteredProjects = projects.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.supervisor.toLowerCase().includes(q) ||
      p.leader.toLowerCase().includes(q) ||
      p.technologies.some((t) => t.toLowerCase().includes(q));

    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    const matchesMajor = majorFilter === "all" || p.major === majorFilter;
    const matchesScope = scopeFilter === "all" || p.projectScope === scopeFilter;

    return matchesSearch && matchesStatus && matchesMajor && matchesScope;
  });

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingProject) return;

    if (!applicantStage) {
      setStageError("يرجى تحديد المرحلة الدراسية للمشروع (مشروع 1 أو 2 أو 1 و 2) لإتمام إرسال الطلب.");
      return;
    }
    setStageError("");
    if (!apiClient.isUsingMock()) {
      try { await projectsService.apply(applyingProject.id, [applicantStage, applicantRole, applicantMessage].filter(Boolean).join("\n")); }
      catch (error) { reportApiError(error); return; }
    }

    notify({
      type: "project",
      title: "تم إرسال طلب الانضمام للمشروع! 🎓",
      message: `تم إرسال طلب انضمامك إلى قائد الفريق ${applyingProject.leader}.`,
      link: `/student/projects/${applyingProject.id}`,
      playSound: true,
      browserNotify: true,
    });

    setAppliedProjects((prev) => ({
      ...prev,
      [applyingProject.id]: {
        stage: applicantStage,
        date: new Date().toLocaleDateString("ar-EG"),
      },
    }));

    setApplyingProject(null);
    setApplicantRole("");
    setApplicantMessage("");
    setApplicantStage("");
  };

  const handleCreateProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    let createdProject: GraduationProject = {
      id: `proj-${Date.now()}`,
      title: newTitle,
      major: newMajor,
      department: "كلية الهندسة وتكنولوجيا المعلومات",
      supervisor: newSupervisor,
      leader: studentName,
      projectScope: "مشروع 1",
      members: [
        { name: studentName, role: "قائد الفريق ومطور رئيسي", major: newMajor, initials: studentInitials },
      ],
      neededCount: 2,
      neededRoles: [newNeededRole || "مطور واجهات ومصمم تجربة مستخدم"],
      stage: "فكرة معتمدة",
      status: "يبحث عن شركاء",
      summary: newSummary || "مشروع تخرج مبتكر يهدف لحل مشكلة تقنية وتطبيق المعايير البرمجية الحديثة.",
      problemStatement: "تحديات التحول الرقمي وحاجة السوق المحلي إلى حلول برمجية موثوقة.",
      objectives: [
        "بناء وتصميم المعمارية البرمجية وفق أفضل الممارسات الأكاديمية.",
        "تنفيذ واجهات مستخدم متجاوبة ودعم معايير سهولة الاستخدام.",
      ],
      technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      milestones: [
        { title: "اعتماد المقترح وخطة العمل", date: "2026-04-01", status: "completed" },
        { title: "تسليم الفصل الأول من وثيقة التخرج", date: "2026-05-01", status: "in_progress" },
      ],
      submissionDate: "2026-06-15",
      academicYear: "2025/2026",
    };

    if (!apiClient.isUsingMock()) {
      try { createdProject = await projectsService.create(newTitle, [newSummary, newNeededRole && `الدور المطلوب: ${newNeededRole}`, newSupervisor && `المشرف المقترح: ${newSupervisor}`].filter(Boolean).join("\n"), newMajor); }
      catch (error) { reportApiError(error); return; }
    }
    setProjects(prev => [createdProject, ...prev]);

    notify({
      type: "project",
      title: "تم تقديم مقترح مشروع التخرج بنجاح! 🚀",
      message: `تم نشر إعلان مشروع "${newTitle}".`,
      link: `/student/projects/${createdProject.id}`,
      playSound: true,
      browserNotify: true,
    });

    setIsNewProjectModalOpen(false);
    setNewTitle("");
    setNewSummary("");
    setNewNeededRole("");
  };

  return {
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
  };
}

