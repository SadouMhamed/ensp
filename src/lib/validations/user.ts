import { z } from "zod";
import { PERMISSIONS, ROLES } from "@/lib/permissions";

const access = {
  role: z.enum(ROLES),
  permissions: z.array(z.enum(PERMISSIONS)),
};

// Shared by the "Add user" dialog (client) and the Server Action (server).
export const createUserSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(100),
  email: z.email("Enter a valid email").trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long"),
  ...access,
});

export const updateAccessSchema = z.object({
  userId: z.string().min(1),
  ...access,
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateAccessInput = z.infer<typeof updateAccessSchema>;
