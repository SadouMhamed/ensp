import type { MediaItem } from "@/server/queries/media";

/** Browser → /api/upload (one image). Returns the new media row, or throws a readable message. */
export async function uploadImage(file: File, alt = ""): Promise<MediaItem> {
  const body = new FormData();
  body.append("file", file);
  if (alt) body.append("alt", alt);

  let res: Response;
  try {
    res = await fetch("/api/upload", { method: "POST", body });
  } catch {
    throw new Error("Network error, check your connection.");
  }
  const json = (await res.json().catch(() => null)) as {
    media?: MediaItem;
    error?: string;
  } | null;
  if (!res.ok || !json?.media) throw new Error(json?.error ?? "Upload failed.");
  return json.media;
}

export const ACCEPTED_IMAGE_TYPES = "image/jpeg,image/png,image/webp";

export function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
