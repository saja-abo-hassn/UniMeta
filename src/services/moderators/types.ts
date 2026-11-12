import { ModeratorUser, AdminPermission, ModeratorStatus } from "@/src/types/admin";
import { LaravelResponse } from "../api-client";

export interface InviteModeratorDTO {
  name: string;
  email: string;
  title: string;
  assignedDepartment?: string;
  permissions: Record<AdminPermission, boolean>;
}

export interface ModeratorsServiceContract {
  list(): Promise<LaravelResponse<ModeratorUser[]>>;
  invite(data: InviteModeratorDTO): Promise<LaravelResponse<{ moderator: ModeratorUser; inviteUrl: string; token: string }>>;
  updatePermissions(id: string, permissions: Record<AdminPermission, boolean>): Promise<LaravelResponse<ModeratorUser>>;
  setStatus(id: string, status: ModeratorStatus): Promise<LaravelResponse<ModeratorUser>>;
  resendInvite(id: string): Promise<LaravelResponse<{ inviteUrl: string; token: string }>>;
  cancelInvite(id: string): Promise<LaravelResponse<null>>;
  delete(id: string): Promise<LaravelResponse<null>>;
}

