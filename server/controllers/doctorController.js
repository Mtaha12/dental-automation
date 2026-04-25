import Doctor from "../models/Doctor.js";

const defaultDoctors = [
  {
    name: "Dr. Ayesha Khan",
    specialization: "Cosmetic Dentistry",
    experience: "12 years",
    availableTimings: ["09:00", "10:00", "11:00", "15:00", "16:00"],
    bio: "Focused on smile design and minimally invasive treatments.",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Dr. Usman Raza",
    specialization: "Orthodontics",
    experience: "9 years",
    availableTimings: ["10:00", "11:00", "12:00", "17:00", "18:00"],
    bio: "Specialist in aligners and braces for adults and teens.",
    image: "https://images.unsplash.com/photo-1612531386530-97286d97c2d2?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Dr. Hina Qureshi",
    specialization: "Endodontics",
    experience: "11 years",
    availableTimings: ["09:30", "10:30", "13:00", "14:00", "16:30"],
    bio: "Expert in microscopic root canal therapy and pain-free procedures.",
    image: "https://images.unsplash.com/photo-1594824475317-d5d79473f58f?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Dr. Bilal Siddiqui",
    specialization: "Oral Surgery",
    experience: "14 years",
    availableTimings: ["10:00", "12:00", "15:00", "17:30"],
    bio: "Handles complex extractions and minor oral surgeries with precision.",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Dr. Mahnoor Tariq",
    specialization: "Pediatric Dentistry",
    experience: "8 years",
    availableTimings: ["09:00", "11:00", "14:00", "16:00"],
    bio: "Focused on child-friendly dental care and preventive treatments.",
    image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Dr. Zain Malik",
    specialization: "Prosthodontics",
    experience: "13 years",
    availableTimings: ["10:00", "12:30", "15:30", "18:00"],
    bio: "Specializes in crowns, bridges, and full-mouth rehabilitation.",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80",
  },
];

async function ensureMinimumDoctors() {
  const existing = await Doctor.find().sort({ createdAt: 1 });
  if (existing.length >= defaultDoctors.length) {
    return;
  }

  const usedNames = new Set(existing.map((item) => item.name));
  const missingDoctors = defaultDoctors.filter((item) => !usedNames.has(item.name));
  if (missingDoctors.length > 0) {
    await Doctor.insertMany(missingDoctors);
  }
}

export async function seedDoctors() {
  await ensureMinimumDoctors();
}

export async function getDoctors(_req, res) {
  await ensureMinimumDoctors();
  const doctors = await Doctor.find().sort({ createdAt: 1 });
  return res.json(doctors);
}

export async function updateDoctorTimings(req, res) {
  const { id } = req.params;
  const { availableTimings } = req.body;

  const doctor = await Doctor.findByIdAndUpdate(
    id,
    { availableTimings: Array.isArray(availableTimings) ? availableTimings : [] },
    { new: true }
  );

  if (!doctor) {
    return res.status(404).json({ message: "Doctor not found" });
  }

  return res.json(doctor);
}
