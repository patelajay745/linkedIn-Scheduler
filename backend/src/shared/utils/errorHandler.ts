import type { NextFunction, Request, Response } from "express";
import { ApiError } from "./apiError";
import { ZodError } from "zod";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    next(new ApiError(400, err.issues[0]?.message));
  } else if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      message: err.message,
      errors: err.errors,
      timeStamp: Date.now(),
    });
  } else {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
      timeStamp: Date.now(),
    });
  }
};
