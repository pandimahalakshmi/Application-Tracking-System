import Sidebar from "../components/Sidebar";
import {
  Box, Grid, Card, Typography, Button, TextField, Chip,
  InputAdornment, CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions, Divider, IconButton,
} from "@mui/material";
import { MapPin, DollarSign, Search, Briefcase, X, Upload, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { jobService, authService } from "../services/api";
import { C, fieldSx, cardSx } from "../theme";

const fSx = {
  ...fieldSx,
  mb: 2,
  '& input:-webkit-autofill': {
    WebkitBoxShadow: '0 0 0 100px #1E293B inset',
    WebkitTextFillColor: '#F1F5F9',
  },
};

const emptyForm = { fullName:'', email:'', phone:'', coverLetter:'', portfolioLink:'', resume:null };

export default function Jobs() {
  const role = localStorage.getItem("role");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs]             = useState([]);
  const [loading, setLoading]       = useState(true);

  // Modal state
  const [open, setOpen]           = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [form, setForm]           = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);

  useEffect(() => {
    jobService.getAllJobs("").then(r => r.success && setJobs(r.jobs)).finally(() => setLoading(false));
  }, []);

  // Pre-fill from logged-in user
  const openModal = (job) => {
    setSelectedJob(job);
    setForm({ ...emptyForm, fullName: user?.name || '', email: user?.email || '' });
    setSubmitted(false);
    setOpen(true);
  };

  const handleChange = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!form.fullName || !form.email || !form.phone) return;
    setSubmitting(true);
    try {
      const userId = user?.id || user?._id;
      const result = await authService.applyForJob(userId, {
        jobId:    String(selectedJob?.id || selectedJob?._id),
        jobTitle: selectedJob?.title,
        company:  selectedJob?.company,
      });
      if (result.success) {
        setSubmitted(true);
      } else {
        alert(result.error || 'Failed to submit application');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => { setOpen(false); setSubmitted(false); };

  const filtered = jobs.filter(j =>
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <Box sx={{ mb:4 }}>
        <Typography variant="h4" sx={{ fontWeight:700, color: C.text }}>Job Applications Overview</Typography>
        <Typography sx={{ color: C.muted, mt:0.5 }}>Monitor applications across all job postings</Typography>
      </Box>
      <Grid container spacing={3}>
        {jobs.map(job => (
          <Grid item xs={12} sm={6} md={4} key={job.id}>
            <Card sx={{ ...cardSx, p:3, height:"100%", display:"flex", flexDirection:"column", justifyContent:"space-between",
              '&:hover':{ borderColor: C.primary, transform:"translateY(-4px)", boxShadow:`0 12px 32px rgba(0,0,0,0.4)` } }}>
              <Box>
                <Box sx={{ display:"flex", alignItems:"center", gap:2, mb:2 }}>
                  <Box sx={{ p:1.5, borderRadius:2, background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
                    <Briefcase size={18} color="#fff" />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight:700, color: C.text, fontSize:15 }}>{job.title}</Typography>
                    <Typography sx={{ color: C.muted, fontSize:12 }}>{job.company}</Typography>
                  </Box>
                </Box>
                <Typography sx={{ color: C.muted, fontSize:13, mb:2 }}>{job.description}</Typography>
              </Box>
              <Box sx={{ display:"flex", gap:1 }}>
                <Chip label={`${job.applications} applied`} size="small" sx={{ background:`${C.accent}22`, color: C.accent, fontWeight:600 }} />
                <Chip label={job.type} size="small" sx={{ background: typeColor(job.type).bg, color: typeColor(job.type).color, fontWeight:600 }} />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );

  // ── User view ─────────────────────────────────────────────────────────────
  return pageWrap(
    <>
      {/* Header */}
      <Box sx={{ mb:4, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight:700, color: C.text }}>Available Jobs</Typography>
          <Typography sx={{ color: C.muted, mt:0.5 }}>{filtered.length} positions found</Typography>
        </Box>
        <TextField placeholder="Search jobs..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          size="small" sx={{ ...fSx, mb:0, minWidth:280 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search size={16} color={C.muted}/></InputAdornment> }} />
      </Box>

      {/* Job Cards */}
      <Grid container spacing={3}>
        {filtered.map(job => (
          <Grid item xs={12} sm={6} md={4} key={job.id}>
            <Card sx={{ ...cardSx, p:3, height:"100%", display:"flex", flexDirection:"column",
              '&:hover':{ borderColor: C.primary, transform:"translateY(-4px)", boxShadow:`0 12px 32px rgba(0,0,0,0.4)` } }}>
              <Box sx={{ display:"flex", justifyContent:"space-between", mb:2 }}>
                <Box>
                  <Typography sx={{ fontWeight:700, color: C.text, fontSize:16 }}>{job.title}</Typography>
                  <Typography sx={{ color: C.muted, fontSize:13 }}>{job.company}</Typography>
                </Box>
                <Chip label={job.type} size="small" sx={{ background: typeColor(job.type).bg, color: typeColor(job.type).color, fontWeight:600 }} />
              </Box>
              <Typography sx={{ color: C.muted, fontSize:13, mb:2, flexGrow:1 }}>{job.description}</Typography>
              <Box sx={{ display:"flex", gap:2, mb:2 }}>
                <Box sx={{ display:"flex", alignItems:"center", gap:0.5, color: C.muted, fontSize:13 }}>
                  <MapPin size={14} color={C.accent}/>{job.location}
                </Box>
                <Box sx={{ display:"flex", alignItems:"center", gap:0.5, color: C.muted, fontSize:13 }}>
                  <DollarSign size={14} color={C.accent}/>{job.salary}
                </Box>
              </Box>
              <Box sx={{ display:"flex", gap:1, flexWrap:"wrap", mb:2 }}>
                {(job.tags||[]).map((tag,i) => (
                  <Chip key={i} label={tag} size="small" sx={{ background:`${C.primary}22`, color: C.primary, fontSize:11 }} />
                ))}
              </Box>
              <Box sx={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <Typography sx={{ color: C.muted, fontSize:12 }}>{job.applications} applications</Typography>
                <Button size="small" onClick={() => openModal(job)}
                  sx={{ background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, color:"#fff",
                    borderRadius:1.5, textTransform:"none", fontWeight:600, px:2,
                    boxShadow:`0 4px 12px ${C.primary}44`,
                    '&:hover':{ transform:"translateY(-1px)", boxShadow:`0 6px 18px ${C.primary}66` },
                    transition:"all 0.2s" }}>
                  Apply Now
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ── Application Modal ─────────────────────────────────────────── */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth
        PaperProps={{ sx:{ background: C.surface, border:`1px solid ${C.border}`, borderRadius:3 } }}>

        {/* Header */}
        <DialogTitle sx={{ p:3, pb:0 }}>
          <Box sx={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight:700, color: C.text }}>
                Apply for {selectedJob?.title}
              </Typography>
              <Typography sx={{ color: C.muted, fontSize:13, mt:0.5 }}>
                {selectedJob?.company} · {selectedJob?.location}
              </Typography>
            </Box>
            <IconButton onClick={handleClose} size="small" sx={{ color: C.muted, '&:hover':{ color: C.text } }}>
              <X size={18}/>
            </IconButton>
          </Box>
          <Divider sx={{ borderColor: C.border, mt:2 }} />
        </DialogTitle>

        <DialogContent sx={{ p:3 }}>
          {submitted ? (
            /* Success state */
            <Box sx={{ textAlign:"center", py:4 }}>
              <Box sx={{ width:64, height:64, borderRadius:"50%", background:`${C.success}22`,
                display:"flex", alignItems:"center", justifyContent:"center", mx:"auto", mb:2 }}>
                <Send size={28} color={C.success}/>
              </Box>
              <Typography variant="h6" sx={{ fontWeight:700, color: C.text, mb:1 }}>
                Application Submitted!
              </Typography>
              <Typography sx={{ color: C.muted, fontSize:14 }}>
                Your application for <strong style={{ color: C.text }}>{selectedJob?.title}</strong> at{" "}
                <strong style={{ color: C.text }}>{selectedJob?.company}</strong> has been sent successfully.
              </Typography>
              <Button onClick={handleClose} variant="contained" sx={{ mt:3, background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
                borderRadius:2, textTransform:"none", fontWeight:600, boxShadow:"none" }}>
                Close
              </Button>
            </Box>
          ) : (
            /* Form */
            <Box sx={{ pt:1 }}>
              <TextField fullWidth label="Full Name *" value={form.fullName}
                onChange={e => handleChange('fullName', e.target.value)} sx={fSx} />
              <TextField fullWidth label="Email *" type="email" value={form.email}
                onChange={e => handleChange('email', e.target.value)} sx={fSx} />
              <TextField fullWidth label="Phone Number *" value={form.phone}
                onChange={e => handleChange('phone', e.target.value)} sx={fSx} />

              {/* Resume Upload */}
              <Box sx={{ mb:2 }}>
                <Typography sx={{ color: C.muted, fontSize:13, mb:1 }}>Resume</Typography>
                <Button variant="outlined" component="label" startIcon={<Upload size={16}/>} fullWidth
                  sx={{ borderColor: C.border, color: form.resume ? C.success : C.muted, borderRadius:2,
                    textTransform:"none", py:1.5, justifyContent:"flex-start",
                    background: form.resume ? `${C.success}11` : 'transparent',
                    '&:hover':{ borderColor: C.primary, color: C.primary } }}>
                  {form.resume ? form.resume.name : "Upload Resume (PDF, DOC)"}
                  <input type="file" hidden accept=".pdf,.doc,.docx"
                    onChange={e => handleChange('resume', e.target.files[0])} />
                </Button>
              </Box>

              <TextField fullWidth label="Cover Letter" multiline rows={3} value={form.coverLetter}
                onChange={e => handleChange('coverLetter', e.target.value)}
                placeholder="Tell us why you're a great fit..." sx={fSx} />
              <TextField fullWidth label="Portfolio Link (optional)" value={form.portfolioLink}
                onChange={e => handleChange('portfolioLink', e.target.value)}
                placeholder="https://yourportfolio.com" sx={{ ...fSx, mb:0 }} />
            </Box>
          )}
        </DialogContent>

        {!submitted && (
          <DialogActions sx={{ px:3, pb:3, pt:2, gap:1 }}>
            <Button onClick={handleClose} sx={{ color: C.muted, textTransform:"none", borderRadius:2 }}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} variant="contained" disabled={submitting || !form.fullName || !form.email || !form.phone}
              startIcon={submitting ? <CircularProgress size={16} color="inherit"/> : <Send size={16}/>}
              sx={{ background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
                borderRadius:2, textTransform:"none", fontWeight:700, px:4, py:1.2,
                boxShadow:`0 4px 16px ${C.primary}44`, '&:disabled':{ opacity:0.5 } }}>
              {submitting ? "Submitting…" : "Submit Application"}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
}
