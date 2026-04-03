import express from 'express';
import { scheduleInterview, getInterviews } from '../controllers/interviewController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();
router.post('/',  protect, adminOnly, scheduleInterview);
router.get('/',   protect, adminOnly, getInterviews);
export default router;
