import type { Metadata } from "next";

export const metadata: Metadata = { title: "Overview" };

export default function Page() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Overview</h1>
      <p className="text-muted-foreground">Quick stats: posts, drafts, media files.</p>
    </div>
  );
}
