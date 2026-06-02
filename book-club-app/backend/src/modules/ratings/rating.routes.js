import { Router } from "express";
import { protect } from "../../middlewares/authMiddleware.js";
import {
  createRating,
  getMemberRatings,
  getMyGivenRatings,
  getMyReceivedRatings,
} from "./rating.controller.js";

const router = Router();

router.post("/", protect, createRating);
router.get("/member/:memberId", protect, getMemberRatings);
router.get("/my-received", protect, getMyReceivedRatings);
router.get("/my-given", protect, getMyGivenRatings);

export default router;
