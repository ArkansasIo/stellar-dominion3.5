export type AdminPermission =
  | "all_access"
  | "administrate"
  | "manage"
  | "moderate"
  | "view_only"
  | "developer_tools"
  | "masquerade"
  | "world_tools"
  | "liveops_override";

const ROLE_PERMISSIONS: Record<string, AdminPermission[]> = {
  founder: [
    "all_access",
    "administrate",
    "manage",
    "moderate",
    "view_only",
    "developer_tools",
    "masquerade",
    "world_tools",
    "liveops_override",
  ],
  devadmin: [
    "administrate",
    "manage",
    "moderate",
    "view_only",
    "developer_tools",
    "masquerade",
    "world_tools",
    "liveops_override",
  ],
  administrator: ["administrate", "manage", "moderate", "view_only"],
  suadmin: ["manage", "moderate", "view_only", "liveops_override"],
  moderator: ["moderate", "view_only"],
  viewer: ["view_only"],
};

export function normalizeAdminRole(role: string | null | undefined): string {
  const normalized = String(role || "viewer").trim().toLowerCase();
  if (normalized === "dev_admin" || normalized === "dev-admin") {
    return "devadmin";
  }
  return ROLE_PERMISSIONS[normalized] ? normalized : "viewer";
}

export function getRolePermissions(role: string | null | undefined): AdminPermission[] {
  return [...(ROLE_PERMISSIONS[normalizeAdminRole(role)] || ROLE_PERMISSIONS.viewer)];
}

export function hasAdminPermission(
  permissions: unknown,
  permission: AdminPermission,
): boolean {
  if (!Array.isArray(permissions)) {
    return false;
  }

  const normalized = permissions.filter((value): value is string => typeof value === "string");
  return normalized.includes("all_access") || normalized.includes(permission);
}
