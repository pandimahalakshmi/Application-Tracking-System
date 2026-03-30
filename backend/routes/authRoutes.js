import express from "express";
import { signup, login, logout, getProfile, updateProfile, applyForJob } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile/:id", getProfile);
router.put("/profile/:id", updateProfile);
router.post("/profile/:id/apply", applyForJob);

export default router;  