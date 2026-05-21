import { PostStatus } from "@/generated/prisma/client";
import prisma from "@/shared/lib/prisma";
import { schedulerService } from "@/shared/services/scheduler";
import { postSelect, type PostDTO } from "@/shared/types/post.types";
import { ApiError } from "@/shared/utils/apiError";

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

    if (scheduledAt) {
      const jobId = await schedulerService.enqueuePost(
        savedPost.id,
        userId,
        scheduledAt
      );

      await prisma.post.update({
        where: {
          id: savedPost.id,
        },
        data: {
          bullJobId: jobId,
        },
      });
    }

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
    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        userId,
      },
      select: { bullJobId: true },
    });

    if (post?.bullJobId) {
      await schedulerService.cancelPost(post.bullJobId);
    }

    const result = await prisma.post.deleteMany({
      where: { id: postId, userId },
    });

    return result.count > 0;
  }

  async updatePost(
    userId: string,
    postId: string,
    content?: string,
    imageUrls?: string[],
    scheduledAt?: string
  ) {
    let oldBullJobId: string | null = null;

    if (scheduledAt !== undefined) {
      const current = await prisma.post.findFirst({
        where: { id: postId, userId },
        select: { bullJobId: true },
      });
      oldBullJobId = current?.bullJobId ?? null;
    }

    if (oldBullJobId) {
      await schedulerService.cancelPost(oldBullJobId);
    }

    const data = {
      ...(content !== undefined && { content }),
      ...(imageUrls !== undefined && { imageUrls: { set: imageUrls } }),
      ...(scheduledAt !== undefined && {
        scheduledAt: scheduledAt || null,
        status: scheduledAt ? PostStatus.SCHEDULED : PostStatus.DRAFT,
      }),
    };

    const updatedPostCount = await prisma.post.updateMany({
      where: {
        userId,
        id: postId,
        status: { in: [PostStatus.DRAFT, PostStatus.SCHEDULED] },
      },
      data,
    });

    if (updatedPostCount.count < 1) throw new ApiError(404, "Post not found");

    if (scheduledAt) {
      const newJobId = await schedulerService.enqueuePost(
        postId,
        userId,
        scheduledAt
      );
      await prisma.post.update({
        where: { id: postId },
        data: { bullJobId: newJobId },
      });
    }

    const updatedPost = await this.getAPost(postId);

    return updatedPost;
  }
}

export const postService = new PostService();
