import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    service: { type: String, required: true, trim: true },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    date: { type: Date, required: true },
    time: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected", "completed"],
      default: "pending",
    },
    notes: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

appointmentSchema.index({ doctorId: 1, date: 1, time: 1 }, { unique: true });

export default mongoose.model("Appointment", appointmentSchema);
