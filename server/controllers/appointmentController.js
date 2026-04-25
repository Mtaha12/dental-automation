import { validationResult } from "express-validator";
import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import ReservedSlot from "../models/ReservedSlot.js";
import { buildCalendarEvent } from "../services/calendarService.js";
import { sendDoctorNotification, sendPatientConfirmation } from "../services/emailService.js";

function normalizeDate(date) {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  return day;
}

export async function createAppointment(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, phone, service, doctorId, date, time } = req.body;
  const day = normalizeDate(date);

  const existing = await Appointment.findOne({ doctorId, date: day, time });
  if (existing) {
    return res.status(409).json({ message: "Unavailable" });
  }

  // Check if slot is reserved
  const reserved = await ReservedSlot.findOne({ doctorId, date: day, time });
  if (reserved) {
    return res.status(409).json({ message: "Slot is reserved" });
  }

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    return res.status(404).json({ message: "Doctor not found" });
  }

  const appointment = await Appointment.create({
    name,
    email,
    phone,
    service,
    doctorId,
    date: day,
    time,
    status: "pending",
  });

  const readableDate = day.toDateString();
  await Promise.all([
    sendPatientConfirmation({
      name,
      email,
      date: readableDate,
      time,
      doctorName: doctor.name,
      clinicAddress: process.env.CLINIC_ADDRESS || "ABC Dental Clinic",
    }),
    sendDoctorNotification({
      doctorEmail: process.env.DOCTOR_NOTIFY_EMAIL,
      patientName: name,
      service,
      date: readableDate,
      time,
    }),
  ]);

  const io = req.app.get("io");
  if (io) {
    io.to("admins").emit("appointment:created", {
      appointmentId: appointment._id,
      doctorId,
      date: day,
      time,
      status: appointment.status,
    });
  }

  return res.status(201).json(appointment);
}

export async function getAvailableSlots(req, res) {
  const { doctorId, date } = req.query;
  if (!doctorId || !date) {
    return res.status(400).json({ message: "doctorId and date are required" });
  }

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    return res.status(404).json({ message: "Doctor not found" });
  }

  const day = normalizeDate(date);
  const booked = await Appointment.find({ doctorId, date: day }).select("time");
  const reserved = await ReservedSlot.find({ doctorId, date: day }).select("time");
  
  const bookedSet = new Set(booked.map((item) => item.time));
  const reservedSet = new Set(reserved.map((item) => item.time));

  const slots = (doctor.availableTimings || []).map((slot) => ({
    time: slot,
    available: !bookedSet.has(slot) && !reservedSet.has(slot),
  }));

  return res.json(slots);
}

export async function getAppointments(req, res) {
  const { status, from, to } = req.query;
  const filter = {};

  if (status) filter.status = status;
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = normalizeDate(from);
    if (to) filter.date.$lte = normalizeDate(to);
  }

  const appointments = await Appointment.find(filter)
    .populate("doctorId", "name specialization")
    .sort({ date: 1, time: 1 });

  return res.json(appointments);
}

export async function updateAppointmentStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  if (!["pending", "confirmed", "rejected", "completed"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const appointment = await Appointment.findByIdAndUpdate(id, { status }, { new: true }).populate(
    "doctorId",
    "name"
  );

  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found" });
  }

  const io = req.app.get("io");
  if (io) {
    io.to("admins").emit("appointment:status-updated", {
      appointmentId: appointment._id,
      status: appointment.status,
    });
  }

  return res.json(appointment);
}

export async function getAppointmentEvents(_req, res) {
  const appointments = await Appointment.find().populate("doctorId", "name");
  const events = appointments.map((appointment) =>
    buildCalendarEvent(appointment, appointment.doctorId?.name || "Doctor")
  );

  return res.json(events);
}

export async function getPublicAppointmentEvents(_req, res) {
  const appointments = await Appointment.find().populate("doctorId", "name");
  const events = appointments.map((item) => ({
    id: String(item._id),
    title: "Booked",
    start: item.date,
    allDay: true,
    extendedProps: {
      time: item.time,
      doctor: item.doctorId?.name || "Doctor",
      status: item.status,
    },
  }));

  return res.json(events);
}

export async function getPatientRecords(_req, res) {
  const appointments = await Appointment.find().sort({ createdAt: -1 }).limit(200);

  const records = appointments.map((item) => ({
    id: item._id,
    name: item.name,
    email: item.email,
    phone: item.phone,
    service: item.service,
    status: item.status,
    date: item.date,
    time: item.time,
  }));

  return res.json(records);
}

export async function getMyAppointments(req, res) {
  const { email } = req.user;
  const appointments = await Appointment.find({ email })
    .populate("doctorId", "name specialization")
    .sort({ date: -1, time: -1 });

  return res.json(
    appointments.map((item) => ({
      id: item._id,
      name: item.name,
      email: item.email,
      service: item.service,
      doctor: item.doctorId?.name || "Doctor",
      specialization: item.doctorId?.specialization || "",
      date: item.date,
      time: item.time,
      status: item.status,
    }))
  );
}
