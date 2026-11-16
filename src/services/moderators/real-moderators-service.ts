import { ModeratorUser, AdminPermission, ModeratorStatus } from "@/src/types/admin";
import { apiClient, LaravelResponse } from "../api-client";
import { InviteModeratorDTO, ModeratorsServiceContract } from "./types";

const permissionKeys = ["manage_content", "manage_agreements", "manage_reports", "manage_members", "view_sensitive"];
function permissionsForApi(permissions: Record<string, boolean>) {
  const unsupported = Object.entries(permissions).filter(([key, enabled]) => enabled && !permissionKeys.includes(key));
  if (unsupported.length) throw new Error("هذه الصلاحيات غير مدعومة حاليًا: " + unsupported.map(([key]) => key).join(", "));
  return Object.fromEntries(permissionKeys.filter(key => key in permissions).map(key => [key, Boolean(permissions[key])]));
}
interface Invitation {
  id: number; name: string; email: string; title: string | null; department: string | null;
  permissions: Record<string, boolean>; created_at: string; expires_at: string;
  accepted_at: string | null; cancelled_at: string | null;
}
function pendingModerator(invitation: Invitation): ModeratorUser {
  return {
    id: `invitation-${invitation.id}`, name: invitation.name, email: invitation.email,
    title: invitation.title, assignedDepartment: invitation.department ?? "", role: "moderator",
    status: "دعوة معلّقة", createdAt: invitation.created_at, inviteExpiresAt: invitation.expires_at,
    permissions: invitation.permissions as ModeratorUser["permissions"],
  };
}
function tokenFromUrl(url: string) { return new URL(url).pathname.split("/").pop() || ""; }

export class RealModeratorsService implements ModeratorsServiceContract {
  async list(): Promise<LaravelResponse<ModeratorUser[]>> {
    const [users, invitations] = await Promise.all([
      apiClient.get<ModeratorUser[]>("/admin/moderators"), apiClient.all<Invitation>("/admin/invitations"),
    ]);
    if (users.errors || invitations.errors) return { ...(users.errors ? users : invitations), data: null };
    return { ...users, data: [...(users.data ?? []), ...(invitations.data ?? [])
      .filter(i => !i.accepted_at && !i.cancelled_at && Date.parse(i.expires_at) > Date.now()).map(pendingModerator)] };
  }

  async invite(data: InviteModeratorDTO): Promise<LaravelResponse<{ moderator: ModeratorUser; inviteUrl: string; token: string }>> {
    const response = await apiClient.post<{ invitation: Invitation; inviteUrl: string }>("/admin/moderators/invite", {
      ...data, permissions: permissionsForApi(data.permissions),
    });
    if (response.errors || !response.data) return { ...response, data: null };
    const { invitation, inviteUrl } = response.data;
    const token = tokenFromUrl(inviteUrl);
    return { ...response, data: { moderator: { ...pendingModerator(invitation), inviteToken: token }, inviteUrl, token } };
  }

  async updatePermissions(id: string, permissions: Record<AdminPermission, boolean>): Promise<LaravelResponse<ModeratorUser>> {
    if (id.startsWith("invitation-")) throw new Error("يمكن تعديل الصلاحيات بعد قبول الدعوة.");
    return apiClient.patch<ModeratorUser>(`/admin/moderators/${id}/permissions`, { permissions: permissionsForApi(permissions) });
  }

  async setStatus(id: string, status: ModeratorStatus): Promise<LaravelResponse<ModeratorUser>> {
    if (id.startsWith("invitation-")) throw new Error("يمكن تعديل حالة المشرف بعد قبول الدعوة.");
    return apiClient.patch<ModeratorUser>(`/admin/moderators/${id}/status`, { active: status === "نشط" });
  }

  async resendInvite(id: string): Promise<LaravelResponse<{ inviteUrl: string; token: string }>> {
    const response = await apiClient.post<{ inviteUrl: string }>(`/admin/invitations/${id.replace(/^invitation-/, "")}/resend`);
    return { ...response, data: response.data ? { ...response.data, token: tokenFromUrl(response.data.inviteUrl) } : null };
  }

  async cancelInvite(id: string): Promise<LaravelResponse<null>> {
    const response = await apiClient.delete(`/admin/invitations/${id.replace(/^invitation-/, "")}`);
    return { ...response, data: null };
  }

  async delete(id: string): Promise<LaravelResponse<null>> {
    if (id.startsWith("invitation-")) return this.cancelInvite(id);
    const response = await apiClient.delete(`/admin/moderators/${id}`);
    return { ...response, data: null };
  }
}
