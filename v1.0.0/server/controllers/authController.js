import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// REGISTER
export const register = async (req, res, next) => {
  const { name, email, password, role } = req.body;
  try {
    console.log("📝 Register request:", req.body);

    const existing = await User.findOne({ email });
    if (existing) {
      console.warn(`⚠️ Email already exists: ${email}`);
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashed, role });
    await user.save();

    console.log(`✅ User registered: ${email} (${role})`);

    res.json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    next(error);
  }
};

// LOGIN
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    console.log("🔑 Login request:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.warn(`⚠️ Login failed (no user): ${email}`);
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn(`⚠️ Wrong password: ${email}`);
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    console.log(`✅ User logged in: ${email}`);
    res.json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    next(error);
  }
};

// GET CURRENT USER
export const getMe = async (req, res, next) => {
  try {
    res.json({ success: true, user: req.user });
  } catch (error) {
    next(error);
  }
};
