import { Router } from "express";
import { protect } from "../../middlewares/authMiddleware.js";
import { getMe, login, pingAuth, register } from "./auth.controller.js";

const router = Router();

router.get("/ping", pingAuth);
router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);

export default router;
