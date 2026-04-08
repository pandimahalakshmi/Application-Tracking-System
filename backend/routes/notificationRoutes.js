import express from 'express';
import { getNotifications, markOneRead, markAllRead } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/:userId',          getNotifications);
router.put('/read/:id',         markOneRead);       // mark single as read
router.put('/:userId/read-all', markAllRead);       // mark all as read

export default router;
