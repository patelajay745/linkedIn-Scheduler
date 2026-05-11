import { PostStatus } from "@/generated/prisma/client";
import prisma from "@/shared/lib/prisma";
import { postSelect, type PostDTO } from "@/shared/types/post.types";

class PostService {
  async savePost(
    userId: string,
    content: string,
    imageUrls?: string[],
    scheduledAt?: string
  ): Promise<PostDTO> {
    const savedPost = await prisma.post.create({
      data: {
        userId: userId,
        content,
        imageUrls: imageUrls ?? [],
        scheduledAt,
        status: scheduledAt ? PostStatus.SCHEDULED : PostStatus.DRAFT,
      },
      select: postSelect,
    });

    return savedPost;
  }

  async getAll(
    userId: string,
    status?: PostStatus,
    from?: string,
    to?: string
  ): Promise<PostDTO[]> {
    const posts = await prisma.post.findMany({
      where: {
        userId,
        ...(status && { status }),
        ...(from &&
          to && {
            scheduledAt: { gte: new Date(from), lte: new Date(to) },
          }),
      },
      select: postSelect,
    });
    return posts;
  }

  async getAPost(postId: string): Promise<PostDTO | null> {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: postSelect,
    });

    return post;
  }

  async deletePost(userId: string, postId: string) {
    const result = await prisma.post.deleteMany({
      where: { id: postId, userId },
    });

    return result.count > 0;
  }
}

export const postService = new PostService();
