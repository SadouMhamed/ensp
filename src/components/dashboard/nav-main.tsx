"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CirclePlusIcon,
  FileTextIcon,
  ImageIcon,
  LayoutDashboardIcon,
  PanelsTopLeftIcon,
  UsersIcon,
} from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export type NavAccess = { posts: boolean; media: boolean; sections: boolean; users: boolean };

const NAV_ITEMS: {
  title: string;
  url: string;
  icon: React.ReactNode;
  requires?: keyof NavAccess;
}[] = [
  { title: "Overview", url: "/dashboard", icon: <LayoutDashboardIcon /> },
  { title: "Articles", url: "/dashboard/posts", icon: <FileTextIcon />, requires: "posts" },
  { title: "Media library", url: "/dashboard/media", icon: <ImageIcon />, requires: "media" },
  { title: "Website sections", url: "/dashboard/sections", icon: <PanelsTopLeftIcon />, requires: "sections" },
  { title: "Users", url: "/dashboard/users", icon: <UsersIcon />, requires: "users" },
];

/** Shows only what the signed-in user may open (pages still check access on the server). */
export function NavMain({ access }: { access: NavAccess }) {
  const pathname = usePathname();
  const items = NAV_ITEMS.filter((item) => !item.requires || access[item.requires]);

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {access.posts ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="New article"
                render={<Link href="/dashboard/posts/new" />}
                className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
              >
                <CirclePlusIcon />
                <span>New article</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : null}
        <SidebarMenu>
          {items.map((item) => {
            const active =
              item.url === "/dashboard" ? pathname === item.url : pathname.startsWith(item.url);
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={active}
                  render={<Link href={item.url} />}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
