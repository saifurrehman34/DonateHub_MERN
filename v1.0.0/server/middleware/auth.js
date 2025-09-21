import jwt from "jsonwebtoken";
import User from "../models/User.js";

const auth = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    console.warn("⚠️ No token provided");
    return res.status(401).json({ success: false, message: "No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }
    console.log(`✅ Authenticated user: ${req.user.email}`);
    next();
  } catch (error) {
    console.error("❌ Auth middleware error:", error.message);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default auth;
