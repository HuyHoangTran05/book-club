import { Router } from "express";
import { pingPoints } from "./point.controller.js";

const router = Router();

router.get("/ping", pingPoints);

export default router;
