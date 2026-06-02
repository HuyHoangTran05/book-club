import { Router } from "express";
import { authorizeRoles, protect } from "../../middlewares/authMiddleware.js";
import { downloadSummaryReport } from "./admin.controller.js";

const router = Router();

// Alias matching the API design in the PTTK document: GET /api/reports/summary
router.get("/summary", protect, authorizeRoles("admin"), downloadSummaryReport);

export default router;
