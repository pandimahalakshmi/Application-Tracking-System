import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Box, Card, Typography, Chip, CircularProgress, Avatar, Grid } from '@mui/material';
import { Briefcase, Calendar, Building2, MapPin } from 'lucide-react';
import { applicationService } from '../services/api';

const C = { bg:'#0F172A', surface:'#1E293B', border:'#334155', primary:'#6366F1', secondary:'#8B5CF6', accent:'#06B6D4', success:'#10B981', warning:'#F59E0B', danger:'#F87171', text:'#F1F5F9', muted:'#94A3B8' };

const statusConfig = {
  Pending:             { color: C.muted,    bg: `${C.muted}22` },
  Shortlisted:         { color: C.warning,  bg: `${C.warning}22` },
  'Interview Scheduled':{ color: C.accent,  bg: `${C.accent}22` },
  Selected:            { color: C.success,  bg: `${C.success}22` },
  Rejected:            { color: C.danger,   bg: `${C.danger}22` },
};

export default function MyApplications() {
  const [apps, setApps]       = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const id = user?.id || user?._id;
    if (!id) { setLoading(false); return; }
    applicationService.getMyApps(id)
      .then(d => d.success && setApps(d.applications))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ display:'flex', background: C.bg, minHeight:'100vh' }}>
      <Sidebar />
      <Box sx={{ marginLeft:'240px', width:'100%', p:'32px' }}>
        <Box sx={{ mb:4 }}>
          <Typography variant="h4" sx={{ fontWeight:700, color: C.text }}>My Applications</Typography>
          <Typography sx={{ color: C.muted, mt:0.5 }}>{apps.length} application{apps.length !== 1 ? 's' : ''} submitted</Typography>
        </Box>

        {loading ? (
          <Box sx={{ display:'flex', justifyContent:'center', pt:8 }}>
            <CircularProgress sx={{ color: C.primary }}/>
          </Box>
        ) : apps.length === 0 ? (
          <Card sx={{ background: C.surface, border:`1px solid ${C.border}`, borderRadius:3, p:6, textAlign:'center' }}>
            <Briefcase size={48} color={C.border} style={{ marginBottom:16 }}/>
            <Typography variant="h6" sx={{ color: C.text, mb:1 }}>No applications yet</Typography>
            <Typography sx={{ color: C.muted }}>Browse jobs and click "Apply Now" to get started</Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {apps.map(app => {
              const sc = statusConfig[app.status] || statusConfig.Pending;
              const job = app.jobId;
              return (
                <Grid item xs={12} md={6} lg={4} key={app._id}>
                  <Card sx={{ background: C.surface, border:`1px solid ${C.border}`, borderRadius:3, p:3,
                    transition:'all 0.2s', '&:hover':{ borderColor: C.primary, transform:'translateY(-3px)', boxShadow:`0 12px 32px rgba(0,0,0,0.3)` } }}>

                    {/* Header */}
                    <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', mb:2 }}>
                      <Box sx={{ display:'flex', alignItems:'center', gap:1.5 }}>
                        <Avatar sx={{ width:40, height:40, background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, fontSize:16, fontWeight:700 }}>
                          {(job?.title || app.jobTitle || '?').charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight:700, color: C.text, fontSize:14 }}>
                            {job?.title || app.jobTitle}
                          </Typography>
                          <Typography sx={{ color: C.muted, fontSize:12 }}>
                            {job?.company || app.company}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip label={app.status} size="small"
                        sx={{ background: sc.bg, color: sc.color, fontWeight:700, fontSize:11 }}/>
                    </Box>

                    {/* Details */}
                    <Box sx={{ display:'flex', flexDirection:'column', gap:1, mb:2 }}>
                      {job?.location && (
                        <Box sx={{ display:'flex', alignItems:'center', gap:1, color: C.muted, fontSize:12 }}>
                          <MapPin size={13} color={C.accent}/>{job.location}
                        </Box>
                      )}
                      {job?.type && (
                        <Box sx={{ display:'flex', alignItems:'center', gap:1, color: C.muted, fontSize:12 }}>
                          <Briefcase size={13} color={C.accent}/>{job.type}
                        </Box>
                      )}
                      <Box sx={{ display:'flex', alignItems:'center', gap:1, color: C.muted, fontSize:12 }}>
                        <Calendar size={13} color={C.accent}/>
                        Applied {new Date(app.createdAt).toLocaleDateString('en-US', { day:'numeric', month:'short', year:'numeric' })}
                      </Box>
                    </Box>

                    {/* Status bar */}
                    <Box sx={{ p:1.5, borderRadius:2, background:`${sc.bg}`, border:`1px solid ${sc.color}33`, textAlign:'center' }}>
                      <Typography sx={{ color: sc.color, fontWeight:600, fontSize:12 }}>
                        Status: {app.status}
                      </Typography>
                    </Box>
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
