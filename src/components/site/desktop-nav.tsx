"use client";

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

/** Main desktop navigation. "Services" opens a mega menu grouped by pillar. */
export function DesktopNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {mainNav.map((item) =>
          item.href === "/services" ? (
            <NavigationMenuItem key={item.href}>
              <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[min(56rem,90vw)] grid-cols-4 gap-6 p-6">
                  {pillars.map((pillar) => (
                    <div key={pillar.id} className="flex flex-col gap-2">
                      <NavigationMenuLink
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
          ) : (
            <NavigationMenuItem key={item.href}>
              <NavigationMenuLink
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
