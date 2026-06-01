import { Router } from "express";
import { protect } from "../../middlewares/authMiddleware.js";
import { listDeliverers, pingDeliverers } from "./deliverer.controller.js";

const router = Router();

router.get("/ping", pingDeliverers);
router.get("/", protect, listDeliverers);

export default router;
