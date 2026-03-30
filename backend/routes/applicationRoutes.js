import express from 'express';
import {
  applyForJob, getUserApplications, getAllApplications,
  updateApplicationStatus, getStats,
} from '../controllers/applicationController.js';

const router = express.Router();

router.post('/apply/:userId',        applyForJob);
router.get('/user/:userId',          getUserApplications);
router.get('/admin',                 getAllApplications);
router.put('/:id/status',            updateApplicationStatus);
router.get('/stats',                 getStats);

export default router;
