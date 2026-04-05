import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { sendStatusEmail } from '../utils/sendEmail.js';
import { getIO } from '../socket.js';

// POST /api/applications — user applies for a job
export const applyForJob = async (req, res) => {
  try {
    const { jobId, coverLetter, portfolioLink, resumeFile, userPhone } = req.body;
    const userId = req.params.userId;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Check duplicate
    const existing = await Application.findOne({ userId, jobId });
    if (existing) return res.status(400).json({ error: 'You have already applied for this job' });

    const application = await Application.create({
      userId, jobId,
      userName:  user.name,
      userEmail: user.email,
      userPhone: userPhone || user.phoneNumber,
      jobTitle:  job.title,
      company:   job.company,
      coverLetter, portfolioLink, resumeFile,
    });

    // Increment job application count
    await Job.findByIdAndUpdate(jobId, { $inc: { applications: 1 } });

    // Notify all admins
    const admins = await User.find({ role: 'admin' });
    const adminNotifs = admins.map(admin => ({
      recipientId:   admin._id,
      recipientRole: 'admin',
      message:       `New application received for "${job.title}" from ${user.name}`,
      type:          'application',
      relatedId:     application._id.toString(),
    }));
    if (adminNotifs.length) await Notification.insertMany(adminNotifs);

    res.status(201).json({ success: true, message: 'Application submitted!', application });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'Already applied for this job' });
    res.status(500).json({ error: err.message });
  }
};

// GET /api/applications/user/:userId — get user's applications
export const getUserApplications = async (req, res) => {
  try {
    const apps = await Application.find({ userId: req.params.userId })
      .populate('jobId', 'title company location type salary')
      .sort({ createdAt: -1 });
    res.json({ success: true, applications: apps });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/applications/admin — get all applications (admin)
export const getAllApplications = async (req, res) => {
  try {
    const { jobId, status } = req.query;
    const filter = {};
    if (jobId)  filter.jobId  = jobId;
    if (status) filter.status = status;

    const apps = await Application.find(filter)
      .populate('userId', 'name email phoneNumber')
      .populate('jobId', 'title company location')
      .sort({ createdAt: -1 });

    res.json({ success: true, applications: apps });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/applications/:id/status — admin updates status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: 'after' }
    ).populate('userId', 'name email');

    if (!app) return res.status(404).json({ error: 'Application not found' });

    // 1. In-app notification
    await Notification.create({
      recipientId:   app.userId._id,
      recipientRole: 'user',
      message:       `Your application for "${app.jobTitle}" at ${app.company} has been ${status.toLowerCase()}`,
      type:          'status_update',
      relatedId:     app._id.toString(),
    });

    // 2. Email notification
    await sendStatusEmail({
      toEmail:  app.userId.email,
      toName:   app.userId.name,
      jobTitle: app.jobTitle,
      company:  app.company,
      status,
    });

    // 3. Real-time Socket.IO push
    const io = getIO();
    if (io) io.to(app.userId._id.toString()).emit('statusUpdate', {
      jobTitle: app.jobTitle,
      company:  app.company,
      status,
    });

    res.json({ success: true, message: 'Status updated', application: app });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/applications/stats — admin dashboard stats
export const getStats = async (req, res) => {
  try {
    const [totalJobs, totalUsers, totalApplications, activeJobs] = await Promise.all([
      Job.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Application.countDocuments(),
      Job.countDocuments({ status: 'active' }),
    ]);
    res.json({ success: true, stats: { totalJobs, totalUsers, totalApplications, activeJobs } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/applications/:id/notes — admin saves notes
export const updateNotes = async (req, res) => {
  try {
    const app = await Application.findByIdAndUpdate(
      req.params.id, { adminNotes: req.body.notes }, { returnDocument: 'after' }
    );
    if (!app) return res.status(404).json({ error: 'Application not found' });
    res.json({ success: true, application: app });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/applications/:id — admin deletes application
export const deleteApplication = async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Application deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
