import type { Metadata } from "next";
import { requirePermission } from "@/lib/dal";

export const metadata: Metadata = { title: "Media library" };

export default async function Page() {
  await requirePermission("media"); // server-side access check
  return (
    <div className="space-y-2 px-4 lg:px-6">
      <h1 className="text-2xl font-semibold">Media library</h1>
      <p className="text-muted-foreground">Upload, replace and delete images, videos and files.</p>
    </div>
  );
}
