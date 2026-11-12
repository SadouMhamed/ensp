import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings" };

export default function Page() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="text-muted-foreground">Edit website sections (hero, banners) and manage users.</p>
    </div>
  );
}
