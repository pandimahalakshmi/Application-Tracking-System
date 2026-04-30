import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {
  Box, Card, Typography, Button, Chip, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Divider, IconButton, TextField, Tooltip,
} from "@mui/material";
import {
  ArrowLeft, MapPin, Briefcase, DollarSign, Calendar,
  Star, Send, Upload, CheckCircle, Users, Clock,
} from "lucide-react";
import { jobService, applicationService, savedJobService } from "../services/api";
import { API_BASE_URL } from "../config/api";
import { useAppTheme } from "../hooks/useAppTheme";

const emptyForm = { fullName: '', email: '', phone: '', coverLetter: '', portfolioLink: '', resume: null };

export default function JobDescriptionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { C, fieldSx } = useAppTheme();

  const user   = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id || user?._id;

  const fSx = {
    ...fieldSx, mb: 2,
    '& input:-webkit-autofill': { WebkitBoxShadow: `0 0 0 100px ${C.surface} inset`, WebkitTextFillColor: C.text },
  };

  const [job,        setJob]        = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [notFound,   setNotFound]   = useState(false);
  const [isSaved,    setIsSaved]    = useState(false);
  const [open,       setOpen]       = useState(false);
  const [form,       setForm]       = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);

  useEffect(() => {
    jobService.getById(id).then(r => {
      if (r.success && r.job) setJob(r.job);
      else setNotFound(true);
    }).finally(() => setLoading(false));

    if (userId) {
      savedJobService.getIds(userId).then(r => {
        if (r.success) setIsSaved(r.savedIds.includes(id));
      });
    }
  }, [id, userId]);

  const handleToggleSave = async () => {
    if (!userId) return;
    const r = await savedJobService.toggle(userId, id);
    if (r.success) setIsSaved(r.saved);
  };

  const openApply = () => {
    setForm({ ...emptyForm, fullName: user?.name || '', email: user?.email || '' });
    setSubmitted(false);
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.fullName || !form.email || !form.phone) return;
    setSubmitting(true);
    try {
      let uploadedFilename = '';
      if (form.resume) {
        const fd = new FormData();
        fd.append('resume', form.resume);
        const token = localStorage.getItem('token');
        const up = await fetch(`${API_BASE_URL}/auth/upload-resume`, {
          method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd,
        });
        const upData = await up.json();
        if (upData.success) uploadedFilename = upData.filename;
      }
      const r = await applicationService.apply(userId, {
        jobId: id, coverLetter: form.coverLetter,
        portfolioLink: form.portfolioLink, resumeFile: uploadedFilename, userPhone: form.phone,
      });
      r.success ? setSubmitted(true) : alert(r.error || 'Failed to submit');
    } catch { alert('Network error'); }
    finally { setSubmitting(false); }
  };

  const typeColor = (t) => {
    if (!t) return { bg: `${C.muted}22`, color: C.muted };
    if (t.toLowerCase().includes('full')) return { bg: `${C.success}22`, color: C.success };
    if (t.toLowerCase().includes('remote')) return { bg: `${C.accent}22`, color: C.accent };
    return { bg: `${C.warning}22`, color: C.warning };
  };

  const wrap = (children) => (
    <Box sx={{ display: 'flex', background: C.bg, minHeight: '100vh' }}>
      <Sidebar />
      <Box sx={{ marginLeft: { xs: 0, lg: '240px' }, width: '100%', minWidth: 0,
        p: { xs: '12px', sm: '20px', lg: '32px' }, pt: { xs: '64px', lg: '32px' }, overflowX: 'hidden' }}>
        {children}
      </Box>
    </Box>
  );

  if (loading) return wrap(
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <CircularProgress sx={{ color: C.primary }} />
    </Box>
  );

  if (notFound) return wrap(
    <Box sx={{ textAlign: 'center', py: 10 }}>
      <Briefcase size={48} color={C.border} style={{ marginBottom: 16 }} />
      <Typography sx={{ color: C.text, fontWeight: 700, fontSize: '1.2rem', mb: 1 }}>Job Not Found</Typography>
      <Typography sx={{ color: C.muted, mb: 3 }}>This job may have been removed or the link is invalid.</Typography>
      <Button onClick={() => navigate('/jobs')} startIcon={<ArrowLeft size={16} />}
        sx={{ background: `linear-gradient(135deg,${C.primary},${C.secondary})`, color: '#fff',
          borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
        Back to Jobs
      </Button>
    </Box>
  );

  const skills = job.skills || job.tags || [];
  const requirements = job.requirements
    ? job.requirements.split('\n').filter(r => r.trim())
    : [];

  return wrap(
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .jd-fade { animation: fadeSlideUp 0.35s ease; }
      `}</style>

      {/* Back button */}
      <Button onClick={() => navigate('/jobs')} startIcon={<ArrowLeft size={15} />}
        sx={{ color: C.muted, textTransform: 'none', fontWeight: 600, fontSize: '0.82rem',
          mb: 2.5, px: 1.5, borderRadius: 2, '&:hover': { background: `${C.primary}12`, color: C.primary } }}>
        Back to Jobs
      </Button>

      <Box className="jd-fade" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 340px' }, gap: 3, alignItems: 'start' }}>

        {/* ── LEFT: Main content ── */}
        <Box>
          {/* Header card */}
          <Card sx={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 3,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)', p: { xs: '20px', sm: '28px' }, mb: 2.5 }}>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, gap: 1 }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 800, color: C.text, fontSize: { xs: '1.2rem', sm: '1.5rem' }, lineHeight: 1.3, mb: 0.5 }}>
                  {job.title}
                </Typography>
                <Typography sx={{ color: C.muted, fontSize: '0.9rem', fontWeight: 500 }}>{job.company}</Typography>
              </Box>
              <Tooltip title={isSaved ? 'Unsave' : 'Save job'}>
                <IconButton onClick={handleToggleSave}
                  sx={{ color: isSaved ? C.warning : C.muted, flexShrink: 0,
                    '&:hover': { color: C.warning, background: `${C.warning}18` }, transition: 'all 0.2s' }}>
                  <Star size={20} fill={isSaved ? C.warning : 'none'} />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Meta chips row */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2.5 }}>
              {job.type && (
                <Chip label={job.type} size="small"
                  sx={{ background: typeColor(job.type).bg, color: typeColor(job.type).color,
                    fontWeight: 700, fontSize: '0.72rem' }} />
              )}
              {job.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: C.muted, fontSize: '0.8rem' }}>
                  <MapPin size={13} color={C.accent} /> {job.location}
                </Box>
              )}
              {job.salary && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: C.muted, fontSize: '0.8rem' }}>
                  <DollarSign size={13} color={C.success} /> {job.salary}
                </Box>
              )}
              {job.createdAt && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: C.muted, fontSize: '0.8rem' }}>
                  <Calendar size={13} color={C.muted} />
                  Posted {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </Box>
              )}
              {job.applications !== undefined && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: C.muted, fontSize: '0.8rem' }}>
                  <Users size={13} color={C.muted} /> {job.applications} applicants
                </Box>
              )}
            </Box>

            <Divider sx={{ borderColor: C.border, mb: 2.5 }} />

            {/* Description */}
            <Typography sx={{ fontWeight: 700, color: C.text, fontSize: '0.95rem', mb: 1.25 }}>
              Job Description
            </Typography>
            <Typography sx={{ color: C.muted, fontSize: '0.875rem', lineHeight: 1.85, whiteSpace: 'pre-line' }}>
              {job.description}
            </Typography>

            {/* Requirements */}
            {requirements.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography sx={{ fontWeight: 700, color: C.text, fontSize: '0.95rem', mb: 1.25 }}>
                  Requirements
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                  {requirements.map((req, i) => (
                    <Box component="li" key={i} sx={{ color: C.muted, fontSize: '0.875rem', lineHeight: 1.85, mb: 0.5 }}>
                      {req.replace(/^[-•*]\s*/, '')}
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography sx={{ fontWeight: 700, color: C.text, fontSize: '0.95rem', mb: 1.25 }}>
                  Skills & Technologies
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {skills.map((s, i) => (
                    <Chip key={i} label={s} size="small"
                      sx={{ background: `${C.primary}18`, color: C.primary,
                        fontWeight: 600, fontSize: '0.75rem', border: `1px solid ${C.primary}30` }} />
                  ))}
                </Box>
              </Box>
            )}
          </Card>
        </Box>

        {/* ── RIGHT: Sticky apply card ── */}
        <Box sx={{ position: { lg: 'sticky' }, top: { lg: 32 } }}>
          <Card sx={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 3,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)', p: { xs: '20px', sm: '24px' } }}>

            <Typography sx={{ fontWeight: 700, color: C.text, fontSize: '1rem', mb: 0.5 }}>{job.title}</Typography>
            <Typography sx={{ color: C.muted, fontSize: '0.82rem', mb: 2 }}>{job.company}</Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, mb: 2.5 }}>
              {[
                { icon: MapPin,     color: C.accent,   label: job.location || 'Not specified' },
                { icon: DollarSign, color: C.success,  label: job.salary   || 'Not specified' },
                { icon: Briefcase,  color: C.primary,  label: job.type     || 'Not specified' },
                { icon: Clock,      color: C.warning,  label: job.createdAt
                    ? `Posted ${new Date(job.createdAt).toLocaleDateString('en-US',{ month:'short', day:'numeric' })}`
                    : 'Recently posted' },
              ].map(({ icon: Icon, color, label }) => (
                <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                  <Box sx={{ width: 30, height: 30, borderRadius: 1.5, background: `${color}18`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={14} color={color} />
                  </Box>
                  <Typography sx={{ color: C.text, fontSize: '0.8rem', fontWeight: 500 }}>{label}</Typography>
                </Box>
              ))}
            </Box>

            <Divider sx={{ borderColor: C.border, mb: 2.5 }} />

            <Button fullWidth onClick={openApply} startIcon={<Send size={15} />}
              sx={{ background: `linear-gradient(135deg,${C.primary},${C.secondary})`, color: '#fff',
                borderRadius: 2, textTransform: 'none', fontWeight: 700, fontSize: '0.9rem',
                minHeight: 44, mb: 1.5, boxShadow: `0 4px 16px ${C.primary}44`,
                '&:hover': { opacity: 0.92, transform: 'translateY(-1px)' }, transition: 'all 0.2s' }}>
              Apply Now
            </Button>

            <Button fullWidth onClick={handleToggleSave} startIcon={<Star size={15} fill={isSaved ? C.warning : 'none'} />}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.82rem',
                minHeight: 40, color: isSaved ? C.warning : C.muted,
                border: `1px solid ${isSaved ? C.warning : C.border}`,
                background: isSaved ? `${C.warning}12` : 'transparent',
                '&:hover': { borderColor: C.warning, color: C.warning, background: `${C.warning}12` } }}>
              {isSaved ? 'Saved' : 'Save Job'}
            </Button>
          </Card>
        </Box>
      </Box>

      {/* ── Apply Modal ── */}
      <Dialog open={open} onClose={() => { setOpen(false); setSubmitted(false); }} maxWidth="sm" fullWidth
        PaperProps={{ sx: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 3 } }}>
        <DialogTitle sx={{ p: 3, pb: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: C.text }}>Apply for {job.title}</Typography>
              <Typography sx={{ color: C.muted, fontSize: 13, mt: 0.5 }}>{job.company} · {job.location}</Typography>
            </Box>
            <IconButton onClick={() => setOpen(false)} size="small" sx={{ color: C.muted }}>
              <ArrowLeft size={18} />
            </IconButton>
          </Box>
          <Divider sx={{ borderColor: C.border, mt: 2 }} />
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {submitted ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Box sx={{ width: 64, height: 64, borderRadius: '50%', background: `${C.success}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                <CheckCircle size={28} color={C.success} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: C.text, mb: 1 }}>Application Submitted!</Typography>
              <Typography sx={{ color: C.muted, fontSize: 14 }}>
                Your application for <strong style={{ color: C.text }}>{job.title}</strong> has been sent.
              </Typography>
              <Button onClick={() => setOpen(false)} variant="contained"
                sx={{ mt: 3, background: `linear-gradient(135deg,${C.primary},${C.secondary})`,
                  borderRadius: 2, textTransform: 'none', fontWeight: 600, boxShadow: 'none' }}>
                Close
              </Button>
            </Box>
          ) : (
            <Box sx={{ pt: 1 }}>
              <TextField fullWidth label="Full Name *" value={form.fullName}
                onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} sx={fSx} />
              <TextField fullWidth label="Email *" type="email" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))} sx={fSx} />
              <TextField fullWidth label="Phone Number *" value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} sx={fSx} />
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ color: C.muted, fontSize: 13, mb: 1 }}>Resume</Typography>
                <Button variant="outlined" component="label" startIcon={<Upload size={16} />} fullWidth
                  sx={{ borderColor: form.resume ? C.success : C.border, color: form.resume ? C.success : C.muted,
                    borderRadius: 2, textTransform: 'none', py: 1.5, justifyContent: 'flex-start',
                    background: form.resume ? `${C.success}11` : 'transparent',
                    '&:hover': { borderColor: C.primary, color: C.primary } }}>
                  {form.resume ? form.resume.name : 'Upload Resume (PDF, DOC)'}
                  <input type="file" hidden accept=".pdf,.doc,.docx"
                    onChange={e => setForm(p => ({ ...p, resume: e.target.files[0] }))} />
                </Button>
              </Box>
              <TextField fullWidth label="Cover Letter" multiline rows={3} value={form.coverLetter}
                onChange={e => setForm(p => ({ ...p, coverLetter: e.target.value }))}
                placeholder="Tell us why you're a great fit..." sx={fSx} />
              <TextField fullWidth label="Portfolio Link (optional)" value={form.portfolioLink}
                onChange={e => setForm(p => ({ ...p, portfolioLink: e.target.value }))}
                sx={{ ...fSx, mb: 0 }} />
            </Box>
          )}
        </DialogContent>

        {!submitted && (
          <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
            <Button onClick={() => setOpen(false)} sx={{ color: C.muted, textTransform: 'none', borderRadius: 2 }}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} variant="contained"
              disabled={submitting || !form.fullName || !form.email || !form.phone}
              startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <Send size={16} />}
              sx={{ background: `linear-gradient(135deg,${C.primary},${C.secondary})`, borderRadius: 2,
                textTransform: 'none', fontWeight: 700, px: 4, py: 1.2,
                boxShadow: `0 4px 16px ${C.primary}44`, '&:disabled': { opacity: 0.5 } }}>
              {submitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
}
