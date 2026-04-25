import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    specialization: { type: String, required: true, trim: true },
    experience: { type: String, required: true, trim: true },
    availableTimings: [{ type: String, trim: true }],
    bio: { type: String, trim: true, default: "" },
    image: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", doctorSchema);
