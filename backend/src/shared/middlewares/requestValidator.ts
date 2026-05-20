import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { ApiError } from "../utils/apiError";

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);

      console.log("reaching to validator");
      next();
    } catch (error) {
      const e = error as Error;
      next(new ApiError(400, e.message));
    }
  };
};
