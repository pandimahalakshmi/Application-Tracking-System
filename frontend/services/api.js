const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const token = () => localStorage.getItem("token");

// Auth Service
export const authService = {
  signup: async (signupData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });
      const data = await response.json();
      if (data.token) localStorage.setItem("token", data.token);
      return data;
    } catch (error) {
      return { error: error.message };
    }
  },

  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.token) localStorage.setItem("token", data.token);
      return data;
    } catch (error) {
      return { error: error.message };
    }
  },

  logout: async () => {
    localStorage.removeItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, { method: "POST" });
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  },

  getProfile: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  },

  updateProfile: async (userId, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  },

  applyForJob: async (userId, jobData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile/${userId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify(jobData),
      });
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  },
};

// Candidates Service
export const candidateService = {
  getAllCandidates: async (status = "All", search = "") => {
    try {
      const params = new URLSearchParams();
      if (status !== "All") params.append("status", status);
      if (search) params.append("search", search);

      const response = await fetch(`${API_BASE_URL}/candidates?${params}`);
      return await response.json();
    } catch (error) {
      console.error("Get candidates error:", error);
      return { error: error.message };
    }
  },

  getCandidateById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/candidates/${id}`);
      return await response.json();
    } catch (error) {
      console.error("Get candidate error:", error);
      return { error: error.message };
    }
  },

  updateCandidateStatus: async (id, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/candidates/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      return await response.json();
    } catch (error) {
      console.error("Update candidate status error:", error);
      return { error: error.message };
    }
  },

  addCandidate: async (candidateData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/candidates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(candidateData),
      });
      return await response.json();
    } catch (error) {
      console.error("Add candidate error:", error);
      return { error: error.message };
    }
  },

  deleteCandidate: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/candidates/${id}`, {
        method: "DELETE",
      });
      return await response.json();
    } catch (error) {
      console.error("Delete candidate error:", error);
      return { error: error.message };
    }
  },
};

// Jobs Service
export const jobService = {
  getAllJobs: async (search = "") => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);

      const response = await fetch(`${API_BASE_URL}/jobs?${params}`);
      return await response.json();
    } catch (error) {
      console.error("Get jobs error:", error);
      return { error: error.message };
    }
  },

  getJobById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${id}`);
      return await response.json();
    } catch (error) {
      console.error("Get job error:", error);
      return { error: error.message };
    }
  },

  createJob: async (jobData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
      });
      return await response.json();
    } catch (error) {
      console.error("Create job error:", error);
      return { error: error.message };
    }
  },

  updateJob: async (id, jobData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
      });
      return await response.json();
    } catch (error) {
      console.error("Update job error:", error);
      return { error: error.message };
    }
  },

  deleteJob: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
        method: "DELETE",
      });
      return await response.json();
    } catch (error) {
      console.error("Delete job error:", error);
      return { error: error.message };
    }
  },

  getStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/stats`);
      return await response.json();
    } catch (error) {
      console.error("Get stats error:", error);
      return { error: error.message };
    }
  },
};
