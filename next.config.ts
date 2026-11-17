import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow <Image> to load photos uploaded to Neon Object Storage (bucket "site-media").
  // AWS_ENDPOINT_URL_S3 comes from `neon deploy` / `neon env pull`.
  images: {
    remotePatterns: process.env.AWS_ENDPOINT_URL_S3
      ? [
          new URL(
            `${process.env.AWS_ENDPOINT_URL_S3.replace(/\/$/, "")}/${process.env.MEDIA_BUCKET ?? "site-media"}/**`,
          ),
        ]
      : [],
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
