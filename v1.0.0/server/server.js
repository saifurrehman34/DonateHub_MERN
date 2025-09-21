import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/database.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect DB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === "production"
    ? [process.env.CORS_ORIGIN]
    : [process.env.LOCAL_CORS_ORIGIN_1, process.env.LOCAL_CORS_ORIGIN_2],
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api/auth", authRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  console.log("✅ Health check hit");
  res.json({ success: true, message: "DonateHub API running", time: new Date().toISOString() });
});

// 404 handler
app.use("/api", (req, res) => {
  console.error(`❌ 404: ${req.originalUrl}`);
  res.status(404).json({ success: false, message: "API endpoint not found" });
});

// Global Error Handler
app.use((error, req, res, next) => {
  console.error("🔥 Global error:", error);

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(400).json({ success: false, message: `${field} already exists` });
  }

  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({ success: false, message: messages.join(", ") });
  }

  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === "production" ? "Server error" : error.message
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
