import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/dal";
import { ALLOWED_MIME_TYPES, MAX_UPLOAD_BYTES, createUploadUrl, publicUrl } from "@/lib/storage";
import { uploadRequestSchema } from "@/lib/validations/media";

/**
 * Step 1 of an upload: the dashboard asks for a signed URL,
 * then PUTs the file directly to R2, then saves the metadata (media table).
 */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = uploadRequestSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const { filename, contentType, size } = parsed.data;
  if (!(ALLOWED_MIME_TYPES as readonly string[]).includes(contentType)) {
    return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
  }
  if (size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "File too large" }, { status: 400 });
  }

  const safeName = filename.toLowerCase().replace(/[^a-z0-9.\-_]/g, "-");
  const key = `uploads/${crypto.randomUUID()}-${safeName}`;
  const uploadUrl = await createUploadUrl(key, contentType);

  return NextResponse.json({ uploadUrl, key, url: publicUrl(key) });
}
