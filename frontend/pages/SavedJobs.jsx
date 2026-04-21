import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import {
  Box, Card, Typography, Chip, Button, CircularProgress,
  IconButton, Tooltip, Dialog, DialogTitle, DialogContent,
  DialogActions, Divider, TextField
} from '@mui/material';
import { Star, MapPin, X, Upload, Send } from 'lucide-react';
import { savedJobService, applicationService } from '../services/api';
import { API_BASE_URL } from '../config/api';
import { C, cardSx, fieldSx } from '../theme';

const fSx = {
  ...fieldSx, mb:2,
  '& input:-webkit-autofill':{ WebkitBoxShadow:'0 0 0 100px #1E293B inset', WebkitTextFillColor:'#F1F5F9' },
};
const emptyForm = { fullName:'', email:'', phone:'', coverLetter:'', portfolioLink:'', resume:null };

export default function SavedJobs() {
  const [jobs, setJobs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [open, setOpen]           = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [form, setForm]           = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const user   = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user?.id || user?._id;

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    savedJobService.getAll(userId).then(d => d.success && setJobs(d.jobs)).finally(() => setLoading(false));
  }, [userId]);

  const handleUnsave = async (jobId) => {
    await savedJobService.toggle(userId, jobId);
    setJobs(prev => prev.filter(j => (j._id || j.id) !== jobId));
  };

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
      let uploadedFilename = '';
      if (form.resume) {
        const formData = new FormData();
        formData.append('resume', form.resume);
        const token = localStorage.getItem('token');
        const uploadRes = await fetch(
          `${API_BASE_URL}/auth/upload-resume`,
          { method:'POST', headers:{ Authorization:`Bearer ${token}` }, body: formData }
        );
        const uploadData = await uploadRes.json();
        if (uploadData.success) uploadedFilename = uploadData.filename;
      }
      const r = await applicationService.apply(userId, {
        jobId:         selectedJob?._id || selectedJob?.id,
        coverLetter:   form.coverLetter,
        portfolioLink: form.portfolioLink,
        resumeFile:    uploadedFilename,
        userPhone:     form.phone,
      });
      r.success ? setSubmitted(true) : alert(r.error || 'Failed to submit');
    } catch { alert('Network error'); }
    finally { setSubmitting(false); }
  };

  const typeColor = (t) => t === 'Full-time'
    ? { bg:`${C.success}22`, color: C.success }
    : { bg:`${C.warning}22`, color: C.warning };

  return (
    <Box sx={{ display:'flex', background: C.bg, minHeight:'100vh' }}>
      <Sidebar />
      <Box sx={{ marginLeft:{ xs:0, lg:'240px' }, width:{ xs:'100%', lg:'calc(100% - 240px)' }, p:{ xs:'16px', sm:'24px', lg:'32px' }, pt:{ xs:'64px', lg:'32px' } }}>
        <Box sx={{ mb:4 }}>
          <Typography variant="h4" sx={{ fontWeight:700, color: C.text }}>Saved Jobs</Typography>
          <Typography sx={{ color: C.muted, mt:0.5 }}>{jobs.length} job{jobs.length !== 1 ? 's' : ''} saved</Typography>
        </Box>

        {loading ? (
          <Box sx={{ display:'flex', justifyContent:'center', pt:8 }}>
            <CircularProgress sx={{ color: C.primary }}/>
          </Box>
        ) : jobs.length === 0 ? (
          <Card sx={{ ...cardSx, p:6, textAlign:'center' }}>
            <Star size={48} color={C.border} style={{ marginBottom:16 }}/>
            <Typography variant="h6" sx={{ color: C.text, mb:1 }}>No saved jobs yet</Typography>
            <Typography sx={{ color: C.muted, mb:3 }}>Browse jobs and click the ★ star icon to save them here</Typography>
            <Button variant="contained" href="/jobs"
              sx={{ background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, borderRadius:2, textTransform:'none', fontWeight:600, boxShadow:'none' }}>
              Browse Jobs
            </Button>
          </Card>
        ) : (
          <Box sx={{ display:'grid', gridTemplateColumns:{ xs:'1fr', sm:'repeat(2,1fr)', lg:'repeat(3,1fr)' }, gap:{ xs:2, sm:3 } }}>
            {jobs.map(job => {
              const jid = job._id || job.id;
              return (
                <Box key={jid} sx={{ display:'flex' }}>
                  <Card sx={{ ...cardSx, p:3, width:'100%', display:'flex', flexDirection:'column', position:'relative',
                    '&:hover':{ borderColor: C.warning, transform:'translateY(-3px)', boxShadow:`0 12px 32px rgba(0,0,0,0.4)` } }}>

                    <Tooltip title="Remove from saved">
                      <IconButton size="small" onClick={() => handleUnsave(jid)}
                        sx={{ position:'absolute', top:12, right:12, color: C.warning, '&:hover':{ background:`${C.warning}22` } }}>
                        <Star size={18} fill={C.warning}/>
                      </IconButton>
                    </Tooltip>

                    <Box sx={{ pr:4, mb:1 }}>
                      <Typography sx={{ fontWeight:700, color: C.text, fontSize:16, mb:0.5, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{job.title}</Typography>
                      <Typography sx={{ color: C.muted, fontSize:13 }}>{job.company}</Typography>
                    </Box>

                    <Chip label={job.type} size="small" sx={{ background: typeColor(job.type).bg, color: typeColor(job.type).color, fontWeight:600, mb:1.5, alignSelf:'flex-start' }}/>

                    <Typography sx={{ color: C.muted, fontSize:13, mb:1.5, flexGrow:1, overflow:'hidden',
                      display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical' }}>{job.description}</Typography>

                    <Box sx={{ display:'flex', gap:2, mb:1.5 }}>
                      <Box sx={{ display:'flex', alignItems:'center', gap:0.5, color: C.muted, fontSize:12 }}>
                        <MapPin size={13} color={C.accent}/>{job.location}
                      </Box>
                      <Box sx={{ color: C.muted, fontSize:12 }}>{job.salary}</Box>
                    </Box>

                    <Box sx={{ display:'flex', gap:1, flexWrap:'wrap', mb:1.5, maxHeight:48, overflow:'hidden' }}>
                      {(job.skills||job.tags||[]).map((s,i) => (
                        <Chip key={i} label={s} size="small" sx={{ background:`${C.primary}22`, color: C.primary, fontSize:11 }}/>
                      ))}
                    </Box>

                    <Button onClick={() => openModal(job)} sx={{ mt:'auto',
                      background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, color:'#fff',
                      borderRadius:1.5, textTransform:'none', fontWeight:600, boxShadow:'none', '&:hover':{ opacity:0.9 } }}>
                      Apply Now
                    </Button>
                  </Card>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>

      {/* Apply Modal */}
      <Dialog open={open} onClose={() => { setOpen(false); setSubmitted(false); }} maxWidth="sm" fullWidth
        PaperProps={{ sx:{ background: C.surface, border:`1px solid ${C.border}`, borderRadius:3 } }}>
        <DialogTitle sx={{ p:3, pb:0 }}>
          <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight:700, color: C.text }}>Apply for {selectedJob?.title}</Typography>
              <Typography sx={{ color: C.muted, fontSize:13, mt:0.5 }}>{selectedJob?.company} · {selectedJob?.location}</Typography>
            </Box>
            <IconButton onClick={() => setOpen(false)} size="small" sx={{ color: C.muted }}><X size={18}/></IconButton>
          </Box>
          <Divider sx={{ borderColor: C.border, mt:2 }}/>
        </DialogTitle>

        <DialogContent sx={{ p:3 }}>
          {submitted ? (
            <Box sx={{ textAlign:'center', py:4 }}>
              <Box sx={{ width:64, height:64, borderRadius:'50%', background:`${C.success}22`, display:'flex', alignItems:'center', justifyContent:'center', mx:'auto', mb:2 }}>
                <Send size={28} color={C.success}/>
              </Box>
              <Typography variant="h6" sx={{ fontWeight:700, color: C.text, mb:1 }}>Application Submitted!</Typography>
              <Typography sx={{ color: C.muted, fontSize:14 }}>
                Your application for <strong style={{ color: C.text }}>{selectedJob?.title}</strong> has been sent.
              </Typography>
              <Button onClick={() => setOpen(false)} variant="contained"
                sx={{ mt:3, background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, borderRadius:2, textTransform:'none', fontWeight:600, boxShadow:'none' }}>
                Close
              </Button>
            </Box>
          ) : (
            <Box sx={{ pt:1 }}>
              <TextField fullWidth label="Full Name *" value={form.fullName} onChange={e => handleChange('fullName', e.target.value)} sx={fSx}/>
              <TextField fullWidth label="Email *" type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} sx={fSx}/>
              <TextField fullWidth label="Phone Number *" value={form.phone} onChange={e => handleChange('phone', e.target.value)} sx={fSx}/>
              <Box sx={{ mb:2 }}>
                <Typography sx={{ color: C.muted, fontSize:13, mb:1 }}>Resume</Typography>
                <Button variant="outlined" component="label" startIcon={<Upload size={16}/>} fullWidth
                  sx={{ borderColor: form.resume ? C.success : C.border, color: form.resume ? C.success : C.muted,
                    borderRadius:2, textTransform:'none', py:1.5, justifyContent:'flex-start',
                    background: form.resume ? `${C.success}11` : 'transparent', '&:hover':{ borderColor: C.primary, color: C.primary } }}>
                  {form.resume ? form.resume.name : 'Upload Resume (PDF, DOC)'}
                  <input type="file" hidden accept=".pdf,.doc,.docx" onChange={e => handleChange('resume', e.target.files[0])}/>
                </Button>
              </Box>
              <TextField fullWidth label="Cover Letter" multiline rows={3} value={form.coverLetter}
                onChange={e => handleChange('coverLetter', e.target.value)} placeholder="Tell us why you're a great fit..." sx={fSx}/>
              <TextField fullWidth label="Portfolio Link (optional)" value={form.portfolioLink}
                onChange={e => handleChange('portfolioLink', e.target.value)} sx={{ ...fSx, mb:0 }}/>
            </Box>
          )}
        </DialogContent>

        {!submitted && (
          <DialogActions sx={{ px:3, pb:3, pt:2, gap:1 }}>
            <Button onClick={() => setOpen(false)} sx={{ color: C.muted, textTransform:'none', borderRadius:2 }}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained"
              disabled={submitting || !form.fullName || !form.email || !form.phone}
              startIcon={submitting ? <CircularProgress size={16} color="inherit"/> : <Send size={16}/>}
              sx={{ background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, borderRadius:2,
                textTransform:'none', fontWeight:700, px:4, py:1.2,
                boxShadow:`0 4px 16px ${C.primary}44`, '&:disabled':{ opacity:0.5 } }}>
              {submitting ? 'Submitting…' : 'Submit Application'}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Box>
  );
}

