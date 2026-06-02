import { Router } from "express";
import { protect } from "../../middlewares/authMiddleware.js";
import {
  getMyDelivererProfile,
  listDeliverers,
  pingDeliverers,
  registerDeliverer,
  updateMyDelivererProfile,
} from "./deliverer.controller.js";

const router = Router();

router.get("/ping", pingDeliverers);
router.get("/", protect, listDeliverers);
router.post("/register", protect, registerDeliverer);
router.get("/me", protect, getMyDelivererProfile);
router.put("/me", protect, updateMyDelivererProfile);

export default router;
