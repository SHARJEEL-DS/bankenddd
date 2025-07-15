import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
}, { timestamps: true }); // Adds createdAt and updatedAt

export default mongoose.model("Task", TaskSchema);
