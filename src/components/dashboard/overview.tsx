import Link from "next/link";
import {
  ArrowRightIcon,
  ExternalLinkIcon,
  FileCheckIcon,
  FilePenLineIcon,
  ImageIcon,
  ImageUpIcon,
  LayoutTemplateIcon,
  PenLineIcon,
  UsersIcon,
} from "lucide-react";
import { requireUser } from "@/lib/dal";
import { can } from "@/lib/permissions";
import { SECTIONS, SECTION_KEYS } from "@/lib/validations/sections";
import { getDashboardStats, getDraftsToFinish } from "@/server/queries/dashboard";
import { getSectionStatuses } from "@/server/queries/sections";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Overview page blocks. Each one is a server component that checks the user's
// access itself, so the page can stream them in separately (each inside <Suspense>).

const todayFormat = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Africa/Algiers",
});

const shortDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  timeZone: "Africa/Algiers",
});

/** "Bonjour, Walid" + today's date. */
export async function Greeting() {
  const user = await requireUser();
  const firstName = user.name.trim().split(/\s+/)[0] || user.name;
  const today = todayFormat.format(new Date());

  return (
    <div>
      <h1 className="text-2xl font-semibold">Bonjour, {firstName}</h1>
      <p className="mt-1 text-sm text-muted-foreground first-letter:uppercase">
        {today}
      </p>
    </div>
  );
}

/** Shortcuts to the things done most often. Only shows what the user is allowed to do. */
export async function QuickActions() {
  const user = await requireUser();
  const actions = [
    can(user, "posts") && { href: "/dashboard/posts/new", label: "New article", icon: PenLineIcon },
    can(user, "media") && { href: "/dashboard/media", label: "Upload a photo", icon: ImageUpIcon },
    can(user, "sections") && { href: "/dashboard/sections", label: "Edit website sections", icon: LayoutTemplateIcon },
  ].filter((a) => a !== false);

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((a) => (
        <Link key={a.href} href={a.href} className={buttonVariants({ variant: "outline" })}>
          <a.icon data-icon="inline-start" />
          {a.label}
        </Link>
      ))}
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants({ variant: "outline" })}
      >
        <ExternalLinkIcon data-icon="inline-start" />
        View the website
      </a>
    </div>
  );
}

/** 3–4 small cards with real counts from the database. */
export async function OverviewStats() {
  const user = await requireUser();
  const stats = await getDashboardStats();

  const cards = [
    {
      label: "Published articles",
      value: stats.publishedPosts,
      icon: FileCheckIcon,
      sub: `${stats.publishedThisMonth} this month`,
    },
    {
      label: "Drafts",
      value: stats.draftPosts,
      icon: FilePenLineIcon,
      sub: "Not visible on the website yet",
    },
    {
      label: "Photos",
      value: stats.mediaFiles,
      icon: ImageIcon,
      sub: "In the media library",
    },
    // Only admins manage accounts, so only they see this number.
    ...(can(user, "users")
      ? [{ label: "Users", value: stats.users, icon: UsersIcon, sub: "Dashboard accounts" }]
      : []),
  ];

  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} className="gap-2 py-5">
          <CardHeader className="px-5">
            <CardDescription>{card.label}</CardDescription>
            <CardTitle className="text-3xl font-semibold tabular-nums">
              {card.value.toLocaleString("fr-FR")}
            </CardTitle>
            <CardAction>
              <card.icon className="size-5 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardFooter className="px-5 text-xs text-muted-foreground">{card.sub}</CardFooter>
        </Card>
      ))}
    </div>
  );
}

/** Draft articles that still need to be finished and published. */
export async function DraftsToFinish() {
  const user = await requireUser();
  if (!can(user, "posts")) return null;
  const drafts = await getDraftsToFinish(5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Drafts to finish</CardTitle>
        <CardDescription>Articles saved but not published yet.</CardDescription>
        <CardAction>
          <Link href="/dashboard/posts" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            All articles
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        {drafts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No drafts. Everything is published. 🎉
          </p>
        ) : (
          <ul className="divide-y">
            {drafts.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{d.title || "Untitled"}</p>
                  <p className="text-xs text-muted-foreground">
                    Last edited {shortDate.format(d.updatedAt)}
                  </p>
                </div>
                <Link
                  href={`/dashboard/posts/${d.id}`}
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Edit
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

/** Which home-page sections the public can see right now. */
export async function SectionsStatus() {
  const user = await requireUser();
  if (!can(user, "sections")) return null;
  const statuses = await getSectionStatuses();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Website sections</CardTitle>
        <CardDescription>What visitors see on the website right now.</CardDescription>
        <CardAction>
          <Link href="/dashboard/sections" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            All sections
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ul className="divide-y">
          {SECTION_KEYS.map((key) => {
            const def = SECTIONS[key];
            // Same rule as the website: a section that can't be hidden is always shown.
            const visible = def.hideable ? (statuses.get(key)?.visible ?? true) : true;
            return (
              <li key={key} className="flex items-center justify-between gap-3 py-2.5">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="truncate text-sm font-medium">{def.title}</span>
                  {visible ? (
                    <Badge variant="secondary">Visible</Badge>
                  ) : (
                    <Badge variant="outline">Hidden</Badge>
                  )}
                </div>
                <Link
                  href={`/dashboard/sections/${def.slug}`}
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Edit
                </Link>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
