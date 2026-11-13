import type { Metadata } from "next";
import { requirePermission } from "@/lib/dal";

export const metadata: Metadata = { title: "Website sections" };

export default async function Page() {
  await requirePermission("sections"); // server-side access check
  return (
    <div className="space-y-2 px-4 lg:px-6">
      <h1 className="text-2xl font-semibold">Website sections</h1>
      <p className="text-muted-foreground">Edit the texts and images of the website (hero, banners…).</p>
    </div>
  );
}
