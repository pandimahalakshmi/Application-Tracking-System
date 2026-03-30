import express from 'express';
import { getNotifications, markAllRead } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/:userId',          getNotifications);
router.put('/:userId/read-all', markAllRead);

export default router;
