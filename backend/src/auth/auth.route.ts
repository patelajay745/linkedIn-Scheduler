import { Router } from "express";
import { callback, redirectToLinkedIn } from "./auth.controller";

const route = Router();

route.get("/linkedin", redirectToLinkedIn);
route.get("/linkedin/callback", callback);

export default route;
