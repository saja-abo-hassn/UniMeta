import type { components } from "@/types/api";
import { apiClient } from "./api-client";
import { ApiError, requireData } from "./api-result";

export type UniversityPlan = components["schemas"]["AdminAcademicPlan"];
export type CreateUniversityPlan = components["schemas"]["CreateAcademicPlanRequest"];
export type UpdateUniversityPlanDetails = components["schemas"]["UpdateAcademicPlanDetailsRequest"];
export type AdminMajorOption = components["schemas"]["Major"];

function isAdminMajor(value: unknown): value is AdminMajorOption {
  if (!value || typeof value !== "object") return false;
  const major = value as Record<string, unknown>;
  return Number.isInteger(major.id) && typeof major.name === "string";
}

export const universityPlansService = {
  async listMajors(): Promise<AdminMajorOption[]> {
    const rows = requireData(await apiClient.all<unknown>("/admin/majors"));
    if (!rows.every(isAdminMajor)) {
      throw new Error("استجابة قائمة التخصصات لا تطابق معرّف التخصص واسمه؛ تعذر تجهيز الاختيار بأمان.");
    }
    return rows;
  },

  async list(): Promise<UniversityPlan[]> {
    return requireData(await apiClient.all<UniversityPlan>("/admin/academic-plans"));
  },

  async create(input: CreateUniversityPlan): Promise<UniversityPlan> {
    return requireData(await apiClient.post<UniversityPlan>("/admin/academic-plans", input));
  },

  async updateDetails(id: number, input: UpdateUniversityPlanDetails): Promise<void> {
    requireData(await apiClient.patch(`/admin/academic-plans/${id}/details`, input));
  },

  async remove(id: number): Promise<void> {
    const response = await apiClient.delete(`/admin/academic-plans/${id}`);
    if (response.errors || (response.status !== undefined && response.status >= 400)) {
      throw new ApiError(
        Object.values(response.errors ?? {}).flat().join(" ") || response.message,
        response.status,
        response.code,
        response.errors ?? undefined,
      );
    }
  },
};
