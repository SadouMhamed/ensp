"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { mainNav, pillars, services } from "@/content/site";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

/**
 * Main desktop navigation. "Services" opens a mega menu grouped by pillar;
 * items with `children` (e.g. "Notre Groupe") open a simple dropdown.
 */
export function DesktopNav() {
  // Which dropdown is open (null = none). Reset when a link is clicked, so the
  // dropdown closes after moving to the new page.
  const [open, setOpen] = useState<string | null>(null);
  const close = () => setOpen(null);

  return (
    <NavigationMenu
      value={open}
      onValueChange={(value) => setOpen((value as string | null) ?? null)}
    >
      <NavigationMenuList>
        {mainNav.map((item) =>
          item.href === "/services" ? (
            <NavigationMenuItem key={item.href} value={item.href}>
              <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[min(56rem,90vw)] grid-cols-4 gap-6 p-6">
                  {pillars.map((pillar) => (
                    <div key={pillar.id} className="flex flex-col gap-2">
                      <NavigationMenuLink
                        onClick={close}
                        render={<Link href={`/services#${pillar.id}`} />}
                        className="font-semibold"
                      >
                        {pillar.title}
                      </NavigationMenuLink>
                      <ul className="flex flex-col">
                        {services
                          .filter((s) => s.pillar === pillar.id)
                          .map((s) => (
                            <li key={s.id}>
                              <NavigationMenuLink
                                onClick={close}
                                render={<Link href={`/services#${s.id}`} />}
                                className="text-muted-foreground"
                              >
                                {s.title}
                              </NavigationMenuLink>
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))}
                  <div className="col-span-4 border-t pt-4">
                    <NavigationMenuLink
                      onClick={close}
                      render={<Link href="/services" />}
                      className="w-fit"
                    >
                      Tous les services
                      <ArrowRightIcon aria-hidden />
                    </NavigationMenuLink>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : item.children?.length ? (
            // Simple dropdown (e.g. « Notre Groupe »)
            <NavigationMenuItem key={item.href} value={item.href}>
              <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="flex w-64 flex-col p-2">
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <NavigationMenuLink
                        onClick={close}
                        render={<Link href={child.href} />}
                        className={
                          child.href === item.href ? "font-semibold" : undefined
                        }
                      >
                        {child.title}
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem key={item.href} value={item.href}>
              <NavigationMenuLink
                onClick={close}
                render={<Link href={item.href} />}
                className={navigationMenuTriggerStyle()}
              >
                {item.title}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ),
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
