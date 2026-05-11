import prisma from "@/shared/lib/prisma";
import { asyncHandler } from "@/shared/utils/asyncHandler";
import type { Request, Response } from "express";
import { postService } from "./post.service";
import { ApiResponse } from "@/shared/utils/apiResponse";

export const createPost = asyncHandler(async (req: Request, res: Response) => {
  const { content, imageUrls, scheduledAt } = req.body;

  const { id } = req.session.user!;

  const savedPost = await postService.savePost(
    id,
    content,
    imageUrls,
    scheduledAt
  );

  return res.status(201).json(
    new ApiResponse(201, "Post has been scheduled", {
      id: savedPost.id,
      content: savedPost.content,
      imageUrls: savedPost.imageUrls,
      scheduledAt: savedPost.scheduledAt,
    })
  );
});
export const getAllPosts = asyncHandler(
  async (req: Request, res: Response) => {}
);
export const getAPost = asyncHandler(async (req: Request, res: Response) => {});
export const updateAPost = asyncHandler(
  async (req: Request, res: Response) => {}
);
export const DeleteAPost = asyncHandler(
  async (req: Request, res: Response) => {}
);
export const getCalendar = asyncHandler(
  async (req: Request, res: Response) => {}
);
