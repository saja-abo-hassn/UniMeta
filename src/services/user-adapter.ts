import type { AuthSessionData } from "./auth-service";

export interface BackendUser {
  id: number | string;
  full_name: string;
  email: string;
  role: string;
  student_id?: string | null;
  faculty?: string | null;
  avatar_url?: string | null;
  email_verified?: boolean;
  admin_role?: "moderator" | "super_admin" | null;
  permissions?: Record<string, boolean> | null;
}

export function toUser(user: BackendUser): AuthSessionData["user"] {
  return {
    id: String(user.id), name: user.full_name, email: user.email,
    role: user.admin_role === "moderator" ? "moderator" : user.role === "ADMIN" ? "super_admin" : "student",
    studentId: user.student_id ?? undefined, faculty: user.faculty ?? undefined,
    avatarUrl: user.avatar_url, emailVerified: user.email_verified,
    permissions: user.permissions,
  };
}
