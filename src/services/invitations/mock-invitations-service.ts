import { ModeratorUser } from "@/src/types/admin";
import { initialModerators } from "@/src/data/mock-admin-data";
import { apiClient, LaravelResponse } from "../api-client";
import { getStoredUsers, saveNewUser } from "../mock-backend/mock-users";
import { InvitationDetails, InvitationsServiceContract } from "./types";

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

export class MockInvitationsService implements InvitationsServiceContract {
  async get(token: string): Promise<LaravelResponse<InvitationDetails>> {
    await new Promise((res) => setTimeout(res, 200));
    const list = getStoredModerators();
    const mod = list.find((m) => m.inviteToken === token);

    if (!mod) {
      return apiClient.createErrorResponse("رابط الدعوة غير صحيح أو لم يعد متاحاً.", {
        token: ["الرمز غير موجود أو غير صالح."],
      });
    }

    if (mod.status === "معطل") {
      return apiClient.createErrorResponse("تم إلغاء هذه الدعوة من قِبل إدارة النظام.", {
        status: ["تم إلغاء الدعوة مسبقاً."],
      });
    }

    if (mod.status === "نشط") {
      return apiClient.createErrorResponse("تم تفعيل هذا الحساب مسبقاً. يمكنك تسجيل الدخول الآن.", {
        status: ["الحساب مفعل بالفعل."],
      });
    }

    const expiresTime = mod.inviteExpiresAt ? new Date(mod.inviteExpiresAt).getTime() : 0;
    const isExpired = expiresTime > 0 && Date.now() > expiresTime;

    if (isExpired) {
      return apiClient.createErrorResponse("انتهت صلاحية رابط الدعوة (48 ساعة). يرجى طلب دعوة جديدة من المسؤول العام.", {
        expiresAt: ["انتهت مهلة صلاحية الرابط."],
      });
    }

    const details: InvitationDetails = {
      name: mod.name,
      email: mod.email,
      title: mod.title || "مشرف",
      assignedDepartment: mod.assignedDepartment,
      role: "moderator",
      expiresAt: mod.inviteExpiresAt || "",
      isExpired: false,
      status: mod.status,
    };

    return apiClient.createSuccessResponse(details, "Success");
  }

  async accept(token: string, password: string): Promise<LaravelResponse<{ email: string }>> {
    await new Promise((res) => setTimeout(res, 250));

    if (password.length < 8 || !/[a-zA-Z\u0600-\u06FF]/.test(password) || !/[0-9]/.test(password)) {
      return apiClient.createErrorResponse("كلمة المرور يجب أن تكون 8 أحرف على الأقل وتتضمن حروفاً وأرقاماً.", {
        password: ["كلمة المرور ضعيفة."],
      });
    }

    const list = getStoredModerators();
    const mod = list.find((m) => m.inviteToken === token);

    if (!mod) {
      return apiClient.createErrorResponse("رابط الدعوة غير صالح.");
    }

    const expiresTime = mod.inviteExpiresAt ? new Date(mod.inviteExpiresAt).getTime() : 0;
    if (expiresTime > 0 && Date.now() > expiresTime) {
      return apiClient.createErrorResponse("انتهت صلاحية رابط الدعوة.");
    }

    const updatedMod: ModeratorUser = {
      ...mod,
      status: "نشط",
      inviteToken: undefined,
      inviteExpiresAt: undefined,
    };

    const updatedList = list.map((m) => (m.id === mod.id ? updatedMod : m));
    saveStoredModerators(updatedList);

    const users = getStoredUsers();
    const existing = users.find((u) => u.email.toLowerCase() === mod.email.toLowerCase());
    if (!existing) {
      saveNewUser({
        id: mod.id,
        name: mod.name,
        email: mod.email,
        password: password,
        role: "admin",
        createdAt: new Date().toISOString().split("T")[0],
        emailVerified: true,
      });
    }

    return apiClient.createSuccessResponse({ email: mod.email }, "تم تفعيل حسابك بنجاح.");
  }
}

