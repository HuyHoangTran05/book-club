import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import bookRoutes from "../modules/books/book.routes.js";
import conversationRoutes from "../modules/conversations/conversation.routes.js";
import memberRoutes from "../modules/members/member.routes.js";
import ratingRoutes from "../modules/ratings/rating.routes.js";
import transactionRoutes from "../modules/transactions/transaction.routes.js";
import pointRoutes from "../modules/points/point.routes.js";
import delivererRoutes from "../modules/deliverers/deliverer.routes.js";
import adminRoutes from "../modules/admin/admin.routes.js";
import reportRoutes from "../modules/admin/report.routes.js";
import { successResponse } from "../utils/response.js";

const router = Router();

router.get("/health", (req, res) => {
  successResponse(
    res,
    {
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    "Book Club API is running",
  );
});

router.use("/auth", authRoutes);
router.use("/members", memberRoutes);
router.use("/books", bookRoutes);
router.use("/conversations", conversationRoutes);
router.use("/transactions", transactionRoutes);
router.use("/points", pointRoutes);
router.use("/deliverers", delivererRoutes);
router.use("/ratings", ratingRoutes);
router.use("/admin", adminRoutes);
router.use("/reports", reportRoutes);

export default router;
