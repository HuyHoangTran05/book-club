import { Router } from "express";
import { protect } from "../../middlewares/authMiddleware.js";
import {
  createBook,
  deleteBook,
  getBookByCopyId,
  listBooks,
  listMyBooks,
  pingBooks,
  updateBook,
} from "./book.controller.js";

const router = Router();

router.get("/ping", pingBooks);
router.get("/", listBooks);
router.get("/my", protect, listMyBooks);
router.get("/:copyId", getBookByCopyId);
router.post("/", protect, createBook);
router.put("/:copyId", protect, updateBook);
router.delete("/:copyId", protect, deleteBook);

export default router;
