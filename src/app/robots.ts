import type { MetadataRoute } from "next";
import { allowIndexing } from "@/lib/indexing";

// Test site (default): ask every search engine to stay away.
// Real launch: set ALLOW_INDEXING=true on the host and redeploy.
export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/login", "/api"],
    },
  };
}
