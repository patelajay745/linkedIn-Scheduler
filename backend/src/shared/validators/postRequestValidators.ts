import z from "zod";

export const createPost = z.object({
  content: z.string().min(1, { error: "content is required" }),
  imageUrls: z.array(z.string()).max(20).optional(),
  scheduledAt: z.iso.datetime().optional(),
});
