import express from "express";
import { signup, login, logout, getProfile, updateProfile, applyForJob, forgotPassword, resetPassword } from "../controllers/authController.js";
import { uploadResume } from "../middleware/upload.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup",              signup);
router.post("/login",               login);
router.post("/logout",              logout);
router.get("/profile/:id",          getProfile);
router.put("/profile/:id",          protect, updateProfile);
router.post("/profile/:id/apply",   protect, applyForJob);
router.post("/forgot-password",     forgotPassword);
router.post("/reset-password",      resetPassword);

// Resume upload
router.post("/upload-resume", protect, uploadResume.single("resume"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({ success: true, filename: req.file.filename, path: `/uploads/resumes/${req.file.filename}` });
});

export default router;
