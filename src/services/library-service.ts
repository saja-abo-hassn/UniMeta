import type { components } from "@/types/api";
import type { CourseMaterialItem } from "@/src/types/admin";
import { apiClient, API_CONFIG } from "./api-client";
import { requireData } from "./api-result";

export type LibrarySubject = Pick<components["schemas"]["LibrarySubject"], "id" | "subject_name" | "subject_code">;
export type LibraryResource = components["schemas"]["LibraryResource"];
export type ResourceType = LibraryResource["resource_type"];
export type LibraryContribution = Pick<LibraryResource, "id" | "subject_id" | "title" | "description" | "resource_type" | "mime_type" | "file_size" | "created_at"> & {
  status: "PENDING" | "APPROVED" | "REJECTED";
  review_reason?: string | null;
};
type ResourceFields = Pick<LibraryResource, "subject_id" | "title" | "resource_type" | "visibility_status"> & { description?: string | null };

export const libraryFileTypes = [".pdf", ".docx", ".pptx"];
export const libraryMaxFileMb = API_CONFIG.maxUploadMb;

function resourceForm(fields: Record<string, string | number | null | undefined>, file: File) {
  const form = new FormData();
  for (const [name, value] of Object.entries(fields)) {
    if (value != null) form.set(name, String(value));
  }
  form.set("file", file);
  return form;
}

export const libraryService = {
  async adminSubjects() {
    return requireData(await apiClient.all<LibrarySubject>("/admin/library/subjects"));
  },
  async adminResources() {
    return requireData(await apiClient.all<LibraryResource>("/admin/library/resources"));
  },
  async createResource(fields: ResourceFields, file: File) {
    return requireData(await apiClient.upload<LibraryResource>("/admin/library/resources", resourceForm(fields, file)));
  },
  async updateResource(id: string, fields: Partial<ResourceFields>) {
    return requireData(await apiClient.patch<LibraryResource>(`/admin/library/resources/${id}`, fields));
  },
  async deleteResource(id: string) {
    const response = await apiClient.delete(`/admin/library/resources/${id}`);
    if (response.status !== 204) requireData(response);
  },
  async contributions(admin: boolean) {
    const endpoint = admin ? "/admin/library/contributions" : "/students/me/library-contributions";
    return requireData(await apiClient.all<LibraryContribution>(endpoint));
  },
  async contribute(fields: Omit<ResourceFields, "visibility_status">, file: File) {
    return requireData(await apiClient.upload<LibraryContribution>("/library/contributions", resourceForm(fields, file)));
  },
  async review(id: string, decision: "APPROVED" | "REJECTED", reason: string) {
    return requireData(await apiClient.patch<LibraryContribution>(`/admin/library/contributions/${id}/review`, { decision, reason }));
  },
};

const categories: Record<ResourceType, string> = {
  SUMMARY: "الملخصات",
  LECTURE: "الفيديوهات",
  STUDY_NOTE: "الملخصات",
  EXAM_MODEL: "النماذج السابقة",
  APPROVED_REFERENCE: "الكتب",
  AUTHORIZED_DIGITAL_BOOK: "الكتب",
};

export function libraryMaterial(
  item: LibraryResource | LibraryContribution,
  subjects: Map<number, LibrarySubject>,
): CourseMaterialItem {
  const subject = subjects.get(item.subject_id);
  const status = "visibility_status" in item
    ? item.visibility_status === "VISIBLE" ? "منشور" : "مسودة"
    : item.status === "PENDING" ? "قيد المراجعة" : item.status === "APPROVED" ? "منشور" : "مرفوض";
  return {
    id: String(item.id),
    courseId: String(item.subject_id),
    courseCode: subject?.subject_code ?? "",
    courseName: subject?.subject_name ?? "مادة دراسية",
    title: item.title,
    description: item.description ?? undefined,
    category: categories[item.resource_type],
    fileType: item.mime_type.includes("wordprocessingml") ? "DOCX"
      : item.mime_type.includes("presentationml") ? "SLIDES" : "PDF",
    fileSize: `${(item.file_size / 1024 / 1024).toFixed(2)} MB`,
    downloads: "visibility_status" in item ? item.download_requests ?? -1 : 0,
    author: "",
    date: item.created_at.slice(0, 10),
    status,
  };
}
