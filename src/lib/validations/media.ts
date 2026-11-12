import { z } from "zod";

export const uploadRequestSchema = z.object({
  filename: z.string().min(1).max(255),
  contentType: z.string().min(1),
  size: z.number().int().positive(),
});

export type UploadRequest = z.infer<typeof uploadRequestSchema>;
