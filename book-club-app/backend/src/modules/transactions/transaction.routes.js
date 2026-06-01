import { Router } from "express";
import { protect } from "../../middlewares/authMiddleware.js";
import {
  cancelTransaction,
  confirmTransaction,
  createTransaction,
  getMyTransactions,
  getTransactionById,
  pingTransactions,
} from "./transaction.controller.js";

const router = Router();

router.get("/ping", pingTransactions);
router.post("/", protect, createTransaction);
router.get("/my", protect, getMyTransactions);
router.get("/:transactionId", protect, getTransactionById);
router.put("/:transactionId/confirm", protect, confirmTransaction);
router.put("/:transactionId/cancel", protect, cancelTransaction);

export default router;
