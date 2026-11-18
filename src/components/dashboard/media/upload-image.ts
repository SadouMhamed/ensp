import type { MediaItem } from "@/server/queries/media";

/**
 * Vercel refuses request bodies over 4.5 MB, before our code runs.
 * Photos above this size are shrunk in the browser first (the server
 * resizes to 2400 px anyway, so nothing visible is lost).
 */
const SAFE_UPLOAD_BYTES = 3.5 * 1024 * 1024;
const MAX_SERVER_BYTES = 4.4 * 1024 * 1024;
const MAX_WIDTH = 2400;

/** Browser → /api/upload (one image). Returns the new media row, or throws a readable message. */
export async function uploadImage(file: File, alt = ""): Promise<MediaItem> {
  const toSend = await shrinkIfNeeded(file);
  if (toSend.size > MAX_SERVER_BYTES)
    throw new Error("The image is too large. Try a smaller photo.");

  const body = new FormData();
  body.append("file", toSend);
  if (alt) body.append("alt", alt);

  let res: Response;
  try {
    res = await fetch("/api/upload", { method: "POST", body });
  } catch {
    throw new Error("Network error, check your connection.");
  }
  if (res.status === 413)
    throw new Error("The image is too large. Try a smaller photo.");
  const json = (await res.json().catch(() => null)) as {
    media?: MediaItem;
    error?: string;
  } | null;
  if (!res.ok || !json?.media) throw new Error(json?.error ?? "Upload failed.");
  return json.media;
}

/** Resize + re-encode a big photo in the browser. Small files are sent as they are. */
async function shrinkIfNeeded(file: File): Promise<File> {
  if (file.size <= SAFE_UPLOAD_BYTES) return file;

  let bitmap: ImageBitmap;
  try {
    // "from-image" applies the camera rotation (EXIF) so the photo stays upright.
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return file; // let the server give its usual error message
  }

  const scale = Math.min(1, MAX_WIDTH / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
  for (const quality of [0.9, 0.8, 0.7, 0.6]) {
    // WebP keeps transparency; browsers that can't make WebP fall back to JPEG.
    let blob = await toBlob(canvas, "image/webp", quality);
    if (!blob || blob.type !== "image/webp")
      blob = await toBlob(canvas, "image/jpeg", quality);
    if (!blob) return file;
    if (blob.size <= SAFE_UPLOAD_BYTES || quality === 0.6) {
      const ext = blob.type === "image/webp" ? "webp" : "jpg";
      return new File([blob], `${baseName}.${ext}`, { type: blob.type });
    }
  }
  return file;
}

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, type, quality),
  );
}

export const ACCEPTED_IMAGE_TYPES = "image/jpeg,image/png,image/webp";

export function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
