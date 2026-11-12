import { ModeratorUser, AdminPermission, ModeratorStatus } from "@/src/types/admin";
import { initialModerators } from "@/src/data/mock-admin-data";
import { apiClient, LaravelResponse } from "../api-client";
import { mailService } from "../mail-service";
import { authService } from "../auth-service";
import { InviteModeratorDTO, ModeratorsServiceContract } from "./types";

function getStoredModerators(): ModeratorUser[] {
  if (typeof window === "undefined") return initialModerators;
  try {
    const raw = localStorage.getItem("unimeta_admin_moderators_v1");
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return initialModerators;
}

function saveStoredModerators(list: ModeratorUser[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("unimeta_admin_moderators_v1", JSON.stringify(list));
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("unimeta_auth_change"));
  } catch {
    // ignore
  }
}

function generateSecureToken(): string {
  if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
    const arr = new Uint8Array(24);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export class MockModeratorsService implements ModeratorsServiceContract {
  async list(): Promise<LaravelResponse<ModeratorUser[]>> {
    await new Promise((res) => setTimeout(res, 150));
    return apiClient.createSuccessResponse(getStoredModerators(), "Success");
  }

  async invite(data: InviteModeratorDTO): Promise<LaravelResponse<{ moderator: ModeratorUser; inviteUrl: string; token: string }>> {
    await new Promise((res) => setTimeout(res, 200));
    const list = getStoredModerators();

    const cleanEmail = data.email.trim().toLowerCase();
    if (list.some((m) => m.email.toLowerCase() === cleanEmail)) {
      return apiClient.createErrorResponse("البريد الإلكتروني مسجل مسبقاً لمشرف آخر.", {
        email: ["البريد الإلكتروني مستخدم بالفعل."],
      });
    }

    const token = generateSecureToken();
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
    const origin = typeof window !== "undefined" ? window.location.origin : "https://unimeta.edu.ps";
    const inviteUrl = `${origin}/invite/${token}`;

    const newMod: ModeratorUser = {
      id: `mod-${Date.now()}`,
      name: data.name.trim(),
      email: cleanEmail,
      role: "moderator",
      title: data.title.trim() || "مشرف",
      assignedDepartment: data.assignedDepartment?.trim() || "إدارة المحتوى والإشراف",
      status: "دعوة معلّقة",
      inviteToken: token,
      inviteExpiresAt: expiresAt,
      invitedAt: new Date().toISOString(),
      createdAt: new Date().toISOString().split("T")[0],
      permissions: data.permissions,
    };

    saveStoredModerators([newMod, ...list]);

    const adminUser = authService.getCurrentUser();
    await mailService.sendModeratorInvite({
      to: cleanEmail,
      name: newMod.name,
      inviteUrl,
      expiresAt,
      invitedBy: adminUser?.name || "المسؤول العام",
    });

    return apiClient.createSuccessResponse(
      { moderator: newMod, inviteUrl, token },
      "تم إنشاء الدعوة بنجاح."
    );
  }

  async updatePermissions(id: string, permissions: Record<AdminPermission, boolean>): Promise<LaravelResponse<ModeratorUser>> {
    await new Promise((res) => setTimeout(res, 150));
    const list = getStoredModerators();
    const target = list.find((m) => m.id === id);
    if (!target) {
      return apiClient.createErrorResponse("المشرف غير موجود.", { id: ["معرف غير صالح"] });
    }

    const updated = { ...target, permissions };
    const newList = list.map((m) => (m.id === id ? updated : m));
    saveStoredModerators(newList);
    return apiClient.createSuccessResponse(updated, "تم تحديث الصلاحيات بنجاح.");
  }

  async setStatus(id: string, status: ModeratorStatus): Promise<LaravelResponse<ModeratorUser>> {
    await new Promise((res) => setTimeout(res, 150));
    const list = getStoredModerators();
    const target = list.find((m) => m.id === id);
    if (!target) {
      return apiClient.createErrorResponse("المشرف غير موجود.");
    }

    const updated = { ...target, status };
    const newList = list.map((m) => (m.id === id ? updated : m));
    saveStoredModerators(newList);
    return apiClient.createSuccessResponse(updated, "تم تغيير حالة المشرف.");
  }

  async resendInvite(id: string): Promise<LaravelResponse<{ inviteUrl: string; token: string }>> {
    await new Promise((res) => setTimeout(res, 150));
    const list = getStoredModerators();
    const target = list.find((m) => m.id === id);
    if (!target) {
      return apiClient.createErrorResponse("المشرف غير موجود.");
    }

    const token = generateSecureToken();
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
    const origin = typeof window !== "undefined" ? window.location.origin : "https://unimeta.edu.ps";
    const inviteUrl = `${origin}/invite/${token}`;

    const updated: ModeratorUser = {
      ...target,
      status: "دعوة معلّقة",
      inviteToken: token,
      inviteExpiresAt: expiresAt,
      invitedAt: new Date().toISOString(),
    };

    saveStoredModerators(list.map((m) => (m.id === id ? updated : m)));

    const adminUser = authService.getCurrentUser();
    await mailService.sendModeratorInvite({
      to: updated.email,
      name: updated.name,
      inviteUrl,
      expiresAt,
      invitedBy: adminUser?.name || "المسؤول العام",
    });

    return apiClient.createSuccessResponse({ inviteUrl, token }, "تمت إعادة إرسال الدعوة بنجاح.");
  }

  async cancelInvite(id: string): Promise<LaravelResponse<null>> {
    await new Promise((res) => setTimeout(res, 150));
    const list = getStoredModerators();
    const target = list.find((m) => m.id === id);
    if (!target) {
      return apiClient.createErrorResponse("الدعوة غير موجودة.");
    }

    const updated: ModeratorUser = {
      ...target,
      status: "معطل",
      inviteToken: undefined,
      inviteExpiresAt: undefined,
    };
    saveStoredModerators(list.map((m) => (m.id === id ? updated : m)));
    return apiClient.createSuccessResponse(null, "تم إلغاء الدعوة بنجاح.");
  }

  async delete(id: string): Promise<LaravelResponse<null>> {
    await new Promise((res) => setTimeout(res, 150));
    const list = getStoredModerators();
    const filtered = list.filter((m) => m.id !== id);
    saveStoredModerators(filtered);
    return apiClient.createSuccessResponse(null, "تم حذف المشرف.");
  }
}

