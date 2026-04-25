import express from "express";
import { body } from "express-validator";
import { bootstrapAdmin, getMe, login, register } from "../controllers/userController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2 }),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  register
);

router.post("/login", [body("email").isEmail(), body("password").notEmpty()], login);
router.post("/bootstrap-admin", bootstrapAdmin);
router.get("/me", authenticate, getMe);

export default router;
