import SavedJob from '../models/SavedJob.js';

// Toggle save/unsave
export const toggleSave = async (req, res) => {
  try {
    const { userId, jobId } = req.body;
    const existing = await SavedJob.findOne({ userId, jobId });
    if (existing) {
      await SavedJob.deleteOne({ userId, jobId });
      return res.json({ success: true, saved: false, message: 'Job unsaved' });
    }
    await SavedJob.create({ userId, jobId });
    res.json({ success: true, saved: true, message: 'Job saved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all saved jobs for a user
export const getSavedJobs = async (req, res) => {
  try {
    const saved = await SavedJob.find({ userId: req.params.userId })
      .populate('jobId')
      .sort({ createdAt: -1 });
    // Filter out any where the job was deleted
    const jobs = saved.filter(s => s.jobId).map(s => ({
      savedId: s._id,
      savedAt: s.createdAt,
      ...s.jobId.toObject(),
    }));
    res.json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get saved job IDs for a user (for star highlighting)
export const getSavedIds = async (req, res) => {
  try {
    const saved = await SavedJob.find({ userId: req.params.userId }, 'jobId');
    res.json({ success: true, savedIds: saved.map(s => s.jobId.toString()) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
