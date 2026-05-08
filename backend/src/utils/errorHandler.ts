import type { NextFunction, Request, Response } from "express";
import { ApiError } from "./apiError";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      message: err.message,
      errors: err.errors,
      timeStamp: Date.now(),
    });
  } else {
  }
};
