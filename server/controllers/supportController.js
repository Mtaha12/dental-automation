import { body, validationResult } from "express-validator";
import SupportMessage from "../models/SupportMessage.js";

export const createSupportMessageValidators = [
  body("name").trim().notEmpty(),
  body("message").trim().notEmpty(),
  body("email").optional().isEmail(),
];

export async function createSupportMessage(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, message } = req.body;
  const created = await SupportMessage.create({ name, email, message });

  return res.status(201).json({
    id: created._id,
    message: "Your message has been received. Our team will reply soon.",
  });
}

export async function getMySupportMessages(req, res) {
  const { email } = req.user;
  const messages = await SupportMessage.find({ email }).sort({ createdAt: -1 });
  return res.json(messages);
}
