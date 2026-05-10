import { storageService } from "@/shared/services/storage";
import { ApiResponse } from "@/shared/utils/apiResponse";
import { asyncHandler } from "@/shared/utils/asyncHandler";
import type { Request, Response } from "express";

export const getPresignedUrl = asyncHandler(
  async (req: Request, res: Response) => {
    const { fileName, contentType } = req.body;

    const { url, fileKey } = await storageService.generatePresignedUrl(
      fileName,
      contentType
    );

    return res.status(200).json(
      new ApiResponse(200, "presigned url is generated", {
        url,
        fileKey,
      })
    );
  }
);
