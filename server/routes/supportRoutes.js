import express from "express";
import { createSupportMessage, createSupportMessageValidators, getMySupportMessages } from "../controllers/supportController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/messages", createSupportMessageValidators, createSupportMessage);
router.get("/messages/me", authenticate, getMySupportMessages);

export default router;
