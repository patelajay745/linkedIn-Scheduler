import { requireAuth } from "@/shared/middlewares/apiAuth";
import { validateRequest } from "@/shared/middlewares/requestValidator";
import { presignRequestValidator } from "@/shared/validators/presignRequestValidator";
import { Router } from "express";
import { getPresignedUrl } from "./upload.controller";

const router = Router();

router.use(requireAuth);

router.post(
  "/presign",
  validateRequest(presignRequestValidator),
  getPresignedUrl
);

export default router;
