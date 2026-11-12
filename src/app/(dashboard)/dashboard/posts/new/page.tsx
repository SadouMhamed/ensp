import type { Metadata } from "next";

export const metadata: Metadata = { title: "New article" };

export default function Page() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">New article</h1>
      <p className="text-muted-foreground">Tiptap editor + title, slug, cover image and status.</p>
    </div>
  );
}
