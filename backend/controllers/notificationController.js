import Notification from '../models/Notification.js';

// GET /api/notifications/:userId
export const getNotifications = async (req, res) => {
  try {
    const notifs = await Notification.find({ recipientId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(20);
    const unread = await Notification.countDocuments({ recipientId: req.params.userId, read: false });
    res.json({ success: true, notifications: notifs, unread });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/notifications/:userId/read-all
export const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ recipientId: req.params.userId }, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
