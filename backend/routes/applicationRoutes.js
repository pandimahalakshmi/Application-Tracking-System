import express from 'express';
import {
  applyForJob, getUserApplications, getAllApplications,
  updateApplicationStatus, getStats, updateNotes, deleteApplication,
} from '../controllers/applicationController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/apply/:userId',        protect, applyForJob);
router.get('/user/:userId',          protect, getUserApplications);
router.get('/admin',                 protect, adminOnly, getAllApplications);
router.put('/:id/status',            protect, adminOnly, updateApplicationStatus);
router.put('/:id/notes',             protect, adminOnly, updateNotes);
router.delete('/:id',                protect, adminOnly, deleteApplication);
router.get('/stats',                 protect, adminOnly, getStats);

export default router;
