import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
  Box, Card, TextField, Button, Typography, Grid,
  Select, MenuItem, FormControl, InputLabel, Alert,
  Avatar, Divider,
} from '@mui/material';
import { Calendar, Clock, User, CheckCircle, Video, Phone, Monitor, Users, Mic } from 'lucide-react';
import { API_BASE_URL } from '../config/api';
import { useAppTheme } from '../hooks/useAppTheme';

const BASE = API_BASE_URL;

const INTERVIEW_TYPES = [
  'HR Interview',
  'Technical Interview',
  'Online Assessment',
  'Panel Interview',
  'Managerial Interview',
  'Final Interview',
];

const INTERVIEW_MODES = [
  { value: 'Google Meet',           icon: <Video size={15}/> },
  { value: 'Video Interview',       icon: <Monitor size={15}/> },
  { value: 'Audio Interview',       icon: <Mic size={15}/> },
  { value: 'Phone Call',            icon: <Phone size={15}/> },
  { value: 'Face to Face Interview',icon: <Users size={15}/> },
];

export default function ScheduleInterviewPage() {
  const navigate = useNavigate();
  const token    = localStorage.getItem('token');
  const { C, fieldSx: fSx, menuPropsSx } = useAppTheme();

  const sectionLabel = (text) => (
    <Typography sx={{ color: C.muted, fontSize:11, fontWeight:700, textTransform:'uppercase',
      letterSpacing:1.2, mb:2, display:'flex', alignItems:'center', gap:1 }}>
      {text}
    </Typography>
  );

  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState({
    applicationId: '',
    interviewer:   '',
    date:          '',
    time:          '',
    type:          'HR Interview',
    mode:          'Google Meet',
    notes:         '',
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
    <Box sx={{ display:'flex', background: C.bg, minHeight:'100vh' }}>
      <Sidebar />
      <Box sx={{ marginLeft:{ xs:0, lg:'240px' }, width:{ xs:'100%', lg:'calc(100% - 240px)' }, minWidth:0, p:{ xs:'12px', sm:'20px', lg:'32px' }, pt:{ xs:'64px', lg:'32px' }, overflowX:'hidden' }}>

        {/* Header */}
        <Box sx={{ mb:{ xs:2, sm:3 } }}>
          <Typography sx={{ fontWeight:700, color: C.text, fontSize:{ xs:'1.1rem', sm:'1.5rem', lg:'1.875rem' } }}>Schedule Interview</Typography>
          <Typography sx={{ color: C.muted, mt:0.5, fontSize:{ xs:'0.72rem', sm:'0.875rem' } }}>
            Select a candidate and set interview details — they'll be notified automatically
          </Typography>
        </Box>

        {success ? (
          <Card sx={{ background: C.surface, border:`1px solid ${C.border}`, borderRadius:3,
            p:6, textAlign:'center', maxWidth:480, mx:'auto' }}>
            <Box sx={{ width:72, height:72, borderRadius:'50%', background:`${C.success}22`,
              display:'flex', alignItems:'center', justifyContent:'center', mx:'auto', mb:3 }}>
              <CheckCircle size={36} color={C.success}/>
            </Box>
            <Typography variant="h5" sx={{ fontWeight:700, color: C.text, mb:1 }}>Interview Scheduled!</Typography>
            <Typography sx={{ color: C.muted, mb:1 }}>
              {selectedApp?.userName} has been notified via email and dashboard notification.
            </Typography>
            <Typography sx={{ color: C.muted, fontSize:13 }}>Redirecting to dashboard…</Typography>
          </Card>
        ) : (
          <Card sx={{ background: C.surface, border:`1px solid ${C.border}`, borderRadius:{ xs:2, sm:3 }, p:{ xs:'14px', sm:3, lg:4 }, maxWidth:900, mx:'auto' }}>

            {error && (
              <Alert severity="error" sx={{ mb:3, borderRadius:2, background:'rgba(248,113,113,0.1)',
                color:'#F87171', border:'1px solid rgba(248,113,113,0.3)',
                '& .MuiAlert-icon':{ color:'#F87171' } }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>

              {/* ── Section 1: Candidate ── */}
              {sectionLabel('1. Select Candidate')}
              <FormControl fullWidth sx={{ ...fSx, mb:2 }}>
                <InputLabel sx={{ color: C.muted }}>Select Candidate *</InputLabel>
                <Select name="applicationId" value={form.applicationId} onChange={handle}
                  sx={{ color: C.text }}
                  MenuProps={{ PaperProps:{ sx:{ background: C.surface, border:`1px solid ${C.border}`, maxHeight:280,
                    '& .MuiMenuItem-root':{ color: C.text, py:1.5,
                      '&:hover':{ background:`${C.primary}22` },
                      '&.Mui-selected':{ background:`${C.primary}33` } } } } }}>
                  <MenuItem value="" disabled>
                    <Typography sx={{ color: C.muted, fontSize:13 }}>— Choose a candidate —</Typography>
                  </MenuItem>
                  {applications.length === 0 && (
                    <MenuItem disabled>
                      <Typography sx={{ color: C.muted, fontSize:13 }}>No applications found</Typography>
                    </MenuItem>
                  )}
                  {applications.map(a => (
                    <MenuItem key={a._id} value={a._id}>
                      <Box sx={{ display:'flex', alignItems:'center', gap:1.5 }}>
                        <Avatar sx={{ width:28, height:28, fontSize:12, fontWeight:700,
                          background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
                          {(a.userName||'?').charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontSize:13, fontWeight:600, color: C.text, lineHeight:1.3 }}>{a.userName}</Typography>
                          <Typography sx={{ fontSize:11, color: C.muted }}>{a.jobTitle} · {a.company}</Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Candidate preview */}
              {selectedApp && (
                <Box sx={{ mb:3, p:2, borderRadius:2, background:`${C.primary}11`,
                  border:`1px solid ${C.primary}33`, display:'flex', alignItems:'center', gap:2 }}>
                  <Avatar sx={{ width:44, height:44, fontWeight:700,
                    background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
                    {selectedApp.userName.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography sx={{ color: C.text, fontWeight:700, fontSize:14 }}>{selectedApp.userName}</Typography>
                    <Typography sx={{ color: C.muted, fontSize:12 }}>{selectedApp.jobTitle} · {selectedApp.company}</Typography>
                    <Typography sx={{ color: C.accent, fontSize:11, mt:0.3 }}>
                      📧 Notification → {selectedApp.userEmail}
                    </Typography>
                  </Box>
                </Box>
              )}

              <Divider sx={{ borderColor: C.border, mb:3 }}/>

              {/* ── Section 2: Interview Details ── */}
              {sectionLabel('2. Interview Details')}

              <Grid container spacing={2.5}>

                {/* Interviewer */}
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Interviewer Name *" name="interviewer"
                    value={form.interviewer} onChange={handle} required size="small" sx={fSx}
                    InputProps={{ startAdornment: <User size={15} color={C.muted} style={{ marginRight:8 }}/> }}/>
                </Grid>

                {/* Date */}
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Interview Date *" name="date" type="date"
                    value={form.date} onChange={handle} required size="small" sx={fSx}
                    InputLabelProps={{ shrink:true }}
                    InputProps={{ startAdornment: <Calendar size={15} color={C.muted} style={{ marginRight:8 }}/> }}/>
                </Grid>

                {/* Time */}
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Interview Time *" name="time" type="time"
                    value={form.time} onChange={handle} required size="small" sx={fSx}
                    InputLabelProps={{ shrink:true }}
                    InputProps={{ startAdornment: <Clock size={15} color={C.muted} style={{ marginRight:8 }}/> }}/>
                </Grid>

                {/* Interview Type */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small" sx={fSx}>
                    <InputLabel sx={{ color: C.muted }}>Interview Type *</InputLabel>
                    <Select name="type" value={form.type} onChange={handle}
                      sx={{ color: C.text }} MenuProps={menuPropsSx}>
                      {INTERVIEW_TYPES.map(t => (
                        <MenuItem key={t} value={t}>{t}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Interview Mode */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small" sx={fSx}>
                    <InputLabel sx={{ color: C.muted }}>Interview Mode *</InputLabel>
                    <Select name="mode" value={form.mode} onChange={handle}
                      sx={{ color: C.text }} MenuProps={menuPropsSx}>
                      {INTERVIEW_MODES.map(({ value, icon }) => (
                        <MenuItem key={value} value={value}>
                          <Box sx={{ display:'flex', alignItems:'center', gap:1.5 }}>
                            <Box sx={{ color: C.accent, display:'flex', alignItems:'center' }}>{icon}</Box>
                            <Typography sx={{ fontSize:13 }}>{value}</Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Notes */}
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Notes / Instructions" name="notes"
                    value={form.notes} onChange={handle} size="small"
                    placeholder="e.g. Join 5 mins early. Link shared separately."
                    sx={fSx}/>
                </Grid>

              </Grid>

              <Divider sx={{ borderColor: C.border, my:3 }}/>

              {/* Actions */}
              <Box sx={{ display:'flex', gap:{ xs:1, sm:2 }, flexWrap:'wrap' }}>
                <Button type="submit" variant="contained" disabled={loading} fullWidth={false}
                  sx={{ flex:{ xs:1, sm:'none' }, px:{ xs:2, sm:4 }, py:{ xs:1.25, sm:1.5 }, borderRadius:2, textTransform:'none', fontWeight:700, fontSize:{ xs:'0.78rem', sm:'0.875rem' },
                    background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
                    boxShadow:`0 4px 16px ${C.primary}44`, minHeight:44,
                    '&:hover':{ transform:'translateY(-1px)' }, transition:'all 0.2s', '&:disabled':{ opacity:0.6 } }}>
                  {loading ? 'Scheduling…' : '📅 Schedule & Notify'}
                </Button>
                <Button variant="outlined" onClick={() => navigate('/dashboard')}
                  sx={{ px:{ xs:2, sm:3 }, py:{ xs:1.25, sm:1.5 }, borderRadius:2, textTransform:'none', fontSize:{ xs:'0.78rem', sm:'0.875rem' }, minHeight:44,
                    borderColor: C.border, color: C.muted,
                    '&:hover':{ borderColor: C.primary, color: C.primary } }}>
                  Cancel
                </Button>
              </Box>

            </form>
          </Card>
        )}
      </Box>
    </Box>
  );
}

