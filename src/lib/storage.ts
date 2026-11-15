import "server-only";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

/**
 * Neon Object Storage (S3-compatible), bucket declared in neon.ts.
 * Credentials, endpoint and region come from the AWS_* variables that `neon deploy` /
 * `neon env pull` write into .env (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY,
 * AWS_ENDPOINT_URL_S3, AWS_REGION), so the AWS SDK reads them by itself.
 * The bucket is `public_read`: anyone can view a file at its URL, only the server writes.
 */
export const MEDIA_BUCKET = process.env.MEDIA_BUCKET ?? "site-media";

let client: S3Client | null = null;

function getClient() {
  if (!process.env.AWS_ENDPOINT_URL_S3) {
    throw new Error(
      "Object storage is not configured: run `neon deploy` (or `neon env pull`) to get the AWS_* variables.",
    );
  }
  // forcePathStyle is required by Neon (path-style addressing).
  client ??= new S3Client({ forcePathStyle: true });
  return client;
}

/** Image types accepted in the media library (no SVG: it can contain scripts). */
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15 MB (before compression)

/** Public address of a file in the bucket (path-style). */
export function publicUrl(key: string) {
  const endpoint = (process.env.AWS_ENDPOINT_URL_S3 ?? "").replace(/\/$/, "");
  return `${endpoint}/${MEDIA_BUCKET}/${key}`;
}

export async function putObject(
  key: string,
  body: Uint8Array,
  contentType: string,
) {
  await getClient().send(
    new PutObjectCommand({
      Bucket: MEDIA_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
      // Each upload gets a new unique key, so the file never changes: cache it for a year.
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
}

export async function deleteObject(key: string) {
  await getClient().send(
    new DeleteObjectCommand({ Bucket: MEDIA_BUCKET, Key: key }),
  );
}
