import express from "express";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware.js";
import {
  createReservedSlot,
  getReservedSlots,
  deleteReservedSlot,
  updateReservedSlot,
} from "../controllers/reservedSlotController.js";

const router = express.Router();

// Create a reserved slot (admin only)
router.post("/", authenticate, authorizeAdmin, createReservedSlot);

// Get reserved slots (admin can see all, with optional filters)
router.get("/", authenticate, authorizeAdmin, getReservedSlots);

// Delete a reserved slot (admin only)
router.delete("/:id", authenticate, authorizeAdmin, deleteReservedSlot);

// Update a reserved slot (admin only)
router.put("/:id", authenticate, authorizeAdmin, updateReservedSlot);

export default router;
