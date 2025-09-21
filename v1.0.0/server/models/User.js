import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"] },
  email: { type: String, required: [true, "Email is required"], unique: true },
  password: { type: String, required: [true, "Password is required"] },
  role: { type: String, enum: ["ngo", "donor"], default: "donor" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
