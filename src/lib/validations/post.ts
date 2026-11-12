import { z } from "zod";

// Shared by the dashboard form (client) and the Server Action (server).
export const postSchema = z.object({
  title: z.string().trim().min(3, "Title is too short").max(200),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes"),
  excerpt: z.string().trim().max(500).optional(),
  content: z.unknown().optional(), // Tiptap JSON
  coverMediaId: z.uuid().nullable().optional(),
  status: z.enum(["draft", "published"]),
});

export type PostInput = z.infer<typeof postSchema>;

export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
