import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

/**
 * Roles known to Better Auth's admin plugin.
 * - admin: may use the admin API (create / delete users, change roles)
 * - editor: no admin-API rights; what an editor may manage in the dashboard
 *   comes from their `permissions` column (see src/lib/permissions.ts)
 */
const statement = { ...defaultStatements } as const;

export const ac = createAccessControl(statement);

export const adminRole = ac.newRole({ ...adminAc.statements });
export const editorRole = ac.newRole({ user: [], session: [] });
