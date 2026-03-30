import Job from '../models/Job.js';

export const getAllJobs = async (req, res) => {
  try {
    const { search, status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    else filter.status = 'active';
    if (search) filter.$or = [
      { title:   { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
    ];
    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json({ success: true, job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
