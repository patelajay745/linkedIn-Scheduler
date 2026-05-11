import { PostStatus } from "@/generated/prisma/enums";
import prisma from "@/shared/lib/prisma";

class PostService {
  async savePost(
    userId: string,
    content: string,
    imageUrls?: string[],
    scheduledAt?: string
  ) {
    const savedPost = await prisma.post.create({
      data: {
        userId: userId,
        content,
        imageUrls: imageUrls ?? [],
        scheduledAt,
        status: scheduledAt ? PostStatus.SCHEDULED : PostStatus.DRAFT,
      },
    });

    return savedPost;
  }

  async getAll(
    userId: string,
    status?: PostStatus,
    from?: string,
    to?: string
  ) {
    const posts = await prisma.post.findMany({
      where: {
        userId,
        ...(status && { status }),
        ...(from &&
          to && {
            scheduledAt: { gte: new Date(from), lte: new Date(to) },
          }),
      },
      select: {
        id: true,
        content: true,
        imageUrls: true,
        status: true,
        scheduledAt: true,
        publishedAt: true,
        createdAt: true,
      },
    });
    return posts;
  }
}

export const postService = new PostService();
