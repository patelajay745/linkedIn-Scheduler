import { asyncHandler } from "@/shared/utils/asyncHandler";
import type { Request, Response } from "express";
import { postService } from "./post.service";
import { ApiResponse } from "@/shared/utils/apiResponse";
import { PostStatus } from "@/generated/prisma/enums";
import { ApiError } from "@/shared/utils/apiError";
import { linkedInService } from "@/shared/services/linkedin";

export const createPost = asyncHandler(async (req: Request, res: Response) => {
  const { content, imageUrls, scheduledAt } = req.body;

  console.log("reaching to controller");

  const { id } = req.session.user!;

  const savedPost = await postService.savePost(
    id,
    content,
    imageUrls,
    scheduledAt
  );

  return res.status(201).json(
    new ApiResponse(201, "Post has been added", {
      id: savedPost.id,
      content: savedPost.content,
      imageUrls: savedPost.imageUrls,
      scheduledAt: savedPost.scheduledAt,
    })
  );
});

export const getAllPosts = asyncHandler(async (req: Request, res: Response) => {
  const { status, from, to } = req.query as Record<string, string | undefined>;

  const validStatus = Object.values(PostStatus);

  if (status && !validStatus.includes(status as PostStatus)) {
    throw new ApiError(400, "Invalid status value");
  }

  const userId = req.session.user?.id;

  const posts = await postService.getAll(
    userId!,
    status as PostStatus,
    from,
    to
  );

  return res.status(200).json(
    new ApiResponse(200, "All Posts are fetched", {
      posts,
      count: posts.length,
    })
  );
});

export const getAPost = asyncHandler(async (req: Request, res: Response) => {
  const { id: PostId } = req.params as { id: string };

  const post = await postService.getAPost(PostId);

  if (!post) throw new ApiError(404, "Post not found");

  return res.status(200).json(
    new ApiResponse(200, "Post is fetched", {
      post,
    })
  );
});

export const updateAPost = asyncHandler(async (req: Request, res: Response) => {
  const { content, imageUrls, scheduledAt } = req.body;

  const { id: postId } = req.params as { id: string };

  const userID = req.session.user?.id;
  const updatedPost = await postService.updatePost(
    userID!,
    postId,
    content,
    imageUrls,
    scheduledAt
  );

  return res.status(200).json(
    new ApiResponse(200, "Post has been updated", {
      post: updatedPost,
    })
  );
});

export const deleteAPost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  const userId = req.session.user?.id;

  const deletedPost = await postService.deletePost(userId!, id);

  if (!deletedPost) throw new ApiError(404, "Invalid postId");

  return res.status(200).json(new ApiResponse(200, "Post has been deleted"));
});

export const getCalendar = asyncHandler(
  async (req: Request, res: Response) => {}
);

export const publishPostNow = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: postId } = req.params as { id: string };

    const userId = req.session.user?.id;

    await linkedInService.publishPost(postId, userId!);

    return res.status(200).json(new ApiResponse(200, "Post is published"));
  }
);
