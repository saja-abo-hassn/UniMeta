import { apiClient, LaravelResponse } from "./api-client";
import { authService } from "./auth-service";
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
      return apiClient.get<AdminMeData>("/me");
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
      return apiClient.get<AdminOverviewData>("/admin/overview");
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

