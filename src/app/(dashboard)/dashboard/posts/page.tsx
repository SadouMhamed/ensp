import type { Metadata } from "next";
import { requirePermission } from "@/lib/dal";

export const metadata: Metadata = { title: "Articles" };

export default async function Page() {
  await requirePermission("posts"); // server-side access check
  return (
    <div className="space-y-2 px-4 lg:px-6">
      <h1 className="text-2xl font-semibold">Articles</h1>
      <p className="text-muted-foreground">Table of all posts with edit / delete actions.</p>
    </div>
  );
}
