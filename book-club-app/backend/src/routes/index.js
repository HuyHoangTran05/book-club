import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import bookRoutes from "../modules/books/book.routes.js";
import memberRoutes from "../modules/members/member.routes.js";
import transactionRoutes from "../modules/transactions/transaction.routes.js";
import pointRoutes from "../modules/points/point.routes.js";
import delivererRoutes from "../modules/deliverers/deliverer.routes.js";
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
router.use("/transactions", transactionRoutes);
router.use("/points", pointRoutes);
router.use("/deliverers", delivererRoutes);

export default router;
