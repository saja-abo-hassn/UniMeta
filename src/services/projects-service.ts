import { apiClient } from "./api-client";
import { requireData } from "./api-result";
import type { GraduationProject } from "../data/graduation-projects-data";
interface Project { id: number; title: string; description: string; major_id: number | null; project_stage: string; available_slots: number; owner: { id: number; full_name: string }; }
export interface Application { id: number; project_id: number; message: string | null; status: string; created_at: string; applicant?: { id: number; full_name: string }; project?: { id: number; title: string }; }
export const projectsService = {
  async list() {
    const [projects, majors] = await Promise.all([apiClient.all<Project>("/graduation-projects"), apiClient.all<{id: number; name: string}>("/majors")]);
    const names = requireData(majors);
    return requireData(projects).map(p => this.adapt(p, names.find(m => m.id === p.major_id)?.name ?? ""));
  },
  adapt(p: Project, major = ""): GraduationProject {
    return { id: String(p.id), title: p.title, summary: p.description, major, department: "", supervisor: "غير محدد",
      leader: p.owner.full_name, projectScope: p.project_stage === "PROJECT_2" ? "مشروع 2" : p.project_stage === "BOTH" ? "مشروع 1 و 2" : "مشروع 1",
      members: [{name: p.owner.full_name, role: "قائد الفريق", major, initials: p.owner.full_name.split(" ").map(n=>n[0]).slice(0,2).join("")}],
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
