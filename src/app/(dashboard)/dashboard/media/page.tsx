import type { Metadata } from "next";

export const metadata: Metadata = { title: "Media library" };

export default function Page() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Media library</h1>
      <p className="text-muted-foreground">Upload, replace and delete images, videos and files.</p>
    </div>
  );
}
