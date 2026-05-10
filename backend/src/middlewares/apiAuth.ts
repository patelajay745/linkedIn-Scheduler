import { ApiError } from "@/utils/apiError";
import { asyncHandler } from "@/utils/asyncHandler";
import type { NextFunction, Request, Response } from "express";

export const requireAuth = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    if (req.session.user) {
      next();
    } else {
      throw new ApiError(401, "Unauthenticated request");
    }
  }
);
