import type { Prisma } from "@/generated/prisma/client";

export const postSelect = {
  id: true,
  content: true,
  imageUrls: true,
  status: true,
  scheduledAt: true,
  publishedAt: true,
  createdAt: true,
} satisfies Prisma.PostSelect;

export type PostDTO = Prisma.PostGetPayload<{ select: typeof postSelect }>;
