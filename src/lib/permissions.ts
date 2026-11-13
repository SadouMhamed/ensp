/**
 * Who can do what in the dashboard.
 * - admin: everything, including managing user accounts
 * - editor: only the permissions ticked for them when their account was created / edited
 * Safe to import from client and server code (no secrets here).
 */
export const ROLES = ["admin", "editor"] as const;
export type Role = (typeof ROLES)[number];

export const PERMISSIONS = ["posts", "media", "sections"] as const;
export type Permission = (typeof PERMISSIONS)[number];

export const ROLE_INFO: Record<Role, { label: string; description: string }> = {
  admin: {
    label: "Admin",
    description: "Full access, including creating and deleting user accounts.",
  },
  editor: {
    label: "Editor",
    description: "Only the sections you tick below.",
  },
};

export const PERMISSION_INFO: Record<Permission, { label: string; description: string }> = {
  posts: { label: "Articles", description: "Write, edit, publish and delete blog articles." },
  media: { label: "Media library", description: "Upload, replace and delete images, videos and files." },
  sections: { label: "Website sections", description: "Change the texts and images of the website pages." },
};

export type AccessUser = { role: Role; permissions: readonly string[] };

export function can(user: AccessUser, permission: Permission | "users") {
  if (user.role === "admin") return true;
  if (permission === "users") return false;
  return user.permissions.includes(permission);
}

/** Keep only known permissions (admins don't need any stored). */
export function cleanPermissions(role: Role, permissions: readonly string[]): Permission[] {
  if (role === "admin") return [];
  return PERMISSIONS.filter((p) => permissions.includes(p));
}
