import { requireAuth } from "@/shared/middlewares/apiAuth";
import { validateRequest } from "@/shared/middlewares/requestValidator";
import { createPost } from "@/shared/validators/postRequestValidators";
import { createPost as genratePost } from "@/post/post.controller";

import { Router } from "express";

const router = Router();

router.use(requireAuth);

router.post("/", validateRequest(createPost), genratePost);

export default router;
