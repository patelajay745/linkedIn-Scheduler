import z from "zod";

export const presignRequestValidator = z.object({
  fileName: z.string().min(1, { error: "filename is required" }),
  contentType: z
    .string()
    .min(1, { error: "contentType is required" })
    .startsWith("image/"),
});
