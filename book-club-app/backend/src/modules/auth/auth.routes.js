import { Router } from "express";
import { pingAuth } from "./auth.controller.js";

const router = Router();

router.get("/ping", pingAuth);

export default router;
