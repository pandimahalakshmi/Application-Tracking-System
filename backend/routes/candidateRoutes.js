import express from "express";
import {
  getAllCandidates,
  getCandidateById,
  updateCandidateStatus,
  addCandidate,
  deleteCandidate,
} from "../controllers/candidateController.js";

const router = express.Router();

router.get("/", getAllCandidates);
router.get("/:id", getCandidateById);
router.post("/", addCandidate);
router.put("/:id/status", updateCandidateStatus);
router.delete("/:id", deleteCandidate);

export default router;
