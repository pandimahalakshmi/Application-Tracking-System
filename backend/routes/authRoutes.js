import express from "express";
import { signup, login, logout, getProfile, updateProfile, applyForJob, forgotPassword, resetPassword, changePassword, googleAuth } from "../controllers/authController.js";
import { uploadResume } from "../middleware/upload.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup",              signup);
router.post("/login",               login);
router.post("/google",              googleAuth);
router.post("/logout",              logout);
router.get("/profile/:id",          getProfile);
router.put("/profile/:id",          protect, updateProfile);
router.post("/profile/:id/apply",   protect, applyForJob);
router.post("/forgot-password",     forgotPassword);
router.post("/reset-password",      resetPassword);
router.put("/change-password/:id",  protect, changePassword);

// Temporary admin reset — remove after use
router.get("/fix-admin", async (_req, res) => {
  try {
    const bcrypt = (await import('bcryptjs')).default;
    const User = (await import('../models/User.js')).default;
    await User.deleteMany({ email: 'recruithubadmin@gmail.com' });
    const hash = await bcrypt.hash('Admin@123', 10);
    await User.collection.insertOne({
      name: 'Admin User',
      email: 'recruithubadmin@gmail.com',
      password: hash,
      role: 'admin',
      phoneNumber: '0000000000',
      gender: 'male',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const saved = await User.findOne({ email: 'recruithubadmin@gmail.com' });
    const ok = await bcrypt.compare('Admin@123', saved.password);
    res.json({ success: true, passwordMatch: ok, message: ok ? 'Admin fixed! Login with Admin@123' : 'FAILED' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Resume upload
router.post("/upload-resume", protect, uploadResume.single("resume"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({ success: true, filename: req.file.filename, path: `/uploads/resumes/${req.file.filename}` });
});

export default router;
