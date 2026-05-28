import { Router } from "express";
import { pingBooks } from "./book.controller.js";

const router = Router();

router.get("/ping", pingBooks);

export default router;
