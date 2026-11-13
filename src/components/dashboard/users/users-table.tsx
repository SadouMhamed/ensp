import { PERMISSION_INFO, ROLE_INFO, cleanPermissions } from "@/lib/permissions";
import type { AdminUserRow } from "@/server/queries/users";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserRowActions } from "./user-row-actions";

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "?";
}

export function UsersTable({ users, currentUserId }: { users: AdminUserRow[]; currentUserId: string }) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead className="pl-4">User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="hidden md:table-cell">Privileges</TableHead>
            <TableHead className="hidden lg:table-cell">Added</TableHead>
            <TableHead className="w-12">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => {
            const isSelf = u.id === currentUserId;
            const perms = cleanPermissions(u.role, u.permissions);
            return (
              <TableRow key={u.id}>
                <TableCell className="pl-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8 rounded-lg">
                      <AvatarFallback className="rounded-lg">{initials(u.name)}</AvatarFallback>
                    </Avatar>
                    <div className="grid leading-tight">
                      <span className="font-medium">
                        {u.name}
                        {isSelf ? <span className="ml-1.5 text-xs text-muted-foreground">(you)</span> : null}
                      </span>
                      <span className="text-xs text-muted-foreground">{u.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={u.role === "admin" ? "default" : "outline"}>{ROLE_INFO[u.role].label}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {u.role === "admin" ? (
                      <span className="text-sm text-muted-foreground">Everything</span>
                    ) : perms.length === 0 ? (
                      <span className="text-sm text-muted-foreground">None</span>
                    ) : (
                      perms.map((p) => (
                        <Badge key={p} variant="secondary">
                          {PERMISSION_INFO[p].label}
                        </Badge>
                      ))
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden text-muted-foreground lg:table-cell">
                  {dateFormat.format(u.createdAt)}
                </TableCell>
                <TableCell>
                  <UserRowActions user={u} isSelf={isSelf} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
