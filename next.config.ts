import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow <Image> to load uploaded media from the R2 bucket's public URL (when configured).
  images: {
    remotePatterns: process.env.R2_PUBLIC_URL
      ? [new URL(`${process.env.R2_PUBLIC_URL.replace(/\/$/, "")}/**`)]
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
