import type { Metadata } from "next";

export const metadata: Metadata = { title: "Blog & articles" };

export default function Page() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Blog & articles</h1>
      <p className="text-muted-foreground">Table of all posts with edit / delete actions.</p>
    </div>
  );
}
