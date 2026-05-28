import { Router } from "express";
import { pingTransactions } from "./transaction.controller.js";

const router = Router();

router.get("/ping", pingTransactions);

export default router;
