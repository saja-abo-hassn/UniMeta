export const ADMIN_PERMISSION_KEYS = [
  "manage_content",
  "manage_agreements",
  "manage_reports",
  "manage_members",
  "view_sensitive",
] as const;

export type AdminPermissionKey = (typeof ADMIN_PERMISSION_KEYS)[number];
export type ModeratorPermissions = Record<AdminPermissionKey, boolean>;
export type AdminDiscriminator = "super_admin" | "moderator" | null;

export function normalizePermissions(value: Record<string, unknown> | null | undefined): ModeratorPermissions {
  return Object.fromEntries(ADMIN_PERMISSION_KEYS.map((key) => [key, value?.[key] === true])) as ModeratorPermissions;
}

export function canAccessAdmin(
  adminRole: AdminDiscriminator,
  permissions: Record<string, boolean> | null | undefined,
  permission: string,
): boolean {
  return adminRole === "super_admin" || (adminRole === "moderator" && permissions?.[permission] === true);
}
