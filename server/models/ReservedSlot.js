import mongoose from "mongoose";

const reservedSlotSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    date: { type: Date, required: true },
    time: { type: String, required: true, trim: true },
    reason: { type: String, trim: true, default: "Manually Reserved" },
    notes: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

// Unique index to prevent duplicate reservations for the same doctor, date, and time
reservedSlotSchema.index({ doctorId: 1, date: 1, time: 1 }, { unique: true });

export default mongoose.model("ReservedSlot", reservedSlotSchema);
