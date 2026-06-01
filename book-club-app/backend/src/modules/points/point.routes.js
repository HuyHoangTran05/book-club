import { Router } from "express";
import { protect } from "../../middlewares/authMiddleware.js";
import { listMyPointHistory, pingPoints } from "./point.controller.js";

const router = Router();

router.get("/ping", pingPoints);
router.get("/history", protect, listMyPointHistory);

export default router;
