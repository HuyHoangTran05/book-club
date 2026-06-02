import { Router } from "express";
import { protect } from "../../middlewares/authMiddleware.js";
import {
  changeMyPassword,
  getMyPointHistory,
  getMyProfile,
  pingMembers,
  updateMyProfile,
} from "./member.controller.js";

const router = Router();

router.get("/ping", pingMembers);
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);
router.put("/me/password", protect, changeMyPassword);
router.get("/me/points", protect, getMyPointHistory);

export default router;
