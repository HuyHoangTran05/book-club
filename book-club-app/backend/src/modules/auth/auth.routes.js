import { Router } from "express";
import {
  getMe,
  login,
  pingAuth,
  register,
} from "./auth.controller.js";
import { protect } from "../../middlewares/authMiddleware.js";

const router = Router();

router.get("/ping", pingAuth);
router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);

export default router;
