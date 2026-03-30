import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Box, Card, Grid, Typography, Chip, Button, CircularProgress, IconButton, Tooltip } from '@mui/material';
import { Star, MapPin, Briefcase } from 'lucide-react';
import { savedJobService } from '../services/api';
import { C, cardSx } from '../theme';

export default function SavedJobs() {
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const user    = JSON.parse(localStorage.getItem('user') || '{}');
  const userId  = user?.id || user?._id;

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    savedJobService.getAll(userId).then(d => d.success && setJobs(d.jobs)).finally(() => setLoading(false));
  }, [userId]);

  const handleUnsave = async (jobId) => {
    await savedJobService.toggle(userId, jobId);
    setJobs(prev => prev.filter(j => (j._id || j.id) !== jobId));
  };

  const typeColor = (t) => t === 'Full-time'
    ? { bg:`${C.success}22`, color: C.success }
    : { bg:`${C.warning}22`, color: C.warning };

  return (
    <Box sx={{ display:'flex', background: C.bg, minHeight:'100vh' }}>
      <Sidebar />
      <Box sx={{ marginLeft:'240px', width:'100%', p:'32px' }}>
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
          <Grid container spacing={3}>
            {jobs.map(job => {
              const jid = job._id || job.id;
              return (
                <Grid item xs={12} sm={6} md={4} key={jid}>
                  <Card sx={{ ...cardSx, p:3, height:'100%', display:'flex', flexDirection:'column', position:'relative',
                    '&:hover':{ borderColor: C.warning, transform:'translateY(-3px)', boxShadow:`0 12px 32px rgba(0,0,0,0.4)` } }}>

                    {/* Unsave button */}
                    <Tooltip title="Remove from saved">
                      <IconButton size="small" onClick={() => handleUnsave(jid)}
                        sx={{ position:'absolute', top:12, right:12, color: C.warning, '&:hover':{ background:`${C.warning}22` } }}>
                        <Star size={18} fill={C.warning}/>
                      </IconButton>
                    </Tooltip>

                    <Box sx={{ pr:4, mb:2 }}>
                      <Typography sx={{ fontWeight:700, color: C.text, fontSize:16, mb:0.5 }}>{job.title}</Typography>
                      <Typography sx={{ color: C.muted, fontSize:13 }}>{job.company}</Typography>
                    </Box>

                    <Chip label={job.type} size="small" sx={{ background: typeColor(job.type).bg, color: typeColor(job.type).color, fontWeight:600, mb:1.5, alignSelf:'flex-start' }}/>

                    <Typography sx={{ color: C.muted, fontSize:13, mb:2, flexGrow:1 }}>{job.description}</Typography>

                    <Box sx={{ display:'flex', gap:2, mb:2 }}>
                      <Box sx={{ display:'flex', alignItems:'center', gap:0.5, color: C.muted, fontSize:12 }}>
                        <MapPin size={13} color={C.accent}/>{job.location}
                      </Box>
                      <Box sx={{ display:'flex', alignItems:'center', gap:0.5, color: C.muted, fontSize:12 }}>
                      {job.salary}
                      </Box>
                    </Box>

                    <Box sx={{ display:'flex', gap:1, flexWrap:'wrap', mb:2 }}>
                      {(job.skills||job.tags||[]).map((s,i) => (
                        <Chip key={i} label={s} size="small" sx={{ background:`${C.primary}22`, color: C.primary, fontSize:11 }}/>
                      ))}
                    </Box>

                    <Button variant="contained" href="/jobs"
                      sx={{ background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, borderRadius:1.5, textTransform:'none', fontWeight:600, boxShadow:'none', '&:hover':{ opacity:0.9 } }}>
                      Apply Now
                    </Button>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
