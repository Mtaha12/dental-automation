import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/User.js";

function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET || "dev-secret",
    { expiresIn: "7d" }
  );
}

export async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, phone } = req.body;
  const existing = await User.findOne({ email: email.toLowerCase() });

  if (existing) {
    return res.status(409).json({ message: "Email already in use" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, phone, password: hashedPassword, role: "patient" });

  return res.status(201).json({
    token: signToken(user),
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
}

export async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Only admin accounts can log in here" });
  }

  return res.json({
    token: signToken(user),
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
}

export async function bootstrapAdmin(_req, res) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return res.status(400).json({ message: "ADMIN_EMAIL and ADMIN_PASSWORD are required" });
  }

  const existing = await User.findOne({ email: adminEmail.toLowerCase() });
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  if (existing) {
    existing.role = "admin";
    existing.password = hashedPassword;
    await existing.save();
    return res.json({ message: "Admin updated" });
  }

  await User.create({
    name: "Clinic Admin",
    email: adminEmail,
    password: hashedPassword,
    role: "admin",
  });

  return res.status(201).json({ message: "Admin created" });
}

export async function getMe(req, res) {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.json(user);
}
