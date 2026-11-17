import { NextResponse } from "next/server";
import sharp, { type OutputInfo } from "sharp";
import { db } from "@/db";
import { media } from "@/db/schema";
import { getCurrentUser } from "@/lib/dal";
import { can } from "@/lib/permissions";
import {
  ALLOWED_MIME_TYPES,
  MAX_UPLOAD_BYTES,
  publicUrl,
  putObject,
} from "@/lib/storage";

/**
 * Upload one image to the media library (multipart form, field "file", optional "alt").
 * The server compresses it (max 2400 px wide, WebP), strips hidden camera data (EXIF/GPS),
 * stores it in Neon Object Storage and saves a row in the `media` table.
 */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  if (!can(user, "media"))
    return NextResponse.json(
      { error: "You don't have access to the media library." },
      { status: 403 },
    );

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File))
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  if (!(ALLOWED_MIME_TYPES as readonly string[]).includes(file.type))
    return NextResponse.json(
      { error: "Only JPG, PNG and WebP images are accepted." },
      { status: 400 },
    );
  if (file.size > MAX_UPLOAD_BYTES)
    return NextResponse.json(
      { error: "The image is too large (15 MB maximum)." },
      { status: 400 },
    );

  const alt = String(form.get("alt") ?? "").slice(0, 300);

  let output: { data: Buffer; info: OutputInfo };
  try {
    output = await sharp(Buffer.from(await file.arrayBuffer()))
      .rotate() // apply the camera orientation before the metadata is removed
      .resize({ width: 2400, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer({ resolveWithObject: true });
  } catch {
    return NextResponse.json(
      { error: "This file could not be read as an image." },
      { status: 400 },
    );
  }

  const baseName =
    file.name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "image";
  const key = `uploads/${crypto.randomUUID()}-${baseName}.webp`;

  try {
    await putObject(key, output.data, "image/webp");
  } catch (error) {
    console.error("Upload to object storage failed", error);
    return NextResponse.json(
      { error: "The image could not be stored. Try again." },
      { status: 502 },
    );
  }

  const [row] = await db
    .insert(media)
    .values({
      url: publicUrl(key),
      storageKey: key,
      filename: `${baseName}.webp`,
      mimeType: "image/webp",
      size: output.info.size,
      width: output.info.width,
      height: output.info.height,
      altText: alt || null,
      uploadedBy: user.id,
    })
    .returning();

  return NextResponse.json({ media: row });
}
