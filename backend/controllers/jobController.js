import { jobsData } from "../models/data.js";

export const getAllJobs = (req, res) => {
  try {
    const { search } = req.query;
    let filtered = [...jobsData];

    // Filter by search term
    if (search) {
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(search.toLowerCase()) ||
          j.company.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json({ success: true, jobs: filtered, total: filtered.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getJobById = (req, res) => {
  try {
    const { id } = req.params;
    const job = jobsData.find((j) => j.id == id);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createJob = (req, res) => {
  try {
    const { title, company, location, salary, type, description, requirements, tags, skills } =
      req.body;

    const newJob = {
      id: jobsData.length + 1,
      title,
      company,
      location,
      salary,
      type,
      description,
      requirements,
      tags: tags || [],
      skills: skills || [],
      applications: 0,
      postedDate: new Date().toISOString().split("T")[0],
    };

    jobsData.push(newJob);
    res.json({ success: true, message: "Job created successfully", job: newJob });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateJob = (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const job = jobsData.find((j) => j.id == id);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    Object.assign(job, updates);
    res.json({ success: true, message: "Job updated", job });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteJob = (req, res) => {
  try {
    const { id } = req.params;
    const index = jobsData.findIndex((j) => j.id == id);

    if (index === -1) {
      return res.status(404).json({ error: "Job not found" });
    }

    const deleted = jobsData.splice(index, 1);
    res.json({ success: true, message: "Job deleted", job: deleted[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStats = (req, res) => {
  try {
    res.json({
      success: true,
      stats: {
        activeJobs: jobsData.length,
        totalApplications: jobsData.reduce((sum, j) => sum + j.applications, 0),
        averageApplications: Math.round(
          jobsData.reduce((sum, j) => sum + j.applications, 0) / jobsData.length
        ),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
