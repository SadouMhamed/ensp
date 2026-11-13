"use client";

import * as React from "react";
import Link from "next/link";
import { ExternalLinkIcon, Settings2Icon } from "lucide-react";

import { BRAND_NAME, Logo } from "@/components/brand/logo";
import { NavSecondary } from "@/components/dashboard/nav-secondary";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navSecondary = [
  { title: "Settings", url: "/dashboard/settings", icon: <Settings2Icon /> },
  { title: "View website", url: "/", icon: <ExternalLinkIcon />, external: true },
];

export function AppSidebar({
  nav,
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  /** Server-rendered main nav, filtered by the user's access (streams in behind Suspense). */
  nav?: React.ReactNode;
  /** Server-rendered user menu (streams in behind Suspense). */
  user?: React.ReactNode;
}) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<Link href="/dashboard" />}
            >
              <Logo size={24} className="size-6!" />
              <span className="text-base font-semibold">{BRAND_NAME}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {nav}
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>{user}</SidebarFooter>
    </Sidebar>
  );
}
