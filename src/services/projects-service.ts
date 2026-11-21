import { apiClient } from "./api-client";
import { requireData } from "./api-result";
import type { GraduationProject } from "../data/graduation-projects-data";
import type { components } from "@/types/api";
type Project = components["schemas"]["GraduationProject"];
type Major = components["schemas"]["Major"];
export interface Application { id: number; project_id: number; message: string | null; status: string; created_at: string; applicant?: { id: number; full_name: string }; project?: { id: number; title: string }; }
export const projectsService = {
  async list() {
    const [projects, majors] = await Promise.all([apiClient.all<Project>("/graduation-projects"), apiClient.all<Major>("/majors")]);
    const names = requireData(majors);
    return requireData(projects).map(p => this.adapt(p, names.find(m => m.id === p.major_id)?.name ?? ""));
  },
  async get(id: string): Promise<GraduationProject | null> {
    if (!/^\d+$/.test(id)) return null;
    const response = await apiClient.get<Project>(`/graduation-projects/${encodeURIComponent(id)}`);
    if (response.status === 404) return null;
    const project = requireData(response);
    const majors = await apiClient.all<Major>("/majors");
    const majorName = majors.data?.find((major) => major.id === project.major_id)?.name ?? "";
    return this.adapt(project, majorName);
  },
  async remove(id: string): Promise<{ supported: false; message: string }> {
    void id;
    return { supported: false, message: "حذف إعلان المشروع غير متاح؛ لا يوجد مسار DELETE موثق في OpenAPI." };
  },
  adapt(p: Project, major = ""): GraduationProject {
    const ownerName = p.owner?.full_name ?? "";
    return { id: String(p.id), ownerId: p.owner ? String(p.owner.id) : undefined, title: p.title, summary: p.description, major, department: "", supervisor: "",
      leader: ownerName, projectScope: p.project_stage === "PROJECT_2" ? "مشروع 2" : p.project_stage === "BOTH" ? "مشروع 1 و 2" : "مشروع 1",
      members: ownerName ? [{name: ownerName, role: "قائد الفريق", major, initials: ownerName.split(" ").map(n=>n[0]).slice(0,2).join("")}] : [],
      neededCount: p.available_slots, neededRoles: [], stage: "المرحلة 1 (بحث ونمذجة)",
      status: p.available_slots > 0 ? "يبحث عن شركاء" : "مكتمل الفريق", problemStatement: "", objectives: [], technologies: [], milestones: [], submissionDate: "", academicYear: "" };
  },
  async create(title: string, description: string, major: string) {
    const majors = requireData(await apiClient.all<{id: number; name: string}>("/majors"));
    if (major && !majors.some(m=>m.name===major)) throw new Error("التخصص المحدد غير موجود. حدّث قائمة التخصصات وحاول مجددًا.");
    const project = requireData(await apiClient.post<Project>("/graduation-projects", { title, description,
      major_id: majors.find(m=>m.name===major)?.id ?? null, project_stage: "PROJECT_1", required_members_preference: "TWO", available_slots: 2 }));
    return this.adapt(project, major);
  },
  async apply(id: string, message: string) { return requireData(await apiClient.post<Application>(`/graduation-projects/${id}/applications`, { message })); },
  async mine() { return requireData(await apiClient.all<Application>("/students/me/project-applications")); },
};
