import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/User.js";
import { seedDoctors } from "../controllers/doctorController.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/dentist";

async function ensureAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log("Skipped admin setup: ADMIN_EMAIL and ADMIN_PASSWORD are required in server/.env");
    return;
  }

  const normalizedEmail = adminEmail.toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail });
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  if (existing) {
    existing.role = "admin";
    existing.password = hashedPassword;
    await existing.save();
    console.log(`Updated admin credentials: ${normalizedEmail}`);
    return;
  }

  await User.create({
    name: "Clinic Admin",
    email: normalizedEmail,
    password: hashedPassword,
    role: "admin",
  });

  console.log(`Created admin user: ${normalizedEmail}`);
}

async function runSetup() {
  await mongoose.connect(MONGO_URI);
  await seedDoctors();
  console.log("Doctor seed complete.");
  await ensureAdmin();
}

runSetup()
  .then(async () => {
    await mongoose.disconnect();
    console.log("Setup finished successfully.");
  })
  .catch(async (error) => {
    console.error("Setup failed:", error.message);
    try {
      await mongoose.disconnect();
    } catch (_error) {
      // Ignore disconnect failures during setup exit.
    }
    process.exit(1);
  });
