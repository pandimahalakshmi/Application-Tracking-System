import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Box, Card, TextField, Button, Typography, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Calendar, Clock, User, Briefcase, Video } from 'lucide-react';
import { C, fieldSx, cardSx, menuPropsSx } from '../theme';

export default function ScheduleInterviewPage() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const [form, setForm] = useState({ candidateName:'', jobTitle:'', interviewer:'', date:'', time:'', type:'Phone', notes:'' });
  const [submitted, setSubmitted] = useState(false);

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); navigate(role === 'admin' ? '/dashboard' : '/userdashboard'); }, 2000);
  };

  return (
    <Box sx={{ display:'flex', background: C.bg, minHeight:'100vh' }}>
      <Sidebar />
      <Box sx={{ marginLeft:'240px', width:'100%', p:'32px' }}>
        <Box sx={{ mb:4 }}>
          <Typography variant="h4" sx={{ fontWeight:700, color: C.text }}>Schedule Interview</Typography>
          <Typography sx={{ color: C.muted, mt:0.5 }}>Set up an interview session</Typography>
        </Box>

        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={8}>
            <Card sx={{ ...cardSx, p:4 }}>
              {submitted && (
                <Box sx={{ mb:3, p:2, borderRadius:2, background:`${C.success}22`, border:`1px solid ${C.success}44`, color: C.success }}>
                  ✓ Interview scheduled successfully! Redirecting…
                </Box>
              )}
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Candidate Name" name="candidateName" value={form.candidateName} onChange={handle} required sx={fieldSx}
                      InputProps={{ startAdornment: <User size={16} color={C.muted} style={{ marginRight:8 }}/> }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Job Title" name="jobTitle" value={form.jobTitle} onChange={handle} required sx={fieldSx}
                      InputProps={{ startAdornment: <Briefcase size={16} color={C.muted} style={{ marginRight:8 }}/> }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Interviewer" name="interviewer" value={form.interviewer} onChange={handle} required sx={fieldSx}
                      InputProps={{ startAdornment: <User size={16} color={C.muted} style={{ marginRight:8 }}/> }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth sx={fieldSx}>
                      <InputLabel sx={{ color: C.muted }}>Interview Type</InputLabel>
                      <Select name="type" value={form.type} onChange={handle} sx={{ color: C.text }} MenuProps={menuPropsSx}>
                        {['Phone','Video','In-person'].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Date" name="date" type="date" value={form.date} onChange={handle} required sx={fieldSx}
                      InputLabelProps={{ shrink:true }}
                      InputProps={{ startAdornment: <Calendar size={16} color={C.muted} style={{ marginRight:8 }}/> }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Time" name="time" type="time" value={form.time} onChange={handle} required sx={fieldSx}
                      InputLabelProps={{ shrink:true }}
                      InputProps={{ startAdornment: <Clock size={16} color={C.muted} style={{ marginRight:8 }}/> }} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Notes" name="notes" multiline rows={4} value={form.notes} onChange={handle} sx={fieldSx}
                      placeholder="Additional notes or instructions..." />
                  </Grid>
                </Grid>

                <Box sx={{ display:'flex', gap:2, mt:3 }}>
                  <Button type="submit" variant="contained"
                    sx={{ background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, px:4, py:1.5, borderRadius:2, textTransform:'none', fontWeight:700, boxShadow:'none' }}>
                    Schedule Interview
                  </Button>
                  <Button variant="outlined" onClick={() => navigate(role === 'admin' ? '/dashboard' : '/userdashboard')}
                    sx={{ borderColor: C.border, color: C.muted, px:3, py:1.5, borderRadius:2, textTransform:'none', '&:hover':{ borderColor: C.primary, color: C.primary } }}>
                    Cancel
                  </Button>
                </Box>
              </form>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
