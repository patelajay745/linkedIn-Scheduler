import { requireAuth } from "@/shared/middlewares/apiAuth";
import { validateRequest } from "@/shared/middlewares/requestValidator";
import { createPostSchema } from "@/shared/validators/postRequestValidators";
import {
  createPost,
  deleteAPost,
  getAllPosts,
  getAPost,
} from "@/post/post.controller";

import { Router } from "express";

const router = Router();

router.use(requireAuth);

router.post("/", validateRequest(createPostSchema), createPost);
router.get("/", getAllPosts);
router.get("/:id", getAPost);
router.delete("/:id", deleteAPost);

export default router;
