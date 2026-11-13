import { FileCheckIcon, FilePenLineIcon, FileTextIcon, ImageIcon } from "lucide-react";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DashboardStats } from "@/server/queries/dashboard";

export function SectionCards({ stats }: { stats: DashboardStats }) {
  const cards = [
    {
      label: "Total articles",
      value: stats.totalPosts,
      icon: FileTextIcon,
      footer: "All blog posts and articles",
      sub: "Drafts and published",
    },
    {
      label: "Published",
      value: stats.publishedPosts,
      icon: FileCheckIcon,
      footer: `${stats.publishedThisMonth} published this month`,
      sub: "Visible on the website",
    },
    {
      label: "Drafts",
      value: stats.draftPosts,
      icon: FilePenLineIcon,
      footer: "Waiting to be published",
      sub: "Only visible in the dashboard",
    },
    {
      label: "Media files",
      value: stats.mediaFiles,
      icon: ImageIcon,
      footer: "Images, videos and documents",
      sub: "Stored in the media library",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {cards.map((card) => (
        <Card key={card.label} className="@container/card">
          <CardHeader>
            <CardDescription>{card.label}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {card.value.toLocaleString()}
            </CardTitle>
            <CardAction>
              <card.icon className="size-5 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 font-medium">{card.footer}</div>
            <div className="text-muted-foreground">{card.sub}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
