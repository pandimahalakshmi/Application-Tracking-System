import express from "express";
import {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getStats,
} from "../controllers/jobController.js";

const router = express.Router();

router.get("/", getAllJobs);
router.get("/stats", getStats);
router.get("/:id", getJobById);
router.post("/", createJob);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);

export default router;
