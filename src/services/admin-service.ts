import { apiClient, LaravelResponse } from "./api-client";
import { authService } from "./auth-service";
import { BackendUser, toUser } from "./user-adapter";
import {
  initialMembersList,
  initialAgreementsList,
  initialMaterialsList,
  initialCoursesList,
  initialReportsList,
} from "@/src/data/mock-admin-data";
import { getStoredUsers } from "./mock-backend/mock-users";
import { AdminRole, AdminAgreementItem, CourseMaterialItem, AdminReportItem, AdminMemberItem } from "@/src/types/admin";

export interface AdminMeData {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  title: string | null;
  avatarUrl: string | null;
}

export interface AdminOverviewData {
  totalStudents: number;
  activeNow: number;
  pendingAgreements: number;
  activeLoans: number;
  contentCount: number;
  coveredCourses: number;
  totalCourses: number;
  openReports: number;
}

class AdminService {
  async getMe(): Promise<LaravelResponse<AdminMeData>> {
    if (!apiClient.isUsingMock()) {
      const response = await apiClient.get<BackendUser>("/users/me/profile");
      const user = response.data ? toUser(response.data) : null;
      return { ...response, data: user ? { ...user, role: user.role === "moderator" ? "moderator" : "super_admin", title: user.title ?? null, avatarUrl: user.avatarUrl ?? null } : null };
    }

    const currentAuth = authService.getCurrentUser();
    let role: AdminRole = "super_admin";
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("unimeta_admin_role_v1");
      if (storedRole === "moderator" || storedRole === "super_admin") {
        role = storedRole;
      }
    }

    const me: AdminMeData = {
      id: currentAuth?.id || "adm-1",
      name: currentAuth?.name || (role === "super_admin" ? "المسؤول العام" : "مشرف النظام"),
      email: currentAuth?.email || "admin@unimeta.edu.ps",
      role,
      title: currentAuth?.title || (role === "super_admin" ? "المسؤول العام" : "مشرف"),
      avatarUrl: currentAuth?.avatarUrl || null,
    };

    return apiClient.createSuccessResponse(me, "Success");
  }

  async getOverview(): Promise<LaravelResponse<AdminOverviewData>> {
    if (!apiClient.isUsingMock()) {
      const response = await apiClient.get<Record<string, number>>("/admin/dashboard/overview");
      const d = response.data;
      return { ...response, data: d ? {
        totalStudents: d.total_students, activeNow: d.active_now ?? 0,
        pendingAgreements: d.pending_agreements ?? 0, activeLoans: d.active_agreements ?? 0,
        contentCount: d.content_count ?? 0, coveredCourses: d.covered_courses ?? 0,
        totalCourses: d.total_courses ?? 0, openReports: d.open_reports ?? 0,
      } : null };
    }

    let members: AdminMemberItem[] = initialMembersList;
    let agreements: AdminAgreementItem[] = initialAgreementsList;
    let materials: CourseMaterialItem[] = initialMaterialsList;
    let reports: AdminReportItem[] = initialReportsList;

    if (typeof window !== "undefined") {
      try {
        const mem = localStorage.getItem("unimeta_admin_members_v1");
        if (mem) members = JSON.parse(mem);
        const agr = localStorage.getItem("unimeta_admin_agreements_v1");
        if (agr) agreements = JSON.parse(agr);
        const mat = localStorage.getItem("unimeta_admin_materials_v1");
        if (mat) materials = JSON.parse(mat);
        const rep = localStorage.getItem("unimeta_admin_reports_v1");
        if (rep) reports = JSON.parse(rep);
      } catch {
        // ignore
      }
    }

    const storedUsers = getStoredUsers();
    const studentUsers = storedUsers.filter((u) => u.role === "student");
    const totalStudents = Math.max(members.length, studentUsers.length);

    const activeNow = members.filter((m) => {
      const last = (m.lastActive || "").toLowerCase();
      return (
        m.status === "نشط" &&
        (last.includes("10") ||
          last.includes("15") ||
          last.includes("دقيقة") ||
          last.includes("دقائق") ||
          last.includes("الآن"))
      );
    }).length;

    const pendingAgreements = agreements.filter((a) => a.status === "قيد الانتظار").length;
    const activeLoans = agreements.filter((a) => a.status === "موافق عليها").length;
    const publishedMaterials = materials.filter((m) => m.status === "منشور");
    const contentCount = publishedMaterials.length;

    const publishedCourseCodes = new Set(
      publishedMaterials.map((m) => m.courseCode.toUpperCase())
    );
    const coveredCourses = initialCoursesList.filter((c) =>
      publishedCourseCodes.has(c.code.toUpperCase())
    ).length;
    const totalCourses = initialCoursesList.length;

    const openReports = reports.filter((r) => r.status === "مفتوح").length;

    const data: AdminOverviewData = {
      totalStudents,
      activeNow,
      pendingAgreements,
      activeLoans,
      contentCount,
      coveredCourses,
      totalCourses,
      openReports,
    };

    return apiClient.createSuccessResponse(data, "Success");
  }
}

export const adminService = new AdminService();

