import ReservedSlot from "../models/ReservedSlot.js";
import Doctor from "../models/Doctor.js";

function normalizeDate(date) {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  return day;
}

export async function createReservedSlot(req, res) {
  const { doctorId, date, time, reason, notes } = req.body;

  if (!doctorId || !date || !time) {
    return res.status(400).json({ message: "doctorId, date, and time are required" });
  }

  const day = normalizeDate(date);

  // Verify doctor exists
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    return res.status(404).json({ message: "Doctor not found" });
  }

  try {
    const reserved = await ReservedSlot.create({
      doctorId,
      date: day,
      time,
      reason: reason || "Manually Reserved",
      notes: notes || "",
    });

    return res.status(201).json(reserved);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Slot already reserved" });
    }
    return res.status(500).json({ message: "Unable to reserve slot" });
  }
}

export async function getReservedSlots(req, res) {
  const { doctorId, date } = req.query;

  const filter = {};
  if (doctorId) filter.doctorId = doctorId;
  if (date) {
    const day = normalizeDate(date);
    filter.date = day;
  }

  const reserved = await ReservedSlot.find(filter)
    .populate("doctorId", "name")
    .sort({ date: 1, time: 1 });

  return res.json(reserved);
}

export async function deleteReservedSlot(req, res) {
  const { id } = req.params;

  const reserved = await ReservedSlot.findByIdAndDelete(id);
  if (!reserved) {
    return res.status(404).json({ message: "Reserved slot not found" });
  }

  return res.json({ message: "Reservation cancelled" });
}

export async function updateReservedSlot(req, res) {
  const { id } = req.params;
  const { reason, notes } = req.body;

  const reserved = await ReservedSlot.findByIdAndUpdate(
    id,
    { reason, notes },
    { new: true }
  ).populate("doctorId", "name");

  if (!reserved) {
    return res.status(404).json({ message: "Reserved slot not found" });
  }

  return res.json(reserved);
}
