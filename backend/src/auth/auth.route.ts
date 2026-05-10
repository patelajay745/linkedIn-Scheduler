import { Router } from "express";
import {
  callback,
  getUserProfile,
  redirectToLinkedIn,
} from "./auth.controller";
import { requireAuth } from "@/middlewares/apiAuth";

const route = Router();

route.get("/linkedin", redirectToLinkedIn);
route.get("/linkedin/callback", callback);

route.get("/me", requireAuth, getUserProfile);

export default route;
