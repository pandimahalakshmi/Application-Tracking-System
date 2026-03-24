import { candidatesData } from "../models/data.js";

export const getAllCandidates = (req, res) => {
  try {
    const { status, search } = req.query;
    let filtered = [...candidatesData];

    // Filter by status
    if (status && status !== "All") {
      filtered = filtered.filter((c) => c.status === status);
    }

    // Filter by search term
    if (search) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json({ success: true, candidates: filtered, total: filtered.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCandidateById = (req, res) => {
  try {
    const { id } = req.params;
    const candidate = candidatesData.find((c) => c.id == id);

    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    res.json({ success: true, candidate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCandidateStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const candidate = candidatesData.find((c) => c.id == id);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    candidate.status = status;
    res.json({ success: true, message: "Status updated", candidate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addCandidate = (req, res) => {
  try {
    const { name, email, position, phone } = req.body;

    const newCandidate = {
      id: candidatesData.length + 1,
      name,
      email,
      position,
      status: "Applied",
      rating: 4.0,
      experience: "2 years",
      phone,
      resume: "resume.pdf",
      appliedDate: new Date().toISOString().split("T")[0],
    };

    candidatesData.push(newCandidate);
    res.json({ success: true, message: "Candidate added", candidate: newCandidate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCandidate = (req, res) => {
  try {
    const { id } = req.params;
    const index = candidatesData.findIndex((c) => c.id == id);

    if (index === -1) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    const deleted = candidatesData.splice(index, 1);
    res.json({ success: true, message: "Candidate deleted", candidate: deleted[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
