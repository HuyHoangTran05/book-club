import { Router } from "express";
import { authorizeRoles, protect } from "../../middlewares/authMiddleware.js";
import {
  cancelTransaction,
  deleteMember,
  forceCompleteTransaction,
  getStats,
  listMembers,
  listTransactions,
  updateMemberStatus,
} from "./admin.controller.js";

const router = Router();

// Every admin endpoint requires a valid JWT AND the "admin" role.
router.use(protect, authorizeRoles("admin"));

router.get("/stats", getStats);

router.get("/members", listMembers);
router.put("/members/:memberId/status", updateMemberStatus);
router.delete("/members/:memberId", deleteMember);

router.get("/transactions", listTransactions);
router.put("/transactions/:transactionId/cancel", cancelTransaction);
router.put("/transactions/:transactionId/force-complete", forceCompleteTransaction);

export default router;
