import { Router } from "express";
import {
  callback,
  getUserProfile,
  redirectToLinkedIn,
} from "./auth.controller";
import { requireAuth } from "@/shared/middlewares/apiAuth";

const router = Router();

router.get("/linkedin", redirectToLinkedIn);
router.get("/linkedin/callback", callback);

router.get("/me", requireAuth, getUserProfile);

export default router;
