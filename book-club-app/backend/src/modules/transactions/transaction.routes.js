import { Router } from "express";
import { protect } from "../../middlewares/authMiddleware.js";
import {
  cancelTransaction,
  confirmTransaction,
  createTransaction,
<<<<<<< HEAD
  getMyTransactions,
  getTransactionById,
=======
  getTransactionById,
  listMyTransactions,
>>>>>>> 08c52326dfdb42b658154d43585d6f425946d3f2
  pingTransactions,
} from "./transaction.controller.js";

const router = Router();

router.get("/ping", pingTransactions);
router.post("/", protect, createTransaction);
<<<<<<< HEAD
router.get("/my", protect, getMyTransactions);
=======
router.get("/my", protect, listMyTransactions);
>>>>>>> 08c52326dfdb42b658154d43585d6f425946d3f2
router.get("/:transactionId", protect, getTransactionById);
router.put("/:transactionId/confirm", protect, confirmTransaction);
router.put("/:transactionId/cancel", protect, cancelTransaction);

export default router;
