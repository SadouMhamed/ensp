import { relations } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  text,
  integer,
  jsonb,
  timestamp,
  uuid,
  index,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const postStatus = pgEnum("post_status", ["draft", "published"]);

/**
 * Media library: the FILE lives in object storage (Cloudflare R2 / S3),
 * this table only keeps its URL + metadata.
 */
export const media = pgTable(
  "media",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    url: text("url").notNull(),
    storageKey: text("storage_key").notNull().unique(), // object key inside the bucket
    filename: text("filename").notNull(),
    mimeType: text("mime_type").notNull(),
    size: integer("size").notNull(), // bytes
    width: integer("width"),
    height: integer("height"),
    altText: text("alt_text"),
    uploadedBy: text("uploaded_by").references(() => user.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("media_created_at_idx").on(t.createdAt)],
);

/** Blog posts / articles. `content` holds the Tiptap editor JSON. */
export const posts = pgTable(
  "posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    excerpt: text("excerpt"),
    content: jsonb("content"),
    coverMediaId: uuid("cover_media_id").references(() => media.id, { onDelete: "set null" }),
    status: postStatus("status").default("draft").notNull(),
    authorId: text("author_id").references(() => user.id, { onDelete: "set null" }),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [index("posts_status_published_idx").on(t.status, t.publishedAt)],
);

/**
 * Editable blocks of the public website (hero image, about banner, …).
 * The site reads by `key`, the dashboard lets admins swap the media/text.
 */
export const siteSections = pgTable("site_sections", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(), // e.g. "home_hero", "about_banner"
  title: text("title"),
  body: text("body"),
  mediaId: uuid("media_id").references(() => media.id, { onDelete: "set null" }),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(user, { fields: [posts.authorId], references: [user.id] }),
  cover: one(media, { fields: [posts.coverMediaId], references: [media.id] }),
}));

export const mediaRelations = relations(media, ({ one }) => ({
  uploader: one(user, { fields: [media.uploadedBy], references: [user.id] }),
}));

export const siteSectionsRelations = relations(siteSections, ({ one }) => ({
  media: one(media, { fields: [siteSections.mediaId], references: [media.id] }),
}));

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Media = typeof media.$inferSelect;
export type SiteSection = typeof siteSections.$inferSelect;
