import { z } from "zod";

export const createPostSchema = z.object({
  content: z
    .string()
    .min(1, { error: "Content is required" })
    .max(3000, "Content cannot exceed 3000 characters"),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
