const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const token = () => localStorage.getItem("token");
const authHeader = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` });

const req = async (method, path, body) => {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers: authHeader(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return await res.json();
  } catch (err) {
    return { error: err.message };
  }
};

export const authService = {
  signup:        (data)        => req("POST", "/auth/signup", data).then(d => { if (d.token) localStorage.setItem("token", d.token); return d; }),
  login:         (email, pass) => req("POST", "/auth/login", { email, password: pass }).then(d => { if (d.token) localStorage.setItem("token", d.token); return d; }),
  logout:        ()            => { localStorage.removeItem("token"); return req("POST", "/auth/logout"); },
  getProfile:    (id)          => req("GET",  `/auth/profile/${id}`),
  updateProfile: (id, data)    => req("PUT",  `/auth/profile/${id}`, data),
};

export const jobService = {
  getAll:  (search = "", status) => req("GET", `/jobs?search=${search}${status ? `&status=${status}` : ""}`),
  getById: (id)                  => req("GET", `/jobs/${id}`),
  create:  (data)                => req("POST",   "/jobs", data),
  update:  (id, data)            => req("PUT",    `/jobs/${id}`, data),
  remove:  (id)                  => req("DELETE", `/jobs/${id}`),
};

export const applicationService = {
  apply:        (userId, data) => req("POST", `/applications/apply/${userId}`, data),
  getMyApps:    (userId)       => req("GET",  `/applications/user/${userId}`),
  getAll:       (filters = {}) => { const q = new URLSearchParams(filters).toString(); return req("GET", `/applications/admin${q ? `?${q}` : ""}`); },
  updateStatus: (id, status)   => req("PUT",  `/applications/${id}/status`, { status }),
  updateNotes:  (id, notes)    => req("PUT",  `/applications/${id}/notes`, { notes }),
  remove:       (id)           => req("DELETE", `/applications/${id}`),
  getStats:     ()             => req("GET",  "/applications/stats"),
};

export const notificationService = {
  getAll:      (userId) => req("GET", `/notifications/${userId}`),
  markOneRead: (id)     => req("PUT", `/notifications/read/${id}`),
  markAllRead: (userId) => req("PUT", `/notifications/${userId}/read-all`),
};

export const savedJobService = {
  toggle: (userId, jobId) => req("POST", "/saved-jobs/toggle", { userId, jobId }),
  getAll: (userId)        => req("GET",  `/saved-jobs/user/${userId}`),
  getIds: (userId)        => req("GET",  `/saved-jobs/ids/${userId}`),
};

export const candidateService = {
  getAllCandidates:       (status = "All", search = "") => {
    const params = new URLSearchParams();
    if (status !== "All") params.append("status", status);
    if (search) params.append("search", search);
    return req("GET", `/candidates?${params}`);
  },
  getCandidateById:      (id)          => req("GET",    `/candidates/${id}`),
  updateCandidateStatus: (id, status)  => req("PUT",    `/candidates/${id}/status`, { status }),
  addCandidate:          (data)        => req("POST",   `/candidates`, data),
  deleteCandidate:       (id)          => req("DELETE", `/candidates/${id}`),
};
