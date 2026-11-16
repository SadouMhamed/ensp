/**
 * Can search engines (Google, Bing…) list this site?
 * Off by default so the online test site stays out of search results.
 * Turn on for the real launch: ALLOW_INDEXING=true, then redeploy (read at build time).
 */
export const allowIndexing = process.env.ALLOW_INDEXING === "true";
