import { ModeratorUser, AdminPermission, ModeratorStatus } from "@/src/types/admin";
import { apiClient, LaravelResponse } from "../api-client";
import { InviteModeratorDTO, ModeratorsServiceContract } from "./types";

export class RealModeratorsService implements ModeratorsServiceContract {
  async list(): Promise<LaravelResponse<ModeratorUser[]>> {
    return apiClient.get<ModeratorUser[]>("/admin/moderators");
  }

  async invite(data: InviteModeratorDTO): Promise<LaravelResponse<{ moderator: ModeratorUser; inviteUrl: string; token: string }>> {
    const permissionKeys = Object.keys(data.permissions) as AdminPermission[];
    const payload = {
      ...data,
      // Laravel validates this field as an array of booleans, in the UI's
      // permission key order. Keep the UI model as a keyed boolean map.
      permissions: permissionKeys.map((permission) => Boolean(data.permissions[permission])),
    };
    const response = await apiClient.post<{ moderator: ModeratorUser; inviteUrl: string; token: string }>("/admin/moderators/invite", payload);
    const returnedPermissions = response.data?.moderator?.permissions as unknown;
    if (response.data?.moderator && Array.isArray(returnedPermissions)) {
      const permissions = Object.fromEntries(
        permissionKeys.map((permission, index) => [permission, Boolean(returnedPermissions[index])])
      ) as ModeratorUser["permissions"];
      return {
        ...response,
        data: {
          ...response.data,
          moderator: { ...response.data.moderator, permissions },
        },
      };
    }
    return response;
  }

  async updatePermissions(id: string, permissions: Record<AdminPermission, boolean>): Promise<LaravelResponse<ModeratorUser>> {
    return apiClient.patch<ModeratorUser>(`/admin/moderators/${id}/permissions`, { permissions });
  }

  async setStatus(id: string, status: ModeratorStatus): Promise<LaravelResponse<ModeratorUser>> {
    return apiClient.patch<ModeratorUser>(`/admin/moderators/${id}/status`, { status });
  }

  async resendInvite(id: string): Promise<LaravelResponse<{ inviteUrl: string; token: string }>> {
    return apiClient.post<{ inviteUrl: string; token: string }>(`/admin/moderators/${id}/resend-invite`);
  }

  async cancelInvite(id: string): Promise<LaravelResponse<null>> {
    return apiClient.delete<null>(`/admin/invitations/${id}`);
  }

  async delete(id: string): Promise<LaravelResponse<null>> {
    return apiClient.delete<null>(`/admin/moderators/${id}`);
  }
}

