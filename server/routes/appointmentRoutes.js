import express from "express";
import { body } from "express-validator";
import {
  createAppointment,
  getAppointmentEvents,
  getAppointments,
  getAvailableSlots,
  getMyAppointments,
  getPatientRecords,
  getPublicAppointmentEvents,
  updateAppointmentStatus,
} from "../controllers/appointmentController.js";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/slots", getAvailableSlots);
router.get("/events", getPublicAppointmentEvents);
router.post(
  "/",
  [
    body("name").trim().notEmpty(),
    body("email").isEmail(),
    body("phone").trim().notEmpty(),
    body("service").trim().notEmpty(),
    body("doctorId").isMongoId(),
    body("date").isISO8601(),
    body("time").matches(/^([01]\d|2[0-3]):([0-5]\d)$/),
  ],
  createAppointment
);

router.get("/admin/list", authenticate, authorizeAdmin, getAppointments);
router.get("/admin/events", authenticate, authorizeAdmin, getAppointmentEvents);
router.get("/admin/records", authenticate, authorizeAdmin, getPatientRecords);
router.patch("/admin/:id/status", authenticate, authorizeAdmin, updateAppointmentStatus);
router.get("/mine/records", authenticate, getMyAppointments);

export default router;
