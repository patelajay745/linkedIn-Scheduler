import z from "zod";

export const createPostSchema = z.object({
  content: z.string().min(1, { error: "content is required" }),
  imageUrls: z.array(z.url()).max(20).optional(),
  scheduledAt: z.iso.datetime().optional(),
});

export const updatePostSchema = z
  .object({
    content: z.string().min(1).optional(),
    imageUrls: z.array(z.url()).max(20).optional(),
    scheduledAt: z.iso.datetime().optional(),
  })
  .refine(
    ({ content, imageUrls, scheduledAt }) =>
      content !== undefined ||
      imageUrls !== undefined ||
      scheduledAt !== undefined,
    { message: "One of the fields must be defined" }
  );
