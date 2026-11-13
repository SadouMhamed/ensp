import type { Metadata } from "next";
import { requirePermission } from "@/lib/dal";

export const metadata: Metadata = { title: "New article" };

export default async function Page() {
  await requirePermission("posts"); // server-side access check
  return (
    <div className="space-y-2 px-4 lg:px-6">
      <h1 className="text-2xl font-semibold">New article</h1>
      <p className="text-muted-foreground">Tiptap editor + title, slug, cover image and status.</p>
    </div>
  );
}
