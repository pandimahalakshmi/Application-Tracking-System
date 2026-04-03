import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
  Box, Card, TextField, Button, Typography, Grid,
  Select, MenuItem, FormControl, InputLabel, Alert,
  Avatar, Divider,
} from '@mui/material';
import { Calendar, Clock, User, Briefcase, Video, CheckCircle } from 'lucide-react';
import { C, menuPropsSx } from '../theme';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const fSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2, background: '#0F172A', color: '#F1F5F9',
    '& fieldset': { borderColor: '#334155' },
    '&:hover fieldset': { borderColor: '#6366F1' },
    '&.Mui-focused fieldset': { borderColor: '#6366F1', borderWidth: 2 },
  },
  '& .MuiInputLabel-root': { color: '#94A3B8' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#6366F1' },
};

export default function ScheduleInterviewPage() {
  const navigate = useNavigate();
  const token    = localStorage.getItem('token');

  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState({
    applicationId: '', interviewer: '', date: '', time: '', type: 'Video', notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => {
    fetch(`${BASE}/applications/admin`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => d.success && setApplications(d.applications));
  }, []);

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const selectedApp = applications.find(a => a._id === form.applicationId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.applicationId) { setError('Please select a candidate'); return; }
    if (!form.date || !form.time) { setError('Please select date and time'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch(`${BASE}/interviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => navigate('/dashboard'), 3000);
      } else {
        setError(data.error || 'Failed to schedule interview');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', background: C.bg, minHeight: '100vh' }}>
      <Sidebar />
      <Box sx={{ marginLeft: '240px', width: '100%', p: '32px' }}>

        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: C.text }}>
            Schedule Interview
          </Typography>
          <Typography sx={{ color: C.muted, mt: 0.5 }}>
            Select a candidate and set interview details — they'll be notified automatically
          </Typography>
        </Box>

        {success ? (
          /* ── Success State ── */
          <Card sx={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 3, p: 6, textAlign: 'center', maxWidth: 500, mx: 'auto' }}>
            <Box sx={{ width: 72, height: 72, borderRadius: '50%', background: `${C.success}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
              <CheckCircle size={36} color={C.success} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: C.text, mb: 1 }}>Interview Scheduled!</Typography>
            <Typography sx={{ color: C.muted, mb: 1 }}>
              {selectedApp?.userName} has been notified via email and dashboard notification.
            </Typography>
            <Typography sx={{ color: C.muted, fontSize: 13 }}>Redirecting to dashboard…</Typography>
          </Card>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} lg={8}>
              <Card sx={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 3, p: 4 }}>

                {error && (
                  <Alert severity="error" sx={{ mb: 3, borderRadius: 2, background: 'rgba(248,113,113,0.1)', color: '#F87171', border: '1px solid rgba(248,113,113,0.3)', '& .MuiAlert-icon': { color: '#F87171' } }}>
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>

                  {/* Section 1 — Candidate */}
                  <Typography sx={{ color: C.muted, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, mb: 2 }}>
                    Candidate
                  </Typography>

                  <FormControl fullWidth sx={{ ...fSx, mb: 2 }}>
                    <InputLabel sx={{ color: C.muted }}>Select Candidate *</InputLabel>
                    <Select
                      name="applicationId"
                      value={form.applicationId}
                      onChange={handle}
                      sx={{ color: C.text }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            background: C.surface,
                            border: `1px solid ${C.border}`,
                            maxHeight: 280,
                            '& .MuiMenuItem-root': {
                              color: C.text,
                              py: 1.5,
                              '&:hover': { background: `${C.primary}22` },
                              '&.Mui-selected': { background: `${C.primary}33` },
                            },
                          },
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        <Typography sx={{ color: C.muted, fontSize: 13 }}>— Choose a candidate —</Typography>
                      </MenuItem>
                      {applications.length === 0 && (
                        <MenuItem disabled>
                          <Typography sx={{ color: C.muted, fontSize: 13 }}>No applications found</Typography>
                        </MenuItem>
                      )}
                      {applications.map(a => (
                        <MenuItem key={a._id} value={a._id}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 28, height: 28, fontSize: 12, fontWeight: 700, background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
                              {(a.userName || '?').charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography sx={{ fontSize: 13, fontWeight: 600, color: C.text, lineHeight: 1.3 }}>
                                {a.userName}
                              </Typography>
                              <Typography sx={{ fontSize: 11, color: C.muted }}>
                                {a.jobTitle} · {a.company}
                              </Typography>
                            </Box>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Selected candidate preview */}
                  {selectedApp && (
                    <Box sx={{ mb: 3, p: 2, borderRadius: 2, background: `${C.primary}11`, border: `1px solid ${C.primary}33`, display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 40, height: 40, fontWeight: 700, background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
                        {selectedApp.userName.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography sx={{ color: C.text, fontWeight: 600, fontSize: 14 }}>{selectedApp.userName}</Typography>
                        <Typography sx={{ color: C.muted, fontSize: 12 }}>
                          {selectedApp.jobTitle} · {selectedApp.company}
                        </Typography>
                        <Typography sx={{ color: C.accent, fontSize: 11, mt: 0.3 }}>
                          📧 Notification → {selectedApp.userEmail}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  <Divider sx={{ borderColor: C.border, mb: 3 }} />

                  {/* Section 2 — Interview Details */}
                  <Typography sx={{ color: C.muted, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, mb: 2 }}>
                    Interview Details
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Interviewer Name *" name="interviewer"
                        value={form.interviewer} onChange={handle} required size="small" sx={fSx}
                        InputProps={{ startAdornment: <User size={15} color={C.muted} style={{ marginRight: 8, flexShrink: 0 }} /> }} />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth size="small" sx={fSx}>
                        <InputLabel sx={{ color: C.muted }}>Interview Type</InputLabel>
                        <Select name="type" value={form.type} onChange={handle} sx={{ color: C.text }} MenuProps={menuPropsSx}>
                          {['Phone', 'Video', 'In-person'].map(t => (
                            <MenuItem key={t} value={t}>{t}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Date *" name="date" type="date"
                        value={form.date} onChange={handle} required size="small" sx={fSx}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ startAdornment: <Calendar size={15} color={C.muted} style={{ marginRight: 8, flexShrink: 0 }} /> }} />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Time *" name="time" type="time"
                        value={form.time} onChange={handle} required size="small" sx={fSx}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ startAdornment: <Clock size={15} color={C.muted} style={{ marginRight: 8, flexShrink: 0 }} /> }} />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField fullWidth label="Notes / Instructions" name="notes" multiline rows={3}
                        value={form.notes} onChange={handle} size="small"
                        placeholder="e.g. Please join 5 minutes early. Meeting link will be shared separately."
                        sx={{
                          ...fSx,
                          '& textarea': {
                            scrollbarWidth: 'thin',
                            scrollbarColor: `${C.border} transparent`,
                            '&::-webkit-scrollbar': { width: 6 },
                            '&::-webkit-scrollbar-track': { background: 'transparent' },
                            '&::-webkit-scrollbar-thumb': { background: C.border, borderRadius: 3 },
                          },
                        }} />
                    </Grid>
                  </Grid>

                  <Divider sx={{ borderColor: C.border, my: 3 }} />

                  {/* Actions */}
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button type="submit" variant="contained" disabled={loading}
                      sx={{ px: 4, py: 1.5, borderRadius: 2, textTransform: 'none', fontWeight: 700,
                        background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`, boxShadow: `0 4px 16px ${C.primary}44`,
                        '&:hover': { transform: 'translateY(-1px)', boxShadow: `0 8px 24px ${C.primary}66` },
                        transition: 'all 0.2s', '&:disabled': { opacity: 0.6 } }}>
                      {loading ? 'Scheduling…' : '📅 Schedule & Notify Candidate'}
                    </Button>
                    <Button variant="outlined" onClick={() => navigate('/dashboard')}
                      sx={{ px: 3, py: 1.5, borderRadius: 2, textTransform: 'none',
                        borderColor: C.border, color: C.muted,
                        '&:hover': { borderColor: C.primary, color: C.primary } }}>
                      Cancel
                    </Button>
                  </Box>

                </form>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  );
}
