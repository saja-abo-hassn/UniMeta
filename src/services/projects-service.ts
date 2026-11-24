import { apiClient } from "./api-client";
import { requireData } from "./api-result";
import type { GraduationProject } from "../data/graduation-projects-data";
import type { components } from "@/types/api";
// Detail fields added to the Laravel contract (GET /graduation-projects/{id}); all nullable.
type Project = components["schemas"]["GraduationProject"] & {
  supervisor_name?: string | null; department?: string | null; problem_statement?: string | null;
  goals?: string[] | null; open_roles?: string[] | null; milestones?: { title: string; due_date: string }[] | null;
  members?: { id: number; full_name: string; role: "OWNER" | "MEMBER"; joined_at: string }[];
};
const initials = (name: string) => name.split(" ").filter(Boolean).map(n => n[0]).slice(0, 2).join("");
const milestoneStatus = (date: string, next: boolean): "completed" | "in_progress" | "pending" => {
  const today = new Date().toISOString().slice(0, 10);
  return date < today ? "completed" : next ? "in_progress" : "pending";
};
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
  // DELETE /graduation-projects/{id}: owner only; 422 once the team has members.
  async remove(id: string): Promise<void> {
    const response = await apiClient.delete(`/graduation-projects/${encodeURIComponent(id)}`);
    if (response.status === 422) throw new Error("لا يمكن حذف إعلان انضم إلى فريقه أعضاء.");
    if (response.errors) throw new Error(response.message);
  },
  adapt(p: Project, major = ""): GraduationProject {
    const ownerName = p.owner?.full_name ?? "";
    const members = p.members?.length
      ? p.members.map(m => ({ name: m.full_name, role: m.role === "OWNER" ? "قائد الفريق" : "عضو في الفريق", major, initials: initials(m.full_name) }))
      : ownerName ? [{ name: ownerName, role: "قائد الفريق", major, initials: initials(ownerName) }] : [];
    const dates = (p.milestones ?? []).map(m => m.due_date);
    const today = new Date().toISOString().slice(0, 10);
    const nextIndex = dates.findIndex(d => d >= today);
    const milestones = (p.milestones ?? []).map((m, i) => ({ title: m.title, date: m.due_date, status: milestoneStatus(m.due_date, i === nextIndex) }));
    return { id: String(p.id), ownerId: p.owner ? String(p.owner.id) : undefined, title: p.title, summary: p.description, major, department: p.department ?? "", supervisor: p.supervisor_name ?? "",
      leader: ownerName, projectScope: p.project_stage === "PROJECT_2" ? "مشروع 2" : p.project_stage === "BOTH" ? "مشروع 1 و 2" : "مشروع 1",
      members, neededCount: p.available_slots, neededRoles: p.open_roles ?? [], stage: "المرحلة 1 (بحث ونمذجة)",
      status: p.available_slots > 0 ? "يبحث عن شركاء" : "مكتمل الفريق", problemStatement: p.problem_statement ?? "", objectives: p.goals ?? [], technologies: [], milestones,
      submissionDate: dates.length ? [...dates].sort().at(-1)! : "", academicYear: "" };
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
