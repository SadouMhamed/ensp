"use client";

import { useState } from "react";
import Link from "next/link";
import { LogInIcon, MenuIcon } from "lucide-react";
import { BRAND_NAME } from "@/components/brand/logo";
import { mainNav, pillars, topLinks } from "@/content/site";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/** Slide-in menu for phones and tablets. Closes after a link is tapped. */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon-lg" />}>
        <MenuIcon />
        <span className="sr-only">Ouvrir le menu</span>
      </SheetTrigger>
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{BRAND_NAME}</SheetTitle>
          <SheetDescription className="sr-only">
            Navigation du site
          </SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4 pb-6">
          {mainNav.map((item) => (
            <div key={item.href} className="flex flex-col">
              <Link
                href={item.href}
                onClick={close}
                className="py-2 text-lg font-light hover:text-primary"
              >
                {item.title}
              </Link>
              {/* service groups listed right under "Services" */}
              {item.href === "/services" ? (
                <div className="mb-2 flex flex-col gap-1 border-l-2 border-primary py-1 pl-4">
                  {pillars.map((p) => (
                    <Link
                      key={p.id}
                      href={`/services#${p.id}`}
                      onClick={close}
                      className="py-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                      {p.title}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
          <Separator className="my-4" />
          {/* utility links not already in the main menu (avoids "Careers" twice) */}
          {topLinks
            .filter((l) => !mainNav.some((m) => m.href === l.href))
            .map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={close}
                className="py-1.5 text-sm"
              >
                {l.title}
              </Link>
            ))}
          <Link
            href="/login"
            onClick={close}
            className="inline-flex items-center gap-2 py-1.5 text-sm"
          >
            <LogInIcon className="size-4" aria-hidden />
            Espace personnel
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
