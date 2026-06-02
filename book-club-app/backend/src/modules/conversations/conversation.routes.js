import { Router } from "express";
import { protect } from "../../middlewares/authMiddleware.js";
import {
  createOrGetConversation,
  listMessages,
  listMyConversations,
  sendMessage,
} from "./conversation.controller.js";

const router = Router();

router.get("/", protect, listMyConversations);
router.post("/:userId", protect, createOrGetConversation);
router.get("/:conversationId/messages", protect, listMessages);
router.post("/:conversationId/messages", protect, sendMessage);

export default router;
