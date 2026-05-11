import { requireAuth } from "@/shared/middlewares/apiAuth";
import { validateRequest } from "@/shared/middlewares/requestValidator";
import { createPostSchema } from "@/shared/validators/postRequestValidators";
import { createPost, getAllPosts } from "@/post/post.controller";

import { Router } from "express";

const router = Router();

router.use(requireAuth);

router.post("/", validateRequest(createPostSchema), createPost);
router.get("/", getAllPosts);

export default router;
