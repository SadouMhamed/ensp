import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { siteSections } from "@/db/schema";
import {
  SECTIONS,
  type SectionContent,
  type SectionKey,
} from "@/lib/validations/sections";

export type SectionState<K extends SectionKey> = {
  visible: boolean;
  content: SectionContent<K>;
  /** false = never edited: the original content (site.ts) is shown */
  saved: boolean;
  updatedAt: Date | null;
};

async function readSection<K extends SectionKey>(
  key: K,
): Promise<SectionState<K>> {
  const def = SECTIONS[key];
  const defaults = def.defaults as SectionContent<K>;
  const row = await db.query.siteSections.findFirst({
    where: eq(siteSections.key, key),
  });
  if (!row)
    return { visible: true, content: defaults, saved: false, updatedAt: null };

  const parsed = def.schema.safeParse(row.data);
  return {
    visible: def.hideable ? row.visible : true,
    // Invalid or empty saved content → fall back to the original so the site never breaks.
    content: parsed.success ? (parsed.data as SectionContent<K>) : defaults,
    saved: parsed.success,
    updatedAt: row.updatedAt,
  };
}

/** Website: cached, refreshed when the dashboard saves (updateTag("section:<key>")). */
export async function getSection<K extends SectionKey>(key: K) {
  "use cache";
  cacheTag(`section:${key}`);
  cacheLife("days");
  return readSection(key);
}

/** Dashboard editor: always fresh. */
export async function getSectionForEdit<K extends SectionKey>(key: K) {
  return readSection(key);
}

/** Dashboard list: which sections were edited / hidden. */
export async function getSectionStatuses() {
  const rows = await db
    .select({
      key: siteSections.key,
      visible: siteSections.visible,
      updatedAt: siteSections.updatedAt,
    })
    .from(siteSections);
  return new Map(rows.map((r) => [r.key, r]));
}
