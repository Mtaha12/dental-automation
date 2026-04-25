import express from "express";
import { getDoctors, updateDoctorTimings } from "../controllers/doctorController.js";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getDoctors);
router.put("/:id/timings", authenticate, authorizeAdmin, updateDoctorTimings);

export default router;
