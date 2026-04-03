import Sidebar from "../components/Sidebar";
import {
  Box, Grid, Card, Typography, Button, TextField, Chip,
  CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions, Divider, IconButton, Tooltip,
} from "@mui/material";
import { MapPin, Briefcase, X, Upload, Send, Star, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { jobService, applicationService, savedJobService } from "../services/api";
import { C, fieldSx, cardSx } from "../theme";
import JobFilters from "../components/JobFilters";
import useSocket from "../hooks/useSocket";

const fSx = {
  ...fieldSx, mb: 2,
  '& input:-webkit-autofill': { WebkitBoxShadow: '0 0 0 100px #1E293B inset', WebkitTextFillColor: '#F1F5F9' },
};
const emptyForm = { fullName:'', email:'', phone:'', coverLetter:'', portfolioLink:'', resume:null };
const emptyFilters = { search:'', type:'', location:'', salary:'' };

export default function Jobs() {
  const role = localStorage.getItem("role");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id || user?._id;

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters]       = useState(emptyFilters);
  const [jobs, setJobs]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [savedIds, setSavedIds]     = useState(new Set());
  const [open, setOpen]             = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [form, setForm]             = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);

  useEffect(() => {
    jobService.getAll("").then(r => r.success && setJobs(r.jobs)).finally(() => setLoading(false));
    if (userId && role === 'user') {
      savedJobService.getIds(userId).then(r => r.success && setSavedIds(new Set(r.savedIds)));
    }
  }, [userId]);

  const openModal = (job) => {
    setSelectedJob(job);
    setForm({ ...emptyForm, fullName: user?.name || '', email: user?.email || '' });
    setSubmitted(false);
    setOpen(true);
  };

  const handleChange = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const handleFilterChange = (k, v) => setFilters(p => ({ ...p, [k]: v }));

  // Socket.IO real-time status updates
  useSocket(userId, (data) => {
    // Show a toast-like alert when status changes
    alert(`📬 Update: Your application for "${data.jobTitle}" is now ${data.status}`);
  });

  const handleToggleSave = async (e, jobId) => {
    e.stopPropagation();
    if (!userId) return;
    const r = await savedJobService.toggle(userId, jobId);
    if (r.success) {
      setSavedIds(prev => {
        const next = new Set(prev);
        r.saved ? next.add(jobId) : next.delete(jobId);
        return next;
      });
    }
  };

  const handleDelete = async (e, jobId) => {
    e.stopPropagation();
    if (!window.confirm("Delete this job?")) return;
    const r = await jobService.remove(jobId);
    if (r.success) setJobs(prev => prev.filter(j => (j._id || j.id) !== jobId));
  };

  const handleSubmit = async () => {
    if (!form.fullName || !form.email || !form.phone) return;
    setSubmitting(true);
    try {
      // Step 1: Upload resume file if selected
      let uploadedFilename = '';
      if (form.resume) {
        const formData = new FormData();
        formData.append('resume', form.resume);
        const token = localStorage.getItem('token');
        const uploadRes = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/upload-resume`,
          { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData }
        );
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          uploadedFilename = uploadData.filename;
        }
      }

      // Step 2: Submit application with server filename
      const r = await applicationService.apply(userId, {
        jobId:        selectedJob?._id || selectedJob?.id,
        coverLetter:  form.coverLetter,
        portfolioLink:form.portfolioLink,
        resumeFile:   uploadedFilename,
        userPhone:    form.phone,
      });
      r.success ? setSubmitted(true) : alert(r.error || 'Failed to submit');
    } catch { alert('Network error'); }
    finally { setSubmitting(false); }
  };

  const filtered = jobs.filter(j => {
    const s = (filters.search || searchTerm).toLowerCase();
    const matchSearch   = !s || j.title?.toLowerCase().includes(s) || j.company?.toLowerCase().includes(s);
    const matchType     = !filters.type     || j.type === filters.type;
    const matchLocation = !filters.location || j.location?.toLowerCase().includes(filters.location.toLowerCase());
    return matchSearch && matchType && matchLocation;
  });

  const typeColor = (t) => t === 'Full-time'
    ? { bg:`${C.success}22`, color: C.success }
    : { bg:`${C.warning}22`, color: C.warning };

  const pageWrap = (children) => (
    <Box sx={{ display:"flex", background: C.bg, minHeight:"100vh" }}>
      <Sidebar />
      <Box sx={{ marginLeft:"240px", width:"100%", p:"32px" }}>{children}</Box>
    </Box>
  );

  if (loading) return pageWrap(
    <Box sx={{ display:"flex", justifyContent:"center", alignItems:"center", height:"60vh" }}>
      <CircularProgress sx={{ color: C.primary }} />
    </Box>
  );

  // ── Admin view ────────────────────────────────────────────────────────────
  if (role === "admin") return pageWrap(
    <>
      <Box sx={{ mb:4, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight:700, color: C.text }}>Job Listings</Typography>
          <Typography sx={{ color: C.muted, mt:0.5 }}>{jobs.length} jobs posted</Typography>
        </Box>
        <Button variant="contained" onClick={() => window.location.href='/jobform'}
          sx={{ background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, borderRadius:2, textTransform:'none', fontWeight:600, boxShadow:'none' }}>
          + Post New Job
        </Button>
      </Box>
      <Grid container spacing={3}>
        {jobs.length === 0 && (
          <Grid item xs={12}>
            <Card sx={{ ...cardSx, p:6, textAlign:'center' }}>
              <Briefcase size={48} color={C.border} style={{ marginBottom:16 }}/>
              <Typography sx={{ color: C.muted }}>No jobs posted yet. Click "Post New Job" to get started.</Typography>
            </Card>
          </Grid>
        )}
        {jobs.map(job => {
          const jid = job._id || job.id;
          return (
            <Grid item xs={12} sm={6} md={4} key={jid}>
              <Card sx={{ ...cardSx, p:3, height:"100%", display:"flex", flexDirection:"column",
                '&:hover':{ borderColor: C.primary, transform:"translateY(-3px)", boxShadow:`0 12px 32px rgba(0,0,0,0.4)` } }}>
                <Box sx={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", mb:2 }}>
                  <Box sx={{ flex:1 }}>
                    <Typography sx={{ fontWeight:700, color: C.text, fontSize:16 }}>{job.title}</Typography>
                    <Typography sx={{ color: C.muted, fontSize:13 }}>{job.company}</Typography>
                  </Box>
                  <Tooltip title="Delete job">
                    <IconButton size="small" onClick={e => handleDelete(e, jid)}
                      sx={{ color: C.danger, '&:hover':{ background:`${C.danger}22` } }}>
                      <Trash2 size={16}/>
                    </IconButton>
                  </Tooltip>
                </Box>
                <Chip label={job.type} size="small" sx={{ background: typeColor(job.type).bg, color: typeColor(job.type).color, fontWeight:600, mb:1.5, alignSelf:'flex-start' }} />
                <Typography sx={{ color: C.muted, fontSize:13, mb:2, flexGrow:1 }}>{job.description}</Typography>
                <Box sx={{ display:"flex", gap:2, mb:2 }}>
                  <Box sx={{ display:"flex", alignItems:"center", gap:0.5, color: C.muted, fontSize:12 }}><MapPin size={13} color={C.accent}/>{job.location}</Box>
                  <Box sx={{ display:"flex", alignItems:"center", gap:0.5, color: C.muted, fontSize:12 }}>{job.salary}</Box>
                </Box>
                <Box sx={{ display:"flex", gap:1, flexWrap:"wrap" }}>
                  {(job.skills||[]).map((s,i) => <Chip key={i} label={s} size="small" sx={{ background:`${C.primary}22`, color: C.primary, fontSize:11 }}/>)}
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </>
  );

  // ── User view ─────────────────────────────────────────────────────────────
  return pageWrap(
    <>
      <Box sx={{ mb:2, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight:700, color: C.text }}>Available Jobs</Typography>
          <Typography sx={{ color: C.muted, mt:0.5 }}>{filtered.length} positions found</Typography>
        </Box>
      </Box>
      <JobFilters filters={filters} onChange={handleFilterChange} onClear={() => setFilters(emptyFilters)} />

      {filtered.length === 0 && !loading && (
        <Card sx={{ ...cardSx, p:6, textAlign:'center' }}>
          <Briefcase size={48} color={C.border} style={{ marginBottom:16 }}/>
          <Typography sx={{ color: C.muted }}>No jobs available right now. Check back later!</Typography>
        </Card>
      )}

      <Grid container spacing={3} sx={{ alignItems:'stretch' }}>
        {filtered.map(job => {
          const jid = job._id || job.id;
          const isSaved = savedIds.has(jid);
          return (
            <Grid item xs={12} sm={6} md={4} key={jid}>
              <Card sx={{ ...cardSx, p:3, height:"100%", display:"flex", flexDirection:"column", position:'relative',
                '&:hover':{ borderColor: C.primary, transform:"translateY(-4px)", boxShadow:`0 12px 32px rgba(0,0,0,0.4)` } }}>

                {/* Star save button */}
                <Tooltip title={isSaved ? "Unsave job" : "Save job"}>
                  <IconButton size="small" onClick={e => handleToggleSave(e, jid)}
                    sx={{ position:'absolute', top:12, right:12, zIndex:1,
                      color: isSaved ? C.warning : C.muted,
                      '&:hover':{ color: C.warning, background:`${C.warning}22` },
                      transition:'all 0.2s' }}>
                    <Star size={18} fill={isSaved ? C.warning : 'none'} />
                  </IconButton>
                </Tooltip>

                <Box sx={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", mb:1.5, pr:4 }}>
                  <Box>
                    <Typography sx={{ fontWeight:700, color: C.text, fontSize:15 }}>{job.title}</Typography>
                    <Typography sx={{ color: C.muted, fontSize:12, mt:0.3 }}>{job.company}</Typography>
                  </Box>
                  <Chip label={job.type} size="small" sx={{ background: typeColor(job.type).bg, color: typeColor(job.type).color, fontWeight:600, flexShrink:0 }} />
                </Box>

                <Typography sx={{ color: C.muted, fontSize:12, mb:1.5, flexGrow:1 }}>{job.description}</Typography>

                <Box sx={{ display:"flex", gap:2, mb:1.5 }}>
                  <Box sx={{ display:"flex", alignItems:"center", gap:0.5, color: C.muted, fontSize:12 }}>
                    <MapPin size={13} color={C.accent}/>{job.location}
                  </Box>
                  <Box sx={{ color: C.muted, fontSize:12 }}>{job.salary}</Box>
                </Box>

                <Box sx={{ display:"flex", gap:0.5, flexWrap:"wrap", mb:1.5 }}>
                  {(job.skills||job.tags||[]).map((t,i) => (
                    <Chip key={i} label={t} size="small" sx={{ background:`${C.primary}22`, color: C.primary, fontSize:11 }}/>
                  ))}
                </Box>

                <Box sx={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <Typography sx={{ color: C.muted, fontSize:11 }}>{job.applications} applicants</Typography>
                  <Button size="small" onClick={() => openModal(job)}
                    sx={{ background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, color:"#fff",
                      borderRadius:1.5, textTransform:"none", fontWeight:600, px:2,
                      boxShadow:`0 4px 12px ${C.primary}44`, '&:hover':{ opacity:0.9 } }}>
                    Apply Now
                  </Button>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Application Modal */}
      <Dialog open={open} onClose={() => { setOpen(false); setSubmitted(false); }} maxWidth="sm" fullWidth
        PaperProps={{ sx:{ background: C.surface, border:`1px solid ${C.border}`, borderRadius:3 } }}>
        <DialogTitle sx={{ p:3, pb:0 }}>
          <Box sx={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight:700, color: C.text }}>Apply for {selectedJob?.title}</Typography>
              <Typography sx={{ color: C.muted, fontSize:13, mt:0.5 }}>{selectedJob?.company} · {selectedJob?.location}</Typography>
            </Box>
            <IconButton onClick={() => setOpen(false)} size="small" sx={{ color: C.muted }}><X size={18}/></IconButton>
          </Box>
          <Divider sx={{ borderColor: C.border, mt:2 }} />
        </DialogTitle>
        <DialogContent sx={{ p:3 }}>
          {submitted ? (
            <Box sx={{ textAlign:"center", py:4 }}>
              <Box sx={{ width:64, height:64, borderRadius:"50%", background:`${C.success}22`, display:"flex", alignItems:"center", justifyContent:"center", mx:"auto", mb:2 }}>
                <Send size={28} color={C.success}/>
              </Box>
              <Typography variant="h6" sx={{ fontWeight:700, color: C.text, mb:1 }}>Application Submitted!</Typography>
              <Typography sx={{ color: C.muted, fontSize:14 }}>
                Your application for <strong style={{ color: C.text }}>{selectedJob?.title}</strong> has been sent.
              </Typography>
              <Button onClick={() => setOpen(false)} variant="contained" sx={{ mt:3, background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, borderRadius:2, textTransform:"none", fontWeight:600, boxShadow:"none" }}>Close</Button>
            </Box>
          ) : (
            <Box sx={{ pt:1 }}>
              <TextField fullWidth label="Full Name *" value={form.fullName} onChange={e => handleChange('fullName', e.target.value)} sx={fSx} />
              <TextField fullWidth label="Email *" type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} sx={fSx} />
              <TextField fullWidth label="Phone Number *" value={form.phone} onChange={e => handleChange('phone', e.target.value)} sx={fSx} />
              <Box sx={{ mb:2 }}>
                <Typography sx={{ color: C.muted, fontSize:13, mb:1 }}>Resume</Typography>
                <Button variant="outlined" component="label" startIcon={<Upload size={16}/>} fullWidth
                  sx={{ borderColor: form.resume ? C.success : C.border, color: form.resume ? C.success : C.muted,
                    borderRadius:2, textTransform:"none", py:1.5, justifyContent:"flex-start",
                    background: form.resume ? `${C.success}11` : 'transparent', '&:hover':{ borderColor: C.primary, color: C.primary } }}>
                  {form.resume ? form.resume.name : "Upload Resume (PDF, DOC)"}
                  <input type="file" hidden accept=".pdf,.doc,.docx" onChange={e => handleChange('resume', e.target.files[0])} />
                </Button>
              </Box>
              <TextField fullWidth label="Cover Letter" multiline rows={3} value={form.coverLetter} onChange={e => handleChange('coverLetter', e.target.value)} placeholder="Tell us why you're a great fit..." sx={fSx} />
              <TextField fullWidth label="Portfolio Link (optional)" value={form.portfolioLink} onChange={e => handleChange('portfolioLink', e.target.value)} sx={{ ...fSx, mb:0 }} />
            </Box>
          )}
        </DialogContent>
        {!submitted && (
          <DialogActions sx={{ px:3, pb:3, pt:2, gap:1 }}>
            <Button onClick={() => setOpen(false)} sx={{ color: C.muted, textTransform:"none", borderRadius:2 }}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" disabled={submitting || !form.fullName || !form.email || !form.phone}
              startIcon={submitting ? <CircularProgress size={16} color="inherit"/> : <Send size={16}/>}
              sx={{ background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, borderRadius:2, textTransform:"none", fontWeight:700, px:4, py:1.2, boxShadow:`0 4px 16px ${C.primary}44`, '&:disabled':{ opacity:0.5 } }}>
              {submitting ? "Submitting…" : "Submit Application"}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
}
