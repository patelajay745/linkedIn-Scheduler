import prisma from "@/shared/lib/prisma";

class PostService {
  async savePost(
    userId: string,
    content: string,
    imageUrls: string,
    scheduledAt: string
  ) {
    const savedPost = await prisma.post.create({
      data: {
        userId: userId,
        content,
        imageUrls,
        scheduledAt,
      },
    });

    return savedPost;
  }
}

export const postService = new PostService();
