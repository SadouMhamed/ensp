"use client";

import { KeyRoundIcon, MonitorSmartphoneIcon, UserIcon } from "lucide-react";
import type { UserSessionsResult } from "@/server/actions/sessions";
import { SessionsPanel } from "@/components/dashboard/sessions/sessions-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NameForm } from "./name-form";
import { PasswordForm } from "./password-form";
import type { SettingsTab } from "./tabs";

/**
 * Settings → Name | Password | Sessions (shadcn Tabs).
 * The open tab is kept in the address (?tab=password), so a link or a reload
 * opens the same tab.
 */
export function SettingsTabs({
  initialTab,
  user,
  sessionsPromise,
}: {
  initialTab: SettingsTab;
  user: { name: string; email: string };
  sessionsPromise: Promise<UserSessionsResult>;
}) {
  function onTabChange(value: unknown) {
    const url = new URL(window.location.href);
    url.searchParams.set("tab", String(value));
    window.history.replaceState(null, "", url);
  }

  return (
    <Tabs defaultValue={initialTab} onValueChange={onTabChange}>
      <TabsList>
        <TabsTrigger value="name">
          <UserIcon />
          Name
        </TabsTrigger>
        <TabsTrigger value="password">
          <KeyRoundIcon />
          Password
        </TabsTrigger>
        <TabsTrigger value="sessions">
          <MonitorSmartphoneIcon />
          Sessions
        </TabsTrigger>
      </TabsList>

      <TabsContent value="name">
        <NameForm currentName={user.name} email={user.email} />
      </TabsContent>

      <TabsContent value="password">
        <PasswordForm />
      </TabsContent>

      <TabsContent value="sessions">
        <Card>
          <CardHeader>
            <CardTitle>Sessions</CardTitle>
            <CardDescription>
              Every device where you are signed in. Don&apos;t recognise one?
              Revoke it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SessionsPanel
              target={{ kind: "me" }}
              sessionsPromise={sessionsPromise}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
