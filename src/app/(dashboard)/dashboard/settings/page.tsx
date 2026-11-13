import type { Metadata } from "next";
import { requireUser } from "@/lib/dal";
import { PERMISSIONS, PERMISSION_INFO, ROLE_INFO, can } from "@/lib/permissions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <div className="grid max-w-2xl gap-4 px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Your account</CardTitle>
          <CardDescription>Your sign-in details and what you can manage.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm">
          <div className="grid grid-cols-[120px_1fr] gap-y-2">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium">{user.name}</span>
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{user.email}</span>
            <span className="text-muted-foreground">Role</span>
            <span>
              <Badge variant="outline">{ROLE_INFO[user.role].label}</Badge>
            </span>
          </div>
          <div className="grid gap-2">
            <span className="text-muted-foreground">Access</span>
            <ul className="grid gap-1.5">
              {PERMISSIONS.map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <Badge variant={can(user, p) ? "default" : "outline"}>
                    {can(user, p) ? "Yes" : "No"}
                  </Badge>
                  {PERMISSION_INFO[p].label}
                </li>
              ))}
              <li className="flex items-center gap-2">
                <Badge variant={can(user, "users") ? "default" : "outline"}>
                  {can(user, "users") ? "Yes" : "No"}
                </Badge>
                User accounts
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
