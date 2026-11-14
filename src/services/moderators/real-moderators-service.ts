import { ModeratorUser, AdminPermission, ModeratorStatus } from "@/src/types/admin";
import { apiClient, LaravelResponse } from "../api-client";
import { InviteModeratorDTO, ModeratorsServiceContract } from "./types";

export class RealModeratorsService implements ModeratorsServiceContract {
  async list(): Promise<LaravelResponse<ModeratorUser[]>> {
    return apiClient.get<ModeratorUser[]>("/admin/moderators");
  }

  async invite(data: InviteModeratorDTO): Promise<LaravelResponse<{ moderator: ModeratorUser; inviteUrl: string; token: string }>> {
    return apiClient.post<{ moderator: ModeratorUser; inviteUrl: string; token: string }>("/admin/moderators/invite", data);
  }

  async updatePermissions(id: string, permissions: Record<AdminPermission, boolean>): Promise<LaravelResponse<ModeratorUser>> {
    return apiClient.patch<ModeratorUser>(`/admin/moderators/${id}/permissions`, { permissions });
  }

  async setStatus(id: string, status: ModeratorStatus): Promise<LaravelResponse<ModeratorUser>> {
    return apiClient.patch<ModeratorUser>(`/admin/moderators/${id}/status`, { active: status === "نشط" });
  }

  async resendInvite(id: string): Promise<LaravelResponse<{ inviteUrl: string; token: string }>> {
    return apiClient.post<{ inviteUrl: string; token: string }>(`/admin/invitations/${id}/resend`);
  }

  async cancelInvite(id: string): Promise<LaravelResponse<null>> {
    return apiClient.delete<null>(`/admin/invitations/${id}`);
  }

  async delete(id: string): Promise<LaravelResponse<null>> {
    return apiClient.delete<null>(`/admin/moderators/${id}`);
  }
}

